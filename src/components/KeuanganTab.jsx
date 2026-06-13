import { useState, useContext, useMemo } from 'react';
import { Wallet, TrendingUp, TrendingDown, Plus, Calendar as CalendarIcon, Edit, Trash2 } from 'lucide-react';
import { ChurchContext } from '../context/ChurchContext';
import Modal from './Modal';

const BadgeColors = [
  { name: 'Merah', class: 'bg-red-100 text-red-800 border-red-200/60' },
  { name: 'Kuning', class: 'bg-amber-100 text-amber-800 border-amber-200/60' },
  { name: 'Hijau', class: 'bg-green-100 text-green-800 border-green-200/60' },
  { name: 'Biru', class: 'bg-blue-100 text-blue-800 border-blue-200/60' },
  { name: 'Ungu', class: 'bg-purple-100 text-purple-800 border-purple-200/60' },
  { name: 'Pink', class: 'bg-pink-100 text-pink-800 border-pink-200/60' },
  { name: 'Teal', class: 'bg-teal-100 text-teal-800 border-teal-200/60' },
  { name: 'Indigo', class: 'bg-indigo-100 text-indigo-800 border-indigo-200/60' },
  { name: 'Abu-abu', class: 'bg-stone-100 text-stone-850 border-stone-200/60' },
];

export default function KeuanganTab({ accentClasses, externalOpenAddModal, setExternalOpenAddModal }) {
  const { 
    keuangan, 
    addTransaksi, 
    updateTransaksi, 
    deleteTransaksi,
    kategoriKantong,
    addKategoriKantong,
    updateKategoriKantong,
    deleteKategoriKantong,
    kategoriTransaksi,
    addKategoriTransaksi,
    updateKategoriTransaksi,
    deleteKategoriTransaksi
  } = useContext(ChurchContext);

  const [activeSubTab, setActiveSubTab] = useState('catatan'); // 'catatan', 'kategori-kantong', or 'kategori-transaksi'
  const [selectedFilterBag, setSelectedFilterBag] = useState('all');

  // Compute pocket details dynamically (using normalized string keys)
  const bagDetails = useMemo(() => {
    const details = {};
    if (kategoriKantong) {
      kategoriKantong.forEach(kat => {
        details[String(kat.id)] = { pemasukan: 0, pengeluaran: 0, saldo: 0 };
      });
    }
    if (keuangan && keuangan.transaksi) {
      keuangan.transaksi.forEach(t => {
        if (t.alokasi_kantong_id) {
          const key = String(t.alokasi_kantong_id);
          if (!details[key]) {
            details[key] = { pemasukan: 0, pengeluaran: 0, saldo: 0 };
          }
          const nominal = Number(t.nominal);
          const isPemasukan = t.tipe_transaksi === 'Pemasukan';
          if (isPemasukan) {
            details[key].pemasukan += nominal;
          } else {
            details[key].pengeluaran += nominal;
          }
        }
      });
    }
    // Calculate saldo for each
    Object.keys(details).forEach(key => {
      details[key].saldo = details[key].pemasukan - details[key].pengeluaran;
    });
    return details;
  }, [keuangan.transaksi, kategoriKantong]);

  // Filter and sort transactions (default date-descending)
  const filteredAndSortedTransactions = useMemo(() => {
    if (!keuangan || !keuangan.transaksi) return [];
    let list = [...keuangan.transaksi];

    // Filter by selected kantong category (both Pemasukan & Pengeluaran are associated with bags)
    if (selectedFilterBag && selectedFilterBag !== 'all') {
      list = list.filter(t => String(t.alokasi_kantong_id) === String(selectedFilterBag));
    }

    // Sort by date descending (newest first), and by ID descending if dates are equal
    list.sort((a, b) => {
      const dateB = new Date(b.tanggal);
      const dateA = new Date(a.tanggal);
      if (dateB - dateA !== 0) {
        return dateB - dateA;
      }
      return b.id - a.id;
    });

    return list;
  }, [keuangan.transaksi, selectedFilterBag]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const getInitialFormState = () => {
    const defaultTipe = 'Pemasukan';
    const filteredCats = (kategoriTransaksi || []).filter(cat => cat.tipe === defaultTipe);
    const defaultKat = filteredCats.length > 0 ? filteredCats[0].nama_kategori : '';
    return {
      tipe_transaksi: defaultTipe,
      kategori: defaultKat,
      nominal: '',
      tanggal: '',
      deskripsi: '',
      alokasi_kantong_id: (kategoriKantong && kategoriKantong.length > 0) ? String(kategoriKantong[0].id) : ''
    };
  };

  const [formData, setFormData] = useState(getInitialFormState());

  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setFormData(getInitialFormState());
    setIsModalOpen(true);
  };

  const [prevExternalOpen, setPrevExternalOpen] = useState(externalOpenAddModal);
  if (externalOpenAddModal !== prevExternalOpen) {
    setPrevExternalOpen(externalOpenAddModal);
    if (externalOpenAddModal) {
      setIsEditMode(false);
      setFormData(getInitialFormState());
      setIsModalOpen(true);
    }
  }

  const handleOpenEditModal = (item) => {
    setIsEditMode(true);
    setSelectedId(item.id);
    setFormData({
      tipe_transaksi: item.tipe_transaksi || 'Pemasukan',
      kategori: item.kategori || 'Persembahan Mingguan',
      nominal: item.nominal || '',
      tanggal: item.tanggal || '',
      deskripsi: item.deskripsi || '',
      alokasi_kantong_id: item.alokasi_kantong_id ? String(item.alokasi_kantong_id) : ((kategoriKantong && kategoriKantong.length > 0) ? String(kategoriKantong[0].id) : '')
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (setExternalOpenAddModal) setExternalOpenAddModal(false);
  };

  const handleDelete = (id, category, amount) => {
    const formattedAmount = formatRupiah(amount);
    const confirmed = window.confirm(`Apakah Anda yakin ingin menghapus transaksi "${category}" senilai ${formattedAmount}?`);
    if (confirmed) {
      deleteTransaksi(id);
    }
  };

  // Kategori Kantong CRUD state and handlers
  const initialKatForm = {
    nama_kantong: '',
    deskripsi_alokasi: '',
    warna_badge: 'bg-red-100 text-red-800 border-red-200/60'
  };
  const [katForm, setKatForm] = useState(initialKatForm);
  const [isEditingKat, setIsEditingKat] = useState(false);
  const [editingKatId, setEditingKatId] = useState(null);

  const handleStartKatEdit = (item) => {
    setIsEditingKat(true);
    setEditingKatId(item.id);
    setKatForm({
      nama_kantong: item.nama_kantong || '',
      deskripsi_alokasi: item.deskripsi_alokasi || '',
      warna_badge: item.warna_badge || 'bg-red-100 text-red-800 border-red-200/60'
    });
  };

  const handleCancelKatEdit = () => {
    setIsEditingKat(false);
    setEditingKatId(null);
    setKatForm(initialKatForm);
  };

  const handleKatSubmit = (e) => {
    e.preventDefault();
    if (!katForm.nama_kantong || !katForm.deskripsi_alokasi) {
      alert('Mohon isi nama kantong dan deskripsi alokasi.');
      return;
    }

    const itemData = {
      id: isEditingKat ? editingKatId : Date.now(),
      nama_kantong: katForm.nama_kantong,
      deskripsi_alokasi: katForm.deskripsi_alokasi,
      warna_badge: katForm.warna_badge
    };

    if (isEditingKat) {
      updateKategoriKantong(itemData);
      setIsEditingKat(false);
      setEditingKatId(null);
    } else {
      addKategoriKantong(itemData);
    }
    setKatForm(initialKatForm);
  };

  const handleKatDelete = (id, nama) => {
    const confirmed = window.confirm(`Apakah Anda yakin ingin menghapus kategori kantong "${nama}"?`);
    if (confirmed) {
      deleteKategoriKantong(id);
      if (isEditingKat && editingKatId === id) {
        handleCancelKatEdit();
      }
    }
  };

  // Kategori Transaksi CRUD state and handlers
  const initialKatTransForm = {
    nama_kategori: '',
    tipe: 'Pemasukan'
  };
  const [katTransForm, setKatTransForm] = useState(initialKatTransForm);
  const [isEditingKatTrans, setIsEditingKatTrans] = useState(false);
  const [editingKatTransId, setEditingKatTransId] = useState(null);

  const handleStartKatTransEdit = (item) => {
    setIsEditingKatTrans(true);
    setEditingKatTransId(item.id);
    setKatTransForm({
      nama_kategori: item.nama_kategori || '',
      tipe: item.tipe || 'Pemasukan'
    });
  };

  const handleCancelKatTransEdit = () => {
    setIsEditingKatTrans(false);
    setEditingKatTransId(null);
    setKatTransForm(initialKatTransForm);
  };

  const handleKatTransSubmit = (e) => {
    e.preventDefault();
    if (!katTransForm.nama_kategori) {
      alert('Mohon isi nama kategori.');
      return;
    }

    const itemData = {
      id: isEditingKatTrans ? editingKatTransId : Date.now(),
      nama_kategori: katTransForm.nama_kategori,
      tipe: katTransForm.tipe
    };

    if (isEditingKatTrans) {
      updateKategoriTransaksi(itemData);
      setIsEditingKatTrans(false);
      setEditingKatTransId(null);
    } else {
      addKategoriTransaksi(itemData);
    }
    setKatTransForm(initialKatTransForm);
  };

  const handleKatTransDelete = (id, nama) => {
    const confirmed = window.confirm(`Apakah Anda yakin ingin menghapus kategori transaksi "${nama}"?`);
    if (confirmed) {
      deleteKategoriTransaksi(id);
      if (isEditingKatTrans && editingKatTransId === id) {
        handleCancelKatTransEdit();
      }
    }
  };

  // Calculate totals
  const totalPemasukan = keuangan.transaksi
    .filter(t => t.tipe_transaksi === 'Pemasukan')
    .reduce((acc, curr) => acc + curr.nominal, 0);

  const totalPengeluaran = keuangan.transaksi
    .filter(t => t.tipe_transaksi === 'Pengeluaran')
    .reduce((acc, curr) => acc + curr.nominal, 0);

  const currentBalance = keuangan.saldo;

  // Format currency helper
  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nominal || !formData.tanggal || !formData.deskripsi) {
      alert('Mohon isi nominal, tanggal, dan deskripsi transaksi.');
      return;
    }

    if (!kategoriKantong || kategoriKantong.length === 0) {
      alert('Mohon buat minimal satu Kategori Kantong terlebih dahulu di Tab Pengaturan Kategori Kantong.');
      return;
    }
    if (!formData.alokasi_kantong_id) {
      alert('Mohon pilih alokasi kantong.');
      return;
    }

    const transactionData = {
      id: isEditMode ? selectedId : Date.now(),
      tanggal: formData.tanggal,
      tipe_transaksi: formData.tipe_transaksi,
      kategori: formData.kategori,
      nominal: Number(formData.nominal),
      deskripsi: formData.deskripsi,
      alokasi_kantong_id: Number(formData.alokasi_kantong_id)
    };

    if (isEditMode) {
      updateTransaksi(transactionData);
    } else {
      addTransaksi(transactionData);
    }

    setFormData(getInitialFormState());
    handleCloseModal();
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs text-stone-400 font-medium">Transparansi Finansial</p>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight">Laporan Keuangan & Persembahan</h2>
        </div>
        {activeSubTab === 'catatan' && (
          <button
            onClick={handleOpenCreateModal}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold shadow-xs ${accentClasses.bgPrimary} accent-transition focus:outline-none`}
          >
            <Plus className="w-4 h-4 mr-2" />
            Catat Transaksi
          </button>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-stone-200">
        <button
          onClick={() => setActiveSubTab('catatan')}
          className={`pb-2.5 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all focus:outline-none ${
            activeSubTab === 'catatan'
              ? `${accentClasses.text} border-current`
              : 'border-transparent text-stone-400 hover:text-stone-600'
          }`}
        >
          Catatan Keuangan
        </button>
        <button
          onClick={() => setActiveSubTab('kategori-kantong')}
          className={`pb-2.5 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all focus:outline-none ${
            activeSubTab === 'kategori-kantong'
              ? `${accentClasses.text} border-current`
              : 'border-transparent text-stone-400 hover:text-stone-600'
          }`}
        >
          Kategori Kantong
        </button>
        <button
          onClick={() => setActiveSubTab('kategori-transaksi')}
          className={`pb-2.5 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all focus:outline-none ${
            activeSubTab === 'kategori-transaksi'
              ? `${accentClasses.text} border-current`
              : 'border-transparent text-stone-400 hover:text-stone-600'
          }`}
        >
          Kategori Transaksi
        </button>
      </div>

      {activeSubTab === 'catatan' && (
        <>
          {/* Cash Flow Summary Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card Saldo Kas */}
            <div className="bg-white border border-stone-200/60 p-5 rounded-xl shadow-xs space-y-2">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Saldo Kas Saat Ini</span>
              <p className="text-xl font-bold text-stone-900">{formatRupiah(currentBalance)}</p>
              <div className="flex items-center space-x-1.5 text-[10.5px] text-stone-400 font-medium pt-1">
                <Wallet className="w-3.5 h-3.5" />
                <span>Kas internal gereja</span>
              </div>
            </div>

            {/* Card Total Pemasukan */}
            <div className="bg-white border border-stone-200/60 p-5 rounded-xl shadow-xs space-y-2">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Total Penerimaan</span>
              <p className="text-xl font-bold text-green-650">{formatRupiah(totalPemasukan)}</p>
              <div className="flex items-center space-x-1.5 text-[10.5px] text-green-650 font-medium pt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Total dana masuk</span>
              </div>
            </div>

            {/* Card Total Pengeluaran */}
            <div className="bg-white border border-stone-200/60 p-5 rounded-xl shadow-xs space-y-2">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Total Pengeluaran</span>
              <p className="text-xl font-bold text-red-650">{formatRupiah(totalPengeluaran)}</p>
              <div className="flex items-center space-x-1.5 text-[10.5px] text-red-650 font-medium pt-1">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>Total pengeluaran operasional</span>
              </div>
            </div>
          </div>

          {/* Saldo Per Kantong Persembahan */}
          <div className="space-y-2.5">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Saldo Per Kantong Persembahan</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {kategoriKantong && kategoriKantong.map((kat) => {
                const detail = bagDetails[String(kat.id)] || { pemasukan: 0, pengeluaran: 0, saldo: 0 };
                return (
                  <div 
                    key={kat.id} 
                    className={`px-4 py-3.5 rounded-lg border border-transparent ${kat.warna_badge} flex flex-col justify-center space-y-2 shadow-none transition-all`}
                  >
                    <span className="text-[11px] font-bold uppercase tracking-wider truncate opacity-90 border-b border-stone-300/20 pb-1.5">
                      {kat.nama_kantong}
                    </span>
                    <div className="text-[10.5px] space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="opacity-80 font-medium">Pemasukan:</span>
                        <span className="text-green-700 font-bold">{formatRupiah(detail.pemasukan)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="opacity-80 font-medium">Pengeluaran:</span>
                        <span className="text-red-700 font-bold">{formatRupiah(detail.pengeluaran)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-stone-350/20">
                      <span className="text-[10.5px] font-bold">Saldo Akhir:</span>
                      <span className="text-sm font-extrabold tracking-tight">
                        {formatRupiah(detail.saldo)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Transaction History Section */}
          <div className="bg-white border border-stone-200/60 rounded-xl overflow-hidden shadow-xs">
            <div className="px-5 py-3 border-b border-stone-100 bg-stone-50/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h3 className="text-xs font-bold text-stone-850 uppercase tracking-wider">Riwayat Arus Kas Jemaat</h3>
              <div className="flex items-center space-x-2">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider whitespace-nowrap">Filter Kantong:</label>
                <select
                  value={selectedFilterBag}
                  onChange={(e) => setSelectedFilterBag(e.target.value)}
                  className="px-2.5 py-1 border border-stone-200 rounded-lg text-xs font-semibold text-stone-700 bg-white focus:outline-none focus:border-stone-400"
                >
                  <option value="all">Semua Kantong</option>
                  {kategoriKantong && kategoriKantong.map((kat) => (
                    <option key={kat.id} value={kat.id}>
                      {kat.nama_kantong}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="divide-y divide-stone-100">
              {filteredAndSortedTransactions.length > 0 ? (
                filteredAndSortedTransactions.map((t) => (
                  <div key={t.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50/50 transition-colors">
                    {/* Left side: Icon + Kategori + Description */}
                    <div className="flex items-start space-x-3.5">
                      <div className={`p-2 rounded-lg mt-0.5 ${
                        t.tipe_transaksi === 'Pemasukan' 
                          ? 'bg-green-50 text-green-600 border border-green-200/40' 
                          : 'bg-red-50/50 text-red-600 border border-red-200/30'
                      }`}>
                        {t.tipe_transaksi === 'Pemasukan' ? <TrendingUp className="w-4.5 h-4.5" /> : <TrendingDown className="w-4.5 h-4.5" />}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-stone-850">{t.kategori}</span>
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.25 rounded border ${
                            t.tipe_transaksi === 'Pemasukan' 
                              ? 'bg-green-50 text-green-700 border-green-200/40' 
                              : 'bg-red-50 text-red-700 border-red-200/30'
                          }`}>
                            {t.tipe_transaksi === 'Pemasukan' ? 'Masuk' : 'Keluar'}
                          </span>
                          {t.alokasi_kantong_id && (() => {
                            const kantong = kategoriKantong?.find(k => String(k.id) === String(t.alokasi_kantong_id));
                            return kantong ? (
                              <span className={`text-[9px] font-bold px-1.5 py-0.25 rounded border uppercase tracking-wider ${kantong.warna_badge}`}>
                                {kantong.nama_kantong}
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold px-1.5 py-0.25 rounded border uppercase tracking-wider bg-stone-100 text-stone-800 border-stone-250">
                                Kategori Dihapus
                              </span>
                            );
                          })()}
                        </div>
                        <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">{t.deskripsi}</p>
                        <span className="text-[10px] text-stone-400 font-semibold block mt-1.5 flex items-center">
                          <CalendarIcon className="w-3 h-3 mr-1" />
                          {new Date(t.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                    </div>

                    {/* Right side: Amount & CRUD actions */}
                    <div className="sm:text-right flex items-center justify-between sm:justify-end gap-4">
                      <span className={`text-xs font-bold whitespace-nowrap ${t.tipe_transaksi === 'Pemasukan' ? 'text-green-700' : 'text-red-700'}`}>
                        {t.tipe_transaksi === 'Pemasukan' ? '+' : '-'} {formatRupiah(t.nominal)}
                      </span>
                      
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleOpenEditModal(t)}
                          className="p-1 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors focus:outline-none"
                          title="Edit Transaksi"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id, t.kategori, t.nominal)}
                          className="p-1 rounded text-stone-400 hover:text-red-650 hover:bg-red-50 transition-colors focus:outline-none"
                          title="Hapus Transaksi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center text-stone-400 text-xs">
                  {selectedFilterBag !== 'all' 
                    ? 'Tidak ada catatan transaksi pemasukan untuk kategori kantong ini.'
                    : 'Belum ada riwayat pencatatan transaksi kas.'}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {activeSubTab === 'kategori-kantong' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          {/* Left Side: Form (Col-span-1) */}
          <div className="bg-white border border-stone-200/60 p-5 rounded-xl shadow-xs space-y-4 h-fit">
            <div>
              <h3 className="text-xs font-bold text-stone-850 uppercase tracking-wider">
                {isEditingKat ? 'Edit Kategori Kantong' : 'Tambah Kategori Kantong'}
              </h3>
              <p className="text-[10px] text-stone-400 mt-1">
                {isEditingKat ? 'Ubah informasi kategori kantong persembahan' : 'Buat master data kantong persembahan baru'}
              </p>
            </div>
            
            <form onSubmit={handleKatSubmit} className="space-y-4">
              {/* Nama Kantong */}
              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Nama Kantong *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kantong Merah"
                  value={katForm.nama_kantong}
                  onChange={(e) => setKatForm({ ...katForm, nama_kantong: e.target.value })}
                  className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-stone-50/50 focus:bg-white"
                />
              </div>

              {/* Deskripsi Alokasi */}
              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Deskripsi Alokasi *</label>
                <textarea
                  required
                  rows="2"
                  placeholder="Contoh: Untuk Diakonia & Pelayanan Sosial"
                  value={katForm.deskripsi_alokasi}
                  onChange={(e) => setKatForm({ ...katForm, deskripsi_alokasi: e.target.value })}
                  className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-stone-50/50 focus:bg-white resize-none"
                />
              </div>

              {/* Warna Badge (Preset Selector) */}
              <div className="space-y-1.5">
                <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Warna Label Badge *</label>
                <div className="grid grid-cols-3 gap-2">
                  {BadgeColors.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setKatForm({ ...katForm, warna_badge: color.class })}
                      className={`px-2 py-1.5 rounded-lg border text-[10px] font-semibold text-center transition-all ${
                        katForm.warna_badge === color.class
                          ? 'border-stone-800 ring-2 ring-stone-900/10'
                          : 'border-stone-200 hover:border-stone-400'
                      } ${color.class}`}
                    >
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2.5 pt-3 border-t border-stone-100">
                {isEditingKat && (
                  <button
                    type="button"
                    onClick={handleCancelKatEdit}
                    className="flex-1 py-1.5 border border-stone-250 hover:bg-stone-50 rounded-lg text-xs font-semibold text-stone-600 transition-colors focus:outline-none"
                  >
                    Batal
                  </button>
                )}
                <button
                  type="submit"
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold text-white shadow-xs ${accentClasses.bgPrimary} transition-colors focus:outline-none`}
                >
                  {isEditingKat ? 'Simpan' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>

          {/* Right Side: Table (Col-span-2) */}
          <div className="bg-white border border-stone-200/60 rounded-xl overflow-hidden shadow-xs lg:col-span-2 flex flex-col justify-between h-fit">
            <div>
              <div className="px-5 py-4 border-b border-stone-100 bg-stone-50/20">
                <h3 className="text-xs font-bold text-stone-850 uppercase tracking-wider">Daftar Kategori Kantong</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-stone-50/40 text-stone-450 border-b border-stone-150 uppercase tracking-wider text-[9px] font-bold">
                      <th className="py-2.5 px-4">Nama Kantong</th>
                      <th className="py-2.5 px-4">Deskripsi Alokasi</th>
                      <th className="py-2.5 px-4">Warna Label</th>
                      <th className="py-2.5 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {kategoriKantong && kategoriKantong.length > 0 ? (
                      kategoriKantong.map((item) => (
                        <tr key={item.id} className="hover:bg-stone-50/35 transition-colors">
                          <td className="py-3 px-4 font-bold text-stone-800">{item.nama_kantong}</td>
                          <td className="py-3 px-4 text-stone-500">{item.deskripsi_alokasi}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded border text-[10px] font-semibold ${item.warna_badge}`}>
                              {item.nama_kantong}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center space-x-1">
                              <button
                                onClick={() => handleStartKatEdit(item)}
                                className="p-1 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors focus:outline-none"
                                title="Edit Kategori"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleKatDelete(item.id, item.nama_kantong)}
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
                        <td colSpan="4" className="py-8 text-center text-stone-400 text-xs">
                          Belum ada kategori kantong.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'kategori-transaksi' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          {/* Left Side: Form (Col-span-1) */}
          <div className="bg-white border border-stone-200/60 p-5 rounded-xl shadow-xs space-y-4 h-fit">
            <div>
              <h3 className="text-xs font-bold text-stone-850 uppercase tracking-wider">
                {isEditingKatTrans ? 'Edit Kategori Transaksi' : 'Tambah Kategori Transaksi'}
              </h3>
              <p className="text-[10px] text-stone-400 mt-1">
                {isEditingKatTrans ? 'Ubah informasi kategori transaksi keuangan' : 'Buat master data kategori transaksi baru'}
              </p>
            </div>
            
            <form onSubmit={handleKatTransSubmit} className="space-y-4">
              {/* Nama Kategori */}
              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Nama Kategori *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Persembahan Syukur"
                  value={katTransForm.nama_kategori}
                  onChange={(e) => setKatTransForm({ ...katTransForm, nama_kategori: e.target.value })}
                  className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-stone-50/50 focus:bg-white"
                />
              </div>

              {/* Tipe */}
              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Tipe Arus Kas *</label>
                <select
                  value={katTransForm.tipe}
                  onChange={(e) => setKatTransForm({ ...katTransForm, tipe: e.target.value })}
                  className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-white"
                >
                  <option value="Pemasukan">Pemasukan / Uang Masuk</option>
                  <option value="Pengeluaran">Pengeluaran / Uang Keluar</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-2.5 pt-3 border-t border-stone-100">
                {isEditingKatTrans && (
                  <button
                    type="button"
                    onClick={handleCancelKatTransEdit}
                    className="flex-1 py-1.5 border border-stone-250 hover:bg-stone-50 rounded-lg text-xs font-semibold text-stone-600 transition-colors focus:outline-none"
                  >
                    Batal
                  </button>
                )}
                <button
                  type="submit"
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold text-white shadow-xs ${accentClasses.bgPrimary} transition-colors focus:outline-none`}
                >
                  {isEditingKatTrans ? 'Simpan' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>

          {/* Right Side: Table (Col-span-2) */}
          <div className="bg-white border border-stone-200/60 rounded-xl overflow-hidden shadow-xs lg:col-span-2 flex flex-col justify-between h-fit">
            <div>
              <div className="px-5 py-4 border-b border-stone-100 bg-stone-50/20">
                <h3 className="text-xs font-bold text-stone-850 uppercase tracking-wider">Daftar Kategori Transaksi</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-stone-50/40 text-stone-450 border-b border-stone-150 uppercase tracking-wider text-[9px] font-bold">
                      <th className="py-2.5 px-4">Nama Kategori</th>
                      <th className="py-2.5 px-4">Tipe Arus Kas</th>
                      <th className="py-2.5 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {kategoriTransaksi && kategoriTransaksi.length > 0 ? (
                      kategoriTransaksi.map((item) => (
                        <tr key={item.id} className="hover:bg-stone-50/35 transition-colors">
                          <td className="py-3 px-4 font-bold text-stone-800">{item.nama_kategori}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded border text-[10px] font-semibold ${
                              item.tipe === 'Pemasukan'
                                ? 'bg-green-100 text-green-800 border-green-200/60'
                                : 'bg-red-100 text-red-800 border-red-200/60'
                            }`}>
                              {item.tipe === 'Pemasukan' ? 'Pemasukan' : 'Pengeluaran'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center space-x-1">
                              <button
                                onClick={() => handleStartKatTransEdit(item)}
                                className="p-1 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors focus:outline-none"
                                title="Edit Kategori"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleKatTransDelete(item.id, item.nama_kategori)}
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
                        <td colSpan="3" className="py-8 text-center text-stone-400 text-xs">
                          Belum ada kategori transaksi.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RECORD / EDIT TRANSACTION MODAL */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={isEditMode ? "Ubah Catatan Transaksi Keuangan" : "Catat Transaksi Keuangan Baru"}>
        <form onSubmit={handleSubmit} className="space-y-4 text-stone-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tipe Transaksi */}
            <div className="space-y-1">
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Tipe Arus Kas *</label>
              <select
                value={formData.tipe_transaksi}
                onChange={(e) => {
                  const newTipe = e.target.value;
                  const filteredCats = (kategoriTransaksi || []).filter(cat => cat.tipe === newTipe);
                  const newKat = filteredCats.length > 0 ? filteredCats[0].nama_kategori : '';
                  const defaultKatId = kategoriKantong && kategoriKantong.length > 0 ? String(kategoriKantong[0].id) : '';
                  setFormData({ ...formData, tipe_transaksi: newTipe, kategori: newKat, alokasi_kantong_id: defaultKatId });
                }}
                className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-white"
              >
                <option value="Pemasukan">Pemasukan / Uang Masuk</option>
                <option value="Pengeluaran">Pengeluaran / Uang Keluar</option>
              </select>
            </div>

            {/* Kategori */}
            <div className="space-y-1">
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Kategori Transaksi *</label>
              <select
                value={formData.kategori}
                onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-white"
              >
                {(kategoriTransaksi || [])
                  .filter(cat => cat.tipe === formData.tipe_transaksi)
                  .map(cat => (
                    <option key={cat.id} value={cat.nama_kategori}>
                      {cat.nama_kategori}
                    </option>
                  ))}
              </select>
            </div>

            {/* Alokasi Kantong */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Alokasi Kantong *</label>
              {kategoriKantong && kategoriKantong.length > 0 ? (
                <select
                  value={formData.alokasi_kantong_id}
                  onChange={(e) => setFormData({ ...formData, alokasi_kantong_id: e.target.value })}
                  className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-white"
                  required
                >
                  {kategoriKantong.map((kat) => (
                    <option key={kat.id} value={kat.id}>
                      {kat.nama_kantong} ({kat.deskripsi_alokasi})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-[11px] text-red-500 bg-red-50 border border-red-200/50 p-2 rounded-lg leading-relaxed">
                  Belum ada kategori kantong. Silakan buat di tab Pengaturan Kategori Kantong terlebih dahulu.
                </div>
              )}
            </div>

            {/* Nominal */}
            <div className="space-y-1">
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Nominal (Rupiah) *</label>
              <input
                type="number"
                min="1"
                required
                placeholder="Contoh: 1500000"
                value={formData.nominal}
                onChange={(e) => setFormData({ ...formData, nominal: e.target.value })}
                className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-stone-50/50 focus:bg-white"
              />
            </div>

            {/* Tanggal */}
            <div className="space-y-1">
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Tanggal Transaksi *</label>
              <input
                type="date"
                required
                value={formData.tanggal}
                onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-stone-50/50 focus:bg-white"
              />
            </div>

            {/* Deskripsi */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Keterangan / Catatan *</label>
              <textarea
                required
                rows="2"
                placeholder="Rincian informasi transaksi..."
                value={formData.deskripsi}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-stone-50/50 focus:bg-white resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 border border-stone-250 hover:bg-stone-50 rounded-lg text-xs font-semibold text-stone-600 transition-colors focus:outline-none"
            >
              Batal
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg text-xs font-bold text-white shadow-xs ${accentClasses.bgPrimary} transition-colors focus:outline-none`}
            >
              {isEditMode ? 'Simpan Perubahan' : 'Simpan Transaksi'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
