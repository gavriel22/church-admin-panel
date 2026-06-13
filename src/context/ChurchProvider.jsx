import { useState, useEffect } from 'react';
import { 
  initialProfil, 
  initialJemaat, 
  initialJadwal, 
  initialPengumuman, 
  initialPelayanan, 
  initialKeuangan,
  initialEvents,
  initialKategoriKantong,
  initialKategoriUsia
} from '../mockData';
import { ChurchContext } from './ChurchContext';

export function ChurchProvider({ children }) {
  // Profil (extended with fotoGembala)
  const [profil, setProfil] = useState(() => {
    const saved = localStorage.getItem('church_profil');
    if (saved) return JSON.parse(saved);
    return {
      ...initialProfil,
      fotoGembala: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=500"
    };
  });

  const [jemaat, setJemaat] = useState(() => {
    const saved = localStorage.getItem('church_jemaat');
    return saved ? JSON.parse(saved) : [...initialJemaat];
  });

  const [jadwal, setJadwal] = useState(() => {
    const saved = localStorage.getItem('church_jadwal');
    return saved ? JSON.parse(saved) : [...initialJadwal];
  });

  const [pengumuman, setPengumuman] = useState(() => {
    const saved = localStorage.getItem('church_pengumuman');
    return saved ? JSON.parse(saved) : [...initialPengumuman];
  });

  const [pelayanan, setPelayanan] = useState(() => {
    const saved = localStorage.getItem('church_pelayanan');
    return saved ? JSON.parse(saved) : [...initialPelayanan];
  });

  const [keuangan, setKeuangan] = useState(() => {
    const saved = localStorage.getItem('church_keuangan');
    return saved ? JSON.parse(saved) : { ...initialKeuangan };
  });

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('church_events');
    return saved ? JSON.parse(saved) : [...initialEvents];
  });

  const [kategoriKantong, setKategoriKantong] = useState(() => {
    const saved = localStorage.getItem('church_kategori_kantong');
    return saved ? JSON.parse(saved) : [...initialKategoriKantong];
  });

  const [kategoriUsia, setKategoriUsia] = useState(() => {
    const saved = localStorage.getItem('church_kategori_usia');
    return saved ? JSON.parse(saved) : [...initialKategoriUsia];
  });

  const [kategoriTransaksi, setKategoriTransaksi] = useState(() => {
    const saved = localStorage.getItem('church_kategori_transaksi');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, nama_kategori: "Persembahan Mingguan", tipe: "Pemasukan" },
      { id: 2, nama_kategori: "Persepuluhan", tipe: "Pemasukan" },
      { id: 3, nama_kategori: "Donasi Khusus", tipe: "Pemasukan" },
      { id: 4, nama_kategori: "Bunga Bank", tipe: "Pemasukan" },
      { id: 5, nama_kategori: "Operasional Gedung", tipe: "Pengeluaran" },
      { id: 6, nama_kategori: "Diakonia", tipe: "Pengeluaran" },
      { id: 7, nama_kategori: "Sekretariat", tipe: "Pengeluaran" },
      { id: 8, nama_kategori: "Honor Pembicara", tipe: "Pengeluaran" },
      { id: 9, nama_kategori: "Pembangunan", tipe: "Pengeluaran" }
    ];
  });

  const [jadwalPetugas, setJadwalPetugas] = useState(() => {
    const saved = localStorage.getItem('church_jadwal_petugas');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to LocalStorage whenever state changes to maintain persistence
  useEffect(() => {
    localStorage.setItem('church_profil', JSON.stringify(profil));
  }, [profil]);

  useEffect(() => {
    localStorage.setItem('church_jemaat', JSON.stringify(jemaat));
  }, [jemaat]);

  useEffect(() => {
    localStorage.setItem('church_jadwal', JSON.stringify(jadwal));
  }, [jadwal]);

  useEffect(() => {
    localStorage.setItem('church_pengumuman', JSON.stringify(pengumuman));
  }, [pengumuman]);

  useEffect(() => {
    localStorage.setItem('church_pelayanan', JSON.stringify(pelayanan));
  }, [pelayanan]);

  useEffect(() => {
    localStorage.setItem('church_keuangan', JSON.stringify(keuangan));
  }, [keuangan]);

  useEffect(() => {
    localStorage.setItem('church_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('church_kategori_kantong', JSON.stringify(kategoriKantong));
  }, [kategoriKantong]);

  useEffect(() => {
    localStorage.setItem('church_kategori_usia', JSON.stringify(kategoriUsia));
  }, [kategoriUsia]);

  useEffect(() => {
    localStorage.setItem('church_kategori_transaksi', JSON.stringify(kategoriTransaksi));
  }, [kategoriTransaksi]);

  useEffect(() => {
    localStorage.setItem('church_jadwal_petugas', JSON.stringify(jadwalPetugas));
  }, [jadwalPetugas]);

  // CRUD Handlers
  
  // 1. Profil
  const saveProfil = (updated) => {
    setProfil(updated);
  };

  // 2. Jemaat
  const addJemaat = (item) => {
    setJemaat(prev => [...prev, item]);
  };
  const updateJemaat = (updated) => {
    setJemaat(prev => prev.map(item => item.id === updated.id ? updated : item));
  };
  const deleteJemaat = (id) => {
    setJemaat(prev => prev.filter(item => item.id !== id));
  };

  // 3. Jadwal Ibadah
  const addJadwal = (item) => {
    setJadwal(prev => [...prev, item]);
  };
  const updateJadwal = (updated) => {
    setJadwal(prev => prev.map(item => item.id === updated.id ? updated : item));
  };
  const deleteJadwal = (id) => {
    setJadwal(prev => prev.filter(item => item.id !== id));
  };

  // 4. Pengumuman
  const addPengumuman = (item) => {
    setPengumuman(prev => [...prev, item]);
  };
  const updatePengumuman = (updated) => {
    setPengumuman(prev => prev.map(item => item.id === updated.id ? updated : item));
  };
  const deletePengumuman = (id) => {
    setPengumuman(prev => prev.filter(item => item.id !== id));
  };

  // 5. Pelayanan
  const addPelayanan = (item) => {
    setPelayanan(prev => [...prev, item]);
  };
  const updatePelayanan = (updated) => {
    setPelayanan(prev => prev.map(item => item.id === updated.id ? updated : item));
  };
  const deletePelayanan = (id) => {
    setPelayanan(prev => prev.filter(item => item.id !== id));
  };

  // 6. Keuangan
  const addTransaksi = (item) => {
    setKeuangan(prev => {
      const updatedBalance = item.tipe_transaksi === 'Pemasukan'
        ? prev.saldo + item.nominal
        : prev.saldo - item.nominal;
      return {
        saldo: updatedBalance,
        transaksi: [item, ...prev.transaksi]
      };
    });
  };
  const updateTransaksi = (updated) => {
    setKeuangan(prev => {
      // Find original transaction to adjust balance
      const orig = prev.transaksi.find(t => t.id === updated.id);
      if (!orig) return prev;
      
      // Revert original transaction balance effect
      let tempBalance = prev.saldo;
      if (orig.tipe_transaksi === 'Pemasukan') {
        tempBalance -= orig.nominal;
      } else {
        tempBalance += orig.nominal;
      }

      // Apply updated transaction balance effect
      if (updated.tipe_transaksi === 'Pemasukan') {
        tempBalance += updated.nominal;
      } else {
        tempBalance -= updated.nominal;
      }

      return {
        saldo: tempBalance,
        transaksi: prev.transaksi.map(t => t.id === updated.id ? updated : t)
      };
    });
  };
  const deleteTransaksi = (id) => {
    setKeuangan(prev => {
      const orig = prev.transaksi.find(t => t.id === id);
      if (!orig) return prev;

      // Revert original transaction balance effect
      let tempBalance = prev.saldo;
      if (orig.tipe_transaksi === 'Pemasukan') {
        tempBalance -= orig.nominal;
      } else {
        tempBalance += orig.nominal;
      }

      return {
        saldo: tempBalance,
        transaksi: prev.transaksi.filter(t => t.id !== id)
      };
    });
  };

  // 7. Event/Acara
  const addEvent = (item) => {
    setEvents(prev => [...prev, item]);
  };
  const updateEvent = (updated) => {
    setEvents(prev => prev.map(item => item.id === updated.id ? updated : item));
  };
  const deleteEvent = (id) => {
    setEvents(prev => prev.filter(item => item.id !== id));
  };

  // 8. Kategori Kantong
  const addKategoriKantong = (item) => {
    setKategoriKantong(prev => [...prev, item]);
  };
  const updateKategoriKantong = (updated) => {
    setKategoriKantong(prev => prev.map(item => item.id === updated.id ? updated : item));
  };
  const deleteKategoriKantong = (id) => {
    setKategoriKantong(prev => prev.filter(item => item.id !== id));
  };

  // 9. Kategori Usia
  const addKategoriUsia = (item) => {
    setKategoriUsia(prev => [...prev, item]);
  };
  const updateKategoriUsia = (updated) => {
    setKategoriUsia(prev => prev.map(item => item.id === updated.id ? updated : item));
  };
  const deleteKategoriUsia = (id) => {
    setKategoriUsia(prev => prev.filter(item => item.id !== id));
  };

  // 10. Kategori Transaksi
  const addKategoriTransaksi = (item) => {
    setKategoriTransaksi(prev => [...prev, item]);
  };
  const updateKategoriTransaksi = (updated) => {
    setKategoriTransaksi(prev => prev.map(item => item.id === updated.id ? updated : item));
  };
  const deleteKategoriTransaksi = (id) => {
    setKategoriTransaksi(prev => prev.filter(item => item.id !== id));
  };

  // 11. Jadwal Petugas
  const addJadwalPetugas = (item) => {
    setJadwalPetugas(prev => [...prev, item]);
  };
  const updateJadwalPetugas = (updated) => {
    setJadwalPetugas(prev => prev.map(item => item.id === updated.id ? updated : item));
  };
  const deleteJadwalPetugas = (id) => {
    setJadwalPetugas(prev => prev.filter(item => item.id !== id));
  };

  // Reset database back to original defaults
  const resetDatabase = () => {
    setProfil({
      ...initialProfil,
      fotoGembala: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=500"
    });
    setJemaat([...initialJemaat]);
    setJadwal([...initialJadwal]);
    setPengumuman([...initialPengumuman]);
    setPelayanan([...initialPelayanan]);
    setKeuangan({ ...initialKeuangan });
    setEvents([...initialEvents]);
    setKategoriKantong([...initialKategoriKantong]);
    setKategoriUsia([...initialKategoriUsia]);
    setKategoriTransaksi([
      { id: 1, nama_kategori: "Persembahan Mingguan", tipe: "Pemasukan" },
      { id: 2, nama_kategori: "Persepuluhan", tipe: "Pemasukan" },
      { id: 3, nama_kategori: "Donasi Khusus", tipe: "Pemasukan" },
      { id: 4, nama_kategori: "Bunga Bank", tipe: "Pemasukan" },
      { id: 5, nama_kategori: "Operasional Gedung", tipe: "Pengeluaran" },
      { id: 6, nama_kategori: "Diakonia", tipe: "Pengeluaran" },
      { id: 7, nama_kategori: "Sekretariat", tipe: "Pengeluaran" },
      { id: 8, nama_kategori: "Honor Pembicara", tipe: "Pengeluaran" },
      { id: 9, nama_kategori: "Pembangunan", tipe: "Pengeluaran" }
    ]);
    setJadwalPetugas([]);
  };

  return (
    <ChurchContext.Provider value={{
      profil,
      jemaat,
      jadwal,
      pengumuman,
      pelayanan,
      keuangan,
      events,
      kategoriKantong,
      kategoriUsia,
      kategoriTransaksi,
      jadwalPetugas,
      saveProfil,
      addJemaat,
      updateJemaat,
      deleteJemaat,
      addJadwal,
      updateJadwal,
      deleteJadwal,
      addPengumuman,
      updatePengumuman,
      deletePengumuman,
      addPelayanan,
      updatePelayanan,
      deletePelayanan,
      addTransaksi,
      updateTransaksi,
      deleteTransaksi,
      addEvent,
      updateEvent,
      deleteEvent,
      addKategoriKantong,
      updateKategoriKantong,
      deleteKategoriKantong,
      addKategoriUsia,
      updateKategoriUsia,
      deleteKategoriUsia,
      addKategoriTransaksi,
      updateKategoriTransaksi,
      deleteKategoriTransaksi,
      addJadwalPetugas,
      updateJadwalPetugas,
      deleteJadwalPetugas,
      resetDatabase
    }}>
      {children}
    </ChurchContext.Provider>
  );
}
