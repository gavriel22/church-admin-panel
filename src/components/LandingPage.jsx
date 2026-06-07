import { useContext } from 'react';
import { 
  Church, 
  HeartHandshake, 
  ArrowRight, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ArrowUpRight,
  Quote
} from 'lucide-react';
import { ChurchContext } from '../context/ChurchContext';

export default function LandingPage({ 
  onNavigateToDashboard,
  accentClasses = {}
}) {
  const {
    profil,
    jemaat,
    jadwal,
    pengumuman,
    pelayanan,
    events
  } = useContext(ChurchContext);

  // Safe defaults if data is missing
  const namaGereja = profil.namaGereja || "Gereja Kasih Karunia";
  const tagline = profil.tagline || "Menyebarkan Kasih, Membangun Iman, Melayani Sesama";
  const deskripsi = profil.deskripsi || "";
  const alamat = profil.alamat || "";
  const telepon = profil.telepon || "";
  const email = profil.email || "";
  const visi = profil.visi || "";
  const misi = profil.misi || [];
  const sejarah = profil.sejarah || "";
  const tahunBerdiri = profil.tahunBerdiri || 2010;
  
  // Pastor Sidang details
  const namaGembala = profil.namaGembala || "Pdt. Dr. Samuel Widjaja";
  const pesanGembala = profil.pesanGembala || "Selamat datang di persekutuan kami.";
  const fotoGembala = profil.fotoGembala || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=500";

  // Calculate statistics dynamically
  const currentYear = new Date().getFullYear();
  const usiaGereja = currentYear - tahunBerdiri;
  const totalJemaatAktif = jemaat.filter(item => item.status === 'Aktif').length;

  // 1. Pelayanan Kami: Max 6 cards
  const limitedPelayanan = pelayanan.slice(0, 6);

  // 2. Pengumuman: Max 6 cards, prioritized by pinned === true, then by newest date
  const sortedPengumuman = [...pengumuman]
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.tanggal) - new Date(a.tanggal);
    })
    .slice(0, 6);

  // 3. Event Terdekat (New): Max 3-4 cards, filtered relative to June 7, 2026, sorted by closest upcoming date
  const systemToday = new Date("2026-06-07T00:00:00");
  const upcomingEvents = events
    .filter(event => {
      const eventDate = new Date(event.tanggal + "T00:00:00");
      return eventDate >= systemToday;
    })
    .sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal))
    .slice(0, 4);

  // Smooth scroll handler
  const handleScrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans selection:bg-stone-200 selection:text-stone-900 scroll-smooth">
      {/* 1. Navbar */}
      <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-stone-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo / Church Name */}
          <a href="#" className="flex items-center space-x-2.5 group" onClick={(e) => handleScrollToSection(e, 'hero')}>
            <div className={`p-1.5 rounded-lg text-white ${accentClasses.bgPrimary || 'bg-amber-600'}`}>
              <Church className="w-5 h-5" />
            </div>
            <span className="font-semibold text-stone-900 tracking-tight text-base group-hover:text-stone-700 transition-colors">
              {namaGereja}
            </span>
          </a>

          {/* Navigation links & CTA */}
          <div className="flex items-center space-x-8">
            <div className="hidden md:flex items-center space-x-6">
              <a 
                href="#tentang" 
                onClick={(e) => handleScrollToSection(e, 'tentang')}
                className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
              >
                Tentang
              </a>
              <a 
                href="#gembala" 
                onClick={(e) => handleScrollToSection(e, 'gembala')}
                className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
              >
                Gembala
              </a>
              <a 
                href="#jadwal" 
                onClick={(e) => handleScrollToSection(e, 'jadwal')}
                className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
              >
                Jadwal
              </a>
              <a 
                href="#pelayanan" 
                onClick={(e) => handleScrollToSection(e, 'pelayanan')}
                className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
              >
                Pelayanan
              </a>
              <a 
                href="#pengumuman" 
                onClick={(e) => handleScrollToSection(e, 'pengumuman')}
                className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
              >
                Pengumuman
              </a>
              {upcomingEvents.length > 0 && (
                <a 
                  href="#acara" 
                  onClick={(e) => handleScrollToSection(e, 'acara')}
                  className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
                >
                  Acara
                </a>
              )}
            </div>

            <button 
              onClick={onNavigateToDashboard}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 transition-all active:scale-[0.98] cursor-pointer"
            >
              <span>Dashboard Admin</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section id="hero" className="relative px-6 py-24 sm:py-32 overflow-hidden flex flex-col items-center justify-center text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border ${accentClasses.badge || 'bg-amber-50 text-amber-700 border-amber-200'}`}>
            Selamat Datang
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-stone-900 leading-tight">
            {namaGereja}
          </h1>
          <p className="text-lg text-stone-500 font-light max-w-xl mx-auto leading-relaxed">
            {tagline}
          </p>
          <div className="pt-4">
            <a 
              href="#jadwal"
              onClick={(e) => handleScrollToSection(e, 'jadwal')}
              className={`inline-flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-semibold tracking-wide transition-all active:scale-95 shadow-xs hover:shadow-md ${accentClasses.bgPrimary || 'bg-amber-600 hover:bg-amber-700 text-white'}`}
            >
              <span>Lihat Jadwal Ibadah</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* 3. Statistik Ringkas */}
      <section className="bg-white border-y border-stone-100 py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 gap-8 divide-x divide-stone-150">
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">{usiaGereja} <span className="text-lg font-normal text-stone-400">Tahun</span></p>
            <p className="text-xs font-medium uppercase tracking-wider text-stone-400 mt-2">Usia Gereja</p>
          </div>
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">{totalJemaatAktif} <span className="text-lg font-normal text-stone-400">Jemaat</span></p>
            <p className="text-xs font-medium uppercase tracking-wider text-stone-400 mt-2">Total Jemaat Aktif</p>
          </div>
        </div>
      </section>

      {/* 4. Tentang Kami */}
      <section id="tentang" className="max-w-5xl mx-auto px-6 py-20 sm:py-28 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-5 space-y-4">
            <span className={`text-[10px] font-bold tracking-widest uppercase ${accentClasses.text || 'text-amber-700'}`}>
              Sejarah Singkat
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
              Perjalanan Kami Dalam Kasih-Nya
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-stone-500 font-light leading-relaxed text-base">
              {sejarah}
            </p>
          </div>
        </div>

        <div className="border-t border-stone-200/60 pt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Visi */}
          <div className="space-y-4">
            <span className="text-[10px] font-bold tracking-widest uppercase text-stone-400">
              Visi Kami
            </span>
            <h3 className="text-lg font-bold text-stone-900">
              Tujuan Akhir Pelayanan
            </h3>
            <p className="text-stone-500 font-light leading-relaxed text-sm">
              {visi}
            </p>
          </div>

          {/* Misi */}
          <div className="space-y-4">
            <span className="text-[10px] font-bold tracking-widest uppercase text-stone-400">
              Misi Kami
            </span>
            <h3 className="text-lg font-bold text-stone-900">
              Langkah Nyata Melayani
            </h3>
            <ul className="space-y-3.5">
              {misi.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-stone-500 font-light text-sm">
                  <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-semibold mt-0.5 ${accentClasses.light || 'bg-amber-50 text-amber-800'}`}>
                    {idx + 1}
                  </span>
                  <span className="flex-1 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 5. Profil Gembala Sidang (New Section) */}
      <section id="gembala" className="bg-white border-y border-stone-100 py-20 sm:py-28 px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className={`text-[10px] font-bold tracking-widest uppercase ${accentClasses.text || 'text-amber-700'}`}>
              Kepemimpinan Rohani
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
              Gembala Sidang Kami
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
            {/* Foto Gembala */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative p-2 bg-stone-100 rounded-2xl border border-stone-200/50 shadow-xs max-w-xs md:max-w-none">
                <img 
                  src={fotoGembala} 
                  alt={namaGembala} 
                  className="rounded-xl object-cover aspect-[4/5] w-full max-h-[380px]"
                />
              </div>
            </div>

            {/* Pesan Gembala */}
            <div className="md:col-span-7 space-y-6">
              <div className="relative">
                <Quote className="w-12 h-12 text-stone-100 absolute -top-5 -left-4 -z-10" />
                <p className="text-stone-600 font-light text-base leading-relaxed italic z-10 relative">
                  "{pesanGembala}"
                </p>
              </div>
              <div className="pt-4 border-t border-stone-100">
                <h4 className="font-bold text-stone-900 text-base">{namaGembala}</h4>
                <p className="text-xs text-stone-400 font-medium tracking-wide mt-0.5">Gembala Sidang {namaGereja}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Jadwal Ibadah (No Limitation) */}
      <section id="jadwal" className="max-w-5xl mx-auto py-20 sm:py-28 px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className={`text-[10px] font-bold tracking-widest uppercase ${accentClasses.text || 'text-amber-700'}`}>
            Jadwal Ibadah
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
            Mari Beribadah Bersama Kami
          </h2>
          <p className="text-stone-400 font-light text-sm">
            Kami menyambut Anda untuk datang bersekutu dan memuliakan Tuhan dalam rangkaian ibadah rutin kami.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {jadwal.map((item) => (
            <div 
              key={item.id}
              className="border border-stone-200/80 bg-white rounded-xl p-6 hover:border-stone-300 transition-all hover:shadow-xs flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-semibold border ${accentClasses.badge || 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                    {item.hari}
                  </span>
                  <span className="text-xs text-stone-400 flex items-center space-x-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>{item.waktu}</span>
                  </span>
                </div>
                <h3 className="font-bold text-stone-900 text-base">
                  {item.nama}
                </h3>
                <p className="text-stone-400 font-light text-xs leading-relaxed">
                  {item.deskripsi}
                </p>
              </div>
              <div className="pt-3 border-t border-stone-100 text-stone-500 text-xs flex items-start space-x-1.5">
                <MapPin className="w-3.5 h-3.5 mt-0.5 text-stone-400 shrink-0" />
                <span className="font-light">{item.lokasi}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Pelayanan Kami (Max 6 Cards) */}
      <section id="pelayanan" className="bg-white border-y border-stone-100 py-20 sm:py-28 px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className={`text-[10px] font-bold tracking-widest uppercase ${accentClasses.text || 'text-amber-700'}`}>
            Pelayanan Kami
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
            Divisi Pelayanan Gereja
          </h2>
          <p className="text-stone-400 font-light text-sm">
            Temukan tempat Anda untuk bertumbuh, berbagi kasih, dan melayani sesama melalui berbagai wadah pelayanan kami.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {limitedPelayanan.map((item) => (
            <div 
              key={item.id}
              className="border border-stone-200/60 rounded-xl p-6 bg-white hover:border-stone-400 transition-all duration-200 space-y-4"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${accentClasses.light || 'bg-amber-50 text-amber-700'}`}>
                  <HeartHandshake className="w-4.5 h-4.5" />
                </div>
                <h3 className="font-bold text-stone-900 text-base">
                  {item.nama}
                </h3>
              </div>
              <p className="text-stone-400 font-light text-xs leading-relaxed min-h-[40px]">
                {item.deskripsi}
              </p>
              {item.pertemuan && (
                <div className="pt-3 border-t border-stone-100 text-stone-400 text-[11px] font-medium flex items-center space-x-1.5">
                  <Clock className="w-3 h-3" />
                  <span>{item.pertemuan}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 8. Pengumuman Terdekat (Max 6 Cards, Pinned First) */}
      <section id="pengumuman" className="max-w-5xl mx-auto py-20 sm:py-28 px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className={`text-[10px] font-bold tracking-widest uppercase ${accentClasses.text || 'text-amber-700'}`}>
            Pengumuman
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
            Warta & Kabar Jemaat
          </h2>
          <p className="text-stone-400 font-light text-sm">
            Ikuti informasi terbaru mengenai warta jemaat dan agenda penting pelayanan gereja.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPengumuman.map((item) => {
            const formattedDate = new Date(item.tanggal).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            });
            return (
              <div 
                key={item.id}
                className={`border rounded-xl p-6 hover:border-stone-300 transition-all hover:shadow-xs flex flex-col justify-between space-y-4 ${
                  item.pinned ? 'border-amber-300 bg-amber-50/5' : 'border-stone-200/80 bg-white'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider">
                      {formattedDate}
                    </span>
                    {item.pinned && (
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${accentClasses.badge || 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                        PENTING
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-stone-900 text-base leading-snug">
                    {item.judul}
                  </h3>
                  <p className="text-stone-400 font-light text-xs leading-relaxed">
                    {item.deskripsi}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. Event Terdekat (New Section - Max 4 Cards, Chronological, Upcoming only) */}
      {upcomingEvents.length > 0 && (
        <section id="acara" className="bg-white border-y border-stone-100 py-20 sm:py-28 px-6 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className={`text-[10px] font-bold tracking-widest uppercase ${accentClasses.text || 'text-amber-700'}`}>
              Agenda Acara
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
              Kegiatan & Acara Mendatang
            </h2>
            <p className="text-stone-400 font-light text-sm">
              Pastikan Anda mencatat tanggalnya dan hadir dalam kebersamaan persekutuan acara kami.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {upcomingEvents.map((item) => {
              const formattedDate = new Date(item.tanggal).toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              });
              return (
                <div 
                  key={item.id}
                  className="border border-stone-200/60 rounded-xl p-6 hover:shadow-xs transition-all flex flex-col justify-between space-y-4 bg-stone-50/30"
                >
                  <div className="space-y-3">
                    <span className="text-[10.5px] font-bold text-stone-400 uppercase tracking-wider block">
                      {formattedDate}
                    </span>
                    <h3 className="font-bold text-stone-900 text-base">
                      {item.nama}
                    </h3>
                    <p className="text-stone-450 font-light text-xs leading-relaxed">
                      {item.deskripsi}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-4 mt-4 border-t border-stone-200/50 text-[10.5px] text-stone-550 font-semibold">
                    <div className="flex items-center">
                      <Clock className="w-3.5 h-3.5 text-stone-400 mr-2" />
                      <span>Waktu: {item.waktu}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 mr-2" />
                      <span>Lokasi: {item.lokasi}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 10. Footer */}
      <footer className="bg-stone-900 text-stone-400 py-16 px-6 border-t border-stone-850">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-12 border-b border-stone-800">
          {/* Column 1: Logo & Tagline */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className={`p-1.5 rounded-lg text-white ${accentClasses.bgPrimary || 'bg-amber-600'}`}>
                <Church className="w-5 h-5" />
              </div>
              <span className="font-semibold text-white tracking-tight text-base">
                {namaGereja}
              </span>
            </div>
            <p className="text-xs font-light text-stone-400 leading-relaxed max-w-sm">
              {deskripsi || tagline}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Tautan Langsung
            </h4>
            <ul className="space-y-2.5 text-xs font-light">
              <li>
                <a href="#tentang" onClick={(e) => handleScrollToSection(e, 'tentang')} className="hover:text-white transition-colors">Tentang Kami</a>
              </li>
              <li>
                <a href="#gembala" onClick={(e) => handleScrollToSection(e, 'gembala')} className="hover:text-white transition-colors">Gembala Sidang</a>
              </li>
              <li>
                <a href="#jadwal" onClick={(e) => handleScrollToSection(e, 'jadwal')} className="hover:text-white transition-colors">Jadwal Ibadah</a>
              </li>
              <li>
                <a href="#pelayanan" onClick={(e) => handleScrollToSection(e, 'pelayanan')} className="hover:text-white transition-colors">Pelayanan Kami</a>
              </li>
              <li>
                <a href="#pengumuman" onClick={(e) => handleScrollToSection(e, 'pengumuman')} className="hover:text-white transition-colors">Pengumuman</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Kontak & Alamat
            </h4>
            <ul className="space-y-3 text-xs font-light">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{alamat}</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-stone-500 shrink-0" />
                <span>{telepon}</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-stone-500 shrink-0" />
                <span>{email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="max-w-6xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-light space-y-4 sm:space-y-0 text-stone-500">
          <p>© {currentYear} {namaGereja}. Hak Cipta Dilindungi Undang-Undang.</p>
          <button 
            onClick={onNavigateToDashboard}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Dashboard Admin
          </button>
        </div>
      </footer>
    </div>
  );
}
