import { useState, useContext } from 'react';
import { Palette, Database, RefreshCw, Check, AlertTriangle, Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { ChurchContext } from '../context/ChurchContext';

export default function PengaturanTab({ 
  accentColor, 
  setAccentColor, 
  onResetDatabase 
}) {
  const { 
    kategoriUsia, 
    addKategoriUsia, 
    updateKategoriUsia, 
    deleteKategoriUsia 
  } = useContext(ChurchContext);

  // CRUD state for Age Category
  const [katUsiaForm, setKatUsiaForm] = useState({
    nama_kategori: '',
    usia_min: '',
    usia_max: ''
  });
  const [isEditingKatUsia, setIsEditingKatUsia] = useState(false);
  const [editingKatUsiaId, setEditingKatUsiaId] = useState(null);

  const handleKatUsiaSubmit = (e) => {
    e.preventDefault();
    if (!katUsiaForm.nama_kategori || katUsiaForm.usia_min === '' || katUsiaForm.usia_max === '') {
      alert('Mohon lengkapi semua input kategori usia.');
      return;
    }

    const min = Number(katUsiaForm.usia_min);
    const max = Number(katUsiaForm.usia_max);

    if (min < 0 || max < 0) {
      alert('Usia tidak boleh bernilai negatif.');
      return;
    }
    if (min > max) {
      alert('Usia minimum tidak boleh lebih besar dari usia maksimum.');
      return;
    }

    const data = {
      id: isEditingKatUsia ? editingKatUsiaId : Date.now(),
      nama_kategori: katUsiaForm.nama_kategori,
      usia_min: min,
      usia_max: max
    };

    if (isEditingKatUsia) {
      updateKategoriUsia(data);
      setIsEditingKatUsia(false);
      setEditingKatUsiaId(null);
    } else {
      addKategoriUsia(data);
    }

    setKatUsiaForm({ nama_kategori: '', usia_min: '', usia_max: '' });
  };

  const handleStartEditKatUsia = (item) => {
    setIsEditingKatUsia(true);
    setEditingKatUsiaId(item.id);
    setKatUsiaForm({
      nama_kategori: item.nama_kategori,
      usia_min: item.usia_min,
      usia_max: item.usia_max
    });
  };

  const handleCancelEditKatUsia = () => {
    setIsEditingKatUsia(false);
    setEditingKatUsiaId(null);
    setKatUsiaForm({ nama_kategori: '', usia_min: '', usia_max: '' });
  };

  const handleDeleteKatUsia = (id, nama) => {
    const confirmed = window.confirm(`Apakah Anda yakin ingin menghapus kategori usia "${nama}"?`);
    if (confirmed) {
      deleteKategoriUsia(id);
      if (isEditingKatUsia && editingKatUsiaId === id) {
        handleCancelEditKatUsia();
      }
    }
  };

  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const colors = [
    { id: 'amber', name: 'Warm Amber', bg: 'bg-amber-600', text: 'text-amber-700', description: 'Warna bumi yang hangat dan bersahaja.' },
    { id: 'emerald', name: 'Emerald Green', bg: 'bg-emerald-600', text: 'text-emerald-700', description: 'Representasi pertumbuhan iman dan kesegaran.' },
    { id: 'indigo', name: 'Royal Indigo', bg: 'bg-indigo-600', text: 'text-indigo-700', description: 'Tampilan tenang, berwibawa, dan kontemporer.' },
    { id: 'slate', name: 'Classic Slate', bg: 'bg-slate-700', text: 'text-slate-700', description: 'Minimalisme administratif modern klasik.' }
  ];

  const handleReset = () => {
    onResetDatabase();
    setShowConfirmReset(false);
    setResetSuccess(true);
    setTimeout(() => {
      setResetSuccess(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Accent Color Chooser Card */}
        <div className="bg-white border border-stone-200/60 p-5 rounded-xl shadow-xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-stone-100 pb-2.5">
            <Palette className="w-4.5 h-4.5 text-stone-400" />
            <h3 className="text-sm font-semibold text-stone-850">Kustomisasi Tema Aksen</h3>
          </div>
          
          <p className="text-[11px] text-stone-500 leading-relaxed">
            Pilih warna aksen utama yang akan diterapkan pada tombol, tautan navigasi, ikon, dan penanda status di seluruh panel admin.
          </p>

          <div className="space-y-3 pt-2">
            {colors.map((color) => {
              const isSelected = accentColor === color.id;
              return (
                <button
                  key={color.id}
                  onClick={() => setAccentColor(color.id)}
                  className={`
                    w-full flex items-center justify-between p-3 border rounded-lg text-left transition-all focus:outline-none
                    ${isSelected 
                      ? 'border-stone-400 bg-stone-50/50 shadow-xs' 
                      : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/20'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`w-4 h-4 rounded-full ${color.bg} border border-white shadow-xs`} />
                    <div>
                      <p className="text-xs font-bold text-stone-800">{color.name}</p>
                      <p className="text-[10px] text-stone-400 mt-0.5">{color.description}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className={`p-1 rounded-full ${color.bg} text-white`}>
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Database Utility Card */}
        <div className="bg-white border border-stone-200/60 p-5 rounded-xl shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-stone-100 pb-2.5">
              <Database className="w-4.5 h-4.5 text-stone-400" />
              <h3 className="text-sm font-semibold text-stone-850">Utilitas & Basis Data</h3>
            </div>

            <p className="text-[11px] text-stone-500 leading-relaxed">
              Utilitas administrasi ini digunakan untuk memelihara data mock simulasi. Mereset database akan menghapus seluruh data tambahan yang telah Anda buat (jemaat baru, pengumuman baru, jadwal baru, dsb.) dan mengembalikannya ke data bawaan program.
            </p>

            {/* Notification messages */}
            {resetSuccess && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-xs font-medium flex items-center animate-in fade-in duration-200">
                <Check className="w-4 h-4 mr-2" />
                Basis data berhasil direset ke kondisi default!
              </div>
            )}

            {showConfirmReset && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg space-y-3 animate-in slide-in-from-bottom-2 duration-150">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-red-650 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-red-800">Apakah Anda Yakin?</h4>
                    <p className="text-[10.5px] text-red-700 mt-0.5 leading-relaxed font-medium">
                      Tindakan ini permanen. Semua data jemaat, pelayanan, pengumuman, dan laporan keuangan yang baru dicatat akan dihapus sepenuhnya.
                    </p>
                  </div>
                </div>
                <div className="flex justify-end gap-2 text-[10.5px] font-bold">
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="px-2.5 py-1 border border-stone-250 hover:bg-white bg-stone-50/50 rounded text-stone-600 focus:outline-none"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded focus:outline-none"
                  >
                    Ya, Reset Data
                  </button>
                </div>
              </div>
            )}
          </div>

          {!showConfirmReset && (
            <div className="pt-4 border-t border-stone-100">
              <button
                onClick={() => setShowConfirmReset(true)}
                className={`w-full flex items-center justify-center py-2.5 px-4 rounded-lg text-xs font-semibold border border-red-200 text-red-700 bg-red-50/50 hover:bg-red-50 hover:border-red-300 transition-all focus:outline-none`}
              >
                <RefreshCw className="w-3.5 h-3.5 mr-2" />
                Reset Data Simulasi Ke Bawaan
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Age Category Settings Card */}
      <div className="bg-white border border-stone-200/60 p-5 rounded-xl shadow-xs space-y-5">
        <div className="flex items-center space-x-2 border-b border-stone-100 pb-2.5">
          <Calendar className="w-4.5 h-4.5 text-stone-400" />
          <h3 className="text-sm font-semibold text-stone-850">Pengaturan Kategori Usia Jemaat</h3>
        </div>

        <p className="text-[11px] text-stone-500 leading-relaxed">
          Kelola batas rentang usia secara dinamis untuk mengelompokkan jemaat (misal: Anak-anak, Pemuda, Dewasa, Lansia). Perubahan di sini akan langsung memperbarui filter pencarian dan klasifikasi kolom Kategori Usia pada modul Data Jemaat.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Form */}
          <div className="border border-stone-100 p-4 rounded-xl bg-stone-50/20 space-y-4 h-fit">
            <h4 className="text-[11px] font-bold text-stone-850 uppercase tracking-wider">
              {isEditingKatUsia ? 'Edit Kategori Usia' : 'Tambah Kategori Usia'}
            </h4>
            <form onSubmit={handleKatUsiaSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Nama Kategori *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Balita, Remaja"
                  value={katUsiaForm.nama_kategori}
                  onChange={(e) => setKatUsiaForm({ ...katUsiaForm, nama_kategori: e.target.value })}
                  className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Usia Min (Thn) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="150"
                    placeholder="0"
                    value={katUsiaForm.usia_min}
                    onChange={(e) => setKatUsiaForm({ ...katUsiaForm, usia_min: e.target.value })}
                    className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Usia Max (Thn) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="150"
                    placeholder="12"
                    value={katUsiaForm.usia_max}
                    onChange={(e) => setKatUsiaForm({ ...katUsiaForm, usia_max: e.target.value })}
                    className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-white"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                {isEditingKatUsia && (
                  <button
                    type="button"
                    onClick={handleCancelEditKatUsia}
                    className="flex-1 py-1.5 border border-stone-250 hover:bg-stone-50 rounded-lg text-xs font-semibold text-stone-650 transition-colors focus:outline-none"
                  >
                    Batal
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-xs font-bold transition-colors focus:outline-none"
                >
                  {isEditingKatUsia ? 'Simpan' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>

          {/* Right Columns: Table */}
          <div className="md:col-span-2 border border-stone-100 rounded-xl overflow-hidden bg-white">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50/70 text-stone-550 border-b border-stone-150 uppercase tracking-wider text-[9px] font-bold">
                  <th className="py-2.5 px-4">Nama Kategori</th>
                  <th className="py-2.5 px-4">Rentang Usia</th>
                  <th className="py-2.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {kategoriUsia && kategoriUsia.length > 0 ? (
                  kategoriUsia.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50/35 transition-colors">
                      <td className="py-2.5 px-4 font-bold text-stone-800">{item.nama_kategori}</td>
                      <td className="py-2.5 px-4 text-stone-500">{item.usia_min} - {item.usia_max} tahun</td>
                      <td className="py-2.5 px-4 text-right">
                        <div className="inline-flex items-center space-x-1">
                          <button
                            onClick={() => handleStartEditKatUsia(item)}
                            className="p-1 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors focus:outline-none"
                            title="Edit Kategori"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteKatUsia(item.id, item.nama_kategori)}
                            className="p-1 rounded text-stone-400 hover:text-red-650 hover:bg-red-50 transition-colors focus:outline-none"
                            title="Hapus Kategori"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-8 text-center text-stone-400 text-xs italic">
                      Belum ada kategori usia yang dikonfigurasi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
