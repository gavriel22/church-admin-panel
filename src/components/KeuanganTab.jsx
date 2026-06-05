import { useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, Plus, Calendar as CalendarIcon, FileText, IndianRupee } from 'lucide-react';
import Modal from './Modal';

export default function KeuanganTab({ keuangan, onAddTransaksi, accentClasses, externalOpenAddModal, setExternalOpenAddModal }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    tipe: 'Penerimaan',
    kategori: 'Persembahan Mingguan',
    nominal: '',
    tanggal: '',
    deskripsi: ''
  });

  // Calculate totals
  const totalPemasukan = keuangan.transaksi
    .filter(t => t.tipe === 'Penerimaan')
    .reduce((acc, curr) => acc + curr.nominal, 0);

  const totalPengeluaran = keuangan.transaksi
    .filter(t => t.tipe === 'Pengeluaran')
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

    onAddTransaksi({
      id: Date.now(),
      tanggal: formData.tanggal,
      tipe: formData.tipe,
      kategori: formData.kategori,
      nominal: Number(formData.nominal),
      deskripsi: formData.deskripsi
    });

    setFormData({
      tipe: 'Penerimaan',
      kategori: 'Persembahan Mingguan',
      nominal: '',
      tanggal: '',
      deskripsi: ''
    });
    
    setIsModalOpen(false);
    if (setExternalOpenAddModal) setExternalOpenAddModal(false);
  };

  // Sync external dashboard quick action trigger
  if (externalOpenAddModal && !isModalOpen) {
    setIsModalOpen(true);
  }
  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (setExternalOpenAddModal) setExternalOpenAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs text-stone-400 font-medium">Transparansi Finansial</p>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight">Laporan Keuangan & Persembahan</h2>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold shadow-xs ${accentClasses.bgPrimary} accent-transition focus:outline-none`}
        >
          <Plus className="w-4 h-4 mr-2" />
          Catat Transaksi
        </button>
      </div>

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

      {/* Transaction History Section */}
      <div className="bg-white border border-stone-200/60 rounded-xl overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-stone-100 bg-stone-50/20">
          <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">Riwayat Arus Kas Jemaat</h3>
        </div>

        <div className="divide-y divide-stone-100">
          {keuangan.transaksi.length > 0 ? (
            keuangan.transaksi.map((t) => (
              <div key={t.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50/50 transition-colors">
                {/* Left side: Icon + Kategori + Description */}
                <div className="flex items-start space-x-3.5">
                  <div className={`p-2 rounded-lg mt-0.5 ${
                    t.tipe === 'Penerimaan' 
                      ? 'bg-green-50 text-green-600 border border-green-200/40' 
                      : 'bg-red-50/50 text-red-600 border border-red-200/30'
                  }`}>
                    {t.tipe === 'Penerimaan' ? <TrendingUp className="w-4.5 h-4.5" /> : <TrendingDown className="w-4.5 h-4.5" />}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-stone-850">{t.kategori}</span>
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.25 rounded border ${
                        t.tipe === 'Penerimaan' 
                          ? 'bg-green-50 text-green-700 border-green-200/40' 
                          : 'bg-red-50 text-red-700 border-red-200/30'
                      }`}>
                        {t.tipe === 'Penerimaan' ? 'Masuk' : 'Keluar'}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">{t.deskripsi}</p>
                    <span className="text-[10px] text-stone-400 font-semibold block mt-1.5 flex items-center">
                      <CalendarIcon className="w-3 h-3 mr-1" />
                      {new Date(t.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Right side: Amount */}
                <div className="sm:text-right">
                  <span className={`text-xs font-bold ${t.tipe === 'Penerimaan' ? 'text-green-700' : 'text-red-700'}`}>
                    {t.tipe === 'Penerimaan' ? '+' : '-'} {formatRupiah(t.nominal)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-10 text-center text-stone-400 text-xs">
              Belum ada riwayat pencatatan transaksi kas.
            </div>
          )}
        </div>
      </div>

      {/* RECORD TRANSACTION MODAL */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Catat Transaksi Keuangan Baru">
        <form onSubmit={handleSubmit} className="space-y-4 text-stone-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tipe Transaksi */}
            <div className="space-y-1">
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Tipe Arus Kas *</label>
              <select
                value={formData.tipe}
                onChange={(e) => {
                  const newTipe = e.target.value;
                  const newKat = newTipe === 'Penerimaan' ? 'Persembahan Mingguan' : 'Operasional Gedung';
                  setFormData({ ...formData, tipe: newTipe, kategori: newKat });
                }}
                className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-white"
              >
                <option value="Penerimaan">Penerimaan / Uang Masuk</option>
                <option value="Pengeluaran">Pengeluaran / Uang Keluar</option>
              </select>
            </div>

            {/* Kategori */}
            <div className="space-y-1">
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Kategori Transaksi *</label>
              {formData.tipe === 'Penerimaan' ? (
                <select
                  value={formData.kategori}
                  onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                  className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-white"
                >
                  <option value="Persembahan Mingguan">Persembahan Mingguan</option>
                  <option value="Persepuluhan">Persepuluhan Jemaat</option>
                  <option value="Donasi Khusus">Donasi / Bantuan Sosial</option>
                  <option value="Bunga Bank">Bunga Bank & Lain-lain</option>
                </select>
              ) : (
                <select
                  value={formData.kategori}
                  onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                  className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-white"
                >
                  <option value="Operasional Gedung">Operasional Gedung (Listrik/Air/Internet)</option>
                  <option value="Diakonia">Diakonia (Kunjungan Sakit/Sosial)</option>
                  <option value="Sekretariat">Sekretariat & ATK</option>
                  <option value="Honor Pembicara">Honor Pembicara & Pelayanan Musik</option>
                  <option value="Pembangunan">Biaya Renovasi & Pembangunan</option>
                </select>
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
              Simpan Transaksi
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
