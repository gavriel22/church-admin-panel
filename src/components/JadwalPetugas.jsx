import { useState, useContext } from 'react';
import { Plus, Edit, Trash2, HeartHandshake, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import { ChurchContext } from '../context/ChurchContext';
import Modal from './Modal';

export default function JadwalPetugas({ accentClasses }) {
  const { 
    jadwal, 
    jemaat,
    jadwalPetugas,
    addJadwalPetugas,
    updateJadwalPetugas,
    deleteJadwalPetugas
  } = useContext(ChurchContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedRosterId, setSelectedRosterId] = useState(null);

  const initialFormState = {
    jadwal_ibadah_id: (jadwal && jadwal.length > 0) ? String(jadwal[0].id) : '',
    tanggal: '',
    petugas: []
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setIsEditMode(true);
    setSelectedRosterId(item.id);
    setFormData({
      jadwal_ibadah_id: item.jadwal_ibadah_id ? String(item.jadwal_ibadah_id) : ((jadwal && jadwal.length > 0) ? String(jadwal[0].id) : ''),
      tanggal: item.tanggal || '',
      petugas: item.petugas || []
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = (id, label) => {
    const confirmed = window.confirm(`Apakah Anda yakin ingin menghapus roster petugas "${label}"?`);
    if (confirmed) {
      deleteJadwalPetugas(id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.jadwal_ibadah_id || !formData.tanggal) {
      alert('Mohon pilih jadwal ibadah rutin dan tanggal pelayanan.');
      return;
    }

    const rosterData = {
      id: isEditMode ? selectedRosterId : Date.now(),
      jadwal_ibadah_id: Number(formData.jadwal_ibadah_id),
      tanggal: formData.tanggal,
      petugas: formData.petugas
    };

    if (isEditMode) {
      updateJadwalPetugas(rosterData);
    } else {
      addJadwalPetugas(rosterData);
    }

    setFormData(initialFormState);
    handleCloseModal();
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs text-stone-400 font-medium">Manajemen Roster Mingguan</p>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight font-sans">Penugasan & Jadwal Petugas Ibadah</h2>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold shadow-xs ${accentClasses.bgPrimary} accent-transition focus:outline-none`}
        >
          <Plus className="w-4 h-4 mr-2" />
          Atur Petugas Baru
        </button>
      </div>

      {/* Roster Listing */}
      <div className="bg-white border border-stone-200/60 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-stone-50/75 border-b border-stone-200 text-stone-550 text-[10px] font-bold uppercase tracking-wider">
                <th className="px-6 py-3.5">Tanggal Ibadah</th>
                <th className="px-6 py-3.5">Detail Ibadah Rutin</th>
                <th className="px-6 py-3.5">Roster Petugas Pelayanan</th>
                <th className="px-6 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs">
              {jadwalPetugas && jadwalPetugas.length > 0 ? (
                jadwalPetugas.map((item) => {
                  const schedule = jadwal.find(j => String(j.id) === String(item.jadwal_ibadah_id));
                  const serviceName = schedule ? schedule.nama : 'Ibadah Tidak Diketahui';
                  const serviceTime = schedule ? `${schedule.hari}, ${schedule.waktu}` : '-';
                  const serviceLoc = schedule ? schedule.lokasi : '-';
                  const formattedDate = new Date(item.tanggal).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  });

                  return (
                    <tr key={item.id} className="hover:bg-stone-50/40 transition-colors">
                      {/* Tanggal Pelayanan */}
                      <td className="px-6 py-4 font-semibold text-stone-850">
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="w-3.5 h-3.5 text-stone-400" />
                          <span>{formattedDate}</span>
                        </div>
                      </td>

                      {/* Detail Ibadah */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="font-bold text-stone-900">{serviceName}</div>
                          <div className="text-[10px] text-stone-500 font-medium flex items-center space-x-3">
                            <span className="flex items-center"><Clock className="w-3 h-3 mr-1 text-stone-400" /> {serviceTime}</span>
                            <span className="flex items-center"><MapPin className="w-3 h-3 mr-1 text-stone-400" /> {serviceLoc}</span>
                          </div>
                        </div>
                      </td>

                      {/* Roster Petugas */}
                      <td className="px-6 py-4">
                        {item.petugas && item.petugas.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {item.petugas.map((p, idx) => {
                              const person = jemaat.find(j => String(j.id) === String(p.jemaat_id));
                              return (
                                <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200 text-[10px] font-semibold">
                                  <strong className="text-stone-500 mr-1">{p.jabatan}:</strong> {person ? person.nama : 'Tidak Diketahui'}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-stone-300 italic">Belum ada petugas ditentukan</span>
                        )}
                      </td>

                      {/* Action buttons */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1 rounded-lg text-stone-450 hover:text-stone-700 hover:bg-stone-50 border border-transparent hover:border-stone-200/60 transition-all focus:outline-none"
                            title="Edit Roster"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, `${serviceName} - ${formattedDate}`)}
                            className="p-1 rounded-lg text-stone-450 hover:text-red-650 hover:bg-red-50 border border-transparent hover:border-red-200/30 transition-all focus:outline-none"
                            title="Hapus Roster"
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
                  <td colSpan="4" className="px-6 py-12 text-center text-stone-400">
                    Belum ada roster petugas ibadah terdaftar. Silakan klik "Atur Petugas Baru" untuk menyusun jadwal.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ADD / EDIT ROSTER */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={isEditMode ? "Ubah Roster Petugas Ibadah" : "Atur Roster Petugas Ibadah Baru"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-stone-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pilih Jadwal Ibadah Rutin */}
            <div className="space-y-1">
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Jadwal Ibadah Rutin *</label>
              {jadwal && jadwal.length > 0 ? (
                <select
                  value={formData.jadwal_ibadah_id}
                  onChange={(e) => setFormData({ ...formData, jadwal_ibadah_id: e.target.value })}
                  className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-white"
                  required
                >
                  {jadwal.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nama} ({item.hari}, {item.waktu})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-[11px] text-red-500 bg-red-50 border border-red-200/50 p-2 rounded-lg leading-relaxed">
                  Belum ada jadwal ibadah rutin. Silakan buat di menu Jadwal Ibadah terlebih dahulu.
                </div>
              )}
            </div>

            {/* Tanggal Pelayanan */}
            <div className="space-y-1">
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Tanggal Pelayanan *</label>
              <input
                type="date"
                required
                value={formData.tanggal}
                onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-stone-50/50 focus:bg-white"
              />
            </div>

            {/* Dynamic Officers List */}
            <div className="space-y-2.5 md:col-span-2 border-t border-stone-150 pt-3">
              <div className="flex items-center justify-between">
                <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Daftar Petugas Pelayanan</label>
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
                      {/* Kategori Tugas */}
                      <input
                        type="text"
                        required
                        placeholder="Jabatan tugas (cth: WL, Singer)"
                        value={officer.jabatan}
                        onChange={(e) => {
                          const updated = [...formData.petugas];
                          updated[index].jabatan = e.target.value;
                          setFormData({ ...formData, petugas: updated });
                        }}
                        className="flex-1 min-w-0 px-2.5 py-1 border border-stone-200 rounded-md text-xs focus:outline-none focus:border-stone-400 bg-white"
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
              {isEditMode ? 'Simpan Perubahan' : 'Jadwalkan Roster'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
