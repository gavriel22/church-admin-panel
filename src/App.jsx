import { useState, useContext } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardTab from './components/DashboardTab';
import DataJemaat from './components/DataJemaat';
import ProfilGerejaTab from './components/ProfilGerejaTab';
import JadwalTab from './components/JadwalTab';
import PengumumanTab from './components/PengumumanTab';
import EventTab from './components/EventTab';
import PelayananTab from './components/PelayananTab';
import KeuanganTab from './components/KeuanganTab';
import PengaturanTab from './components/PengaturanTab';
import LandingPage from './components/LandingPage';
import JadwalPetugas from './components/JadwalPetugas';
import { ChurchContext } from './context/ChurchContext';

export default function App() {
  const {
    profil,
    jemaat,
    pelayanan,
    keuangan,
    jadwal,
    saveProfil,
    addJemaat,
    updateJemaat,
    deleteJemaat,
    resetDatabase
  } = useContext(ChurchContext);

  // Navigation & Menu Drawer States
  const [activeTab, setActiveTab] = useState('landing');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [accentColor, setAccentColor] = useState('amber');

  // Quick Action Modal Trigger States
  const [quickActionJemaat, setQuickActionJemaat] = useState(false);
  const [quickActionPengumuman, setQuickActionPengumuman] = useState(false);
  const [quickActionJadwal, setQuickActionJadwal] = useState(false);
  const [quickActionKeuangan, setQuickActionKeuangan] = useState(false);

  // Helper mapping to generate color theme accent classes dynamically
  const getAccentClasses = (color) => {
    switch (color) {
      case 'emerald':
        return {
          bgPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-white',
          text: 'text-emerald-700',
          light: 'bg-emerald-50 text-emerald-800 border-emerald-200/50',
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/55',
          ring: 'focus:ring-emerald-500'
        };
      case 'indigo':
        return {
          bgPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
          text: 'text-indigo-700',
          light: 'bg-indigo-50 text-indigo-800 border-indigo-200/50',
          badge: 'bg-indigo-50 text-indigo-700 border-indigo-200/55',
          ring: 'focus:ring-indigo-500'
        };
      case 'slate':
        return {
          bgPrimary: 'bg-slate-700 hover:bg-slate-800 text-white',
          text: 'text-slate-700',
          light: 'bg-slate-100 text-slate-800 border-slate-200/50',
          badge: 'bg-slate-50 text-slate-700 border-slate-200/55',
          ring: 'focus:ring-slate-500'
        };
      case 'amber':
      default:
        return {
          bgPrimary: 'bg-amber-600 hover:bg-amber-700 text-white',
          text: 'text-amber-700',
          light: 'bg-amber-50 text-amber-800 border-amber-200/50',
          badge: 'bg-amber-50 text-amber-700 border-amber-200/55',
          ring: 'focus:ring-amber-500'
        };
    }
  };

  const accentClasses = getAccentClasses(accentColor);

  // Central Router for dashboard quick actions
  const handleQuickAction = (actionKey) => {
    switch (actionKey) {
      case 'jemaat-add':
        setActiveTab('jemaat');
        setQuickActionJemaat(true);
        break;
      case 'pengumuman-add':
        setActiveTab('pengumuman');
        setQuickActionPengumuman(true);
        break;
      case 'keuangan-add':
        setActiveTab('keuangan');
        setQuickActionKeuangan(true);
        break;
      case 'jadwal-add':
        setActiveTab('jadwal');
        setQuickActionJadwal(true);
        break;
      default:
        break;
    }
  };

  // Tab Content Renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardTab
            jemaat={jemaat}
            pelayanan={pelayanan}
            keuangan={keuangan}
            jadwal={jadwal}
            onQuickAction={handleQuickAction}
            accentClasses={accentClasses}
          />
        );
      case 'profil':
        return (
          <ProfilGerejaTab
            profil={profil}
            onSaveProfil={saveProfil}
            accentClasses={accentClasses}
          />
        );
      case 'jemaat':
        return (
          <DataJemaat
            jemaat={jemaat}
            onAddJemaat={addJemaat}
            onUpdateJemaat={updateJemaat}
            onDeleteJemaat={deleteJemaat}
            accentClasses={accentClasses}
            externalOpenAddModal={quickActionJemaat}
            setExternalOpenAddModal={setQuickActionJemaat}
          />
        );
      case 'jadwal':
        return (
          <JadwalTab
            accentClasses={accentClasses}
            externalOpenJadwalModal={quickActionJadwal}
            setExternalOpenJadwalModal={setQuickActionJadwal}
          />
        );
      case 'jadwal-petugas':
        return (
          <JadwalPetugas
            accentClasses={accentClasses}
          />
        );
      case 'pengumuman':
        return (
          <PengumumanTab
            accentClasses={accentClasses}
            externalOpenPengumumanModal={quickActionPengumuman}
            setExternalOpenPengumumanModal={setQuickActionPengumuman}
          />
        );
      case 'event':
        return (
          <EventTab
            accentClasses={accentClasses}
          />
        );
      case 'keuangan':
        return (
          <KeuanganTab
            accentClasses={accentClasses}
            externalOpenAddModal={quickActionKeuangan}
            setExternalOpenAddModal={setQuickActionKeuangan}
          />
        );
      case 'pelayanan':
        return (
          <PelayananTab
            accentClasses={accentClasses}
          />
        );
      case 'pengaturan':
        return (
          <PengaturanTab
            accentColor={accentColor}
            setAccentColor={setAccentColor}
            onResetDatabase={resetDatabase}
          />
        );
      default:
        return (
          <div className="p-8 text-center text-stone-500 font-medium">
            Tab tidak ditemukan.
          </div>
        );
    }
  };

  if (activeTab === 'landing') {
    return (
      <LandingPage
        onNavigateToDashboard={() => setActiveTab('dashboard')}
        accentClasses={accentClasses}
      />
    );
  }

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden font-sans">
      {/* Persistent / Toggleable Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        accentClasses={accentClasses}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Navbar */}
        <Header 
          activeTab={activeTab} 
          setIsSidebarOpen={setIsSidebarOpen} 
        />

        {/* Dynamic Tab Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto animate-in fade-in duration-200">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
