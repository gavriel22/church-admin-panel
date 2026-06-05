import { useState } from 'react';
import { HeartHandshake, Users, Clock, User, Plus } from 'lucide-react';
import Modal from './Modal';

export default function PelayananTab({ pelayanan, onAddPelayanan, accentClasses }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: '',
    anggota: '',
    pertemuan: '',
    ketua: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.deskripsi || !formData.ketua) {
      alert('Mohon isi kolom Nama, Deskripsi, dan Ketua Pelayanan.');
      return;
    }

    onAddPelayanan({
      id: Date.now(),
      nama: formData.nama,
      deskripsi: formData.deskripsi,
      anggota: Number(formData.anggota) || 0,
      pertemuan: formData.pertemuan || 'Hubungi Ketua',
      ketua: formData.ketua
    });

    setFormData({
      nama: '',
      deskripsi: '',
      anggota: '',
      pertemuan: '',
      ketua: ''
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs text-stone-400 font-medium">Pengembangan Layanan Jemaat</p>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight">Bidang Pelayanan & Komunitas</h2>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold shadow-xs ${accentClasses.bgPrimary} accent-transition focus:outline-none`}
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Pelayanan
        </button>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {pelayanan.map((item) => (
          <div key={item.id} className="bg-white border border-stone-200/60 p-5 rounded-xl shadow-xs flex flex-col justify-between hover:border-stone-300 transition-colors">
            <div className="space-y-3">
              {/* Card Header (Icon & Name) */}
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${accentClasses.light}`}>
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold text-stone-900 tracking-tight">{item.nama}</h3>
              </div>

              {/* Description */}
              <p className="text-[11px] text-stone-500 leading-relaxed min-h-[44px]">
                {item.deskripsi}
              </p>
            </div>

            {/* Meta details list */}
            <div className="space-y-1.5 pt-4 mt-4 border-t border-stone-100 text-[10.5px] text-stone-550 font-semibold">
              <div className="flex items-center">
                <Users className="w-3.5 h-3.5 text-stone-450 mr-2" />
                <span>Kekuatan Tim: <strong className="text-stone-700">{item.anggota} Anggota</strong></span>
              </div>
              <div className="flex items-center">
                <Clock className="w-3.5 h-3.5 text-stone-450 mr-2" />
                <span className="truncate">Pertemuan: {item.pertemuan}</span>
              </div>
              <div className="flex items-center">
                <User className="w-3.5 h-3.5 text-stone-450 mr-2" />
                <span className="truncate">Ketua: {item.ketua}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD PELAYANAN MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Bidang Pelayanan Baru">
        <form onSubmit={handleSubmit} className="space-y-4 text-stone-700">
          <div className="space-y-1">
            <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Nama Bidang Pelayanan / Komunitas *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Multimedia & Broadcast"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-stone-50/50 focus:bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Ketua Bidang Pelayanan *</label>
            <input
              type="text"
              required
              placeholder="Nama penanggung jawab pelayanan"
              value={formData.ketua}
              onChange={(e) => setFormData({ ...formData, ketua: e.target.value })}
              className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-stone-50/50 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Jumlah Anggota</label>
              <input
                type="number"
                min="0"
                placeholder="Jumlah anggota saat ini"
                value={formData.anggota}
                onChange={(e) => setFormData({ ...formData, anggota: e.target.value })}
                className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-stone-50/50 focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Jadwal Pertemuan Reguler</label>
              <input
                type="text"
                placeholder="Contoh: Sabtu pukul 14:00 WIB"
                value={formData.pertemuan}
                onChange={(e) => setFormData({ ...formData, pertemuan: e.target.value })}
                className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-stone-50/50 focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Deskripsi Singkat Pelayanan *</label>
            <textarea
              required
              rows="3"
              placeholder="Tuliskan tugas utama dan ruang lingkup divisi pelayanan ini..."
              value={formData.deskripsi}
              onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
              className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-stone-50/50 focus:bg-white resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-stone-250 hover:bg-stone-50 rounded-lg text-xs font-semibold text-stone-600 transition-colors focus:outline-none"
            >
              Batal
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg text-xs font-bold text-white shadow-xs ${accentClasses.bgPrimary} transition-colors focus:outline-none`}
            >
              Simpan Pelayanan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
