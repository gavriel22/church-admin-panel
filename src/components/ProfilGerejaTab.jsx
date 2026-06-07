import { useState } from 'react';
import { Save, Plus, Trash2, Calendar, FileText, MapPin, UserCheck, Check } from 'lucide-react';

export default function ProfilGerejaTab({ profil, onSaveProfil, accentClasses }) {
  const [localProfil, setLocalProfil] = useState({ ...profil });
  const [newMisiItem, setNewMisiItem] = useState('');
  const [showToast, setShowToast] = useState(false);

  const [prevProfil, setPrevProfil] = useState(profil);
  if (profil !== prevProfil) {
    setPrevProfil(profil);
    setLocalProfil({ ...profil });
  }

  // Dynamic calculations
  const currentYear = 2026; // System year based on local time
  const churchAge = localProfil.tahunBerdiri 
    ? Math.max(0, currentYear - Number(localProfil.tahunBerdiri))
    : 0;

  // Add Mission Item
  const handleAddMisi = () => {
    if (!newMisiItem.trim()) return;
    setLocalProfil({
      ...localProfil,
      misi: [...localProfil.misi, newMisiItem.trim()]
    });
    setNewMisiItem('');
  };

  // Remove Mission Item
  const handleRemoveMisi = (indexToRemove) => {
    setLocalProfil({
      ...localProfil,
      misi: localProfil.misi.filter((_, idx) => idx !== indexToRemove)
    });
  };

  // Input change handler
  const handleChange = (field, value) => {
    setLocalProfil({
      ...localProfil,
      [field]: value
    });
  };

  // Submit profile save
  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveProfil(localProfil);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center bg-stone-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-lg border border-stone-800 animate-in fade-in slide-in-from-top-4 duration-200">
          <Check className="w-4 h-4 text-green-400 mr-2" />
          Perubahan profil berhasil disimpan!
        </div>
      )}

      {/* Header & Submit Button */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs text-stone-400 font-medium">Informasi Profil Instansi</p>
            <h2 className="text-lg font-bold text-stone-900 tracking-tight">Identitas Gereja Kasih Karunia</h2>
          </div>
          <button
            type="submit"
            className={`flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-semibold shadow-xs ${accentClasses.bgPrimary} accent-transition focus:outline-none`}
          >
            <Save className="w-4 h-4 mr-2" />
            Simpan Perubahan
          </button>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Columns - Inputs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card 1: Informasi Utama */}
            <div className="bg-white border border-stone-200/60 p-5 rounded-xl shadow-xs space-y-4">
              <div className="flex items-center space-x-2 border-b border-stone-100 pb-2">
                <FileText className="w-4.5 h-4.5 text-stone-400" />
                <h3 className="text-sm font-semibold text-stone-800">Informasi Utama</h3>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Nama Gereja</label>
                  <input
                    type="text"
                    required
                    value={localProfil.namaGereja}
                    onChange={(e) => handleChange('namaGereja', e.target.value)}
                    className="w-full px-3.5 py-2 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-400 bg-stone-50/30 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Tagline / Motto</label>
                  <input
                    type="text"
                    value={localProfil.tagline}
                    onChange={(e) => handleChange('tagline', e.target.value)}
                    className="w-full px-3.5 py-2 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-400 bg-stone-50/30 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Deskripsi Singkat</label>
                  <textarea
                    rows="3"
                    value={localProfil.deskripsi}
                    onChange={(e) => handleChange('deskripsi', e.target.value)}
                    className="w-full px-3.5 py-2 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-400 bg-stone-50/30 focus:bg-white resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Kontak & Alamat */}
            <div className="bg-white border border-stone-200/60 p-5 rounded-xl shadow-xs space-y-4">
              <div className="flex items-center space-x-2 border-b border-stone-100 pb-2">
                <MapPin className="w-4.5 h-4.5 text-stone-400" />
                <h3 className="text-sm font-semibold text-stone-800">Kontak & Lokasi</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Nomor Telepon</label>
                  <input
                    type="text"
                    value={localProfil.telepon}
                    onChange={(e) => handleChange('telepon', e.target.value)}
                    className="w-full px-3.5 py-2 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-400 bg-stone-50/30 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Email Resmi</label>
                  <input
                    type="email"
                    value={localProfil.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-3.5 py-2 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-400 bg-stone-50/30 focus:bg-white"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Alamat Lengkap</label>
                  <textarea
                    rows="2"
                    value={localProfil.alamat}
                    onChange={(e) => handleChange('alamat', e.target.value)}
                    className="w-full px-3.5 py-2 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-400 bg-stone-50/30 focus:bg-white resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Card 3: Visi & Misi */}
            <div className="bg-white border border-stone-200/60 p-5 rounded-xl shadow-xs space-y-4">
              <div className="flex items-center space-x-2 border-b border-stone-100 pb-2">
                <FileText className="w-4.5 h-4.5 text-stone-400" />
                <h3 className="text-sm font-semibold text-stone-800">Visi & Misi Gereja</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Pernyataan Visi</label>
                  <textarea
                    rows="2"
                    value={localProfil.visi}
                    onChange={(e) => handleChange('visi', e.target.value)}
                    className="w-full px-3.5 py-2 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-400 bg-stone-50/30 focus:bg-white resize-none"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Poin-Poin Misi (Ordered List)</label>
                  
                  {/* List items */}
                  <ol className="space-y-2.5">
                    {localProfil.misi.map((misiItem, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 bg-stone-50/60 p-2 border border-stone-150 rounded-lg text-xs">
                        <span className="font-bold text-stone-400 mt-0.5">{idx + 1}.</span>
                        <span className="flex-1 text-stone-700 leading-relaxed">{misiItem}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMisi(idx)}
                          className="text-stone-400 hover:text-red-650 p-0.5 transition-colors focus:outline-none"
                          title="Hapus misi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ol>

                  {/* Add item form */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Tulis poin misi baru..."
                      value={newMisiItem}
                      onChange={(e) => setNewMisiItem(e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-stone-50/50 focus:bg-white"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddMisi();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddMisi}
                      className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold ${accentClasses.light} border border-transparent hover:brightness-95 transition-all`}
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Tambah
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Read-only widget & Pastor Message */}
          <div className="space-y-6">
            {/* Widget Ringkasan (Read-Only) */}
            <div className="bg-white border border-stone-200/60 p-5 rounded-xl shadow-xs space-y-4">
              <div className="flex items-center space-x-2 border-b border-stone-100 pb-2">
                <Calendar className="w-4.5 h-4.5 text-stone-400" />
                <h3 className="text-sm font-semibold text-stone-850">Statistik Usia Gereja</h3>
              </div>

              <div className="p-4 bg-stone-50 border border-stone-200/50 rounded-lg text-center space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Usia Berdirinya Gereja</span>
                <p className="text-4xl font-extrabold text-stone-850 tracking-tight">{churchAge} <span className="text-sm font-normal text-stone-400">Tahun</span></p>
                <span className="text-[10px] text-stone-400 block mt-1">Dihitung otomatis dari tahun berdiri {localProfil.tahunBerdiri}</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Tahun Berdiri (Edit untuk mengubah usia)</label>
                <input
                  type="number"
                  min="1900"
                  max="2026"
                  required
                  value={localProfil.tahunBerdiri}
                  onChange={(e) => handleChange('tahunBerdiri', Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-400 bg-stone-50/30 focus:bg-white font-medium"
                />
              </div>
            </div>

            {/* Pastor Message & Sejarah */}
            <div className="bg-white border border-stone-200/60 p-5 rounded-xl shadow-xs space-y-4">
              <div className="flex items-center space-x-2 border-b border-stone-100 pb-2">
                <UserCheck className="w-4.5 h-4.5 text-stone-400" />
                <h3 className="text-sm font-semibold text-stone-850">Kepemimpinan & Sejarah</h3>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Nama Gembala Sidang</label>
                  <input
                    type="text"
                    value={localProfil.namaGembala}
                    onChange={(e) => handleChange('namaGembala', e.target.value)}
                    className="w-full px-3.5 py-2 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-stone-50/30 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Foto Gembala Sidang (URL)</label>
                  <input
                    type="text"
                    placeholder="Contoh: https://images.unsplash.com/..."
                    value={localProfil.fotoGembala || ''}
                    onChange={(e) => handleChange('fotoGembala', e.target.value)}
                    className="w-full px-3.5 py-2 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-stone-50/30 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Pesan Gembala Sidang</label>
                  <textarea
                    rows="4"
                    value={localProfil.pesanGembala}
                    onChange={(e) => handleChange('pesanGembala', e.target.value)}
                    className="w-full px-3.5 py-2 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-400 bg-stone-50/30 focus:bg-white resize-none leading-relaxed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Sejarah Singkat Gereja</label>
                  <textarea
                    rows="4"
                    value={localProfil.sejarah}
                    onChange={(e) => handleChange('sejarah', e.target.value)}
                    className="w-full px-3.5 py-2 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-400 bg-stone-50/30 focus:bg-white resize-none leading-relaxed"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
