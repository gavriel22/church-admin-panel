import { useState, useMemo } from 'react';
import { 
  Users, 
  HeartHandshake, 
  Wallet, 
  Plus, 
  Megaphone, 
  Calendar,
  UserCheck,
  Home
} from 'lucide-react';

export default function DashboardTab({ 
  jemaat, 
  pelayanan, 
  keuangan, 
  jadwal,
  events = [],
  onQuickAction, 
  accentClasses 
}) {
  // Birthday Filter State and Helpers
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().getMonth());
  const namaBulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  const birthdayJemaat = jemaat.filter(item => {
    if (!item.tanggal_lahir) return false;
    const birthDate = new Date(item.tanggal_lahir);
    return birthDate.getMonth() === selectedMonth;
  });

  const [calendarMonth, setCalendarMonth] = useState(() => new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(() => new Date().getFullYear());
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(null);

  const handlePrevMonth = () => {
    setSelectedCalendarDay(null);
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(prev => prev - 1);
    } else {
      setCalendarMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    setSelectedCalendarDay(null);
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(prev => prev + 1);
    } else {
      setCalendarMonth(prev => prev + 1);
    }
  };

  const calendarCells = useMemo(() => {
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const firstDayIndex = new Date(calendarYear, calendarMonth, 1).getDay();
    const cells = [];
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(d);
    }
    return cells;
  }, [calendarMonth, calendarYear]);

  const getEventsForDay = (day) => {
    if (!day) return [];
    const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return (events || []).filter(e => e.tanggal === dateStr);
  };

  const eventsInCalendarMonth = useMemo(() => {
    return (events || []).filter(item => {
      if (!item.tanggal) return false;
      const eventDate = new Date(item.tanggal);
      return eventDate.getMonth() === calendarMonth && eventDate.getFullYear() === calendarYear;
    });
  }, [events, calendarMonth, calendarYear]);

  const getAgeToReach = (birthDateString) => {
    if (!birthDateString) return 0;
    const birthYear = new Date(birthDateString).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  };

  // Calculate demographics
  const totalJemaat = jemaat.length;
  const totalPria = jemaat.filter(j => j.jenis_kelamin === 'Laki-laki').length;
  const totalWanita = jemaat.filter(j => j.jenis_kelamin === 'Perempuan').length;
  
  const totalJemaatAktif = jemaat.filter(item => item.status === 'Aktif').length;
  const totalKK = new Set(jemaat.filter(item => item.no_kk && item.no_kk !== '-').map(item => item.no_kk)).size;
  const totalLakiLaki = jemaat.filter(item => item.jenis_kelamin === 'Laki-laki' && item.status === 'Aktif').length;
  const totalPerempuan = jemaat.filter(item => item.jenis_kelamin === 'Perempuan' && item.status === 'Aktif').length;

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

      {/* Barisan Card Ringkasan Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Jemaat Aktif */}
        <div className="bg-white border border-stone-200/60 p-5 rounded-xl flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Jemaat Aktif</span>
            <p className="text-2xl font-bold text-stone-900">{totalJemaatAktif} Jiwa</p>
            <span className="text-[11px] text-stone-400 block font-light">Status terdaftar aktif</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Jumlah Kartu Keluarga */}
        <div className="bg-white border border-stone-200/60 p-5 rounded-xl flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Kartu Keluarga</span>
            <p className="text-2xl font-bold text-stone-900">{totalKK} KK</p>
            <span className="text-[11px] text-stone-400 block font-light">KK terdaftar unik</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Home className="w-6 h-6" />
          </div>
        </div>

        {/* Total Laki-laki */}
        <div className="bg-white border border-stone-200/60 p-5 rounded-xl flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Jemaat Pria</span>
            <p className="text-2xl font-bold text-stone-900">{totalLakiLaki} Jiwa</p>
            <span className="text-[11px] text-stone-400 block font-light">Laki-laki aktif</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Users className="w-6 h-6 text-sky-600" />
          </div>
        </div>

        {/* Total Perempuan */}
        <div className="bg-white border border-stone-200/60 p-5 rounded-xl flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Jemaat Wanita</span>
            <p className="text-2xl font-bold text-stone-900">{totalPerempuan} Jiwa</p>
            <span className="text-[11px] text-stone-400 block font-light">Perempuan aktif</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-650 flex items-center justify-center">
            <Users className="w-6 h-6 text-pink-500" />
          </div>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
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

        {/* Kalender Event Interaktif */}
        <div className="bg-white border border-stone-200/60 p-5 rounded-xl flex flex-col justify-between shadow-xs">
          <div className="space-y-4">
            {/* Header Kalender */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="text-sm font-semibold text-stone-850 tracking-tight">Kalender Event</h3>
              <div className="flex items-center space-x-2 bg-stone-50 border border-stone-200/60 px-2 py-0.5 rounded-lg">
                <button
                  onClick={handlePrevMonth}
                  className="p-1 hover:bg-stone-200/60 rounded text-stone-500 hover:text-stone-800 transition-colors focus:outline-none font-bold"
                  title="Bulan Sebelumnya"
                >
                  &larr;
                </button>
                <span className="text-[10.5px] font-bold text-stone-700 select-none min-w-[75px] text-center uppercase tracking-wide">
                  {namaBulan[calendarMonth]} {calendarYear}
                </span>
                <button
                  onClick={handleNextMonth}
                  className="p-1 hover:bg-stone-200/60 rounded text-stone-500 hover:text-stone-800 transition-colors focus:outline-none font-bold"
                  title="Bulan Berikutnya"
                >
                  &rarr;
                </button>
              </div>
            </div>

            {/* Grid Kalender */}
            <div className="space-y-1 my-1">
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d) => (
                  <span key={d} className="py-1">{d}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarCells.map((day, idx) => {
                  if (day === null) {
                    return <div key={`empty-${idx}`} className="aspect-square" />;
                  }

                  const dayEvents = getEventsForDay(day);
                  const hasEvents = dayEvents.length > 0;
                  const isSelected = selectedCalendarDay === day;
                  
                  // Today logic (June 13, 2026)
                  const isToday = day === 13 && calendarMonth === 5 && calendarYear === 2026;

                  return (
                    <button
                      key={`day-${day}`}
                      onClick={() => {
                        setSelectedCalendarDay(prev => prev === day ? null : day);
                      }}
                      className={`aspect-square rounded-full flex flex-col items-center justify-center relative text-xs transition-all focus:outline-none ${
                        isSelected
                          ? `${accentClasses.bgPrimary} font-bold shadow-xs text-white`
                          : hasEvents
                            ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-250 font-bold'
                            : 'hover:bg-stone-100 text-stone-700'
                      } ${isToday && !isSelected ? 'ring-1 ring-stone-900 font-bold' : ''}`}
                    >
                      <span>{day}</span>
                      {hasEvents && !isSelected && (
                        <span className="absolute bottom-1 w-1 h-1 bg-amber-500 rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* List Event Terkait */}
            <div className="border-t border-stone-100 pt-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-bold text-stone-450 uppercase tracking-wider">
                  {selectedCalendarDay 
                    ? `Event Tanggal ${selectedCalendarDay} ${namaBulan[calendarMonth]}` 
                    : `Semua Event Bulan Ini`}
                </h4>
                {selectedCalendarDay && (
                  <button
                    onClick={() => setSelectedCalendarDay(null)}
                    className="text-[9px] font-semibold text-stone-400 hover:text-stone-600 focus:outline-none"
                  >
                    Reset Filter
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                {(() => {
                  const displayList = selectedCalendarDay 
                    ? getEventsForDay(selectedCalendarDay) 
                    : eventsInCalendarMonth;

                  if (displayList.length === 0) {
                    return (
                      <div className="py-4 text-center bg-stone-50/20 rounded-lg border border-dashed border-stone-200/50">
                        <p className="text-[10.5px] text-stone-450 italic">
                          {selectedCalendarDay 
                            ? 'Tidak ada kegiatan pada tanggal ini.' 
                            : 'Tidak ada kegiatan di bulan ini.'}
                        </p>
                      </div>
                    );
                  }

                  return displayList.map((event) => (
                    <div key={event.id} className="p-2 border border-stone-100 rounded-lg bg-stone-50/50 flex flex-col space-y-1 font-sans">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-stone-850 truncate">{event.nama}</span>
                        <span className="text-[9.5px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.25 rounded whitespace-nowrap">
                          {new Date(event.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[9.5px] text-stone-400 font-medium">
                        <span>{event.waktu}</span>
                        <span className="truncate max-w-[120px]">{event.lokasi}</span>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
          <div className="border-t border-stone-100 pt-3.5 mt-3 text-center">
            <span className="text-[10px] text-stone-400 font-medium">
              Gunakan panah navigasi untuk melihat agenda bulan depan/lainnya
            </span>
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

      {/* Widget Ulang Tahun Bulanan */}
      <div className="bg-white border border-stone-200/60 p-5 rounded-xl flex flex-col shadow-xs">
        <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-2.5">
          <div className="flex items-center space-x-3">
            <h3 className="text-sm font-semibold text-stone-850 tracking-tight">Daftar Ulang Tahun Jemaat</h3>
            <div className="flex items-center space-x-1.5 bg-stone-50 px-2 py-0.5 rounded border border-stone-200/60">
              <span className="text-[10px] text-stone-400 font-bold uppercase">Bulan:</span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="py-0.5 px-1 border-transparent rounded text-[11px] bg-transparent text-stone-700 font-semibold focus:outline-none focus:ring-0 cursor-pointer"
              >
                {namaBulan.map((name, index) => (
                  <option key={index} value={index}>{name}</option>
                ))}
              </select>
            </div>
          </div>
          <span className="text-[10.5px] font-bold text-stone-400 uppercase tracking-wide bg-stone-50 px-2 py-0.5 rounded border border-stone-200/40">
            {birthdayJemaat.length} Jemaat
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {birthdayJemaat.length > 0 ? (
            birthdayJemaat.map((item) => {
              const age = getAgeToReach(item.tanggal_lahir);
              const formattedBirth = new Date(item.tanggal_lahir).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long'
              });
              return (
                <div key={item.id} className="p-3 border border-stone-100 rounded-lg bg-stone-50/40 flex items-center justify-between hover:border-stone-250 transition-colors">
                  <div>
                    <h4 className="text-xs font-bold text-stone-850">{item.nama}</h4>
                    <p className="text-[10px] text-stone-400 font-medium mt-0.5">{formattedBirth}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/40 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      Akan {age} Thn
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-8 text-center bg-stone-50/20 rounded-lg border border-dashed border-stone-200/50">
              <p className="text-xs text-stone-400 italic">Tidak ada jemaat yang berulang tahun di bulan ini.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
