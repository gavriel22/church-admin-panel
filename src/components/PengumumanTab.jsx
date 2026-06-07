import { useState, useContext } from 'react';
import { Plus, Calendar as CalendarIcon, Pin, Edit, Trash2 } from 'lucide-react';
import { ChurchContext } from '../context/ChurchContext';
import Modal from './Modal';

export default function PengumumanTab({ accentClasses, externalOpenPengumumanModal, setExternalOpenPengumumanModal }) {
  const { 
    pengumuman, 
    addPengumuman, 
    updatePengumuman, 
    deletePengumuman 
  } = useContext(ChurchContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const initialFormState = {
    judul: '',
    deskripsi: '',
    tanggal: '',
    pinned: false
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const [prevExternalOpen, setPrevExternalOpen] = useState(externalOpenPengumumanModal);
  if (externalOpenPengumumanModal !== prevExternalOpen) {
    setPrevExternalOpen(externalOpenPengumumanModal);
    if (externalOpenPengumumanModal) {
      setIsEditMode(false);
      setFormData(initialFormState);
      setIsModalOpen(true);
    }
  }

  const handleOpenEditModal = (item) => {
    setIsEditMode(true);
    setSelectedId(item.id);
    setFormData({
      judul: item.judul || '',
      deskripsi: item.deskripsi || '',
      tanggal: item.tanggal || '',
      pinned: !!item.pinned
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (setExternalOpenPengumumanModal) setExternalOpenPengumumanModal(false);
  };

  const handleDelete = (id, title) => {
    const confirmed = window.confirm(`Apakah Anda yakin ingin menghapus pengumuman "${title}"?`);
    if (confirmed) {
      deletePengumuman(id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.judul || !formData.deskripsi || !formData.tanggal) {
      alert('Mohon isi seluruh kolom pengumuman.');
      return;
    }

    if (isEditMode) {
      updatePengumuman({
        id: selectedId,
        ...formData
      });
    } else {
      addPengumuman({
        id: Date.now(),
        ...formData
      });
    }

    setFormData(initialFormState);
    handleCloseModal();
  };

  // Sort announcements so pinned ones come first, then date descending
  const sortedPengumuman = [...pengumuman].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.tanggal) - new Date(a.tanggal);
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs text-stone-400 font-medium">Komunikasi Jemaat</p>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight">Warta Jemaat & Pengumuman</h2>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold shadow-xs ${accentClasses.bgPrimary} accent-transition focus:outline-none`}
        >
          <Plus className="w-4 h-4 mr-2" />
          Buat Pengumuman
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-stone-200/60 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-stone-50/75 border-b border-stone-200 text-stone-550 text-[10px] font-bold uppercase tracking-wider">
                <th className="px-6 py-3.5">Judul Pengumuman</th>
                <th className="px-6 py-3.5">Tanggal Terbit</th>
                <th className="px-6 py-3.5">Status Pin</th>
                <th className="px-6 py-3.5">Deskripsi Singkat</th>
                <th className="px-6 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs">
              {sortedPengumuman.length > 0 ? (
                sortedPengumuman.map((item) => (
                  <tr 
                    key={item.id} 
                    className={`hover:bg-stone-50/40 transition-colors ${item.pinned ? 'bg-amber-50/5' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-stone-900 flex items-center gap-1.5">
                        {item.pinned && <Pin className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />}
                        <span>{item.judul}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-stone-600 font-medium whitespace-nowrap">
                      <div className="flex items-center space-x-1.5">
                        <CalendarIcon className="w-3.5 h-3.5 text-stone-400" />
                        <span>{new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.pinned ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200/50 uppercase tracking-wide">
                          Dipin / Penting
                        </span>
                      ) : (
                        <span className="text-stone-300 italic">Standar</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-stone-450 leading-relaxed max-w-xs truncate" title={item.deskripsi}>
                      {item.deskripsi}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1 rounded-lg text-stone-450 hover:text-stone-700 hover:bg-stone-50 border border-transparent hover:border-stone-200/60 transition-all focus:outline-none"
                          title="Edit Pengumuman"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.judul)}
                          className="p-1 rounded-lg text-stone-450 hover:text-red-650 hover:bg-red-50 border border-transparent hover:border-red-200/30 transition-all focus:outline-none"
                          title="Hapus Pengumuman"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-stone-400">
                    Belum ada pengumuman terdaftar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ADD / EDIT PENGUMUMAN */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={isEditMode ? "Ubah Pengumuman" : "Buat Pengumuman Baru"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-stone-700">
          <div className="space-y-1">
            <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Judul Pengumuman *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Perubahan Jadwal Ibadah KKR"
              value={formData.judul}
              onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
              className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-stone-50/50 focus:bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Tanggal Publikasi *</label>
            <input
              type="date"
              required
              value={formData.tanggal}
              onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
              className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-stone-50/50 focus:bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Deskripsi / Konten Pengumuman *</label>
            <textarea
              required
              rows="4"
              placeholder="Tuliskan detail pengumuman secara rinci..."
              value={formData.deskripsi}
              onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
              className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-stone-50/50 focus:bg-white resize-none"
            />
          </div>

          <div className="flex items-center space-x-2 py-1">
            <input
              type="checkbox"
              id="pinned"
              checked={formData.pinned}
              onChange={(e) => setFormData({ ...formData, pinned: e.target.checked })}
              className="rounded border-stone-300 text-amber-600 focus:ring-amber-500 h-4 w-4"
            />
            <label htmlFor="pinned" className="text-xs font-semibold text-stone-700 select-none flex items-center">
              <Pin className="w-3.5 h-3.5 text-amber-500 mr-1 fill-amber-500" /> Pin ke Halaman Utama (Tampilkan di section teratas landing page)
            </label>
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
              {isEditMode ? 'Simpan Perubahan' : 'Terbitkan Pengumuman'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
