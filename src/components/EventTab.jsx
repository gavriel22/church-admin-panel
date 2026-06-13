import { useState, useContext } from 'react';
import { Calendar, Plus, Clock, MapPin, Edit, Trash2 } from 'lucide-react';
import { ChurchContext } from '../context/ChurchContext';
import Modal from './Modal';

export default function EventTab({ accentClasses }) {
  const { 
    events, 
    addEvent, 
    updateEvent, 
    deleteEvent 
  } = useContext(ChurchContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [filterMonth, setFilterMonth] = useState('all');
  const namaBulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const initialFormState = {
    nama: '',
    tanggal: '',
    waktu: '',
    lokasi: '',
    deskripsi: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setIsEditMode(true);
    setSelectedId(item.id);
    setFormData({
      nama: item.nama || '',
      tanggal: item.tanggal || '',
      waktu: item.waktu || '',
      lokasi: item.lokasi || '',
      deskripsi: item.deskripsi || ''
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = (id, name) => {
    const confirmed = window.confirm(`Apakah Anda yakin ingin menghapus acara "${name}"?`);
    if (confirmed) {
      deleteEvent(id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.tanggal || !formData.waktu || !formData.lokasi) {
      alert('Mohon isi nama, tanggal, waktu, dan lokasi acara.');
      return;
    }

    if (isEditMode) {
      updateEvent({
        id: selectedId,
        ...formData
      });
    } else {
      addEvent({
        id: Date.now(),
        ...formData
      });
    }

    setFormData(initialFormState);
    handleCloseModal();
  };

  // Sort events by date descending
  const sortedEvents = [...events].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

  // Filter events by selected month
  const filteredEvents = sortedEvents.filter(item => {
    if (filterMonth === 'all') return true;
    if (!item.tanggal) return false;
    const date = new Date(item.tanggal);
    return date.getMonth() === Number(filterMonth);
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs text-stone-400 font-medium">Agenda Kegiatan Gereja</p>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight">Manajemen Kegiatan & Event Terdekat</h2>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold shadow-xs ${accentClasses.bgPrimary} accent-transition focus:outline-none`}
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Acara Baru
        </button>
      </div>

      {/* Control Bar (Filter & Summary) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 bg-white border border-stone-200/60 px-3 py-1.5 rounded-lg shadow-xs">
          <span className="text-[10px] font-bold text-stone-450 uppercase tracking-wider">Filter Bulan:</span>
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="py-0.5 px-1 border-transparent rounded text-xs bg-transparent text-stone-700 font-semibold focus:outline-none focus:ring-0 cursor-pointer focus:border-stone-400"
          >
            <option value="all">Semua Bulan</option>
            {namaBulan.map((name, index) => (
              <option key={index} value={index}>{name}</option>
            ))}
          </select>
        </div>
        <span className="text-[10.5px] font-bold text-stone-400 uppercase tracking-wide bg-stone-50/50 px-2.5 py-1 rounded border border-stone-200/40">
          Total: {filteredEvents.length} Event
        </span>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-stone-200/60 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-stone-50/75 border-b border-stone-200 text-stone-550 text-[10px] font-bold uppercase tracking-wider">
                <th className="px-6 py-3.5">Nama Kegiatan / Acara</th>
                <th className="px-6 py-3.5">Tanggal Acara</th>
                <th className="px-6 py-3.5">Waktu / Jam</th>
                <th className="px-6 py-3.5">Lokasi</th>
                <th className="px-6 py-3.5">Deskripsi Acara</th>
                <th className="px-6 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((item) => {
                  const eventDate = new Date(item.tanggal);
                  const isPast = eventDate < new Date("2026-06-07");
                  return (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-stone-50/40 transition-colors ${isPast ? 'opacity-60 bg-stone-50/20' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-stone-900">{item.nama}</div>
                        {isPast && (
                          <span className="text-[9px] font-bold uppercase text-stone-400 block mt-0.5">Selesai / Berlalu</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-stone-600 font-medium whitespace-nowrap">
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          <span>{new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-stone-650 font-medium">
                        <div className="flex items-center space-x-1.5">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          <span>{item.waktu}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-stone-550 font-medium">
                        <div className="flex items-center space-x-1.5">
                          <MapPin className="w-3.5 h-3.5 text-stone-400" />
                          <span>{item.lokasi}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-stone-450 leading-relaxed max-w-xs truncate" title={item.deskripsi}>
                        {item.deskripsi}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1 rounded-lg text-stone-450 hover:text-stone-700 hover:bg-stone-50 border border-transparent hover:border-stone-200/60 transition-all focus:outline-none"
                            title="Edit Acara"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.nama)}
                            className="p-1 rounded-lg text-stone-450 hover:text-red-650 hover:bg-red-50 border border-transparent hover:border-red-200/30 transition-all focus:outline-none"
                            title="Hapus Acara"
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
                  <td colSpan="6" className="px-6 py-12 text-center text-stone-400">
                    Belum ada kegiatan/acara terdaftar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ADD / EDIT ACARA */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={isEditMode ? "Ubah Detail Acara" : "Tambah Acara Baru"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-stone-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 md:col-span-2">
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Nama Kegiatan / Acara *</label>
              <input
                type="text"
                required
                placeholder="Contoh: Ibadah Padang Bersama Jemaat"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-stone-50/50 focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Tanggal Acara *</label>
              <input
                type="date"
                required
                value={formData.tanggal}
                onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-stone-50/50 focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Waktu / Jam *</label>
              <input
                type="text"
                required
                placeholder="Contoh: 10:00 - 15:00 WIB"
                value={formData.waktu}
                onChange={(e) => setFormData({ ...formData, waktu: e.target.value })}
                className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-stone-50/50 focus:bg-white"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Lokasi Pelaksanaan *</label>
              <input
                type="text"
                required
                placeholder="Contoh: Kebun Raya Bogor atau Aula Utama"
                value={formData.lokasi}
                onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-stone-50/50 focus:bg-white"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Deskripsi Kegiatan *</label>
              <textarea
                required
                rows="4"
                placeholder="Tuliskan tujuan acara, pembicara, dan detail penting lainnya..."
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
              {isEditMode ? 'Simpan Perubahan' : 'Tambah Acara'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
