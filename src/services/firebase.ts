import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  query,
  where,
  onSnapshot,
  setDoc,
  deleteDoc,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import {
  Student,
  AttendanceRecord,
  GradeRecord,
  CharacterLog,
  DisciplineLog,
  AchievementRecord,
  CommunicationLog,
  ClassReport,
  WelfareCase,
  Classroom,
  UserProfile
} from '../types';

// 1. Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// 2. Validate Connection to Firestore on Boot
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase Firestore connected successfully.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or initializing.');
    }
  }
}
testConnection();

// 3. Error Handling Function Required by Firebase Skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// 4. Authentication Helpers
export async function loginWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const isAdminEmail = user.email === 'alamifal@smkn1sidayu.sch.id';

    // Sync user profile in Firestore
    const userRef = doc(db, 'users', user.uid);
    const userProfile: UserProfile = {
      id: user.uid,
      email: user.email || '',
      displayName: user.displayName || (isAdminEmail ? 'Kepala Sekolah / Admin' : 'Wali Kelas'),
      schoolName: 'SMKN 1 Sidayu',
      role: isAdminEmail ? 'admin' : 'wali_kelas',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await setDoc(userRef, userProfile, { merge: true });

    if (isAdminEmail) {
      await setDoc(doc(db, 'admins', user.uid), {
        id: user.uid,
        email: user.email,
        displayName: user.displayName || 'Administrator Utama',
        role: 'super_admin',
        schoolName: 'SMKN 1 Sidayu',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }

    return user;
  } catch (error) {
    console.error('Google Sign In Error:', error);
    throw error;
  }
}

export function isUserAdmin(profile: UserProfile | { email?: string | null; role?: string } | null): boolean {
  if (!profile) return false;
  return profile.email === 'alamifal@smkn1sidayu.sch.id' || profile.role === 'admin' || profile.role === 'super_admin';
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export { onAuthStateChanged };

// 5. Generic Document Operations with Defensive Validation
export async function saveRecord<T extends { id: string; teacherId: string }>(
  collectionName: string,
  record: T
): Promise<void> {
  // If not authenticated via Firebase Auth, do not call Firestore to prevent permission errors
  if (!auth.currentUser) {
    return;
  }
  try {
    const docRef = doc(db, collectionName, record.id);
    await setDoc(docRef, record, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${collectionName}/${record.id}`);
  }
}

export async function removeRecord(collectionName: string, id: string): Promise<void> {
  if (!auth.currentUser) {
    return;
  }
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${collectionName}/${id}`);
  }
}

// 6. Realtime Collection Listeners (Only attached if user is authenticated)
export function subscribeToTeacherData<T>(
  collectionName: string,
  teacherId: string,
  callback: (data: T[]) => void
): () => void {
  // Direct adherence to Skill: Only attach onSnapshot listeners if auth is ready and user is authenticated
  if (!auth.currentUser) {
    return () => {};
  }

  const q = query(collection(db, collectionName), where('teacherId', '==', teacherId));
  return onSnapshot(
    q,
    snapshot => {
      const results: T[] = [];
      snapshot.forEach(docSnap => {
        results.push(docSnap.data() as T);
      });
      callback(results);
    },
    error => {
      handleFirestoreError(error, OperationType.LIST, collectionName);
    }
  );
}

// 7. Initial Demo Seed Data for Indonesian School (SMKN 1 Sidayu / SMA)
export async function seedDemoDataForTeacher(teacherId: string): Promise<void> {
  const batch = writeBatch(db);
  const now = new Date().toISOString();

  // Create Default Class
  const classId = `cls_${teacherId.substring(0, 8)}_rpl1`;
  const classroom: Classroom = {
    id: classId,
    teacherId,
    name: 'Kelas XI RPL 1',
    grade: 'XI (Sebelas)',
    academicYear: '2026/2027',
    semester: 'Ganjil',
    schoolName: 'SMKN 1 Sidayu',
    major: 'Rekayasa Perangkat Lunak',
    targetAttendanceRate: 90,
    createdAt: now,
    updatedAt: now
  };
  batch.set(doc(db, 'classes', classId), classroom);

  // 6 Realistic Students
  const initialStudents: Omit<Student, 'id' | 'classId' | 'teacherId' | 'createdAt'>[] = [
    {
      nis: '20261101',
      nisn: '0089123401',
      name: 'Ahmad Zaky Maulana',
      gender: 'L',
      birthPlace: 'Gresik',
      birthDate: '2009-04-12',
      address: 'Jl. Raya Sidayu No. 45, Gresik',
      phone: '081234567801',
      emergencyContact: '081234567802 (Ayah)',
      parentName: 'H. Sudirman, S.Pd.',
      parentPhone: '081234567802',
      parentJob: 'PNS / Guru',
      healthHistory: 'Alergi dingin ringan, kondisi prima',
      talentsAndInterests: 'Pemrograman Web, Algoritma, Bulutangkis',
      specialNotes: 'Ketua kelas, aktif berdiskusi dan bertanggung jawab tinggi',
      status: 'Aktif'
    },
    {
      nis: '20261102',
      nisn: '0089123402',
      name: 'Siti Nurhaliza Putri',
      gender: 'P',
      birthPlace: 'Lamongan',
      birthDate: '2009-08-20',
      address: 'Desa Wadeng RT 02 RW 03, Sidayu',
      phone: '081234567803',
      emergencyContact: '081234567804 (Ibu)',
      parentName: 'Hj. Aminah',
      parentPhone: '081234567804',
      parentJob: 'Wiraswasta / Pedagang',
      healthHistory: 'Riwayat asma ringan saat kelelahan',
      talentsAndInterests: 'UI/UX Design, Desain Grafis, Storytelling',
      specialNotes: 'Sangat teliti dalam tugas projek, perlu dorongan berbicara di depan umum',
      status: 'Aktif'
    },
    {
      nis: '20261103',
      nisn: '0089123403',
      name: 'Fajar Ramadhan Pratama',
      gender: 'L',
      birthPlace: 'Surabaya',
      birthDate: '2008-11-15',
      address: 'Perum GKB Blok AB No. 12, Manyar, Gresik',
      phone: '081234567805',
      emergencyContact: '081234567806 (Kakak)',
      parentName: 'Bambang Irawan',
      parentPhone: '081234567806',
      parentJob: 'Karyawan Swasta Industri',
      healthHistory: 'Sehat',
      talentsAndInterests: 'Jaringan Komputer, Futsal, Musik Akustik',
      specialNotes: 'Kehadiran menurun minggu ini (alfa 2x), terindikasi sering begadang gaming',
      status: 'Aktif'
    },
    {
      nis: '20261104',
      nisn: '0089123404',
      name: 'Dinda Putri Lestari',
      gender: 'P',
      birthPlace: 'Gresik',
      birthDate: '2009-02-05',
      address: 'Jl. Pahlawan No. 8, Sedagaran, Sidayu',
      phone: '081234567807',
      emergencyContact: '081234567808 (Ibu)',
      parentName: 'Endang Sulistiyowati',
      parentPhone: '081234567808',
      parentJob: 'Ibu Rumah Tangga',
      healthHistory: 'Sehat',
      talentsAndInterests: 'Matematika Terapan, Basis Data, Literasi Puisi',
      specialNotes: 'Prestasi akademik tertinggi di kelas, ramah dan suka membantu teman',
      status: 'Aktif'
    },
    {
      nis: '20261105',
      nisn: '0089123405',
      name: 'Rayhan Kurniawan Saputra',
      gender: 'L',
      birthPlace: 'Gresik',
      birthDate: '2009-06-30',
      address: 'Desa Golokan RT 04 RW 01, Sidayu',
      phone: '081234567809',
      emergencyContact: '081234567810 (Paman)',
      parentName: 'Joko Susilo (Bekerja di luar kota)',
      parentPhone: '081234567810',
      parentJob: 'Pelaut / Teknisi Mesin',
      healthHistory: 'Sehat',
      talentsAndInterests: 'Hardware, Robotika IoT, Silat',
      specialNotes: 'Tinggal bersama nenek, tampak murung akhir-akhir ini dan nilai ulangan menurun',
      status: 'Aktif'
    },
    {
      nis: '20261106',
      nisn: '0089123406',
      name: 'Nabila Zahra Syahrini',
      gender: 'P',
      birthPlace: 'Tuban',
      birthDate: '2009-10-18',
      address: 'Jl. Deandels KM 32, Ujungpangkah',
      phone: '081234567811',
      emergencyContact: '081234567812 (Ayah)',
      parentName: 'Drs. H. Mulyadi',
      parentPhone: '081234567812',
      parentJob: 'PNS Pemkab',
      healthHistory: 'Miopia (menggunakan kacamata -1.5)',
      talentsAndInterests: 'Public Speaking, Bahasa Inggris, Debat Siswa',
      specialNotes: 'Anggota OSIS aktif, keterampilan komunikasi sangat menonjol',
      status: 'Aktif'
    }
  ];

  const studentIds: string[] = [];
  initialStudents.forEach((st, idx) => {
    const sId = `std_${teacherId.substring(0, 6)}_${idx + 1}`;
    studentIds.push(sId);
    batch.set(doc(db, 'students', sId), {
      ...st,
      id: sId,
      classId,
      teacherId,
      createdAt: now,
      updatedAt: now
    });
  });

  // Attendance Records (Last 10 days)
  const dates = ['2026-11-01', '2026-11-02', '2026-11-03', '2026-11-04', '2026-11-05', '2026-11-06', '2026-11-07', '2026-11-08', '2026-11-09', '2026-11-10'];
  let attIdx = 1;

  studentIds.forEach((sId, sIdx) => {
    dates.forEach(d => {
      let status: 'Hadir' | 'Izin' | 'Sakit' | 'Alfa' | 'Terlambat' = 'Hadir';
      let lateMinutes = 0;
      let notes = '';

      // Create realistic attendance profile
      if (sIdx === 2) { // Fajar Ramadhan: frequent absences (<90%)
        if (d === '2026-11-04' || d === '2026-11-09') {
          status = 'Alfa';
          notes = 'Tanpa keterangan saat jam pertama';
        } else if (d === '2026-11-07') {
          status = 'Terlambat';
          lateMinutes = 25;
          notes = 'Terlambat 25 menit karena ban bocor';
        }
      } else if (sIdx === 1 && d === '2026-11-05') { // Siti Nurhaliza
        status = 'Sakit';
        notes = 'Surat dokter: istirahat flu dan asma';
      } else if (sIdx === 4 && d === '2026-11-08') { // Rayhan
        status = 'Izin';
        notes = 'Izin keperluan keluarga mendadak';
      }

      const attId = `att_${teacherId.substring(0, 6)}_${attIdx++}`;
      batch.set(doc(db, 'attendance', attId), {
        id: attId,
        classId,
        teacherId,
        studentId: sId,
        date: d,
        status,
        lateMinutes,
        notes,
        createdAt: now,
        updatedAt: now
      });
    });
  });

  // Grades Sample
  const subjects = ['Pemrograman Web', 'Basis Data', 'Matematika Terapan', 'Bahasa Indonesia', 'Bahasa Inggris'];
  let grIdx = 1;
  studentIds.forEach((sId, sIdx) => {
    subjects.forEach(sub => {
      let baseScore = 85;
      if (sIdx === 3) baseScore = 94; // Dinda (top)
      if (sIdx === 2) baseScore = 72; // Fajar (struggling)
      if (sIdx === 4) baseScore = 76; // Rayhan

      const score = Math.min(100, Math.max(65, Math.round(baseScore + (Math.random() * 8 - 4))));
      const gId = `grd_${teacherId.substring(0, 6)}_${grIdx++}`;
      batch.set(doc(db, 'grades', gId), {
        id: gId,
        classId,
        teacherId,
        studentId: sId,
        subject: sub,
        type: 'PTS',
        score,
        semester: 'Ganjil',
        date: '2026-10-15',
        topic: 'Evaluasi Tengah Semester Ganjil',
        notes: score >= 85 ? 'Penguasaan materi sangat baik' : 'Perlu bimbingan remedial dan pengayaan',
        createdAt: now,
        updatedAt: now
      });
    });
  });

  // Character Observations (10 Core Values)
  const charValues: ('Religius' | 'Jujur' | 'Disiplin' | 'Tanggung Jawab' | 'Kerja Sama' | 'Kepedulian' | 'Kepemimpinan' | 'Percaya Diri' | 'Kemandirian' | 'Integritas')[] = [
    'Religius', 'Jujur', 'Disiplin', 'Tanggung Jawab', 'Kerja Sama', 'Kepedulian', 'Kepemimpinan', 'Percaya Diri', 'Kemandirian', 'Integritas'
  ];
  let chIdx = 1;
  studentIds.forEach((sId, sIdx) => {
    const val = charValues[sIdx % charValues.length];
    const chId = `chr_${teacherId.substring(0, 6)}_${chIdx++}`;
    batch.set(doc(db, 'characterLogs', chId), {
      id: chId,
      classId,
      teacherId,
      studentId: sId,
      date: '2026-11-08',
      valueType: val,
      rating: sIdx === 2 ? 3 : 5,
      context: 'Kegiatan Belajar Mengajar & Projek Kolaboratif',
      notes: sIdx === 2
        ? 'Perlu peningkatan dalam kedisiplinan pengumpulan tugas tepat waktu'
        : 'Menunjukkan komitmen tinggi, teladan bagi rekan sekelas dalam kejujuran dan kerja sama',
      createdAt: now,
      updatedAt: now
    });
  });

  // Discipline & Awards Logs
  const discId1 = `dsc_${teacherId.substring(0, 6)}_1`;
  batch.set(doc(db, 'disciplineLogs', discId1), {
    id: discId1,
    classId,
    teacherId,
    studentId: studentIds[2], // Fajar
    date: '2026-11-04',
    category: 'Pelanggaran',
    level: 'Ringan',
    description: 'Tidak hadir tanpa keterangan (Alfa) pada jam pelajaran pertama dan kedua',
    followUpAction: 'Dialog reflektif edukatif dengan wali kelas dan membuat komitmen jadwal tidur malam yang teratur',
    points: 5,
    status: 'Dalam Proses',
    createdAt: now,
    updatedAt: now
  });

  const discId2 = `dsc_${teacherId.substring(0, 6)}_2`;
  batch.set(doc(db, 'disciplineLogs', discId2), {
    id: discId2,
    classId,
    teacherId,
    studentId: studentIds[0], // Ahmad Zaky
    date: '2026-11-02',
    category: 'Penghargaan',
    level: 'Ringan',
    description: 'Inisiatif mengoordinasikan teman sekelas dalam kebersihan ruang kelas dan penataan laboratorium RPL',
    followUpAction: 'Pemberian sertifikat bintang teladan kelas dan poin apresiasi karakter',
    points: 15,
    status: 'Selesai',
    createdAt: now,
    updatedAt: now
  });

  // Achievements
  const achId1 = `ach_${teacherId.substring(0, 6)}_1`;
  batch.set(doc(db, 'achievements', achId1), {
    id: achId1,
    classId,
    teacherId,
    studentId: studentIds[0], // Ahmad Zaky
    date: '2026-10-28',
    category: 'Akademik',
    title: 'Lomba Kompetensi Siswa (LKS) Bidang Web Technologies',
    rank: 'Juara 2',
    level: 'Kabupaten/Kota',
    notes: 'Mewakili sekolah di tingkat provinsi bulan depan',
    createdAt: now,
    updatedAt: now
  });

  const achId2 = `ach_${teacherId.substring(0, 6)}_2`;
  batch.set(doc(db, 'achievements', achId2), {
    id: achId2,
    classId,
    teacherId,
    studentId: studentIds[5], // Nabila
    date: '2026-10-10',
    category: 'Non Akademik',
    title: 'English Speech Contest Hari Sumpah Pemuda',
    rank: 'Juara 1',
    level: 'Kabupaten/Kota',
    notes: 'Penampilan memukau dalam topik Peran Pelajar Digital',
    createdAt: now,
    updatedAt: now
  });

  // Communications Sample
  const comId1 = `com_${teacherId.substring(0, 6)}_1`;
  batch.set(doc(db, 'communications', comId1), {
    id: comId1,
    classId,
    teacherId,
    studentId: studentIds[0],
    date: '2026-11-01',
    channel: 'WhatsApp',
    recipient: 'Orang Tua',
    category: 'Apresiasi',
    subject: 'Apresiasi Kepemimpinan & Prestasi LKS Ananda Ahmad Zaky',
    content: 'Assalamu’alaikum Bapak H. Sudirman. Kami sampaikan apresiasi setinggi-tingginya atas kedisiplinan dan keberhasilan ananda Zaky meraih Juara 2 LKS Web Tech tingkat Kabupaten.',
    status: 'Terkirim',
    createdAt: now,
    updatedAt: now
  });

  // Welfare Monitoring Cases
  const welId1 = `wel_${teacherId.substring(0, 6)}_1`;
  batch.set(doc(db, 'welfareCases', welId1), {
    id: welId1,
    classId,
    teacherId,
    studentId: studentIds[4], // Rayhan
    date: '2026-11-06',
    triggerCategory: 'Penurunan Motivasi',
    severity: 'Perlu Perhatian',
    indications: 'Tampak sering melamun di kelas, tugas projek kelompok belum terselesaikan, orang tua bekerja di perkapalan jauh',
    actionRecommendation: 'Rujukan Guru BK',
    status: 'Aktif',
    notes: 'Dijadwalkan sesi konseling suportif bersama Guru BK untuk menggali beban pikiran ananda.',
    createdAt: now,
    updatedAt: now
  });

  // Class Report Sample
  const repId1 = `rep_${teacherId.substring(0, 6)}_1`;
  batch.set(doc(db, 'reports', repId1), {
    id: repId1,
    classId,
    teacherId,
    periodType: 'Bulanan',
    periodDate: 'Oktober 2026',
    title: 'Laporan Perkembangan Kelas XI RPL 1 - Bulan Oktober 2026',
    summary: 'Secara umum kondisi kelas berjalan kondusif dengan rata-rata kehadiran 92.4%. Siswa menunjukkan ketertarikan tinggi pada mata pelajaran kejuruan.',
    achievementsSummary: 'Juara 2 LKS Web Tech Kabupaten (Ahmad Zaky), Juara 1 Speech Contest (Nabila Zahra).',
    challenges: 'Terdapat 2 siswa yang membutuhkan pendampingan khusus terkait manajemen waktu dan adaptasi keluarga.',
    dataAnalysis: 'Rata-rata nilai PTS kelas mencapai 83.2. Ketuntasan belajar mencapai 88%.',
    followUp: 'Koordinasi intensif dengan Guru BK untuk 2 siswa rentan, serta pertemuan refleksi wali kelas mingguan.',
    recommendations: 'Mengusulkan pengadaan modul praktikum tambahan dan sesi parenting online dengan orang tua.',
    createdAt: now,
    updatedAt: now
  });

  await batch.commit();
}

// Helper to provide realistic initial data for offline / unauthenticated state
export function getInitialSampleData(teacherId: string = 'guest_teacher') {
  const now = new Date().toISOString();
  const classId = `cls_${teacherId.substring(0, 8)}_rpl1`;

  const classroom: Classroom = {
    id: classId,
    teacherId,
    name: 'Kelas XI RPL 1',
    grade: 'XI (Sebelas)',
    academicYear: '2026/2027',
    semester: 'Ganjil',
    schoolName: 'SMKN 1 Sidayu',
    major: 'Rekayasa Perangkat Lunak',
    targetAttendanceRate: 90,
    createdAt: now,
    updatedAt: now
  };

  const students: Student[] = [
    {
      id: `std_${teacherId.substring(0, 6)}_1`,
      classId,
      teacherId,
      nis: '20261101',
      nisn: '0089123401',
      name: 'Ahmad Zaky Maulana',
      gender: 'L',
      birthPlace: 'Gresik',
      birthDate: '2009-04-12',
      address: 'Jl. Raya Sidayu No. 45, Gresik',
      phone: '081234567801',
      emergencyContact: '081234567802 (Ayah)',
      parentName: 'H. Sudirman, S.Pd.',
      parentPhone: '081234567802',
      parentJob: 'PNS / Guru',
      healthHistory: 'Alergi dingin ringan, kondisi prima',
      talentsAndInterests: 'Pemrograman Web, Algoritma, Bulutangkis',
      specialNotes: 'Ketua kelas, aktif berdiskusi dan bertanggung jawab tinggi',
      filledByStudent: true,
      dreams: 'Fullstack Software Engineer',
      status: 'Aktif',
      createdAt: now,
      updatedAt: now
    },
    {
      id: `std_${teacherId.substring(0, 6)}_2`,
      classId,
      teacherId,
      nis: '20261102',
      nisn: '0089123402',
      name: 'Siti Nurhaliza Putri',
      gender: 'P',
      birthPlace: 'Lamongan',
      birthDate: '2009-08-20',
      address: 'Desa Wadeng RT 02 RW 03, Sidayu',
      phone: '081234567803',
      emergencyContact: '081234567804 (Ibu)',
      parentName: 'Hj. Aminah',
      parentPhone: '081234567804',
      parentJob: 'Wiraswasta / Pedagang',
      healthHistory: 'Riwayat asma ringan saat kelelahan',
      talentsAndInterests: 'UI/UX Design, Desain Grafis, Storytelling',
      specialNotes: 'Sangat teliti dalam tugas projek, perlu dorongan berbicara di depan umum',
      filledByStudent: true,
      dreams: 'Product Designer',
      status: 'Aktif',
      createdAt: now,
      updatedAt: now
    },
    {
      id: `std_${teacherId.substring(0, 6)}_3`,
      classId,
      teacherId,
      nis: '20261103',
      nisn: '0089123403',
      name: 'Fajar Ramadhan Pratama',
      gender: 'L',
      birthPlace: 'Surabaya',
      birthDate: '2008-11-15',
      address: 'Perum GKB Blok AB No. 12, Manyar, Gresik',
      phone: '081234567805',
      emergencyContact: '081234567806 (Kakak)',
      parentName: 'Bambang Irawan',
      parentPhone: '081234567806',
      parentJob: 'Karyawan Swasta Industri',
      healthHistory: 'Sehat',
      talentsAndInterests: 'Jaringan Komputer, Futsal, Musik Akustik',
      specialNotes: 'Kehadiran menurun minggu ini (alfa 2x), terindikasi sering begadang gaming',
      status: 'Aktif',
      createdAt: now,
      updatedAt: now
    },
    {
      id: `std_${teacherId.substring(0, 6)}_4`,
      classId,
      teacherId,
      nis: '20261104',
      nisn: '0089123404',
      name: 'Dinda Putri Lestari',
      gender: 'P',
      birthPlace: 'Gresik',
      birthDate: '2009-02-05',
      address: 'Jl. Pahlawan No. 8, Sedagaran, Sidayu',
      phone: '081234567807',
      emergencyContact: '081234567808 (Ibu)',
      parentName: 'Endang Sulistiyowati',
      parentPhone: '081234567808',
      parentJob: 'Ibu Rumah Tangga',
      healthHistory: 'Sehat',
      talentsAndInterests: 'Matematika Terapan, Basis Data, Literasi Puisi',
      specialNotes: 'Prestasi akademik tertinggi di kelas, ramah dan suka membantu teman',
      filledByStudent: true,
      dreams: 'Data Scientist',
      status: 'Aktif',
      createdAt: now,
      updatedAt: now
    },
    {
      id: `std_${teacherId.substring(0, 6)}_5`,
      classId,
      teacherId,
      nis: '20261105',
      nisn: '0089123405',
      name: 'Rayhan Kurniawan Saputra',
      gender: 'L',
      birthPlace: 'Gresik',
      birthDate: '2009-06-30',
      address: 'Desa Golokan RT 04 RW 01, Sidayu',
      phone: '081234567809',
      emergencyContact: '081234567810 (Paman)',
      parentName: 'Joko Susilo',
      parentPhone: '081234567810',
      parentJob: 'Pelaut / Teknisi Mesin',
      healthHistory: 'Sehat',
      talentsAndInterests: 'Hardware, Robotika IoT, Silat',
      specialNotes: 'Tinggal bersama nenek, tampak murung akhir-akhir ini dan nilai ulangan menurun',
      status: 'Aktif',
      createdAt: now,
      updatedAt: now
    },
    {
      id: `std_${teacherId.substring(0, 6)}_6`,
      classId,
      teacherId,
      nis: '20261106',
      nisn: '0089123406',
      name: 'Nabila Zahra Syahrini',
      gender: 'P',
      birthPlace: 'Tuban',
      birthDate: '2009-10-18',
      address: 'Jl. Deandels KM 32, Ujungpangkah',
      phone: '081234567811',
      emergencyContact: '081234567812 (Ayah)',
      parentName: 'Drs. H. Mulyadi',
      parentPhone: '081234567812',
      parentJob: 'PNS Pemkab',
      healthHistory: 'Miopia (menggunakan kacamata -1.5)',
      talentsAndInterests: 'Public Speaking, Bahasa Inggris, Debat Siswa',
      specialNotes: 'Anggota OSIS aktif, keterampilan komunikasi sangat menonjol',
      filledByStudent: true,
      dreams: 'Diplomat / Public Relations',
      status: 'Aktif',
      createdAt: now,
      updatedAt: now
    }
  ];

  const dates = ['2026-11-01', '2026-11-02', '2026-11-03', '2026-11-04', '2026-11-05', '2026-11-06', '2026-11-07', '2026-11-08', '2026-11-09', '2026-11-10'];
  const attendance: AttendanceRecord[] = [];
  let attIdx = 1;

  students.forEach((st, sIdx) => {
    dates.forEach(d => {
      let status: 'Hadir' | 'Izin' | 'Sakit' | 'Alfa' | 'Terlambat' = 'Hadir';
      let lateMinutes = 0;
      let notes = '';

      if (sIdx === 2) {
        if (d === '2026-11-04' || d === '2026-11-09') {
          status = 'Alfa';
          notes = 'Tanpa keterangan saat jam pertama';
        } else if (d === '2026-11-07') {
          status = 'Terlambat';
          lateMinutes = 25;
          notes = 'Terlambat 25 menit karena ban bocor';
        }
      } else if (sIdx === 1 && d === '2026-11-05') {
        status = 'Sakit';
        notes = 'Surat dokter: flu';
      } else if (sIdx === 4 && d === '2026-11-08') {
        status = 'Izin';
        notes = 'Izin keperluan keluarga mendadak';
      }

      attendance.push({
        id: `att_${teacherId.substring(0, 6)}_${attIdx++}`,
        classId,
        teacherId,
        studentId: st.id,
        date: d,
        status,
        lateMinutes,
        notes,
        createdAt: now,
        updatedAt: now
      });
    });
  });

  const subjects = ['Pemrograman Web', 'Basis Data', 'Matematika Terapan', 'Bahasa Indonesia', 'Bahasa Inggris'];
  const grades: GradeRecord[] = [];
  let grIdx = 1;

  students.forEach((st, sIdx) => {
    subjects.forEach(sub => {
      let baseScore = 85;
      if (sIdx === 3) baseScore = 94;
      if (sIdx === 2) baseScore = 72;
      if (sIdx === 4) baseScore = 76;

      const score = Math.min(100, Math.max(65, Math.round(baseScore + (sIdx % 3))));
      grades.push({
        id: `grd_${teacherId.substring(0, 6)}_${grIdx++}`,
        classId,
        teacherId,
        studentId: st.id,
        subject: sub,
        type: 'PTS',
        score,
        semester: 'Ganjil',
        date: '2026-10-15',
        topic: 'Evaluasi Tengah Semester Ganjil',
        notes: score >= 75 ? 'Tuntas KKM' : 'Perlu Remedial',
        createdAt: now,
        updatedAt: now
      });
    });
  });

  const characterLogs: CharacterLog[] = students.map((st, sIdx) => ({
    id: `chr_${teacherId.substring(0, 6)}_${sIdx + 1}`,
    classId,
    teacherId,
    studentId: st.id,
    date: '2026-11-08',
    valueType: sIdx === 0 ? 'Kepemimpinan' : sIdx === 1 ? 'Kerja Sama' : sIdx === 2 ? 'Disiplin' : 'Tanggung Jawab',
    rating: sIdx === 2 ? 3 : 5,
    notes: sIdx === 2 ? 'Perlu peningkatan disiplin waktu' : 'Teladan positif kelas',
    createdAt: now,
    updatedAt: now
  }));

  const disciplineLogs: DisciplineLog[] = [
    {
      id: `dsc_${teacherId.substring(0, 6)}_1`,
      classId,
      teacherId,
      studentId: students[2].id,
      date: '2026-11-04',
      category: 'Pelanggaran',
      level: 'Ringan',
      description: 'Tidak hadir tanpa keterangan (Alfa) pada jam pelajaran pertama dan kedua',
      followUpAction: 'Dialog reflektif edukatif dengan wali kelas',
      points: 5,
      createdAt: now,
      updatedAt: now
    },
    {
      id: `dsc_${teacherId.substring(0, 6)}_2`,
      classId,
      teacherId,
      studentId: students[0].id,
      date: '2026-11-02',
      category: 'Penghargaan',
      level: 'Ringan',
      description: 'Inisiatif mengoordinasikan teman sekelas dalam kebersihan ruang kelas',
      followUpAction: 'Pemberian sertifikat bintang teladan kelas',
      points: 15,
      createdAt: now,
      updatedAt: now
    }
  ];

  const achievements: AchievementRecord[] = [
    {
      id: `ach_${teacherId.substring(0, 6)}_1`,
      classId,
      teacherId,
      studentId: students[0].id,
      date: '2026-10-28',
      category: 'Akademik',
      title: 'Lomba Kompetensi Siswa (LKS) Bidang Web Technologies',
      rank: 'Juara 2',
      level: 'Kabupaten/Kota',
      notes: 'Mewakili sekolah di tingkat provinsi',
      createdAt: now,
      updatedAt: now
    },
    {
      id: `ach_${teacherId.substring(0, 6)}_2`,
      classId,
      teacherId,
      studentId: students[5].id,
      date: '2026-10-10',
      category: 'Non Akademik',
      title: 'English Speech Contest Hari Sumpah Pemuda',
      rank: 'Juara 1',
      level: 'Kabupaten/Kota',
      notes: 'Penampilan memukau dalam topik Pelajar Digital',
      createdAt: now,
      updatedAt: now
    }
  ];

  const welfareCases: WelfareCase[] = [
    {
      id: `wel_${teacherId.substring(0, 6)}_1`,
      classId,
      teacherId,
      studentId: students[4].id,
      date: '2026-11-06',
      triggerCategory: 'Penurunan Motivasi',
      severity: 'Perlu Perhatian',
      indications: 'Tampak sering melamun di kelas, tugas kelompok belum terselesaikan',
      actionRecommendation: 'Rujukan Guru BK',
      status: 'Aktif',
      notes: 'Dijadwalkan konseling suportif bersama Guru BK.',
      createdAt: now,
      updatedAt: now
    }
  ];

  const communications: CommunicationLog[] = [
    {
      id: `com_${teacherId.substring(0, 6)}_1`,
      classId,
      teacherId,
      studentId: students[0].id,
      date: '2026-11-01',
      channel: 'WhatsApp',
      recipient: 'Orang Tua',
      category: 'Apresiasi',
      content: 'Assalamu’alaikum Bapak H. Sudirman. Kami sampaikan apresiasi atas kedisiplinan dan keberhasilan ananda Zaky meraih Juara 2 LKS Web Tech.',
      status: 'Terkirim',
      createdAt: now,
      updatedAt: now
    }
  ];

  const reports: ClassReport[] = [
    {
      id: `rep_${teacherId.substring(0, 6)}_1`,
      classId,
      teacherId,
      periodType: 'Bulanan',
      periodDate: 'Oktober 2026',
      title: 'Laporan Perkembangan Kelas XI RPL 1 - Bulan Oktober 2026',
      summary: 'Secara umum kondisi kelas berjalan kondusif dengan rata-rata kehadiran 95.2%.',
      achievementsSummary: 'Juara 2 LKS Web Tech Kabupaten (Ahmad Zaky), Juara 1 Speech Contest (Nabila Zahra).',
      challenges: 'Terdapat 2 siswa yang membutuhkan pendampingan khusus manajemen waktu.',
      dataAnalysis: 'Rata-rata nilai PTS kelas mencapai 84.5. Ketuntasan belajar 90%.',
      followUp: 'Koordinasi dengan Guru BK dan pertemuan refleksi wali kelas.',
      recommendations: 'Mengusulkan pengadaan modul praktikum tambahan.',
      createdAt: now,
      updatedAt: now
    }
  ];

  return {
    classroom,
    students,
    attendance,
    grades,
    characterLogs,
    disciplineLogs,
    achievements,
    welfareCases,
    communications,
    reports
  };
}
