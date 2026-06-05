import { useState } from 'react';
import { Megaphone, Calendar, Pin, Clock, MapPin, Plus, AlertCircle } from 'lucide-react';
import Modal from './Modal';

export default function JadwalPengumumanTab({ 
  pengumuman, 
  onAddPengumuman, 
  jadwal, 
  onAddJadwal, 
  accentClasses,
  externalOpenPengumumanModal,
  setExternalOpenPengumumanModal,
  externalOpenJadwalModal,
  setExternalOpenJadwalModal
}) {
  // Modal visibility states
  const [isPengumumanModalOpen, setIsPengumumanModalOpen] = useState(false);
  const [isJadwalModalOpen, setIsJadwalModalOpen] = useState(false);

  // Forms state
  const [pengumumanForm, setPengumumanForm] = useState({
    judul: '',
    deskripsi: '',
    tanggal: '',
    pinned: false
  });

  const [jadwalForm, setJadwalForm] = useState({
    nama: '',
    hari: 'Minggu',
    waktu: '',
    lokasi: '',
    deskripsi: ''
  });

  // Sort announcements so pinned ones come first, then sort by date descending
  const sortedPengumuman = [...pengumuman].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.tanggal) - new Date(a.tanggal);
  });

  const handleAddPengumumanSubmit = (e) => {
    e.preventDefault();
    if (!pengumumanForm.judul || !pengumumanForm.deskripsi || !pengumumanForm.tanggal) {
      alert('Mohon isi seluruh kolom pengumuman.');
      return;
    }
    onAddPengumuman({
      id: Date.now(),
      ...pengumumanForm
    });
    setPengumumanForm({
      judul: '',
      deskripsi: '',
      tanggal: '',
      pinned: false
    });
    setIsPengumumanModalOpen(false);
    if (setExternalOpenPengumumanModal) setExternalOpenPengumumanModal(false);
  };

  const handleAddJadwalSubmit = (e) => {
    e.preventDefault();
    if (!jadwalForm.nama || !jadwalForm.waktu || !jadwalForm.lokasi) {
      alert('Mohon isi nama, waktu, dan lokasi ibadah.');
      return;
    }
    onAddJadwal({
      id: Date.now(),
      ...jadwalForm
    });
    setJadwalForm({
      nama: '',
      hari: 'Minggu',
      waktu: '',
      lokasi: '',
      deskripsi: ''
    });
    setIsJadwalModalOpen(false);
    if (setExternalOpenJadwalModal) setExternalOpenJadwalModal(false);
  };

  // Sync external triggers from Dashboard
  if (externalOpenPengumumanModal && !isPengumumanModalOpen) {
    setIsPengumumanModalOpen(true);
  }
  const closePengumumanModal = () => {
    setIsPengumumanModalOpen(false);
    if (setExternalOpenPengumumanModal) setExternalOpenPengumumanModal(false);
  };

  if (externalOpenJadwalModal && !isJadwalModalOpen) {
    setIsJadwalModalOpen(true);
  }
  const closeJadwalModal = () => {
    setIsJadwalModalOpen(false);
    if (setExternalOpenJadwalModal) setExternalOpenJadwalModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Upper Grid Layout: 2 Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Announcements (Column Span 7) */}
        <section className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200/60 pb-3">
            <div className="flex items-center space-x-2">
              <Megaphone className="w-5 h-5 text-stone-500" />
              <h3 className="text-base font-bold text-stone-850 tracking-tight">Warta Jemaat & Pengumuman</h3>
            </div>
            <button
              onClick={() => setIsPengumumanModalOpen(true)}
              className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs ${accentClasses.light} border border-transparent hover:brightness-95 transition-all`}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Buat Pengumuman
            </button>
          </div>

          <div className="space-y-4">
            {sortedPengumuman.length > 0 ? (
              sortedPengumuman.map((item) => (
                <div 
                  key={item.id} 
                  className={`
                    p-4 bg-white border rounded-xl shadow-xs transition-all relative overflow-hidden
                    ${item.pinned ? 'border-amber-300 bg-amber-50/15' : 'border-stone-200/60'}
                  `}
                >
                  {/* Pinned background decoration line */}
                  {item.pinned && (
                    <div className="absolute top-0 left-0 bottom-0 w-1 bg-amber-500" />
                  )}

                  {/* Title & Badge */}
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-stone-900 leading-snug">{item.judul}</h4>
                    {item.pinned && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-850 border border-amber-200/50 uppercase tracking-wide">
                        <Pin className="w-2.5 h-2.5 mr-1 text-amber-600 fill-amber-600" /> Dipin / Penting
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-[11.5px] text-stone-600 mt-2 leading-relaxed">
                    {item.deskripsi}
                  </p>

                  {/* Footer metadata */}
                  <div className="flex items-center text-[10px] text-stone-400 font-semibold mt-3 pt-2.5 border-t border-stone-100">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    <span>Diterbitkan: {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 border border-dashed border-stone-200 rounded-xl text-center">
                <p className="text-xs text-stone-400">Belum ada pengumuman terdaftar.</p>
              </div>
            )}
          </div>
        </section>

        {/* Right Side: Schedules (Column Span 5) */}
        <section className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200/60 pb-3">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-stone-500" />
              <h3 className="text-base font-bold text-stone-850 tracking-tight">Jadwal Layanan Ibadah</h3>
            </div>
            <button
              onClick={() => setIsJalwalModalOpen(true)}
              className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs ${accentClasses.light} border border-transparent hover:brightness-95 transition-all`}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Atur Jadwal
            </button>
          </div>

          <div className="space-y-4">
            {jadwal.length > 0 ? (
              jadwal.map((item) => (
                <div key={item.id} className="p-4 bg-white border border-stone-200/60 rounded-xl shadow-xs space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-stone-900 leading-none">{item.nama}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${accentClasses.badge}`}>
                      {item.hari}
                    </span>
                  </div>
                  
                  {item.deskripsi && (
                    <p className="text-[11px] text-stone-550 leading-relaxed">
                      {item.deskripsi}
                    </p>
                  )}

                  <div className="space-y-1.5 pt-2 border-t border-stone-100 text-[10.5px] text-stone-500 font-semibold">
                    <div className="flex items-center">
                      <Clock className="w-3.5 h-3.5 text-stone-400 mr-1.5" />
                      <span>{item.waktu}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 mr-1.5" />
                      <span className="truncate">{item.lokasi}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 border border-dashed border-stone-200 rounded-xl text-center">
                <p className="text-xs text-stone-400">Belum ada jadwal ibadah terdaftar.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* MODAL: ADD PENGUMUMAN */}
      <Modal 
        isOpen={isPengumumanModalOpen} 
        onClose={closePengumumanModal} 
        title="Buat Pengumuman Baru"
      >
        <form onSubmit={handleAddPengumumanSubmit} className="space-y-4 text-stone-700">
          <div className="space-y-1">
            <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Judul Pengumuman *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Jadwal Penerimaan Donasi Bakti Sosial"
              value={pengumumanForm.judul}
              onChange={(e) => setPengumumanForm({ ...pengumumanForm, judul: e.target.value })}
              className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-stone-50/50 focus:bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Tanggal Publikasi *</label>
            <input
              type="date"
              required
              value={pengumumanForm.tanggal}
              onChange={(e) => setPengumumanForm({ ...pengumumanForm, tanggal: e.target.value })}
              className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-stone-50/50 focus:bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Deskripsi / Konten Pengumuman *</label>
            <textarea
              required
              rows="4"
              placeholder="Tuliskan detail pengumuman yang ingin disampaikan kepada jemaat..."
              value={pengumumanForm.deskripsi}
              onChange={(e) => setPengumumanForm({ ...pengumumanForm, deskripsi: e.target.value })}
              className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-stone-50/50 focus:bg-white resize-none"
            />
          </div>

          <div className="flex items-center space-x-2 py-1">
            <input
              type="checkbox"
              id="pinned"
              checked={pengumumanForm.pinned}
              onChange={(e) => setPengumumanForm({ ...pengumumanForm, pinned: e.target.checked })}
              className="rounded border-stone-300 text-amber-600 focus:ring-amber-500 h-4 w-4"
            />
            <label htmlFor="pinned" className="text-xs font-semibold text-stone-700 select-none flex items-center">
              <Pin className="w-3.5 h-3.5 text-amber-500 mr-1 fill-amber-500" /> Tandai sebagai penting (Pin di paling atas)
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={closePengumumanModal}
              className="px-4 py-2 border border-stone-250 hover:bg-stone-50 rounded-lg text-xs font-semibold text-stone-600 transition-colors focus:outline-none"
            >
              Batal
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg text-xs font-bold text-white shadow-xs ${accentClasses.bgPrimary} transition-colors focus:outline-none`}
            >
              Terbitkan Pengumuman
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: ADD JADWAL */}
      <Modal 
        isOpen={isJadwalModalOpen} 
        onClose={closeJadwalModal} 
        title="Atur Jadwal Ibadah Baru"
      >
        <form onSubmit={handleAddJadwalSubmit} className="space-y-4 text-stone-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 md:col-span-2">
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Nama Ibadah / Layanan *</label>
              <input
                type="text"
                required
                placeholder="Contoh: Ibadah Doa Malam Sabtuan"
                value={jadwalForm.nama}
                onChange={(e) => setJadwalForm({ ...jadwalForm, nama: e.target.value })}
                className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-stone-50/50 focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Hari *</label>
              <select
                value={jadwalForm.hari}
                onChange={(e) => setJadwalForm({ ...jadwalForm, hari: e.target.value })}
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
                placeholder="Contoh: 18:30 - 20:00 WIB"
                value={jadwalForm.waktu}
                onChange={(e) => setJadwalForm({ ...jadwalForm, waktu: e.target.value })}
                className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-stone-50/50 focus:bg-white"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Lokasi Pertemuan *</label>
              <input
                type="text"
                required
                placeholder="Contoh: Gedung Serbaguna Lantai 1 atau Zoom Meeting"
                value={jadwalForm.lokasi}
                onChange={(e) => setJadwalForm({ ...jadwalForm, lokasi: e.target.value })}
                className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-stone-50/50 focus:bg-white"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">Deskripsi Kegiatan</label>
              <textarea
                rows="3"
                placeholder="Deskripsi singkat mengenai ibadah atau kelompok sel..."
                value={jadwalForm.deskripsi}
                onChange={(e) => setJadwalForm({ ...jadwalForm, deskripsi: e.target.value })}
                className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-450 bg-stone-50/50 focus:bg-white resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={closeJadwalModal}
              className="px-4 py-2 border border-stone-250 hover:bg-stone-50 rounded-lg text-xs font-semibold text-stone-600 transition-colors focus:outline-none"
            >
              Batal
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg text-xs font-bold text-white shadow-xs ${accentClasses.bgPrimary} transition-colors focus:outline-none`}
            >
              Jadwalkan Ibadah
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
