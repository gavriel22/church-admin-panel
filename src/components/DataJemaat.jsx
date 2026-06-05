aimport { useState, useMemo } from 'react';
import { Search, Plus, Filter, User, Phone, CheckCircle, XCircle, Edit, Trash2, Eye } from 'lucide-react';
import Modal from './Modal';

export default function DataJemaat({ 
  jemaat, 
  onAddJemaat, 
  onUpdateJemaat, 
  onDeleteJemaat, 
  accentClasses, 
  externalOpenAddModal, 
  setExternalOpenAddModal 
}) {
  // UI states
  const [searchTerm, setSearchTerm] = useState('');
  const [ageFilter, setAgeFilter] = useState('Semua');
  const [genderFilter, setGenderFilter] = useState('Semua');
  const [bloodFilter, setBloodFilter] = useState('Semua');
  const [cityFilter, setCityFilter] = useState('');
  
  const [selectedMember, setSelectedMember] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form State
  const initialFormState = {
    id: '',
    no_kk: '',
    nik: '',
    nama: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    jenis_kelamin: 'Laki-laki',
    golongan_darah: 'Tidak Tahu',
    alamat_lengkap: '',
    agama: 'Kristen',
    status_perkawinan: 'Belum Kawin',
    pekerjaan: '',
    kewarganegaraan: 'WNI',
    peran: 'Jemaat',
    kelompok_sel: 'Sion',
    kontak: '',
    status: 'Aktif',
    hubungan_keluarga: 'Anak'
  };
  
  const [formData, setFormData] = useState(initialFormState);

  // Calculate age from birthdate
  const getAge = (birthDateString) => {
    if (!birthDateString) return 0;
    const birthYear = new Date(birthDateString).getFullYear();
    const currentYear = 2026; // System year relative to current time
    return currentYear - birthYear;
  };

  // Classify age category
  const getAgeCategory = (birthDateString) => {
    const age = getAge(birthDateString);
    if (age < 12) return 'Anak-anak';
    if (age >= 12 && age <= 25) return 'Pemuda';
    if (age >= 26 && age <= 59) return 'Dewasa';
    return 'Lansia';
  };

  // Filter Combinations with useMemo
  const filteredJemaat = useMemo(() => {
    return jemaat.filter(member => {
      const matchSearch = searchTerm.trim() === '' || 
        member.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.nik.includes(searchTerm) ||
        member.no_kk.includes(searchTerm);

      const ageCategory = getAgeCategory(member.tanggal_lahir);
      const matchAge = ageFilter === 'Semua' || ageCategory === ageFilter;

      const matchGender = genderFilter === 'Semua' || member.jenis_kelamin === genderFilter;

      const matchBlood = bloodFilter === 'Semua' || member.golongan_darah === bloodFilter;

      const matchCity = cityFilter.trim() === '' || 
        member.alamat_lengkap.toLowerCase().includes(cityFilter.toLowerCase());

      return matchSearch && matchAge && matchGender && matchBlood && matchCity;
    });
  }, [jemaat, searchTerm, ageFilter, genderFilter, bloodFilter, cityFilter]);

  // Handle Create Modal Open
  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setFormData(initialFormState);
    setIsFormModalOpen(true);
  };

  // Handle Edit Modal Open
  const handleOpenEditModal = (e, member) => {
    e.stopPropagation(); // Prevent row click details modal trigger
    setIsEditMode(true);
    
    // Extract tempat lahir if format "City, Date"
    let tempat = '';
    if (member.tempat_tanggal_lahir) {
      const parts = member.tempat_tanggal_lahir.split(',');
      if (parts.length > 0) tempat = parts[0].trim();
    }

    setFormData({
      id: member.id,
      no_kk: member.no_kk || '',
      nik: member.nik || '',
      nama: member.nama || '',
      tempat_lahir: tempat || '',
      tanggal_lahir: member.tanggal_lahir || '',
      jenis_kelamin: member.jenis_kelamin || 'Laki-laki',
      golongan_darah: member.golongan_darah || 'Tidak Tahu',
      alamat_lengkap: member.alamat_lengkap || '',
      agama: member.agama || 'Kristen',
      status_perkawinan: member.status_perkawinan || 'Belum Kawin',
      pekerjaan: member.pekerjaan || '',
      kewarganegaraan: member.kewarganegaraan || 'WNI',
      peran: member.peran || 'Jemaat',
      kelompok_sel: member.kelompok_sel || 'Sion',
      kontak: member.kontak || '',
      status: member.status || 'Aktif',
      hubungan_keluarga: member.hubungan_keluarga || 'Anak'
    });
    setIsFormModalOpen(true);
  };

  // Handle Row Detail Modal Open
  const handleRowClick = (member) => {
    setSelectedMember(member);
    setIsDetailModalOpen(true);
  };

  // Handle Delete Action
  const handleDeleteClick = (e, member) => {
    e.stopPropagation();
    const confirmed = window.confirm(`Apakah Anda yakin ingin menghapus data jemaat "${member.nama}"?`);
    if (confirmed) {
      onDeleteJemaat(member.id);
    }
  };

  // Form submit handler (Insert/Update)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.nik || !formData.no_kk || !formData.tanggal_lahir) {
      alert('Mohon isi kolom wajib: Nama, NIK, No KK, dan Tanggal Lahir.');
      return;
    }

    // Format Date string
    const dateFormatted = new Date(formData.tanggal_lahir).toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
    const tempatTanggalLahir = `${formData.tempat_lahir}, ${dateFormatted}`;

    const memberData = {
      id: isEditMode ? formData.id : Date.now(),
      no_kk: formData.no_kk,
      nik: formData.nik,
      nama: formData.nama,
      tempat_tanggal_lahir: tempatTanggalLahir,
      tanggal_lahir: formData.tanggal_lahir,
      jenis_kelamin: formData.jenis_kelamin,
      golongan_darah: formData.golongan_darah,
      alamat_lengkap: formData.alamat_lengkap,
      agama: formData.agama,
      status_perkawinan: formData.status_perkawinan,
      pekerjaan: formData.pekerjaan || 'Tidak Bekerja',
      kewarganegaraan: formData.kewarganegaraan,
      peran: formData.peran,
      kelompok_sel: formData.kelompok_sel,
      kontak: formData.kontak || '-',
      status: formData.status,
      hubungan_keluarga: formData.hubungan_keluarga
    };

    if (isEditMode) {
      onUpdateJemaat(memberData);
    } else {
      onAddJemaat(memberData);
    }

    setIsFormModalOpen(false);
    if (setExternalOpenAddModal) setExternalOpenAddModal(false);
  };

  // Close form modal
  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    if (setExternalOpenAddModal) setExternalOpenAddModal(false);
  };

  // Sync external dashboard quick action trigger
  if (externalOpenAddModal && !isFormModalOpen) {
    handleOpenCreateModal();
  }

  // Get family members for detailed view modal (same no_kk)
  const familyMembers = useMemo(() => {
    if (!selectedMember) return [];
    return jemaat.filter(member => member.no_kk === selectedMember.no_kk);
  }, [jemaat, selectedMember]);

  // Sort family members by order: Kepala Keluarga, Istri, Anak, dll.
  const sortedFamilyMembers = useMemo(() => {
    const order = { 'Kepala Keluarga': 1, 'Istri': 2, 'Anak': 3 };
    return [...familyMembers].sort((a, b) => {
      return (order[a.hubungan_keluarga] || 4) - (order[b.hubungan_keluarga] || 4);
    });
  }, [familyMembers]);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs text-stone-400 font-medium">Manajemen Basis Data</p>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight">Daftar Keanggotaan Jemaat</h2>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold shadow-xs ${accentClasses.bgPrimary} accent-transition focus:outline-none`}
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Jemaat
        </button>
      </div>

      {/* Filter controls row */}
      <div className="bg-white border border-stone-200/60 p-4 rounded-xl space-y-3 shadow-xs">
        {/* Row 1: Search & City Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama jemaat, NIK, atau nomor KK..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-lg text-sm bg-stone-50/50 focus:bg-white focus:border-stone-450 focus:outline-none placeholder-stone-400 text-stone-850"
            />
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Kota / Daerah alamat..."
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-lg text-sm bg-stone-50/50 focus:bg-white focus:border-stone-450 focus:outline-none placeholder-stone-400 text-stone-850"
            />
          </div>
        </div>

        {/* Row 2: Select Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Age range filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider whitespace-nowrap">Usia:</span>
            <select
              value={ageFilter}
              onChange={(e) => setAgeFilter(e.target.value)}
              className="w-full py-1.5 px-2.5 border border-stone-200 rounded-lg text-xs bg-white text-stone-700 font-semibold focus:outline-none focus:border-stone-400"
            >
              <option value="Semua">Semua Usia</option>
              <option value="Anak-anak">Anak-anak (&lt;12 thn)</option>
              <option value="Pemuda">Pemuda (12-25 thn)</option>
              <option value="Dewasa">Dewasa (26-59 thn)</option>
              <option value="Lansia">Lansia (&ge;60 thn)</option>
            </select>
          </div>

          {/* Gender Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider whitespace-nowrap">Gender:</span>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="w-full py-1.5 px-2.5 border border-stone-200 rounded-lg text-xs bg-white text-stone-700 font-semibold focus:outline-none focus:border-stone-400"
            >
              <option value="Semua">Semua Gender</option>
              <option value="Laki-laki">Pria (Laki-laki)</option>
              <option value="Perempuan">Wanita (Perempuan)</option>
            </select>
          </div>

          {/* Blood Type Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider whitespace-nowrap font-sans">Goldar:</span>
            <select
              value={bloodFilter}
              onChange={(e) => setBloodFilter(e.target.value)}
              className="w-full py-1.5 px-2.5 border border-stone-200 rounded-lg text-xs bg-white text-stone-700 font-semibold focus:outline-none focus:border-stone-400"
            >
              <option value="Semua">Semua Goldar</option>
              <option value="A">Golongan Darah A</option>
              <option value="B">Golongan Darah B</option>
              <option value="AB">Golongan Darah AB</option>
              <option value="O">Golongan Darah O</option>
              <option value="Tidak Tahu">Tidak Tahu</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-stone-200/60 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-stone-50/75 border-b border-stone-200 text-stone-550 text-[10px] font-bold uppercase tracking-wider">
                <th className="px-6 py-3.5">Nama Lengkap</th>
                <th className="px-6 py-3.5">Peran Pelayanan</th>
                <th className="px-6 py-3.5">Kelompok Sel</th>
                <th className="px-6 py-3.5">Kontak</th>
                <th className="px-6 py-3.5">Usia / JK / Goldar</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs">
              {filteredJemaat.length > 0 ? (
                filteredJemaat.map((member) => {
                  const age = getAge(member.tanggal_lahir);
                  const category = getAgeCategory(member.tanggal_lahir);
                  
                  return (
                    <tr 
                      key={member.id} 
                      onClick={() => handleRowClick(member)}
                      className="hover:bg-stone-50/70 cursor-pointer transition-colors"
                      title="Klik untuk melihat detail lengkap"
                    >
                      {/* Name & NIK */}
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-bold text-stone-900">{member.nama}</div>
                          <div className="text-[10px] text-stone-400 font-medium mt-0.5">NIK: {member.nik}</div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4 text-stone-600 font-semibold">{member.peran}</td>

                      {/* Cell Group */}
                      <td className="px-6 py-4">
                        <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-[10px] font-bold border border-stone-200/40">
                          {member.kelompok_sel}
                        </span>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-4 text-stone-600 font-medium">
                        {member.kontak !== '-' ? (
                          <span className="flex items-center"><Phone className="w-3.5 h-3.5 text-stone-400 mr-1" /> {member.kontak}</span>
                        ) : (
                          <span className="text-stone-300">-</span>
                        )}
                      </td>

                      {/* Age / Gender / Blood */}
                      <td className="px-6 py-4">
                        <div>
                          <span className="font-semibold text-stone-700">{age} Thn ({member.jenis_kelamin === 'Laki-laki' ? 'P' : 'W'})</span>
                          <span className="block text-[10px] text-stone-400 font-semibold mt-0.5">Goldar: {member.golongan_darah}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        {member.status === 'Aktif' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-50 text-green-700 border border-green-200/50">
                            <CheckCircle className="w-3 h-3 mr-1" /> Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-500 border border-stone-200/60">
                            <XCircle className="w-3 h-3 mr-1" /> Tidak Aktif
                          </span>
                        )}
                      </td>

                      {/* Action buttons */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={(e) => handleOpenEditModal(e, member)}
                            className="p-1 rounded-lg text-stone-450 hover:text-stone-700 hover:bg-stone-50 border border-transparent hover:border-stone-200/60 transition-all focus:outline-none"
                            title="Edit data jemaat"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteClick(e, member)}
                            className="p-1 rounded-lg text-stone-450 hover:text-red-650 hover:bg-red-50 border border-transparent hover:border-red-200/30 transition-all focus:outline-none"
                            title="Hapus data jemaat"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-stone-450 text-xs">
                    Tidak ada data jemaat ditemukan yang cocok dengan kriteria pencarian atau filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Table summary info */}
        <div className="px-6 py-3 border-t border-stone-150/60 bg-stone-50/50 flex items-center justify-between">
          <span className="text-[10px] text-stone-400 font-medium">
            Menampilkan {filteredJemaat.length} dari {jemaat.length} jemaat terdaftar
          </span>
          <span className="text-[10px] text-stone-400 font-semibold italic">
            * Klik baris jemaat untuk membuka detail profil lengkap dan anggota keluarga
          </span>
        </div>
      </div>

      {/* DETAIL MODAL (READ/VIEW) */}
      <Modal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        title={`Profil Lengkap Jemaat - ${selectedMember?.nama}`}
      >
        {selectedMember && (
          <div className="space-y-6">
            {/* Primary Details Grid (All 11 Fields) */}
            <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-4 space-y-4">
              <h4 className="text-[10.5px] font-bold text-stone-400 uppercase tracking-wider border-b border-stone-200 pb-1.5">
                Data Identifikasi & Kependudukan
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3.5 text-xs text-stone-700 font-medium">
                <div>
                  <span className="text-[10px] font-bold text-stone-400 block uppercase">Nomor Kartu Keluarga (No KK)</span>
                  <span className="font-semibold text-stone-850">{selectedMember.no_kk}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-400 block uppercase">NIK (KTP)</span>
                  <span className="font-semibold text-stone-850">{selectedMember.nik}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-400 block uppercase">Nama Lengkap</span>
                  <span className="font-bold text-stone-900">{selectedMember.nama}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-400 block uppercase">Tempat, Tanggal Lahir</span>
                  <span className="font-semibold text-stone-850">{selectedMember.tempat_tanggal_lahir}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-400 block uppercase">Jenis Kelamin</span>
                  <span className="font-semibold text-stone-850">{selectedMember.jenis_kelamin}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-400 block uppercase font-sans">Golongan Darah</span>
                  <span className="font-bold text-stone-850">{selectedMember.golongan_darah}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-400 block uppercase">Agama</span>
                  <span className="font-semibold text-stone-850">{selectedMember.agama}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-400 block uppercase">Status Perkawinan</span>
                  <span className="font-semibold text-stone-850">{selectedMember.status_perkawinan}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-400 block uppercase">Pekerjaan</span>
                  <span className="font-semibold text-stone-850">{selectedMember.pekerjaan}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-400 block uppercase">Kewarganegaraan</span>
                  <span className="font-semibold text-stone-850">{selectedMember.kewarganegaraan}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-[10px] font-bold text-stone-400 block uppercase">Alamat Lengkap</span>
                  <span className="font-semibold text-stone-850 leading-relaxed block">{selectedMember.alamat_lengkap}</span>
                </div>
              </div>
            </div>

            {/* Extra Church details */}
            <div className="bg-stone-50/50 border border-stone-200/60 rounded-xl p-4 space-y-3">
              <h4 className="text-[10.5px] font-bold text-stone-400 uppercase tracking-wider border-b border-stone-150 pb-1.5">
                Afiliasi & Kontak Gereja
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-stone-700 font-medium">
                <div>
                  <span className="text-[10px] font-bold text-stone-400 block uppercase">Kelompok Sel</span>
                  <span className="bg-white px-2 py-0.5 border border-stone-200 rounded text-[10px] font-bold inline-block mt-0.5">{selectedMember.kelompok_sel}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-400 block uppercase">Peran</span>
                  <span className="font-semibold block mt-0.5">{selectedMember.peran}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-400 block uppercase">Kontak</span>
                  <span className="font-semibold block mt-0.5">{selectedMember.kontak}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-400 block uppercase">Hub. Keluarga</span>
                  <span className="font-bold text-stone-850 block mt-0.5">{selectedMember.hubungan_keluarga}</span>
                </div>
              </div>
            </div>

            {/* Family Members Section (same KK) */}
            <div className="space-y-3">
              <h4 className="text-[10.5px] font-bold text-stone-400 uppercase tracking-wider border-b border-stone-200 pb-1.5">
                Anggota Keluarga (KK: {selectedMember.no_kk})
              </h4>
              
              <div className="space-y-2">
                {sortedFamilyMembers.length > 0 ? (
                  sortedFamilyMembers.map((fam) => (
                    <div 
                      key={fam.id} 
                      className={`
                        p-2.5 rounded-lg border text-xs flex justify-between items-center font-medium
                        ${fam.id === selectedMember.id 
                          ? 'bg-stone-100 border-stone-300 font-bold' 
                          : 'bg-white border-stone-200/80'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className={`
                          w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold
                          ${fam.hubungan_keluarga === 'Kepala Keluarga' 
                            ? 'bg-amber-100 text-amber-800' 
                            : fam.hubungan_keluarga === 'Istri' 
                              ? 'bg-pink-100 text-pink-800'
                              : 'bg-blue-100 text-blue-800'
                          }
                        `}>
                          {fam.hubungan_keluarga[0]}
                        </div>
                        <div>
                          <span className="text-stone-900">{fam.nama}</span>
                          <span className="text-[10px] text-stone-400 block mt-0.5">{fam.nik}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                          {fam.hubungan_keluarga}
                        </span>
                        <span className="text-[10px] text-stone-400 font-medium">
                          {getAge(fam.tanggal_lahir)} Thn
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-stone-400 text-xs italic">Tidak ada anggota keluarga lain terdaftar.</p>
                )}
              </div>
            </div>

            {/* Close footer */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 border border-stone-250 hover:bg-stone-50 bg-white rounded-lg text-xs font-semibold text-stone-650 transition-colors focus:outline-none"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* FORM MODAL (CREATE & EDIT) */}
      <Modal 
        isOpen={isFormModalOpen} 
        onClose={handleCloseFormModal} 
        title={isEditMode ? "Ubah Data Jemaat" : "Pendaftaran Jemaat Baru"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-stone-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* KK */}
            <div className="space-y-1">
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">No. Kartu Keluarga (KK) *</label>
              <input
                type="text"
                required
                maxLength="16"
                placeholder="16 digit No KK"
                value={formData.no_kk}
                onChange={(e) => setFormData({...formData, no_kk: e.target.value})}
                className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-stone-50/50 focus:bg-white"
              />
            </div>

            {/* NIK */}
            <div className="space-y-1">
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">NIK (Nomor Induk Kependudukan) *</label>
              <input
                type="text"
                required
                maxLength="16"
                placeholder="16 digit NIK"
                value={formData.nik}
                onChange={(e) => setFormData({...formData, nik: e.target.value})}
                className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-stone-50/50 focus:bg-white"
              />
            </div>

            {/* Nama */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Nama Lengkap *</label>
              <input
                type="text"
                required
                placeholder="Nama lengkap sesuai identitas"
                value={formData.nama}
                onChange={(e) => setFormData({...formData, nama: e.target.value})}
                className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-stone-50/50 focus:bg-white"
              />
            </div>

            {/* Tempat Lahir */}
            <div className="space-y-1">
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Tempat Lahir *</label>
              <input
                type="text"
                required
                placeholder="Kota tempat lahir"
                value={formData.tempat_lahir}
                onChange={(e) => setFormData({...formData, tempat_lahir: e.target.value})}
                className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-stone-50/50 focus:bg-white"
              />
            </div>

            {/* Tanggal Lahir */}
            <div className="space-y-1">
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Tanggal Lahir *</label>
              <input
                type="date"
                required
                value={formData.tanggal_lahir}
                onChange={(e) => setFormData({...formData, tanggal_lahir: e.target.value})}
                className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-stone-50/50 focus:bg-white"
              />
            </div>

            {/* Jenis Kelamin */}
            <div className="space-y-1">
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Jenis Kelamin</label>
              <select
                value={formData.jenis_kelamin}
                onChange={(e) => setFormData({...formData, jenis_kelamin: e.target.value})}
                className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-white"
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            {/* Golongan Darah */}
            <div className="space-y-1">
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Golongan Darah</label>
              <select
                value={formData.golongan_darah}
                onChange={(e) => setFormData({...formData, golongan_darah: e.target.value})}
                className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-white font-semibold"
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
                <option value="O">O</option>
                <option value="Tidak Tahu">Tidak Tahu</option>
              </select>
            </div>

            {/* Hubungan Keluarga */}
            <div className="space-y-1">
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Hubungan Keluarga</label>
              <select
                value={formData.hubungan_keluarga}
                onChange={(e) => setFormData({...formData, hubungan_keluarga: e.target.value})}
                className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-white font-semibold"
              >
                <option value="Kepala Keluarga">Kepala Keluarga</option>
                <option value="Istri">Istri</option>
                <option value="Anak">Anak</option>
              </select>
            </div>

            {/* Status Perkawinan */}
            <div className="space-y-1">
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Status Perkawinan</label>
              <select
                value={formData.status_perkawinan}
                onChange={(e) => setFormData({...formData, status_perkawinan: e.target.value})}
                className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-white"
              >
                <option value="Belum Kawin">Belum Kawin</option>
                <option value="Kawin">Kawin</option>
                <option value="Cerai Hidup">Cerai Hidup</option>
                <option value="Cerai Mati">Cerai Mati</option>
              </select>
            </div>

            {/* Pekerjaan */}
            <div className="space-y-1">
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Pekerjaan</label>
              <input
                type="text"
                placeholder="Pekerjaan jemaat"
                value={formData.pekerjaan}
                onChange={(e) => setFormData({...formData, pekerjaan: e.target.value})}
                className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-stone-50/50 focus:bg-white"
              />
            </div>

            {/* Kewarganegaraan */}
            <div className="space-y-1">
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Kewarganegaraan</label>
              <select
                value={formData.kewarganegaraan}
                onChange={(e) => setFormData({...formData, kewarganegaraan: e.target.value})}
                className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-white"
              >
                <option value="WNI">WNI (Warga Negara Indonesia)</option>
                <option value="WNA">WNA (Warga Negara Asing)</option>
              </select>
            </div>

            {/* Agama */}
            <div className="space-y-1">
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Agama</label>
              <select
                value={formData.agama}
                onChange={(e) => setFormData({...formData, agama: e.target.value})}
                className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-white"
              >
                <option value="Kristen">Kristen</option>
                <option value="Katolik">Katolik</option>
                <option value="Islam">Islam</option>
                <option value="Hindu">Hindu</option>
                <option value="Buddha">Buddha</option>
                <option value="Khonghucu">Khonghucu</option>
              </select>
            </div>

            {/* Peran Jemaat */}
            <div className="space-y-1">
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Peran Pelayanan</label>
              <select
                value={formData.peran}
                onChange={(e) => setFormData({...formData, peran: e.target.value})}
                className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-white"
              >
                <option value="Jemaat">Jemaat</option>
                <option value="Penatua">Penatua</option>
                <option value="Diaken">Diaken</option>
              </select>
            </div>

            {/* Kelompok Sel */}
            <div className="space-y-1">
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Kelompok Sel</label>
              <select
                value={formData.kelompok_sel}
                onChange={(e) => setFormData({...formData, kelompok_sel: e.target.value})}
                className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-white"
              >
                <option value="Sion">Sion</option>
                <option value="Hermon">Hermon</option>
                <option value="Getsemani">Getsemani</option>
                <option value="Bethlehem">Bethlehem</option>
                <option value="Sekolah Minggu">Sekolah Minggu</option>
              </select>
            </div>

            {/* Kontak */}
            <div className="space-y-1">
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Nomor HP / Kontak</label>
              <input
                type="tel"
                placeholder="Contoh: 0812-xxxx-xxxx"
                value={formData.kontak}
                onChange={(e) => setFormData({...formData, kontak: e.target.value})}
                className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-stone-50/50 focus:bg-white"
              />
            </div>

            {/* Status */}
            <div className="space-y-1">
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Status Keanggotaan</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-white"
              >
                <option value="Aktif">Aktif</option>
                <option value="Tidak Aktif">Tidak Aktif</option>
              </select>
            </div>

            {/* Alamat Lengkap */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Alamat Lengkap (RT/RW, Kelurahan, Kecamatan, Kota/Daerah) *</label>
              <textarea
                required
                rows="2.5"
                placeholder="Alamat lengkap tempat tinggal saat ini"
                value={formData.alamat_lengkap}
                onChange={(e) => setFormData({...formData, alamat_lengkap: e.target.value})}
                className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-stone-50/50 focus:bg-white resize-none"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={handleCloseFormModal}
              className="px-4 py-2 border border-stone-250 hover:bg-stone-50 rounded-lg text-xs font-semibold text-stone-600 transition-colors focus:outline-none"
            >
              Batal
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg text-xs font-bold text-white shadow-xs ${accentClasses.bgPrimary} transition-colors focus:outline-none`}
            >
              {isEditMode ? "Simpan Perubahan" : "Daftarkan Jemaat"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
