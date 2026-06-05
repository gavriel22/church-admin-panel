import { useState } from 'react';
import { Search, Plus, Filter, User, Phone, CheckCircle, XCircle, Share2 } from 'lucide-react';
import Modal from './Modal';

export default function JemaatTab({ jemaat, onAddJemaat, accentClasses, externalOpenAddModal, setExternalOpenAddModal }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [ageFilter, setAgeFilter] = useState('Semua');
  const [selectedFamilyKk, setSelectedFamilyKk] = useState(null);
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State for Adding Jemaat
  const [formData, setFormData] = useState({
    no_kk: '',
    nik: '',
    nama: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    jenis_kelamin: 'Laki-laki',
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
  });

  // Calculate age from birthdate
  const getAge = (birthDateString) => {
    if (!birthDateString) return 0;
    const birthYear = new Date(birthDateString).getFullYear();
    const currentYear = 2026; // System year based on local time
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

  // Filter & Search Logic
  const filteredJemaat = jemaat.filter(member => {
    const matchesSearch = 
      member.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.nik.includes(searchTerm) ||
      member.no_kk.includes(searchTerm) ||
      (member.kelompok_sel && member.kelompok_sel.toLowerCase().includes(searchTerm.toLowerCase()));

    if (ageFilter === 'Semua') return matchesSearch;
    return matchesSearch && getAgeCategory(member.tanggal_lahir) === ageFilter;
  });

  // Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.nik || !formData.no_kk || !formData.tanggal_lahir) {
      alert('Mohon isi kolom wajib: Nama, NIK, No KK, dan Tanggal Lahir.');
      return;
    }

    const newJemaat = {
      id: Date.now(),
      no_kk: formData.no_kk,
      nik: formData.nik,
      nama: formData.nama,
      tempat_tanggal_lahir: `${formData.tempat_lahir}, ${new Date(formData.tanggal_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`,
      tanggal_lahir: formData.tanggal_lahir,
      jenis_kelamin: formData.jenis_kelamin,
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

    onAddJemaat(newJemaat);
    
    // Reset form
    setFormData({
      no_kk: '',
      nik: '',
      nama: '',
      tempat_lahir: '',
      tanggal_lahir: '',
      jenis_kelamin: 'Laki-laki',
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
    });
    
    setIsAddModalOpen(false);
    if (setExternalOpenAddModal) setExternalOpenAddModal(false);
  };

  // Handle external modal trigger from Quick Action dashboard
  if (externalOpenAddModal && !isAddModalOpen) {
    setIsAddModalOpen(true);
  }

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    if (setExternalOpenAddModal) setExternalOpenAddModal(false);
  };

  // Open Family Tree Modal
  const handleRowClick = (member) => {
    setSelectedFamilyKk(member.no_kk);
    setIsFamilyModalOpen(true);
  };

  // Get family members
  const familyMembers = jemaat.filter(member => member.no_kk === selectedFamilyKk);
  
  // Sort family members so Head of Family comes first, then Wife, then Children
  const sortedFamilyMembers = [...familyMembers].sort((a, b) => {
    const order = { 'Kepala Keluarga': 1, 'Istri': 2, 'Anak': 3 };
    return (order[a.hubungan_keluarga] || 4) - (order[b.hubungan_keluarga] || 4);
  });

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs text-stone-400 font-medium">Manajemen Basis Data</p>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight">Daftar Keanggotaan Jemaat</h2>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold shadow-xs ${accentClasses.bgPrimary} accent-transition focus:outline-none`}
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Jemaat
        </button>
      </div>

      {/* Search and filter controls */}
      <div className="bg-white border border-stone-200/60 p-4 rounded-xl flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama, kelompok sel, NIK, atau no KK..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-lg text-sm bg-stone-50/50 focus:bg-white focus:border-stone-400 focus:outline-none placeholder-stone-400 text-stone-800"
          />
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-2.5 min-w-[220px]">
          <Filter className="w-4 h-4 text-stone-500" />
          <span className="text-xs font-medium text-stone-500">Rentang Usia:</span>
          <select
            value={ageFilter}
            onChange={(e) => setAgeFilter(e.target.value)}
            className="flex-1 py-1.5 px-3 border border-stone-200 rounded-lg text-xs bg-white text-stone-700 font-medium focus:outline-none focus:border-stone-400"
          >
            <option value="Semua">Semua Usia</option>
            <option value="Anak-anak">Anak-anak (&lt;12 thn)</option>
            <option value="Pemuda">Pemuda (12-25 thn)</option>
            <option value="Dewasa">Dewasa (26-59 thn)</option>
            <option value="Lansia">Lansia (&ge;60 thn)</option>
          </select>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-stone-200/60 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-stone-50/75 border-b border-stone-200 text-stone-500 text-[11px] font-bold uppercase tracking-wider">
                <th className="px-6 py-3.5">Nama Lengkap</th>
                <th className="px-6 py-3.5">Peran Pelayanan</th>
                <th className="px-6 py-3.5">Kelompok Sel</th>
                <th className="px-6 py-3.5">Kontak</th>
                <th className="px-6 py-3.5">Usia / Kategori</th>
                <th className="px-6 py-3.5">Status</th>
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
                      className="hover:bg-stone-50/80 cursor-pointer transition-colors"
                      title="Klik untuk melihat hubungan keluarga"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-stone-900">{member.nama}</div>
                          <div className="text-[10px] text-stone-400 font-medium mt-0.5">NIK: {member.nik}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-stone-600 font-medium">{member.peran}</td>
                      <td className="px-6 py-4">
                        <span className="bg-stone-100 text-stone-850 px-2 py-0.5 rounded-md text-[10px] font-semibold border border-stone-200/40">
                          {member.kelompok_sel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-stone-600">
                        {member.kontak !== '-' ? (
                          <span className="flex items-center"><Phone className="w-3.5 h-3.5 text-stone-400 mr-1" /> {member.kontak}</span>
                        ) : (
                          <span className="text-stone-300">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <span className="font-semibold text-stone-700">{age} tahun</span>
                          <span className="block text-[10px] text-stone-400 font-medium mt-0.5">{category}</span>
                        </div>
                      </td>
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
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-stone-400 text-xs">
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
            * Klik baris jemaat untuk membuka silsilah keluarga (KK)
          </span>
        </div>
      </div>

      {/* FAMILY TREE MODAL */}
      <Modal 
        isOpen={isFamilyModalOpen} 
        onClose={() => setIsFamilyModalOpen(false)} 
        title={`Pohon Hubungan Keluarga (No. KK: ${selectedFamilyKk})`}
      >
        <div className="space-y-6">
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
            <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Lokasi Rumah Jemaat</h4>
            <p className="text-xs text-stone-700 mt-1 font-medium">
              {sortedFamilyMembers[0]?.alamat_lengkap || '-'}
            </p>
          </div>

          <div className="relative">
            {/* Visual tree connection line */}
            <div className="absolute left-6 top-3 bottom-3 w-0.5 bg-stone-200 -z-1" />
            
            <div className="space-y-4">
              {sortedFamilyMembers.map((member, index) => {
                const age = getAge(member.tanggal_lahir);
                return (
                  <div key={member.id} className="relative flex items-center gap-4 bg-white p-3 rounded-lg border border-stone-200 shadow-xs ml-0">
                    {/* Node marker icon */}
                    <div className={`
                      w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold z-10 bg-white
                      ${member.hubungan_keluarga === 'Kepala Keluarga' 
                        ? 'border-amber-500 text-amber-700 bg-amber-50' 
                        : member.hubungan_keluarga === 'Istri' 
                          ? 'border-pink-400 text-pink-700 bg-pink-50'
                          : 'border-blue-450 text-blue-800 bg-blue-50/50'
                      }
                    `}>
                      <User className="w-5 h-5" />
                    </div>
                    
                    {/* Member Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-stone-900 truncate">{member.nama}</span>
                        <span className={`
                          text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border
                          ${member.hubungan_keluarga === 'Kepala Keluarga' 
                            ? 'bg-amber-100 text-amber-800 border-amber-250' 
                            : member.hubungan_keluarga === 'Istri' 
                              ? 'bg-pink-100 text-pink-850 border-pink-200' 
                              : 'bg-blue-100 text-blue-850 border-blue-200'
                          }
                        `}>
                          {member.hubungan_keluarga}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-y-1 mt-1.5 text-[10.5px] text-stone-500 font-medium">
                        <p><span className="text-stone-400">NIK:</span> {member.nik}</p>
                        <p><span className="text-stone-400">JK:</span> {member.jenis_kelamin}</p>
                        <p><span className="text-stone-400">Umur:</span> {age} Thn</p>
                        <p><span className="text-stone-400">Pekerjaan:</span> {member.pekerjaan}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setIsFamilyModalOpen(false)}
              className="px-4 py-2 border border-stone-250 hover:bg-stone-50 rounded-lg text-xs font-semibold text-stone-600 transition-colors focus:outline-none"
            >
              Tutup
            </button>
          </div>
        </div>
      </Modal>

      {/* ADD JEMAAT MODAL */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={handleCloseAddModal} 
        title="Form Pendaftaran Jemaat Baru"
      >
        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-stone-700">
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

            {/* Hubungan Keluarga */}
            <div className="space-y-1">
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Hubungan Keluarga</label>
              <select
                value={formData.hubungan_keluarga}
                onChange={(e) => setFormData({...formData, hubungan_keluarga: e.target.value})}
                className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-white"
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
              <input
                type="text"
                disabled
                value={formData.agama}
                className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs bg-stone-100 text-stone-400 focus:outline-none cursor-not-allowed font-semibold"
              />
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
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Nomor HP/Kontak</label>
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
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Alamat Lengkap (RT/RW, Kelurahan, Kecamatan) *</label>
              <textarea
                required
                rows="2"
                placeholder="Alamat lengkap tempat tinggal saat ini"
                value={formData.alamat_lengkap}
                onChange={(e) => setFormData({...formData, alamat_lengkap: e.target.value})}
                className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-stone-50/50 focus:bg-white resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={handleCloseAddModal}
              className="px-4 py-2 border border-stone-250 hover:bg-stone-50 rounded-lg text-xs font-semibold text-stone-600 transition-colors focus:outline-none"
            >
              Batal
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg text-xs font-bold text-white shadow-xs ${accentClasses.bgPrimary} transition-colors focus:outline-none`}
            >
              Simpan Data
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
