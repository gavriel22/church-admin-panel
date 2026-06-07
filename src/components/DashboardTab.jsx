import { 
  Users, 
  HeartHandshake, 
  Wallet, 
  Plus, 
  Megaphone, 
  Calendar 
} from 'lucide-react';

export default function DashboardTab({ 
  jemaat, 
  pelayanan, 
  keuangan, 
  jadwal,
  onQuickAction, 
  accentClasses 
}) {
  // Calculate demographics
  const totalJemaat = jemaat.length;
  const totalPria = jemaat.filter(j => j.jenis_kelamin === 'Laki-laki').length;
  const totalWanita = jemaat.filter(j => j.jenis_kelamin === 'Perempuan').length;
  
  const pctPria = totalJemaat > 0 ? Math.round((totalPria / totalJemaat) * 100) : 0;
  const pctWanita = totalJemaat > 0 ? Math.round((totalWanita / totalJemaat) * 100) : 0;

  // Format currency helper
  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Helper to determine upcoming events in the next 7 days (June 5, 2026 to June 12, 2026)
  // Let's map weekdays to actual dates relative to Friday, June 5, 2026:
  // Friday, June 5 (Today)
  // Saturday, June 6 -> Ibadah Pemuda
  // Sunday, June 7 -> Ibadah Raya Pagi, Sekolah Minggu
  // Friday, June 12
  const getUpcomingEvents = () => {
    const events = [];
    jadwal.forEach(item => {
      if (item.hari === 'Sabtu') {
        events.push({
          ...item,
          tanggalFormatted: 'Sabtu, 6 Juni 2026',
          daysLeft: 1
        });
      } else if (item.hari === 'Minggu') {
        events.push({
          ...item,
          tanggalFormatted: 'Minggu, 7 Juni 2026',
          daysLeft: 2
        });
      }
    });
    // Sort by days left
    return events.sort((a, b) => a.daysLeft - b.daysLeft);
  };

  const upcomingEvents = getUpcomingEvents();

  return (
    <div className="space-y-6">
      {/* Welcome Hero */}
      <div className="bg-white border border-stone-200/60 p-6 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">
            Selamat datang di panel admin Gereja Kasih Karunia
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Pantau dan kelola data jemaat, pelayanan, keuangan, serta warta kegiatan gereja dalam satu dashboard terintegrasi.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card Jemaat */}
        <div className="bg-white border border-stone-200/60 p-5 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Total Jemaat</span>
            <p className="text-2xl font-bold text-stone-900">{totalJemaat} Jiwa</p>
            <span className="text-[11px] text-stone-400 block">Jemaat aktif terdaftar</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card Pelayanan */}
        <div className="bg-white border border-stone-200/60 p-5 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Divisi Pelayanan</span>
            <p className="text-2xl font-bold text-stone-900">{pelayanan.length} Tim</p>
            <span className="text-[11px] text-stone-400 block">Komunitas aktif</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <HeartHandshake className="w-6 h-6" />
          </div>
        </div>

        {/* Card Keuangan */}
        <div className="bg-white border border-stone-200/60 p-5 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Kas Keuangan</span>
            <p className="text-xl font-bold text-stone-900">{formatRupiah(keuangan.saldo)}</p>
            <span className="text-[11px] text-stone-400 block">Saldo kas saat ini</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-stone-200/60 p-5 rounded-xl">
        <h3 className="text-sm font-semibold text-stone-800 tracking-tight mb-4">Aksi Cepat</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onQuickAction('jemaat-add')}
            className="flex items-center justify-between p-3.5 border border-stone-200/80 hover:border-stone-300 rounded-lg text-left transition-all hover:bg-stone-50 group focus:outline-none"
          >
            <div>
              <p className="text-xs font-semibold text-stone-800">Tambah Jemaat</p>
              <span className="text-[10px] text-stone-400 block mt-0.5">Form jemaat baru</span>
            </div>
            <div className={`p-1.5 rounded-md text-white ${accentClasses.bgPrimary} opacity-90 group-hover:opacity-100 transition-opacity`}>
              <Plus className="w-3.5 h-3.5" />
            </div>
          </button>

          <button
            onClick={() => onQuickAction('pengumuman-add')}
            className="flex items-center justify-between p-3.5 border border-stone-200/80 hover:border-stone-300 rounded-lg text-left transition-all hover:bg-stone-50 group focus:outline-none"
          >
            <div>
              <p className="text-xs font-semibold text-stone-800">Buat Pengumuman</p>
              <span className="text-[10px] text-stone-400 block mt-0.5">Sebarkan warta jemaat</span>
            </div>
            <div className={`p-1.5 rounded-md text-white ${accentClasses.bgPrimary} opacity-90 group-hover:opacity-100 transition-opacity`}>
              <Megaphone className="w-3.5 h-3.5" />
            </div>
          </button>

          <button
            onClick={() => onQuickAction('keuangan-add')}
            className="flex items-center justify-between p-3.5 border border-stone-200/80 hover:border-stone-300 rounded-lg text-left transition-all hover:bg-stone-50 group focus:outline-none"
          >
            <div>
              <p className="text-xs font-semibold text-stone-800">Catat Persembahan</p>
              <span className="text-[10px] text-stone-400 block mt-0.5">Pemasukan & persembahan</span>
            </div>
            <div className={`p-1.5 rounded-md text-white ${accentClasses.bgPrimary} opacity-90 group-hover:opacity-100 transition-opacity`}>
              <Wallet className="w-3.5 h-3.5" />
            </div>
          </button>

          <button
            onClick={() => onQuickAction('jadwal-add')}
            className="flex items-center justify-between p-3.5 border border-stone-200/80 hover:border-stone-300 rounded-lg text-left transition-all hover:bg-stone-50 group focus:outline-none"
          >
            <div>
              <p className="text-xs font-semibold text-stone-800">Atur Jadwal</p>
              <span className="text-[10px] text-stone-400 block mt-0.5">Penjadwalan ibadah baru</span>
            </div>
            <div className={`p-1.5 rounded-md text-white ${accentClasses.bgPrimary} opacity-90 group-hover:opacity-100 transition-opacity`}>
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      </div>

      {/* Grid: Events & Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Reminder Kegiatan Terdekat */}
        <div className="bg-white border border-stone-200/60 p-5 rounded-xl flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-2">
            <h3 className="text-sm font-semibold text-stone-800 tracking-tight">Kegiatan Terdekat (7 Hari ke Depan)</h3>
            <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/45 uppercase tracking-wide">
              Juni 2026
            </span>
          </div>

          <div className="flex-1 space-y-3.5">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div key={event.id} className="p-3 border border-stone-100 rounded-lg bg-stone-50/50 flex items-start gap-3">
                  <div className="p-2 bg-white rounded-md border border-stone-200/50 text-stone-500 mt-0.5">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-stone-800 truncate">{event.nama}</h4>
                      <span className="text-[10px] font-medium text-stone-400 whitespace-nowrap">{event.waktu}</span>
                    </div>
                    <p className="text-[10.5px] text-stone-500 mt-0.5 leading-relaxed truncate">{event.deskripsi}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[10px] text-stone-400">{event.lokasi}</span>
                      <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-sm">
                        {event.tanggalFormatted}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-center p-8">
                <p className="text-xs text-stone-400">Tidak ada jadwal ibadah dalam 7 hari ke depan.</p>
              </div>
            )}
          </div>
        </div>

        {/* Grafik Demografi */}
        <div className="bg-white border border-stone-200/60 p-5 rounded-xl flex flex-col justify-between">
          <div className="mb-4 border-b border-stone-100 pb-2">
            <h3 className="text-sm font-semibold text-stone-800 tracking-tight font-sans">Demografi Jemaat</h3>
          </div>

          <div className="space-y-6 my-auto py-2">
            {/* Legend / Metrics */}
            <div className="flex justify-around items-center text-center">
              <div>
                <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Laki-laki (Pria)</p>
                <p className="text-2xl font-bold text-stone-850 mt-1">{totalPria} <span className="text-xs font-normal text-stone-400">Jiwa</span></p>
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/50 mt-1.5 inline-block">
                  {pctPria}%
                </span>
              </div>
              
              <div className="h-10 w-px bg-stone-150" />

              <div>
                <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Perempuan (Wanita)</p>
                <p className="text-2xl font-bold text-stone-850 mt-1">{totalWanita} <span className="text-xs font-normal text-stone-400">Jiwa</span></p>
                <span className="text-xs font-medium text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-200/50 mt-1.5 inline-block">
                  {pctWanita}%
                </span>
              </div>
            </div>

            {/* Elegant horizontal representation bar */}
            <div className="space-y-2">
              <div className="h-5 w-full bg-stone-100 rounded-full overflow-hidden flex">
                <div 
                  style={{ width: `${pctPria}%` }} 
                  className="bg-blue-500 accent-transition" 
                  title={`Pria: ${pctPria}%`}
                />
                <div 
                  style={{ width: `${pctWanita}%` }} 
                  className="bg-pink-400 accent-transition" 
                  title={`Wanita: ${pctWanita}%`}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-stone-400 font-semibold px-0.5">
                <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-blue-500 mr-1.5" /> Pria</span>
                <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-pink-400 mr-1.5" /> Wanita</span>
              </div>
            </div>
          </div>

          <div className="border-t border-stone-100 pt-3 mt-4 text-center">
            <span className="text-[10.5px] text-stone-400 font-medium">
              Diperbarui otomatis berdasarkan database registrasi jemaat
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
