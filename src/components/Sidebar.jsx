import { 
  LayoutDashboard, 
  Church, 
  Users, 
  Calendar, 
  Megaphone, 
  Wallet, 
  HeartHandshake, 
  Settings, 
  X,
  Globe,
  Clock,
  ClipboardCheck
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen, accentClasses }) {
  const menuItems = [
    { id: 'landing', label: 'Halaman Publik', icon: Globe },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profil', label: 'Profil Gereja', icon: Church },
    { id: 'jemaat', label: 'Jemaat', icon: Users },
    { id: 'jadwal', label: 'Jadwal Ibadah', icon: Clock },
    { id: 'jadwal-petugas', label: 'Jadwal Petugas', icon: ClipboardCheck },
    { id: 'pengumuman', label: 'Pengumuman', icon: Megaphone },
    { id: 'event', label: 'Event Terdekat', icon: Calendar },
    { id: 'keuangan', label: 'Keuangan', icon: Wallet },
    { id: 'pelayanan', label: 'Pelayanan', icon: HeartHandshake },
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-stone-900/30 backdrop-blur-xs lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-40 flex flex-col w-64 bg-white border-r border-stone-200/80 transition-transform duration-200 ease-in-out
        lg:translate-x-0 lg:static lg:h-screen
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-stone-100 bg-white">
          <div className="flex items-center space-x-2.5">
            <div className={`p-1.5 rounded-lg text-white ${accentClasses.bgPrimary}`}>
              <Church className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-stone-900 leading-none">Kasih Karunia</h2>
              <span className="text-[10px] text-stone-400 font-medium tracking-wide uppercase">Admin Panel</span>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-50 lg:hidden"
            aria-label="Tutup menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Menu */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <div key={item.id}>
                {item.id === 'dashboard' && (
                  <div className="my-2 border-t border-stone-100" />
                )}
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false); // Close sidebar on mobile after selection
                  }}
                  className={`
                    w-full flex items-center px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group
                    ${isActive 
                      ? `${accentClasses.light} border` 
                      : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50'
                    }
                  `}
                >
                  <Icon className={`
                    w-[18px] h-[18px] mr-3 transition-colors
                    ${isActive ? accentClasses.text : 'text-stone-400 group-hover:text-stone-600'}
                  `} />
                  {item.label}
                </button>
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-stone-100 bg-stone-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-xs font-semibold text-stone-600">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-stone-700 truncate">Admin Gereja</p>
              <p className="text-[10px] text-stone-400 truncate">admin@kasihkarunia.org</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
