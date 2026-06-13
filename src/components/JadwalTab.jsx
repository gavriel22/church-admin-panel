import { useState, useContext } from 'react';
import { Plus, Clock, MapPin, Edit, Trash2 } from 'lucide-react';
import { ChurchContext } from '../context/ChurchContext';
import Modal from './Modal';

export default function JadwalTab({ accentClasses, externalOpenJadwalModal, setExternalOpenJadwalModal }) {
  const { 
    jadwal, 
    jemaat,
    addJadwal, 
    updateJadwal, 
    deleteJadwal 
  } = useContext(ChurchContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedJadwalId, setSelectedJadwalId] = useState(null);

  const initialFormState = {
    nama: '',
    hari: 'Minggu',
    waktu: '',
    lokasi: '',
    deskripsi: '',
    petugas: []
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const [prevExternalOpen, setPrevExternalOpen] = useState(externalOpenJadwalModal);
  if (externalOpenJadwalModal !== prevExternalOpen) {
    setPrevExternalOpen(externalOpenJadwalModal);
    if (externalOpenJadwalModal) {
      setIsEditMode(false);
      setFormData(initialFormState);
      setIsModalOpen(true);
    }
  }

  const handleOpenEditModal = (item) => {
    setIsEditMode(true);
    setSelectedJadwalId(item.id);
    setFormData({
      nama: item.nama || '',
      hari: item.hari || 'Minggu',
      waktu: item.waktu || '',
      lokasi: item.lokasi || '',
      deskripsi: item.deskripsi || '',
      petugas: item.petugas || []
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (setExternalOpenJadwalModal) setExternalOpenJadwalModal(false);
  };

  const handleDelete = (id, name) => {
    const confirmed = window.confirm(`Apakah Anda yakin ingin menghapus jadwal "${name}"?`);
    if (confirmed) {
      deleteJadwal(id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.waktu || !formData.lokasi) {
      alert('Mohon isi nama, waktu, dan lokasi ibadah.');
      return;
    }

    if (isEditMode) {
      updateJadwal({
        id: selectedJadwalId,
        ...formData
      });
    } else {
      addJadwal({
        id: Date.now(),
        ...formData
      });
    }

    setFormData(initialFormState);
    handleCloseModal();
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs text-stone-400 font-medium">Manajemen Waktu Ibadah</p>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight">Pengaturan Jadwal Ibadah Rutin</h2>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold shadow-xs ${accentClasses.bgPrimary} accent-transition focus:outline-none`}
        >
          <Plus className="w-4 h-4 mr-2" />
          Atur Jadwal Baru
        </button>
      </div>

      {/* Grid of Cards / Table */}
      <div className="bg-white border border-stone-200/60 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-stone-50/75 border-b border-stone-200 text-stone-550 text-[10px] font-bold uppercase tracking-wider">
                <th className="px-6 py-3.5">Nama Layanan / Ibadah</th>
                <th className="px-6 py-3.5">Hari</th>
                <th className="px-6 py-3.5">Waktu / Jam</th>
                <th className="px-6 py-3.5">Lokasi Ruangan</th>
                <th className="px-6 py-3.5">Deskripsi Singkat</th>
                <th className="px-6 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs">
              {jadwal.length > 0 ? (
                jadwal.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-stone-900">{item.nama}</div>
                      {item.petugas && item.petugas.length > 0 && (
                        <div className="mt-1.5 space-y-1 animate-in fade-in duration-200">
                          <p className="text-[9px] font-extrabold text-stone-400 uppercase tracking-wider">Petugas:</p>
                          <div className="flex flex-wrap gap-1">
                            {item.petugas.map((p, idx) => {
                              const person = jemaat.find(j => String(j.id) === String(p.jemaat_id));
                              return (
                                <span key={idx} className="inline-flex items-center px-1.5 py-0.5 rounded bg-stone-50 text-stone-700 border border-stone-200 text-[10px] font-semibold">
                                  <strong className="text-stone-500 mr-1">{p.jabatan}:</strong> {person ? person.nama : 'Tidak Diketahui'}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${accentClasses.badge}`}>
                        {item.hari}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-stone-600 font-medium">
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
                      {item.deskripsi || <span className="text-stone-300 italic">Tidak ada keterangan</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1 rounded-lg text-stone-450 hover:text-stone-700 hover:bg-stone-50 border border-transparent hover:border-stone-200/60 transition-all focus:outline-none"
                          title="Edit Jadwal"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.nama)}
                          className="p-1 rounded-lg text-stone-450 hover:text-red-650 hover:bg-red-50 border border-transparent hover:border-red-200/30 transition-all focus:outline-none"
                          title="Hapus Jadwal"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-stone-400">
                    Belum ada jadwal ibadah terdaftar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ADD / EDIT JADWAL */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={isEditMode ? "Ubah Jadwal Ibadah" : "Atur Jadwal Ibadah Baru"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-stone-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 md:col-span-2">
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Nama Ibadah / Layanan *</label>
              <input
                type="text"
                required
                placeholder="Contoh: Ibadah Raya Minggu Sesi I"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-stone-50/50 focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Hari *</label>
              <select
                value={formData.hari}
                onChange={(e) => setFormData({ ...formData, hari: e.target.value })}
                className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-white"
              >
                <option value="Senin">Senin</option>
                <option value="Selasa">Selasa</option>
                <option value="Rabu">Rabu</option>
                <option value="Kamis">Kamis</option>
                <option value="Jumat">Jumat</option>
                <option value="Sabtu">Sabtu</option>
                <option value="Minggu">Minggu</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Waktu / Jam Ibadah *</label>
              <input
                type="text"
                required
                placeholder="Contoh: 08:00 - 10:00 WIB"
                value={formData.waktu}
                onChange={(e) => setFormData({ ...formData, waktu: e.target.value })}
                className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-stone-50/50 focus:bg-white"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Lokasi Pertemuan *</label>
              <input
                type="text"
                required
                placeholder="Contoh: Gedung Utama Sesi I atau Aula Lantai 2"
                value={formData.lokasi}
                onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-stone-50/50 focus:bg-white"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Deskripsi Kegiatan</label>
              <textarea
                rows="3"
                placeholder="Deskripsi singkat mengenai ibadah ini..."
                value={formData.deskripsi}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-stone-50/50 focus:bg-white resize-none"
              />
            </div>

            {/* Petugas Ibadah (Internal Admin) */}
            <div className="space-y-2.5 md:col-span-2 border-t border-stone-150 pt-3">
              <div className="flex items-center justify-between">
                <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Petugas Ibadah (Internal Admin)</label>
                <button
                  type="button"
                  onClick={() => {
                    const defaultJemaatId = jemaat && jemaat.length > 0 ? String(jemaat[0].id) : '';
                    setFormData(prev => ({
                      ...prev,
                      petugas: [...(prev.petugas || []), { id: Date.now(), jabatan: '', jemaat_id: defaultJemaatId }]
                    }));
                  }}
                  className={`text-[11px] font-bold ${accentClasses.text} hover:opacity-80 transition-opacity flex items-center focus:outline-none`}
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Tambah Kategori Petugas
                </button>
              </div>

              {formData.petugas && formData.petugas.length > 0 ? (
                <div className="space-y-2">
                  {formData.petugas.map((officer, index) => (
                    <div key={officer.id || index} className="flex items-center gap-3 bg-stone-50 p-2 rounded-lg border border-stone-200/60">
                      {/* Nama Tugas / Jabatan */}
                      <input
                        type="text"
                        required
                        placeholder="Nama tugas (cth: Penyambut Jemaat)"
                        value={officer.jabatan}
                        onChange={(e) => {
                          const updated = [...formData.petugas];
                          updated[index].jabatan = e.target.value;
                          setFormData({ ...formData, petugas: updated });
                        }}
                        className="flex-1 min-w-0 px-2.5 py-1 border border-stone-200 rounded-md text-xs focus:outline-none focus:border-stone-450 bg-white"
                      />

                      {/* Dropdown Jemaat */}
                      <select
                        value={officer.jemaat_id}
                        onChange={(e) => {
                          const updated = [...formData.petugas];
                          updated[index].jemaat_id = e.target.value;
                          setFormData({ ...formData, petugas: updated });
                        }}
                        className="flex-1 min-w-0 px-2 py-1 border border-stone-200 rounded-md text-xs focus:outline-none focus:border-stone-450 bg-white"
                        required
                      >
                        <option value="">Pilih Jemaat</option>
                        {jemaat && jemaat.map(j => (
                          <option key={j.id} value={j.id}>
                            {j.nama} ({j.peran})
                          </option>
                        ))}
                      </select>

                      {/* Button Remove */}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.petugas.filter((_, i) => i !== index);
                          setFormData({ ...formData, petugas: updated });
                        }}
                        className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors focus:outline-none"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-stone-400 italic">Belum ada petugas ibadah ditambahkan.</p>
              )}
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
              {isEditMode ? 'Simpan Perubahan' : 'Jadwalkan Ibadah'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
