import React, { useState, useMemo } from 'react';
import {
  Student,
  AttendanceRecord,
  GradeRecord,
  CharacterLog,
  DisciplineLog,
  AchievementRecord,
  WelfareCase,
  Classroom
} from '../types';
import { StudentAttendanceChart } from './StudentAttendanceChart';
import {
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  GraduationCap,
  CalendarCheck,
  Award,
  ShieldAlert,
  ShieldCheck,
  User,
  HeartHandshake,
  BookOpen,
  FileEdit,
  Clock,
  Target,
  Lightbulb,
  MessageSquare,
  HelpCircle,
  X,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Flame,
  Check,
  Compass,
  Phone
} from 'lucide-react';

export interface EvaluationItem {
  id: string;
  kind: 'good' | 'improve';
  category: 'Akademik' | 'Presensi' | 'Karakter' | 'Disiplin' | 'Prestasi' | 'Cita-cita';
  title: string;
  summary: string;
  tag: string;
  metric?: string;
  date?: string;
  iconType: 'academic' | 'attendance' | 'award' | 'character' | 'discipline' | 'career';
  details: {
    overview: string;
    whyItMatters: string;
    actionSteps: string[];
    teacherNote: string;
    aiPromptSuggestion: string;
  };
}

interface StudentPortalViewProps {
  student: Student;
  classroom: Classroom | null;
  attendance: AttendanceRecord[];
  grades: GradeRecord[];
  characterLogs: CharacterLog[];
  disciplineLogs: DisciplineLog[];
  achievements: AchievementRecord[];
  welfareCases: WelfareCase[];
  onOpenEditSelfData: (student: Student) => void;
  onOpenAIWithPrompt: (prompt: string) => void;
  onLogout: () => void;
}

export const StudentPortalView: React.FC<StudentPortalViewProps> = ({
  student,
  classroom,
  attendance,
  grades,
  characterLogs,
  disciplineLogs,
  achievements,
  welfareCases,
  onOpenEditSelfData,
  onOpenAIWithPrompt,
  onLogout
}) => {
  const [selectedSubTab, setSelectedSubTab] = useState<'evaluasi' | 'presensi' | 'nilai' | 'prestasi' | 'datadiri'>('evaluasi');
  const [selectedItemForModal, setSelectedItemForModal] = useState<EvaluationItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Filter student-specific records
  const myAttendance = useMemo(() => attendance.filter(a => a.studentId === student.id), [attendance, student.id]);
  const myGrades = useMemo(() => grades.filter(g => g.studentId === student.id), [grades, student.id]);
  const myCharacters = useMemo(() => characterLogs.filter(c => c.studentId === student.id), [characterLogs, student.id]);
  const myDisciplines = useMemo(() => disciplineLogs.filter(d => d.studentId === student.id), [disciplineLogs, student.id]);
  const myAchievements = useMemo(() => achievements.filter(a => a.studentId === student.id), [achievements, student.id]);

  // Key metrics
  const totalAtt = myAttendance.length;
  const hadirCount = myAttendance.filter(a => a.status === 'Hadir' || a.status === 'Terlambat').length;
  const attRate = totalAtt > 0 ? (hadirCount / totalAtt) * 100 : 96.0;

  const totalGrades = myGrades.length;
  const avgGrade = totalGrades > 0 ? myGrades.reduce((a, b) => a + b.score, 0) / totalGrades : 84.5;
  const kkmStandard = 75;

  // Build the list of "Hal yang Baik" and "Hal yang Perlu Diperbaiki"
  const { goodItems, improveItems } = useMemo(() => {
    const goods: EvaluationItem[] = [];
    const improves: EvaluationItem[] = [];

    // --- 1. PRESENSI ---
    if (attRate >= 90) {
      goods.push({
        id: 'att_good_1',
        kind: 'good',
        category: 'Presensi',
        title: `Kehadiran Konsisten & Prima (${attRate.toFixed(1)}%)`,
        summary: 'Tingkat presensi melampaui target standar sekolah (90%)',
        tag: 'Presensi Unggul',
        metric: `${attRate.toFixed(1)}%`,
        iconType: 'attendance',
        details: {
          overview: `Ananda telah hadir sebanyak ${hadirCount} dari total ${totalAtt || 10} pertemuan aktif. Kedisiplinan hadir ini merupakan modal utama keberhasilan belajar kejuruan.`,
          whyItMatters: 'Konsistensi kehadiran di sekolah mencerminkan integritas dan etos kerja industri (industri mengharuskan kehadiran di atas 95%).',
          actionSteps: [
            'Pertahankan kebiasaan bangun pagi dan persiapan alat belajar sebelum tidur.',
            'Jika ada kendala kesehatan, segera kabari wali kelas dengan surat dokter resmi.',
            'Jadilah teladan bagi rekan kelompok dalam memulai praktikum tepat waktu.'
          ],
          teacherNote: 'Apresiasi tinggi atas kedisiplinan ananda yang konsisten hadir dan siap belajar di setiap jam pelajaran.',
          aiPromptSuggestion: `Bagikan tips menjaga stamina dan motivasi belajar siswa SMK jurusan RPL agar selalu fit dan produktif.`
        }
      });
    } else {
      improves.push({
        id: 'att_imp_1',
        kind: 'improve',
        category: 'Presensi',
        title: `Tingkat Kehadiran Perlu Ditingkatkan (${attRate.toFixed(1)}%)`,
        summary: 'Kehadiran di bawah standar 90%, butuh pemantauan jadwal',
        tag: 'Perlu Perhatian',
        metric: `${attRate.toFixed(1)}%`,
        iconType: 'attendance',
        details: {
          overview: `Saat ini persentase kehadiran ananda berada pada angka ${attRate.toFixed(1)}%, di bawah standar minimal sekolah 90%. Ada beberapa hari tidak masuk atau terlambat.`,
          whyItMatters: 'Mata pelajaran kejuruan RPL menuntut jam praktik laboratorium bertahap. Ketidakhadiran berisiko tertinggal materi sintaks kode dan pengujian sistem.',
          actionSteps: [
            'Atur jam istirahat malam maksimal pukul 22.00 WIB (hindari begadang gaming).',
            'Selesaikan verifikasi surat izin atau surat dokter bagi hari-hari yang masih tercatat tanpa keterangan.',
            'Diskusikan dengan wali kelas jika memiliki kendala transportasi atau masalah kesehatan berulang.'
          ],
          teacherNote: 'Wali kelas siap berdiskusi hangat untuk membantu ananda mengatur kembali ritme istirahat dan transportasi sekolah.',
          aiPromptSuggestion: `Berikan strategi manajemen waktu bagi pelajar SMK agar tidak tidur larut malam dan tidak terlambat ke sekolah.`
        }
      });
    }

    // Cek keterlambatan presensi
    const lateRecords = myAttendance.filter(a => a.status === 'Terlambat');
    if (lateRecords.length > 0) {
      improves.push({
        id: 'att_late_1',
        kind: 'improve',
        category: 'Presensi',
        title: `Penyusutan Keterlambatan Masuk Jam Pertama (${lateRecords.length}x)`,
        summary: 'Tercatat pernah terlambat masuk sekolah saat jam awal',
        tag: 'Manajemen Waktu',
        metric: `${lateRecords.reduce((sum, r) => sum + (r.lateMinutes || 15), 0)} Menit Total`,
        date: lateRecords[0].date,
        iconType: 'attendance',
        details: {
          overview: `Tercatat ${lateRecords.length} kali keterlambatan masuk kelas pada jam pelajaran pagi (rata-rata 15–25 menit). Keterangan terakhir: "${lateRecords[0].notes || 'Kendala perjalanan'}".`,
          whyItMatters: 'Jam pertama adalah sesi penerimaan pengantar materi pokok dan doa bersama kelas.',
          actionSteps: [
            'Berangkat 15 menit lebih awal dari rumah untuk mengantisipasi kepadatan jalan.',
            'Siapkan seragam, ransel, dan perlengkapan laptop malam sebelumnya.'
          ],
          teacherNote: 'Usahakan tiba di gerbang SMKN 1 Sidayu 10 menit sebelum bel masuk berbunyi.',
          aiPromptSuggestion: `Buatkan checklist persiapan pagi hari efektif untuk siswa SMK sebelum berangkat sekolah.`
        }
      });
    }

    // --- 2. AKADEMIK (NILAI & MATA PELAJARAN) ---
    // Cari nilai tinggi (>= 85)
    const topGrades = myGrades.filter(g => g.score >= 85);
    if (topGrades.length > 0) {
      const best = topGrades.reduce((prev, curr) => (curr.score > prev.score ? curr : prev), topGrades[0]);
      goods.push({
        id: `grade_good_${best.id}`,
        kind: 'good',
        category: 'Akademik',
        title: `Penguasaan Unggul: ${best.subject} (Nilai ${best.score})`,
        summary: `Melampaui KKM 75 dengan predikat Amat Baik pada asesmen ${best.type}`,
        tag: 'Nilai Terbaik',
        metric: `${best.score}/100`,
        date: best.date,
        iconType: 'academic',
        details: {
          overview: `Pada mata pelajaran ${best.subject}, ananda meraih capaian ${best.score}. Materi: "${best.topic || 'Kompetensi Kejuruan Utama'}". Catatan guru: "${best.notes || 'Penguasaan materi sangat baik'}".`,
          whyItMatters: 'Pemahaman konsep dan logika yang kuat pada mata pelajaran ini adalah fondasi karier profesional di bidang teknologi.',
          actionSteps: [
            'Pertahankan antusiasme belajar dan terus bereksplorasi dengan latihan mandiri.',
            'Bantu rekan sekelas yang mengalami kendala pemahaman melalui metode tutor sebaya.',
            'Kembangkan hasil tugas ini menjadi karya portofolio projek digital yang dapat dipamerkan.'
          ],
          teacherNote: 'Kemampuan analisis dan logika ananda pada mapel ini luar biasa. Terus asah potensi ini!',
          aiPromptSuggestion: `Berikan rekomendasi projek mandiri lanjutan yang menarik untuk mengasah keahlian materi ${best.subject}.`
        }
      });
    }

    // Cari nilai yang perlu perbaikan (< 75)
    const lowGrades = myGrades.filter(g => g.score < kkmStandard);
    if (lowGrades.length > 0) {
      lowGrades.forEach(g => {
        improves.push({
          id: `grade_imp_${g.id}`,
          kind: 'improve',
          category: 'Akademik',
          title: `Remedial & Pemantapan: ${g.subject} (Nilai ${g.score})`,
          summary: `Nilai belum mencapai standar KKM (${kkmStandard}), perlu bimbingan pengayaan`,
          tag: 'Perlu Remedial',
          metric: `${g.score} (KKM ${kkmStandard})`,
          date: g.date,
          iconType: 'academic',
          details: {
            overview: `Nilai asesmen ${g.type} pada mata pelajaran ${g.subject} adalah ${g.score}, masih di bawah standar ketuntasan minimal (${kkmStandard}). Catatan guru: "${g.notes || 'Perlu bimbingan remedial'}".`,
            whyItMatters: 'Ketuntasan setiap mata pelajaran merupakan syarat mutlak dalam kenaikan kelas dan kelulusan kompetensi kejuruan.',
            actionSteps: [
              'Hubungi guru mata pelajaran untuk mendaftar sesi remedial atau pengumpulan tugas perbaikan.',
              'Tanyakan bagian materi yang belum dipahami atau mintalah contoh studi kasus tambahan.',
              'Buat ringkasan rumus/sintaks penting dan diskusikan bersama teman kelompok.'
            ],
            teacherNote: 'Jangan berkecil hati. Nilai remedial adalah kesempatan emas untuk memahami materi lebih mendalam!',
            aiPromptSuggestion: `Jelaskan secara sederhana materi pokok ${g.subject} topik "${g.topic || 'pemahaman dasar'}" disertai contoh soal dan pembahasannya.`
          }
        });
      });
    } else {
      // Jika tidak ada nilai < 75, berikan pengayaan target nilai tertinggi
      const minGrade = myGrades.length > 0 ? myGrades.reduce((prev, curr) => (curr.score < prev.score ? curr : prev), myGrades[0]) : null;
      if (minGrade) {
        goods.push({
          id: 'grade_all_pass',
          kind: 'good',
          category: 'Akademik',
          title: 'Semua Mata Pelajaran Tuntas Melampaui KKM',
          summary: `Rata-rata kelas ananda ${avgGrade.toFixed(1)}, bebas dari tanggungan remedial`,
          tag: 'Tuntas Sempurna',
          metric: `Rata-rata ${avgGrade.toFixed(1)}`,
          iconType: 'academic',
          details: {
            overview: `Seluruh ${totalGrades} mata pelajaran yang telah diujikan berada di atas nilai batas KKM 75. Nilai terendah ananda adalah ${minGrade.score} pada mapel ${minGrade.subject}.`,
            whyItMatters: 'Konsistensi seluruh mata pelajaran membuktikan daya juang dan manajemen belajar yang seimbang.',
            actionSteps: [
              'Tingkatkan target capaian berikutnya dari rata-rata saat ini menuju 90+.',
              'Mulai persiapkan diri menghadapi Asesmen Akhir Semester (PAS/SAS).'
            ],
            teacherNote: 'Kerja keras ananda membuahkan hasil membanggakan. Terus pertahankan prestasinya!',
            aiPromptSuggestion: `Berikan strategi mempertahankan nilai stabil menjelang ujian akhir semester.`
          }
        });
      }
    }

    // --- 3. PRESTASI & KEJUARAAN ---
    if (myAchievements.length > 0) {
      myAchievements.forEach(ach => {
        goods.push({
          id: `ach_good_${ach.id}`,
          kind: 'good',
          category: 'Prestasi',
          title: `Juara: ${ach.title}`,
          summary: `${ach.rank} Tingkat ${ach.level} (${ach.category})`,
          tag: 'Prestasi Juara',
          metric: ach.rank,
          date: ach.date,
          iconType: 'award',
          details: {
            overview: `Ananda berhasil meraih prestasi membanggakan sebagai ${ach.rank} pada ajang "${ach.title}" tingkat ${ach.level}. Catatan portofolio: "${ach.notes || 'Penampilan membanggakan'}".`,
            whyItMatters: 'Sertifikat kejuaraan resmi memberikan nilai tambah besar untuk seleksi beasiswa kuliah maupun rekrutmen kerja industri (mitra SMKN 1 Sidayu).',
            actionSteps: [
              'Pastikan sertifikat juara disimpan rapi baik fisik maupun dokumen digital (scan PDF).',
              'Konsultasikan dengan pembimbing lomba untuk persiapan kejuaraan tingkat yang lebih tinggi.',
              'Bagikan pengalaman dan motivasi kepada adik kelas dalam kegiatan ekstrakurikuler.'
            ],
            teacherNote: 'Sekolah sangat bangga atas prestasi ananda! Nama ananda tercatat dalam rekap kejuaraan resmi sekolah.',
            aiPromptSuggestion: `Tuliskan draf teks portofolio singkat LinkedIn / resume atas pencapaian ${ach.title} sebagai ${ach.rank}.`
          }
        });
      });
    } else {
      improves.push({
        id: 'ach_opp_1',
        kind: 'improve',
        category: 'Prestasi',
        title: 'Peluang Mengikuti Kompetisi & Ekstrakurikuler',
        summary: 'Belum ada portofolio kejuaraan tercatat, saatnya unjuk bakat',
        tag: 'Peluang Terbuka',
        iconType: 'award',
        details: {
          overview: `Saat ini ananda belum memiliki catatan kejuaraan atau lomba terdaftar di sistem. Mengembangkan bakat di luar jam kelas sangat disarankan.`,
          whyItMatters: 'Partisipasi dalam kompetisi (LKS, lomba cipta aplikasi, olahraga, seni, debat) melatih kepemimpinan, daya tahan, dan memperkaya portofolio kerja.',
          actionSteps: [
            'Ikuti salah satu ekstrakurikuler kejuruan (misal: Web Club, Robotika, Desain Grafis, English Club, Futsal).',
            'Bicarakan dengan guru pembimbing mengenai informasi pendaftaran lomba tingkat pelajar.',
            'Bentuk tim kolaboratif bersama teman sekelas untuk membuat karya projek rintisan.'
          ],
          teacherNote: 'Wali kelas melihat ananda memiliki potensi tersembunyi. Jangan ragu mencoba kompetisi!',
          aiPromptSuggestion: `Sebutkan ide kompetisi dan lomba yang cocok untuk siswa SMK RPL tingkat pemula.`
        }
      });
    }

    // --- 4. KARAKTER & DISIPLIN ---
    const goodCharacters = myCharacters.filter(c => c.rating >= 4);
    if (goodCharacters.length > 0) {
      const topChar = goodCharacters[0];
      goods.push({
        id: `char_good_${topChar.id}`,
        kind: 'good',
        category: 'Karakter',
        title: `Keteladanan Karakter: ${topChar.valueType} (${topChar.rating}/5)`,
        summary: topChar.notes || 'Menunjukkan sikap terpuji dan keteladanan positif di lingkungan sekolah',
        tag: 'Karakter Pancasila',
        metric: `${topChar.rating}/5.0`,
        date: topChar.date,
        iconType: 'character',
        details: {
          overview: `Hasil observasi wali kelas dan guru mata pelajaran mencatat capaian positif ananda pada nilai karakter "${topChar.valueType}". Catatan: "${topChar.notes}".`,
          whyItMatters: 'Kecerdasan emosional dan integritas moral (soft skills) adalah faktor nomor satu yang dicari dunia kerja modern.',
          actionSteps: [
            'Pertahankan keteladanan ini dalam pergaulan sehari-hari di sekolah dan di rumah.',
            'Tularkan semangat positif dan kebiasaan santun kepada teman-teman sebaya.'
          ],
          teacherNote: 'Perilaku santun dan tanggung jawab ananda sangat diapresiasi oleh bapak/ibu guru pengajar.',
          aiPromptSuggestion: `Bagaimana cara memperkuat nilai kepemimpinan dan komunikasi positif dalam kerja tim?`
        }
      });
    }

    // Cek catatan pelanggaran tata tertib
    const violations = myDisciplines.filter(d => d.category === 'Pelanggaran' || d.category === 'Teguran');
    if (violations.length > 0) {
      violations.forEach(v => {
        improves.push({
          id: `disc_imp_${v.id}`,
          kind: 'improve',
          category: 'Disiplin',
          title: `Refleksi Tata Tertib: ${v.description}`,
          summary: `Catatan pembinaan edukatif tingkat ${v.level}. Mari evaluasi dan perbaiki bersama.`,
          tag: 'Refleksi Diri',
          metric: `${v.points || 5} Poin`,
          date: v.date,
          iconType: 'discipline',
          details: {
            overview: `Tercatat teguran/pelanggaran "${v.description}" pada tanggal ${v.date}. Tindak lanjut yang disepakati: "${v.followUpAction || 'Dialog reflektif edukatif'}".`,
            whyItMatters: 'Pencatatan ini bukan untuk menghukum, melainkan pembinaan edukatif agar ananda memahami batas norma dan tanggung jawab sosial.',
            actionSteps: [
              'Laksanakan komitmen tindak lanjut yang telah disepakati bersama wali kelas.',
              'Gunakan pengalaman ini sebagai titik balik pendewasaan diri.',
              'Jika memerlukan bantuan atau ingin mencurahkan keluhan, ruang BK dan wali kelas selalu terbuka.'
            ],
            teacherNote: 'Kami percaya setiap siswa mampu belajar dari kesalahan dan bertumbuh menjadi pribadi yang jauh lebih baik.',
            aiPromptSuggestion: `Bagikan tips membangun kebiasaan disiplin diri dan komitmen menepati aturan tanpa rasa terbebani.`
          }
        });
      });
    } else {
      goods.push({
        id: 'disc_clean',
        kind: 'good',
        category: 'Disiplin',
        title: 'Catatan Kedisiplinan Bersih (Nihil Pelanggaran)',
        summary: 'Patuhi seluruh tata tertib sekolah dengan rekam jejak tanpa teguran',
        tag: 'Disiplin Positif',
        metric: '0 Pelanggaran',
        iconType: 'discipline',
        details: {
          overview: 'Ananda memiliki rekor disiplin yang bersih dan tidak pernah menerima teguran pelanggaran tata tertib di sekolah.',
          whyItMatters: 'Kepatuhan terhadap regulasi mencerminkan kedewasaan dan kesiapan memasuki lingkungan kerja formal.',
          actionSteps: [
            'Tetap jaga ketertiban seragam, jam kehadiran, dan kesopanan bertutur kata.',
            'Ajak teman sekelas untuk bersama-sama menjaga kondusivitas kelas.'
          ],
          teacherNote: 'Terima kasih atas keteladanan yang ananda tunjukkan dalam menaati tata tertib sekolah.',
          aiPromptSuggestion: `Bagikan kata mutiara motivasi tentang arti penting kedisiplinan dan kejujuran untuk pelajar.`
        }
      });
    }

    // --- 5. DATA DIRI & CITA-CITA ---
    if (student.dreams || student.talentsAndInterests) {
      goods.push({
        id: 'career_good_1',
        kind: 'good',
        category: 'Cita-cita',
        title: `Cita-cita & Minat: ${student.dreams || 'Profesional Teknologi'}`,
        summary: `Fokus minat: ${student.talentsAndInterests || 'Pengembangan Kejuruan RPL'}`,
        tag: 'Visi Masa Depan',
        iconType: 'career',
        details: {
          overview: `Ananda telah merumuskan minat bakat pada bidang "${student.talentsAndInterests || '-'}" dan memiliki cita-cita berkarier sebagai "${student.dreams || 'Profesional'}".`,
          whyItMatters: 'Memiliki visi karier yang jelas sejak jenjang SMK membantu fokus belajar dan pemilihan projek magang (PKL) yang tepat sasaran.',
          actionSteps: [
            'Mulai susun portofolio projek yang relevan dengan profesi impian ananda.',
            'Cari informasi sertifikasi kompetensi industri terkait profesi tersebut.'
          ],
          teacherNote: 'Wali kelas dan guru kejuruan siap mendukung langkah ananda meraih cita-cita tersebut!',
          aiPromptSuggestion: `Berikan roadmap belajar dan keahlian yang harus dikuasai oleh siswa SMK untuk menjadi ${student.dreams || 'Software Engineer'}.`
        }
      });
    } else {
      improves.push({
        id: 'career_imp_1',
        kind: 'improve',
        category: 'Cita-cita',
        title: 'Lengkapi Data Diri, Minat & Cita-Cita Anda',
        summary: 'Formulir isian minat dan impian masa depan belum terisi lengkap',
        tag: 'Isian Siswa',
        iconType: 'career',
        details: {
          overview: 'Profil ananda di sistem sekolah masih menggunakan data standar buku induk. Bagian minat, bakat, dan cita-cita masa depan masih kosong.',
          whyItMatters: 'Data ini sangat penting bagi wali kelas dan Guru BK untuk memberikan rekomendasi penempatan magang PKL industri yang sesuai dengan aspirasi ananda.',
          actionSteps: [
            'Klik tombol "Isi / Lengkapi Data Diri" di bagian atas halaman ini.',
            'Tuliskan minat bakat serta impian karier yang ingin ananda capai setelah lulus nanti.'
          ],
          teacherNote: 'Mari luangkan waktu 2 menit untuk melengkapi data ini agar kami dapat mendampingi ananda secara optimal.',
          aiPromptSuggestion: `Bagaimana cara mengetahui minat dan bakat diri sendiri untuk siswa SMK jurusan RPL?`
        }
      });
    }

    return { goodItems: goods, improveItems: improves };
  }, [myAttendance, myGrades, myCharacters, myDisciplines, myAchievements, student, attRate, hadirCount, totalAtt, avgGrade, totalGrades]);

  // Filtering for category
  const filteredGoodItems = useMemo(() => {
    if (filterCategory === 'all') return goodItems;
    return goodItems.filter(item => item.category.toLowerCase() === filterCategory.toLowerCase());
  }, [goodItems, filterCategory]);

  const filteredImproveItems = useMemo(() => {
    if (filterCategory === 'all') return improveItems;
    return improveItems.filter(item => item.category.toLowerCase() === filterCategory.toLowerCase());
  }, [improveItems, filterCategory]);

  return (
    <div className="w-full space-y-6">

      {/* 1. Header Khusus Portal Siswa (Bersih, Personal & Ramah Android) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-100/50 via-teal-50/30 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center font-black text-2xl sm:text-3xl text-white shadow-md shrink-0 ${
              student.gender === 'L'
                ? 'bg-gradient-to-tr from-blue-600 to-indigo-700'
                : 'bg-gradient-to-tr from-rose-500 to-pink-600'
            }`}>
              {student.name[0]}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                  {student.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Siswa / Wali Murid
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {classroom?.name || 'Kelas XI RPL 1'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-600 font-medium">
                <span>NISN: <strong className="text-slate-800">{student.nisn || '-'}</strong></span>
                <span>•</span>
                <span>NIS: <strong className="text-slate-800">{student.nis}</strong></span>
                <span>•</span>
                <span>Sekolah: <strong className="text-slate-800">{classroom?.schoolName || 'SMKN 1 Sidayu'}</strong></span>
              </div>

              {student.dreams && (
                <div className="pt-1 text-xs text-indigo-700 font-bold flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Cita-cita: {student.dreams}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Action Buttons for Student */}
          <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
            <button
              onClick={() => onOpenEditSelfData(student)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 shadow-2xs transition-all active:scale-95"
            >
              <FileEdit className="w-4 h-4 text-emerald-600" />
              <span>Isi / Ubah Data Diri</span>
            </button>

            <button
              onClick={() => onOpenAIWithPrompt(`Saya adalah ${student.name} (siswa kelas XI RPL 1 SMKN 1 Sidayu). Bantu saya menganalisis perkembangan belajar saya, hal-hal baik yang perlu saya pertahankan, serta strategi mengatasi kelemahan belajar saya.`)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Tanya Asisten AI Belajar</span>
            </button>
          </div>
        </div>

        {/* 4 Mini Stat Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-slate-500 font-medium block text-[11px]">Kehadiran Saya</span>
            <div className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
              {attRate.toFixed(1)}%
            </div>
            <span className={`text-[10px] font-bold ${attRate >= 90 ? 'text-emerald-700' : 'text-rose-700'}`}>
              {attRate >= 90 ? '✓ Standar Terpenuhi' : '⚠️ Perlu Ditingkatkan'}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-slate-500 font-medium block text-[11px]">Rata-rata Nilai</span>
            <div className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
              {avgGrade.toFixed(1)}
            </div>
            <span className="text-[10px] font-bold text-blue-700">
              Standar KKM: 75
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-slate-500 font-medium block text-[11px]">Portofolio Prestasi</span>
            <div className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
              {myAchievements.length} Juara
            </div>
            <span className="text-[10px] font-bold text-amber-700">
              {myAchievements.length > 0 ? 'Terverifikasi' : 'Terbuka Untuk Lomba'}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-slate-500 font-medium block text-[11px]">Evaluasi Disiplin</span>
            <div className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
              {myDisciplines.filter(d => d.category === 'Pelanggaran').length === 0 ? 'Bersih' : `${myDisciplines.filter(d => d.category === 'Pelanggaran').length} Catatan`}
            </div>
            <span className="text-[10px] font-bold text-emerald-700">
              {myDisciplines.filter(d => d.category === 'Pelanggaran').length === 0 ? '✓ Keteladanan Positif' : 'Dalam Pembinaan'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Sub-Tab Navigasi Khusus Siswa */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setSelectedSubTab('evaluasi')}
          className={`py-2 px-3.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            selectedSubTab === 'evaluasi'
              ? 'bg-white text-emerald-800 shadow-2xs font-black'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Kartu Evaluasi Diri ({goodItems.length + improveItems.length})</span>
        </button>

        <button
          onClick={() => setSelectedSubTab('presensi')}
          className={`py-2 px-3.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            selectedSubTab === 'presensi'
              ? 'bg-white text-emerald-800 shadow-2xs font-black'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CalendarCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Grafik Presensi Saya</span>
        </button>

        <button
          onClick={() => setSelectedSubTab('nilai')}
          className={`py-2 px-3.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            selectedSubTab === 'nilai'
              ? 'bg-white text-emerald-800 shadow-2xs font-black'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
          <span>Rapor & Nilai ({myGrades.length})</span>
        </button>

        <button
          onClick={() => setSelectedSubTab('prestasi')}
          className={`py-2 px-3.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            selectedSubTab === 'prestasi'
              ? 'bg-white text-emerald-800 shadow-2xs font-black'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-amber-600" />
          <span>Prestasi ({myAchievements.length})</span>
        </button>

        <button
          onClick={() => setSelectedSubTab('datadiri')}
          className={`py-2 px-3.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            selectedSubTab === 'datadiri'
              ? 'bg-white text-emerald-800 shadow-2xs font-black'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <User className="w-3.5 h-3.5 text-purple-600" />
          <span>Profil & Cita-Cita</span>
        </button>
      </div>

      {/* 3. VIEW UTAMA: TAMPILAN DAFTAR KARTU HAL YANG BAIK DAN HAL YANG PERLU DIPERBAIKI */}
      {selectedSubTab === 'evaluasi' && (
        <div className="space-y-6">

          {/* Banner Petunjuk Interaksi */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Lightbulb className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900">
                  Evaluasi Holistik Perkembangan Siswa
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  Daftar kartu di bawah ini disusun otomatis berdasarkan data kehadiran, nilai asesmen, rekam disiplin, dan observasi 10 karakter ananda. <strong>Klik pada kartu mana saja untuk melihat rincian detail, saran tindak lanjut, dan bimbingan wali kelas.</strong>
                </p>
              </div>
            </div>

            {/* Filter Kategori */}
            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
              <span className="text-[11px] font-bold text-slate-500">Filter:</span>
              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-700 outline-none cursor-pointer shadow-2xs"
              >
                <option value="all">Semua Bidang</option>
                <option value="akademik">Akademik</option>
                <option value="presensi">Presensi</option>
                <option value="karakter">Karakter</option>
                <option value="disiplin">Kedisiplinan</option>
                <option value="prestasi">Prestasi</option>
              </select>
            </div>
          </div>

          {/* Grid Dua Kolom: Kolom Kiri = Hal yang Baik, Kolom Kanan = Hal yang Perlu Diperbaiki */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

            {/* SEKSI 1: HAL YANG BAIK (KEKUATAN & PRESTASI) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5">
                    <span>Hal yang Baik</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {filteredGoodItems.length} Poin
                    </span>
                  </h3>
                </div>
                <span className="text-[11px] text-emerald-700 font-bold">
                  Kekuatan & Keteladanan
                </span>
              </div>

              {filteredGoodItems.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs italic bg-white rounded-2xl border border-slate-200">
                  Tidak ada kartu hal baik pada filter kategori ini.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredGoodItems.map(item => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItemForModal(item)}
                      className="group p-4 sm:p-5 rounded-2xl bg-white hover:bg-emerald-50/40 border border-slate-200 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-emerald-500 group-hover:w-2 transition-all" />

                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1.5 pl-1 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {item.tag}
                            </span>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600">
                              {item.category}
                            </span>
                            {item.metric && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-600 text-white shadow-2xs">
                                {item.metric}
                              </span>
                            )}
                          </div>

                          <h4 className="font-black text-xs sm:text-sm text-slate-900 group-hover:text-emerald-800 transition-colors">
                            {item.title}
                          </h4>

                          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                            {item.summary}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs shrink-0 self-center group-hover:translate-x-1 transition-transform">
                          <span className="hidden sm:inline text-[11px]">Detail</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 pl-1">
                        <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                          <Check className="w-3.5 h-3.5" /> Pertahankan & Kembangkan
                        </span>
                        <span className="text-[10px]">Klik untuk baca saran »</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SEKSI 2: HAL YANG PERLU DIPERBAIKI (AREA PENGEMBANGAN) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-amber-200 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5">
                    <span>Hal yang Perlu Diperbaiki</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                      {filteredImproveItems.length} Poin
                    </span>
                  </h3>
                </div>
                <span className="text-[11px] text-amber-800 font-bold">
                  Bimbingan & Tindak Lanjut
                </span>
              </div>

              {filteredImproveItems.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-1">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                  <p className="font-bold text-emerald-900">Luar Biasa!</p>
                  <p className="text-[11px] text-emerald-700">Tidak ada poin perbaikan mendesak pada filter kategori ini. Seluruh capaian ananda berjalan optimal.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredImproveItems.map(item => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItemForModal(item)}
                      className="group p-4 sm:p-5 rounded-2xl bg-white hover:bg-amber-50/40 border border-slate-200 hover:border-amber-300 shadow-xs hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-amber-500 group-hover:w-2 transition-all" />

                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1.5 pl-1 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              {item.tag}
                            </span>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600">
                              {item.category}
                            </span>
                            {item.metric && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                {item.metric}
                              </span>
                            )}
                          </div>

                          <h4 className="font-black text-xs sm:text-sm text-slate-900 group-hover:text-amber-900 transition-colors">
                            {item.title}
                          </h4>

                          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                            {item.summary}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 text-amber-700 font-bold text-xs shrink-0 self-center group-hover:translate-x-1 transition-transform">
                          <span className="hidden sm:inline text-[11px]">Detail</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 pl-1">
                        <span className="flex items-center gap-1 text-amber-800 font-semibold">
                          <Compass className="w-3.5 h-3.5" /> Rekomendasi Solutif
                        </span>
                        <span className="text-[10px]">Klik untuk baca panduan »</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* 4. SUB-TAB PRESENSI: GRAFIK & REKAP KEHADIRAN */}
      {selectedSubTab === 'presensi' && (
        <div className="space-y-6">
          <StudentAttendanceChart attendanceRecords={myAttendance} targetRate={90} />

          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
            <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-emerald-600" />
              <span>Daftar Presensi Harian Siswa (10 Hari Terakhir)</span>
            </h4>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-y border-slate-100">
                  <tr>
                    <th className="p-3">Tanggal</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Keterlambatan</th>
                    <th className="p-3">Keterangan / Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myAttendance.map(att => (
                    <tr key={att.id} className="hover:bg-slate-50">
                      <td className="p-3 font-medium text-slate-700">{att.date}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          att.status === 'Hadir' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          att.status === 'Terlambat' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          att.status === 'Sakit' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          att.status === 'Izin' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                          'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {att.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600">
                        {att.lateMinutes ? `${att.lateMinutes} Menit` : '-'}
                      </td>
                      <td className="p-3 text-slate-500">
                        {att.notes || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. SUB-TAB NILAI: DAFTAR NILAI & KKM */}
      {selectedSubTab === 'nilai' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-900">
                Buku Nilai Asesmen Pembelajaran
              </h4>
              <p className="text-[11px] text-slate-500">
                Standar Kriteria Ketuntasan Minimal (KKM): 75
              </p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-500 block">Rata-rata Capaian</span>
              <span className="text-sm font-black text-blue-700">{avgGrade.toFixed(1)}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-y border-slate-100">
                <tr>
                  <th className="p-3">Mata Pelajaran</th>
                  <th className="p-3">Asesmen</th>
                  <th className="p-3">Nilai</th>
                  <th className="p-3">Ketuntasan KKM</th>
                  <th className="p-3">Topik & Rekomendasi Belajar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myGrades.map(g => {
                  const isTuntas = g.score >= kkmStandard;
                  return (
                    <tr key={g.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-800">{g.subject}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold">
                          {g.type}
                        </span>
                      </td>
                      <td className="p-3 font-black text-sm">
                        <span className={isTuntas ? 'text-emerald-700' : 'text-rose-600'}>
                          {g.score}
                        </span>
                      </td>
                      <td className="p-3">
                        {isTuntas ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            ✓ Tuntas
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            ⚠️ Remedial
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-slate-500">
                        {g.topic || g.notes || 'Asesmen tengah semester'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. SUB-TAB PRESTASI: PORTOFOLIO */}
      {selectedSubTab === 'prestasi' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-900">
                Portofolio Prestasi & Piagam Kejuaraan
              </h4>
              <p className="text-[11px] text-slate-500">
                Dokumentasi capaian lomba akademik dan non-akademik siswa
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
              {myAchievements.length} Piagam
            </span>
          </div>

          {myAchievements.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs italic space-y-1">
              <Award className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-semibold">Belum ada portofolio prestasi tercatat.</p>
              <p className="text-[11px] text-slate-500">Konsultasikan dengan pembina ekstrakurikuler untuk mendaftar kompetisi lomba antarpelajar!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {myAchievements.map(ach => (
                <div key={ach.id} className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-xs">
                    🏆
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-black text-xs sm:text-sm text-slate-900">
                      {ach.title}
                    </h5>
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-amber-900">
                      <span>{ach.rank}</span>
                      <span>•</span>
                      <span>Tingkat {ach.level}</span>
                      <span>•</span>
                      <span>{ach.category}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block pt-0.5">
                      Tanggal: {ach.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 7. SUB-TAB DATA DIRI & CITA-CITA: FORMULIR ISIAN MANDIRI */}
      {selectedSubTab === 'datadiri' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-900">
                Data Diri, Minat Bakat & Kontak Siswa
              </h4>
              <p className="text-[11px] text-slate-500">
                Informasi ini digunakan oleh wali kelas untuk pendampingan konseling dan penempatan PKL
              </p>
            </div>
            <button
              onClick={() => onOpenEditSelfData(student)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <FileEdit className="w-3.5 h-3.5" />
              <span>Edit Data</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 space-y-1">
              <span className="text-slate-400 font-semibold block text-[10px]">CITA-CITA PROFESI MASA DEPAN</span>
              <p className="font-black text-sm text-indigo-900">
                {student.dreams || 'Belum diisi (Klik Edit Data)'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 space-y-1">
              <span className="text-slate-400 font-semibold block text-[10px]">MINAT & BAKAT KEJURUAN</span>
              <p className="font-black text-sm text-slate-800">
                {student.talentsAndInterests || 'Belum diisi (Klik Edit Data)'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 space-y-1">
              <span className="text-slate-400 font-semibold block text-[10px]">ALAMAT TINGGAL</span>
              <p className="font-bold text-slate-800">
                {student.address || '-'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 space-y-1">
              <span className="text-slate-400 font-semibold block text-[10px]">NOMOR HP / WHATSAPP SISWA</span>
              <p className="font-bold text-slate-800">
                {student.phone || '-'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 space-y-1">
              <span className="text-slate-400 font-semibold block text-[10px]">NAMA ORANG TUA / WALI</span>
              <p className="font-bold text-slate-800">
                {student.parentName || student.fatherName || '-'} ({student.parentJob || 'Wiraswasta'})
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 space-y-1">
              <span className="text-slate-400 font-semibold block text-[10px]">KONTAK DARURAT / ORANG TUA</span>
              <p className="font-bold text-slate-800">
                {student.parentPhone || student.emergencyContact || '-'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 8. MODAL INTERAKTIF: KLIK UNTUK MASUK LEBIH DETAIL */}
      {selectedItemForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className={`p-5 sm:p-6 text-white flex items-start justify-between gap-4 ${
              selectedItemForModal.kind === 'good'
                ? 'bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900'
                : 'bg-gradient-to-r from-amber-600 via-orange-600 to-slate-900'
            }`}>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-md">
                    {selectedItemForModal.kind === 'good' ? '★ Hal yang Baik' : '⚠️ Hal yang Perlu Diperbaiki'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/10">
                    Bidang: {selectedItemForModal.category}
                  </span>
                  {selectedItemForModal.metric && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-white text-slate-900">
                      {selectedItemForModal.metric}
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-xl font-black text-white leading-snug">
                  {selectedItemForModal.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedItemForModal(null)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs">
              
              {/* Seksi 1: Deskripsi Rinci */}
              <div className="space-y-1.5">
                <span className="font-black text-slate-900 uppercase tracking-wide text-[11px] block">
                  1. Rincian Temuan & Kondisi Aktual
                </span>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  {selectedItemForModal.details.overview}
                </p>
              </div>

              {/* Seksi 2: Mengapa Hal Ini Penting */}
              <div className="space-y-1.5">
                <span className="font-black text-slate-900 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-indigo-600" />
                  <span>2. Mengapa Hal Ini Penting untuk Masa Depan Ananda?</span>
                </span>
                <p className="text-slate-700 leading-relaxed bg-indigo-50/50 p-3.5 rounded-2xl border border-indigo-100">
                  {selectedItemForModal.details.whyItMatters}
                </p>
              </div>

              {/* Seksi 3: Langkah Tindak Lanjut Konkret */}
              <div className="space-y-2">
                <span className="font-black text-slate-900 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>3. Saran & Langkah Tindak Lanjut Konkret</span>
                </span>
                <div className="space-y-2">
                  {selectedItemForModal.details.actionSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-slate-700 font-medium leading-relaxed">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seksi 4: Catatan & Rekomendasi Wali Kelas */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1.5">
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-amber-700" />
                  <span className="font-bold text-amber-900 text-xs">Pesan Ramah dari Wali Kelas:</span>
                </div>
                <p className="text-amber-950 italic leading-relaxed pl-6">
                  "{selectedItemForModal.details.teacherNote}"
                </p>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => {
                  const prompt = selectedItemForModal.details.aiPromptSuggestion;
                  setSelectedItemForModal(null);
                  onOpenAIWithPrompt(prompt);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Konsultasi AI untuk Topik Ini</span>
              </button>

              <button
                onClick={() => setSelectedItemForModal(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-300 transition-colors"
              >
                Tutup Jendela
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
