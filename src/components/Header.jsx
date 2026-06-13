import { Menu, Bell } from 'lucide-react';

export default function Header({ activeTab, setIsSidebarOpen }) {
  const getTabTitle = (tab) => {
    switch (tab) {
      case 'dashboard': return 'Dashboard';
      case 'profil': return 'Profil Gereja';
      case 'jemaat': return 'Data Jemaat';
      case 'jadwal': return 'Jadwal Ibadah';
      case 'jadwal-petugas': return 'Jadwal Petugas Ibadah';
      case 'pengumuman': return 'Pengumuman';
      case 'event': return 'Kegiatan & Event';
      case 'keuangan': return 'Laporan Keuangan';
      case 'pelayanan': return 'Pelayanan';
      case 'pengaturan': return 'Pengaturan';
      default: return 'Panel Admin';
    }
  };

  // Format date helper: Friday, 5 June 2026
  const getFormattedDate = () => {
    return 'Jumat, 5 Juni 2026';
  };

  return (
    <header className="h-16 bg-white border-b border-stone-200/80 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left side: Hamburger button + Title */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-50 hover:text-stone-800 lg:hidden transition-colors focus:outline-none"
          aria-label="Buka menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-base font-semibold text-stone-800 tracking-tight">
          {getTabTitle(activeTab)}
        </h1>
      </div>

      {/* Right side: Date, Notifications, Profile */}
      <div className="flex items-center space-x-4">
        {/* Current Date Display */}
        <span className="hidden sm:inline-block text-xs font-medium text-stone-400 bg-stone-50 border border-stone-200/50 px-3 py-1 rounded-full">
          {getFormattedDate()}
        </span>

        {/* Notifications mock button */}
        <button 
          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-50 relative transition-colors focus:outline-none"
          aria-label="Notifikasi"
        >
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>
      </div>
    </header>
  );
}
