import React, { useState } from 'react';
import {
  X,
  Check,
  UserCheck,
  Sparkles,
  Phone,
  Heart,
  Home,
  Briefcase,
  AlertCircle,
  FileEdit
} from 'lucide-react';
import { Student, Gender } from '../types';

interface StudentDataInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onSaveStudent: (student: Student) => void;
  isStudentUser?: boolean;
}

export const StudentDataInputModal: React.FC<StudentDataInputModalProps> = ({
  isOpen,
  onClose,
  student,
  onSaveStudent,
  isStudentUser = false
}) => {
  const [formData, setFormData] = useState<Partial<Student>>(() => {
    if (student) {
      return { ...student };
    }
    return {
      name: '',
      nis: '',
      nisn: '',
      gender: 'L',
      birthPlace: '',
      birthDate: '',
      address: '',
      phone: '',
      fatherName: '',
      motherName: '',
      parentName: '',
      parentJob: '',
      parentPhone: '',
      emergencyContact: '',
      healthHistory: '',
      talentsAndInterests: '',
      dreams: '',
      specialNotes: '',
      status: 'Aktif'
    };
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync if student changes
  React.useEffect(() => {
    if (student) {
      setFormData({ ...student });
    }
  }, [student]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const studentToSave: Student = {
      id: student?.id || `std_${Date.now()}`,
      classId: student?.classId || 'cls_rpl1',
      teacherId: student?.teacherId || 'guest_teacher',
      nis: formData.nis || student?.nis || '20261101',
      nisn: formData.nisn || student?.nisn || '',
      name: formData.name || '',
      gender: (formData.gender as Gender) || 'L',
      birthPlace: formData.birthPlace || '',
      birthDate: formData.birthDate || '',
      address: formData.address || '',
      phone: formData.phone || '',
      fatherName: formData.fatherName || '',
      motherName: formData.motherName || '',
      parentName: formData.parentName || formData.fatherName || formData.motherName || '',
      parentJob: formData.parentJob || '',
      parentPhone: formData.parentPhone || '',
      emergencyContact: formData.emergencyContact || '',
      healthHistory: formData.healthHistory || 'Sehat',
      talentsAndInterests: formData.talentsAndInterests || '',
      dreams: formData.dreams || '',
      specialNotes: formData.specialNotes || '',
      filledByStudent: true,
      selfSubmissionDate: new Date().toISOString(),
      status: formData.status || 'Aktif',
      createdAt: student?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSaveStudent(studentToSave);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-auto">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-800 via-teal-800 to-indigo-900 text-white flex items-center justify-between shrink-0 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-amber-300 shadow-xs">
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  {isStudentUser ? 'Formulir Isian Biodata Siswa Mandiri' : 'Pengisian & Pembaruan Data Siswa'}
                </h3>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
                  User Siswa
                </span>
              </div>
              <p className="text-xs text-emerald-100/90">
                Data yang diisi di sini akan disinkronkan langsung ke dashboard wali kelas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs flex-1">
          {savedSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Data isian siswa berhasil disimpan dan disinkronkan ke buku induk wali kelas!</span>
            </div>
          )}

          {/* Section 1: Data Identitas Siswa */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wide border-b border-slate-100 pb-1.5">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>1. Identitas Pokok Siswa</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Siswa *</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Muhammad Rizki"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Jenis Kelamin *</label>
                <select
                  value={formData.gender || 'L'}
                  onChange={e => setFormData({ ...formData, gender: e.target.value as Gender })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none font-semibold text-slate-800 bg-white"
                >
                  <option value="L">Laki-laki (L)</option>
                  <option value="P">Perempuan (P)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">NIS (Nomor Induk Siswa)</label>
                <input
                  type="text"
                  value={formData.nis || ''}
                  onChange={e => setFormData({ ...formData, nis: e.target.value })}
                  placeholder="20261101"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">NISN (10 Digit Nasional)</label>
                <input
                  type="text"
                  value={formData.nisn || ''}
                  onChange={e => setFormData({ ...formData, nisn: e.target.value })}
                  placeholder="0078912345"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tempat Lahir</label>
                <input
                  type="text"
                  value={formData.birthPlace || ''}
                  onChange={e => setFormData({ ...formData, birthPlace: e.target.value })}
                  placeholder="Gresik"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tanggal Lahir</label>
                <input
                  type="date"
                  value={formData.birthDate || ''}
                  onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Alamat Tempat Tinggal</label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Jl. Raya Sidayu No. 12, Gresik"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">No. HP / WhatsApp Siswa</label>
                <input
                  type="text"
                  value={formData.phone || ''}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="081234567890"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Data Orang Tua & Kontak Darurat */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wide border-b border-slate-100 pb-1.5">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span>2. Data Orang Tua / Wali & Kontak Darurat</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Ayah</label>
                <input
                  type="text"
                  value={formData.fatherName || formData.parentName || ''}
                  onChange={e => setFormData({ ...formData, fatherName: e.target.value, parentName: e.target.value })}
                  placeholder="Nama Ayah Siswa"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Ibu</label>
                <input
                  type="text"
                  value={formData.motherName || ''}
                  onChange={e => setFormData({ ...formData, motherName: e.target.value })}
                  placeholder="Nama Ibu Siswa"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pekerjaan Orang Tua</label>
                <input
                  type="text"
                  value={formData.parentJob || ''}
                  onChange={e => setFormData({ ...formData, parentJob: e.target.value })}
                  placeholder="Wiraswasta / Guru / Karyawan Swasta"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">No. WhatsApp Orang Tua (Wali Murid)</label>
                <input
                  type="text"
                  value={formData.parentPhone || ''}
                  onChange={e => setFormData({ ...formData, parentPhone: e.target.value })}
                  placeholder="081398765432"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Kontak Darurat (Emergency Contact)</label>
              <input
                type="text"
                value={formData.emergencyContact || ''}
                onChange={e => setFormData({ ...formData, emergencyContact: e.target.value })}
                placeholder="081234567899 (Paman / Budi Santoso)"
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Section 3: Minat, Bakat, Kesehatan & Cita-Cita */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wide border-b border-slate-100 pb-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>3. Minat, Bakat, Kesehatan & Impian Masa Depan</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Riwayat Kesehatan (Alergi/Kondisi)</label>
                <input
                  type="text"
                  value={formData.healthHistory || ''}
                  onChange={e => setFormData({ ...formData, healthHistory: e.target.value })}
                  placeholder="Sehat / Alergi debu / Asma ringan"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Minat & Bakat Siswa</label>
                <input
                  type="text"
                  value={formData.talentsAndInterests || ''}
                  onChange={e => setFormData({ ...formData, talentsAndInterests: e.target.value })}
                  placeholder="Pemrograman Web, Futsal, Desain Grafis"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Cita-Cita / Impian Siswa</label>
              <input
                type="text"
                value={formData.dreams || ''}
                onChange={e => setFormData({ ...formData, dreams: e.target.value })}
                placeholder="Software Engineer / Pengusaha Digital / Kuliah Informatika"
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Harapan / Catatan untuk Wali Kelas</label>
              <textarea
                rows={2}
                value={formData.specialNotes || ''}
                onChange={e => setFormData({ ...formData, specialNotes: e.target.value })}
                placeholder="Tuliskan catatan khusus atau harapan pendampingan belajar dari wali kelas..."
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 shrink-0">
            <span className="text-[11px] text-slate-500">
              {formData.filledByStudent ? '✅ Sudah pernah diisi mandiri' : 'Baru diisi siswa'}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
              >
                Batal
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md transition-all active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>Simpan Data Isian Siswa</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
