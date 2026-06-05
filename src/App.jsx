import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardTab from './components/DashboardTab';
import JemaatTab from './components/JemaatTab';
import ProfilGerejaTab from './components/ProfilGerejaTab';
import JadwalPengumumanTab from './components/JadwalPengumumanTab';
import PelayananTab from './components/PelayananTab';
import KeuanganTab from './components/KeuanganTab';
import PengaturanTab from './components/PengaturanTab';

import { 
  initialProfil, 
  initialJemaat, 
  initialJadwal, 
  initialPengumuman, 
  initialPelayanan, 
  initialKeuangan 
} from './mockData';

export default function App() {
  // Navigation & Menu Drawer States
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [accentColor, setAccentColor] = useState('amber');

  // Unified Database States
  const [profil, setProfil] = useState({ ...initialProfil });
  const [jemaat, setJemaat] = useState([...initialJemaat]);
  const [jadwal, setJadwal] = useState([...initialJadwal]);
  const [pengumuman, setPengumuman] = useState([...initialPengumuman]);
  const [pelayanan, setPelayanan] = useState([...initialPelayanan]);
  const [keuangan, setKeuangan] = useState({ ...initialKeuangan });

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
          bgPrimary: 'bg-indigo-655 hover:bg-indigo-700 text-white',
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

  // Handlers for data modifications
  const handleAddJemaat = (newMember) => {
    setJemaat(prev => [...prev, newMember]);
  };

  const handleSaveProfil = (updatedProfil) => {
    setProfil(updatedProfil);
  };

  const handleAddPengumuman = (newAnnouncement) => {
    setPengumuman(prev => [...prev, newAnnouncement]);
  };

  const handleAddJadwal = (newSchedule) => {
    setJadwal(prev => [...prev, newSchedule]);
  };

  const handleAddPelayanan = (newService) => {
    setPelayanan(prev => [...prev, newService]);
  };

  const handleAddTransaksi = (newTx) => {
    setKeuangan(prev => {
      const updatedBalance = newTx.tipe === 'Penerimaan'
        ? prev.saldo + newTx.nominal
        : prev.saldo - newTx.nominal;
      return {
        saldo: updatedBalance,
        transaksi: [newTx, ...prev.transaksi]
      };
    });
  };

  // Reset database back to original defaults
  const handleResetDatabase = () => {
    setProfil({ ...initialProfil });
    setJemaat([...initialJemaat]);
    setJadwal([...initialJadwal]);
    setPengumuman([...initialPengumuman]);
    setPelayanan([...initialPelayanan]);
    setKeuangan({ ...initialKeuangan });
  };

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
            onSaveProfil={handleSaveProfil}
            accentClasses={accentClasses}
          />
        );
      case 'jemaat':
        return (
          <JemaatTab
            jemaat={jemaat}
            onAddJemaat={handleAddJemaat}
            accentClasses={accentClasses}
            externalOpenAddModal={quickActionJemaat}
            setExternalOpenAddModal={setQuickActionJemaat}
          />
        );
      case 'jadwal':
        return (
          <JadwalPengumumanTab
            pengumuman={pengumuman}
            onAddPengumuman={handleAddPengumuman}
            jadwal={jadwal}
            onAddJadwal={handleAddJadwal}
            accentClasses={accentClasses}
            externalOpenJadwalModal={quickActionJadwal}
            setExternalOpenJadwalModal={setQuickActionJadwal}
          />
        );
      case 'pengumuman':
        return (
          <JadwalPengumumanTab
            pengumuman={pengumuman}
            onAddPengumuman={handleAddPengumuman}
            jadwal={jadwal}
            onAddJadwal={handleAddJadwal}
            accentClasses={accentClasses}
            externalOpenPengumumanModal={quickActionPengumuman}
            setExternalOpenPengumumanModal={setQuickActionPengumuman}
          />
        );
      case 'keuangan':
        return (
          <KeuanganTab
            keuangan={keuangan}
            onAddTransaksi={handleAddTransaksi}
            accentClasses={accentClasses}
            externalOpenAddModal={quickActionKeuangan}
            setExternalOpenAddModal={setQuickActionKeuangan}
          />
        );
      case 'pelayanan':
        return (
          <PelayananTab
            pelayanan={pelayanan}
            onAddPelayanan={handleAddPelayanan}
            accentClasses={accentClasses}
          />
        );
      case 'pengaturan':
        return (
          <PengaturanTab
            accentColor={accentColor}
            setAccentColor={setAccentColor}
            onResetDatabase={handleResetDatabase}
            accentClasses={accentClasses}
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
