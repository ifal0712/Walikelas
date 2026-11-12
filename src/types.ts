export type Gender = 'L' | 'P';
export type StudentStatus = 'Aktif' | 'Mutasi' | 'Lulus';

export interface Student {
  id: string;
  classId: string;
  teacherId: string;
  nis: string;
  nisn: string;
  name: string;
  gender: Gender;
  birthPlace?: string;
  birthDate?: string;
  address?: string;
  phone?: string;
  emergencyContact?: string;
  parentName?: string;
  parentPhone?: string;
  parentJob?: string;
  healthHistory?: string;
  talentsAndInterests?: string;
  specialNotes?: string;
  dreams?: string;
  fatherName?: string;
  motherName?: string;
  filledByStudent?: boolean;
  selfSubmissionDate?: string;
  status: StudentStatus;
  createdAt: string;
  updatedAt?: string;
}

export type AttendanceStatus = 'Hadir' | 'Izin' | 'Sakit' | 'Alfa' | 'Terlambat';

export interface AttendanceRecord {
  id: string;
  classId: string;
  teacherId: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  lateMinutes?: number;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export type AssessmentType = 'Tugas' | 'Ulangan' | 'PTS' | 'PAS' | 'Projek' | 'Praktikum' | 'Portofolio';

export interface GradeRecord {
  id: string;
  classId: string;
  teacherId: string;
  studentId: string;
  subject: string;
  type: AssessmentType;
  score: number;
  semester: 'Ganjil' | 'Genap';
  date: string;
  topic?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export type CharacterValueType =
  | 'Religius'
  | 'Jujur'
  | 'Disiplin'
  | 'Tanggung Jawab'
  | 'Kerja Sama'
  | 'Kepedulian'
  | 'Kepemimpinan'
  | 'Percaya Diri'
  | 'Kemandirian'
  | 'Integritas';

export interface CharacterLog {
  id: string;
  classId: string;
  teacherId: string;
  studentId: string;
  date: string;
  valueType: CharacterValueType;
  rating: number; // 1 to 5
  context?: string;
  notes: string;
  createdAt: string;
  updatedAt?: string;
}

export type DisciplineCategory = 'Pelanggaran' | 'Teguran' | 'Pembinaan' | 'Penghargaan';
export type DisciplineLevel = 'Ringan' | 'Sedang' | 'Berat';
export type DisciplineStatus = 'Ditangani' | 'Dalam Proses' | 'Selesai';

export interface DisciplineLog {
  id: string;
  classId: string;
  teacherId: string;
  studentId: string;
  date: string;
  category: DisciplineCategory;
  level: DisciplineLevel;
  description: string;
  followUpAction?: string;
  points?: number;
  status?: DisciplineStatus;
  createdAt: string;
  updatedAt?: string;
}

export type AchievementCategory = 'Akademik' | 'Non Akademik' | 'Olahraga' | 'Seni' | 'Keagamaan' | 'Organisasi';
export type AchievementLevel = 'Sekolah' | 'Kecamatan' | 'Kabupaten/Kota' | 'Provinsi' | 'Nasional' | 'Internasional';

export interface AchievementRecord {
  id: string;
  classId: string;
  teacherId: string;
  studentId: string;
  date: string;
  category: AchievementCategory;
  title: string;
  rank: string;
  level: AchievementLevel;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export type CommChannel = 'WhatsApp' | 'Telepon' | 'Surat Resmi' | 'Pertemuan Langsung';
export type CommRecipient = 'Orang Tua' | 'Guru Mapel' | 'Guru BK' | 'Kesiswaan' | 'Kepala Sekolah';
export type CommCategory = 'Informasi' | 'Apresiasi' | 'Peringatan' | 'Undangan' | 'Rujukan BK' | 'Koordinasi Mapel';
export type CommStatus = 'Draf' | 'Terkirim' | 'Selesai';

export interface CommunicationLog {
  id: string;
  classId: string;
  teacherId: string;
  studentId: string;
  date: string;
  channel: CommChannel;
  recipient: CommRecipient;
  category: CommCategory;
  subject?: string;
  content: string;
  status: CommStatus;
  createdAt: string;
  updatedAt?: string;
}

export type ReportPeriodType = 'Harian' | 'Mingguan' | 'Bulanan' | 'PTS' | 'PAS';

export interface ClassReport {
  id: string;
  classId: string;
  teacherId: string;
  periodType: ReportPeriodType;
  periodDate: string;
  title: string;
  summary: string;
  achievementsSummary?: string;
  challenges?: string;
  dataAnalysis?: string;
  followUp?: string;
  recommendations?: string;
  createdAt: string;
  updatedAt?: string;
}

export type WelfareTrigger =
  | 'Penurunan Motivasi'
  | 'Kesulitan Belajar'
  | 'Konflik Sosial'
  | 'Perundungan'
  | 'Masalah Emosional';

export type WelfareSeverity = 'Waspada' | 'Perlu Perhatian' | 'Kritis';
export type WelfareAction =
  | 'Konsultasi Wali Kelas'
  | 'Rujukan Guru BK'
  | 'Panggilan Orang Tua'
  | 'Koordinasi Tim Kesiswaan';
export type WelfareStatus = 'Aktif' | 'Dalam Pemantauan' | 'Selesai';

export interface WelfareCase {
  id: string;
  classId: string;
  teacherId: string;
  studentId: string;
  date: string;
  triggerCategory: WelfareTrigger;
  severity: WelfareSeverity;
  indications: string;
  actionRecommendation: WelfareAction;
  status: WelfareStatus;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Classroom {
  id: string;
  teacherId: string;
  name: string;
  grade: string;
  academicYear: string;
  semester: 'Ganjil' | 'Genap';
  schoolName: string;
  major?: string;
  targetAttendanceRate: number;
  createdAt: string;
  updatedAt?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  schoolName?: string;
  nip?: string;
  nisn?: string;
  studentId?: string;
  role: 'wali_kelas' | 'admin' | 'siswa';
  createdAt: string;
  updatedAt?: string;
}

export interface AdminProfile {
  id: string;
  email: string;
  displayName: string;
  role: 'super_admin' | 'admin_kesiswaan' | 'admin_kurikulum' | 'kepala_sekolah';
  schoolName: string;
  nip?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PriorityStudent {
  student: Student;
  category: 'Akademik' | 'Karakter' | 'Kehadiran' | 'Kedisiplinan';
  urgency: 'Tinggi' | 'Sedang';
  reason: string;
  recommendation: string;
  metrics: {
    attendanceRate?: number;
    averageGrade?: number;
    violationCount?: number;
    characterRating?: number;
  };
}

export interface AIAnalysisResult {
  findingsSummary: string; // Ringkasan Temuan
  analysis: string;        // Analisis
  recommendations: string; // Rekomendasi
  followUp: string;        // Tindak Lanjut
  communicationDraft?: string; // Draf Komunikasi
  rawText?: string;
}
