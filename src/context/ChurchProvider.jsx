// Author: Gavriel Theofilus Nugroho
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
import { supabase } from '../lib/supabaseClient';

// Helper mappers to handle schema differences between DB (snake_case/Postgres) and App (camelCase/UI)
const mapProfileFromDb = (dbProfile) => {
  if (!dbProfile) return null;
  return {
    id: dbProfile.id,
    namaGereja: dbProfile.nama_gereja || dbProfile.namaGereja || dbProfile.nama || '',
    tagline: dbProfile.tagline || '',
    deskripsi: dbProfile.deskripsi || '',
    alamat: dbProfile.alamat || '',
    telepon: dbProfile.telepon || '',
    email: dbProfile.email || '',
    visi: dbProfile.visi || '',
    misi: Array.isArray(dbProfile.misi) 
      ? dbProfile.misi 
      : (typeof dbProfile.misi === 'string' ? JSON.parse(dbProfile.misi) : []),
    sejarah: dbProfile.sejarah || '',
    tahunBerdiri: dbProfile.tahun_berdiri || dbProfile.tahunBerdiri || 2010,
    namaGembala: dbProfile.nama_gembala || dbProfile.namaGembala || dbProfile.gembala || '',
    pesanGembala: dbProfile.pesan_gembala || dbProfile.pesanGembala || '',
    fotoGembala: dbProfile.foto_gembala || dbProfile.fotoGembala || ''
  };
};

const mapProfileToDb = (appProfile) => {
  return {
    id: appProfile.id || 1,
    nama: appProfile.namaGereja || '',
    nama_gereja: appProfile.namaGereja || '',
    tagline: appProfile.tagline || '',
    deskripsi: appProfile.deskripsi || '',
    alamat: appProfile.alamat || '',
    telepon: appProfile.telepon || '',
    email: appProfile.email || '',
    visi: appProfile.visi || '',
    misi: Array.isArray(appProfile.misi) ? appProfile.misi : [],
    sejarah: appProfile.sejarah || '',
    tahun_berdiri: appProfile.tahunBerdiri || 2010,
    tahunBerdiri: appProfile.tahunBerdiri || 2010,
    gembala: appProfile.namaGembala || '',
    nama_gembala: appProfile.namaGembala || '',
    pesan_gembala: appProfile.pesanGembala || '',
    pesanGembala: appProfile.pesanGembala || '',
    foto_gembala: appProfile.fotoGembala || '',
    fotoGembala: appProfile.fotoGembala || ''
  };
};

const mapJadwalFromDb = (dbJadwal) => {
  if (!dbJadwal) return null;
  return {
    id: dbJadwal.id,
    nama: dbJadwal.nama || dbJadwal.nama_ibadah || '',
    hari: dbJadwal.hari || '',
    waktu: dbJadwal.waktu || dbJadwal.jam || '',
    lokasi: dbJadwal.lokasi || dbJadwal.tempat || '',
    deskripsi: dbJadwal.deskripsi || ''
  };
};

const mapJadwalToDb = (appJadwal) => {
  return {
    id: appJadwal.id,
    nama: appJadwal.nama || '',
    nama_ibadah: appJadwal.nama || '',
    hari: appJadwal.hari || '',
    waktu: appJadwal.waktu || '',
    jam: appJadwal.waktu || '',
    lokasi: appJadwal.lokasi || '',
    tempat: appJadwal.lokasi || '',
    deskripsi: appJadwal.deskripsi || ''
  };
};

const mapPengumumanFromDb = (dbPengumuman) => {
  if (!dbPengumuman) return null;
  return {
    id: dbPengumuman.id,
    judul: dbPengumuman.judul || '',
    deskripsi: dbPengumuman.deskripsi || dbPengumuman.isi || '',
    tanggal: dbPengumuman.tanggal || '',
    pinned: dbPengumuman.pinned !== undefined ? !!dbPengumuman.pinned : dbPengumuman.status === 'Pinned'
  };
};

const mapPengumumanToDb = (appPengumuman) => {
  return {
    id: appPengumuman.id,
    judul: appPengumuman.judul || '',
    deskripsi: appPengumuman.deskripsi || '',
    isi: appPengumuman.deskripsi || '',
    tanggal: appPengumuman.tanggal || null,
    pinned: !!appPengumuman.pinned,
    status: appPengumuman.pinned ? 'Pinned' : 'Aktif'
  };
};

const mapPelayananFromDb = (dbPelayanan) => {
  if (!dbPelayanan) return null;
  return {
    id: dbPelayanan.id,
    nama: dbPelayanan.nama || dbPelayanan.nama_pelayanan || '',
    deskripsi: dbPelayanan.deskripsi || '',
    anggota: dbPelayanan.anggota !== undefined ? Number(dbPelayanan.anggota) : Number(dbPelayanan.jumlah_anggota || 0),
    pertemuan: dbPelayanan.pertemuan || '',
    ketua: dbPelayanan.ketua || ''
  };
};

const mapPelayananToDb = (appPelayanan) => {
  return {
    id: appPelayanan.id,
    nama: appPelayanan.nama || '',
    nama_pelayanan: appPelayanan.nama || '',
    deskripsi: appPelayanan.deskripsi || '',
    anggota: Number(appPelayanan.anggota || 0),
    jumlah_anggota: Number(appPelayanan.anggota || 0),
    pertemuan: appPelayanan.pertemuan || '',
    ketua: appPelayanan.ketua || ''
  };
};

const mapEventFromDb = (dbEvent) => {
  if (!dbEvent) return null;
  return {
    id: dbEvent.id,
    nama: dbEvent.nama || dbEvent.title || '',
    tanggal: dbEvent.tanggal || (dbEvent.start ? dbEvent.start.split('T')[0] : ''),
    waktu: dbEvent.waktu || (dbEvent.start ? new Date(dbEvent.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''),
    lokasi: dbEvent.lokasi || dbEvent.location || '',
    deskripsi: dbEvent.deskripsi || dbEvent.description || ''
  };
};

const mapEventToDb = (appEvent) => {
  return {
    id: appEvent.id,
    nama: appEvent.nama || '',
    title: appEvent.nama || '',
    tanggal: appEvent.tanggal || null,
    start: appEvent.tanggal ? `${appEvent.tanggal}T${appEvent.waktu ? appEvent.waktu.split(' ')[0] : '00:00:00'}` : null,
    waktu: appEvent.waktu || '',
    lokasi: appEvent.lokasi || '',
    location: appEvent.lokasi || '',
    deskripsi: appEvent.deskripsi || '',
    description: appEvent.deskripsi || ''
  };
};

const mapKategoriKantongFromDb = (dbKK) => {
  if (!dbKK) return null;
  return {
    id: dbKK.id,
    nama_kantong: dbKK.nama_kantong || dbKK.nama || '',
    deskripsi_alokasi: dbKK.deskripsi_alokasi || dbKK.deskripsi || '',
    warna_badge: dbKK.warna_badge || 'bg-amber-100 text-amber-800'
  };
};

const mapKategoriKantongToDb = (appKK) => {
  return {
    id: appKK.id,
    nama_kantong: appKK.nama_kantong || '',
    nama: appKK.nama_kantong || '',
    deskripsi_alokasi: appKK.deskripsi_alokasi || '',
    deskripsi: appKK.deskripsi_alokasi || '',
    warna_badge: appKK.warna_badge || ''
  };
};

const mapKategoriUsiaFromDb = (dbUsia) => {
  if (!dbUsia) return null;
  return {
    id: dbUsia.id,
    nama_kategori: dbUsia.nama_kategori || dbUsia.nama || '',
    usia_min: dbUsia.usia_min !== undefined ? Number(dbUsia.usia_min) : 0,
    usia_max: dbUsia.usia_max !== undefined ? Number(dbUsia.usia_max) : 120
  };
};

const mapKategoriUsiaToDb = (appUsia) => {
  return {
    id: appUsia.id,
    nama_kategori: appUsia.nama_kategori || '',
    nama: appUsia.nama_kategori || '',
    usia_min: Number(appUsia.usia_min || 0),
    usia_max: Number(appUsia.usia_max || 0)
  };
};

const mapKategoriTransaksiFromDb = (dbKat) => {
  if (!dbKat) return null;
  return {
    id: dbKat.id,
    nama_kategori: dbKat.nama_kategori || dbKat.nama || '',
    tipe: dbKat.tipe || 'Pemasukan'
  };
};

const mapKategoriTransaksiToDb = (appKat) => {
  return {
    id: appKat.id,
    nama_kategori: appKat.nama_kategori || '',
    nama: appKat.nama_kategori || '',
    tipe: appKat.tipe || 'Pemasukan'
  };
};

const mapJadwalPetugasFromDb = (dbJP) => {
  if (!dbJP) return null;
  return {
    id: dbJP.id,
    jadwal_ibadah_id: dbJP.jadwal_ibadah_id || dbJP.ibadah_id || '',
    tanggal: dbJP.tanggal || '',
    petugas: Array.isArray(dbJP.petugas) 
      ? dbJP.petugas 
      : (typeof dbJP.petugas === 'string' ? JSON.parse(dbJP.petugas) : (dbJP.petugas || []))
  };
};

const mapJadwalPetugasToDb = (appJP) => {
  return {
    id: appJP.id,
    jadwal_ibadah_id: appJP.jadwal_ibadah_id || null,
    ibadah_id: appJP.jadwal_ibadah_id || null,
    tanggal: appJP.tanggal || null,
    petugas: Array.isArray(appJP.petugas) ? appJP.petugas : []
  };
};

export function ChurchProvider({ children }) {
  // Loading State
  const [isLoading, setIsLoading] = useState(true);

  // States initialized with mockData defaults (will be overwritten by Supabase fetches)
  const [profil, setProfil] = useState({
    ...initialProfil,
    fotoGembala: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=500"
  });
  const [jemaat, setJemaat] = useState([...initialJemaat]);
  const [jadwal, setJadwal] = useState([...initialJadwal]);
  const [pengumuman, setPengumuman] = useState([...initialPengumuman]);
  const [pelayanan, setPelayanan] = useState([...initialPelayanan]);
  const [keuangan, setKeuangan] = useState({ ...initialKeuangan });
  const [events, setEvents] = useState([...initialEvents]);
  const [kategoriKantong, setKategoriKantong] = useState([...initialKategoriKantong]);
  const [kategoriUsia, setKategoriUsia] = useState([...initialKategoriUsia]);
  const [kategoriTransaksi, setKategoriTransaksi] = useState([
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
  const [jadwalPetugas, setJadwalPetugas] = useState([]);

  // Fetch all tables from Supabase on mount
  const loadAllData = async () => {
    setIsLoading(true);
    try {
      // 1. Profil Gereja
      const { data: profilData, error: profilError } = await supabase
        .from('profil_gereja')
        .select('*');
      if (profilError) {
        console.warn('Gagal memuat profil_gereja dari Supabase. Menggunakan data lokal.', profilError.message);
      } else if (profilData && profilData.length > 0) {
        setProfil(mapProfileFromDb(profilData[0]));
      }

      // 2. Jemaat
      const { data: jemaatData, error: jemaatError } = await supabase
        .from('jemaat')
        .select('*')
        .order('nama', { ascending: true });
      if (jemaatError) {
        console.warn('Gagal memuat jemaat dari Supabase. Menggunakan data lokal.', jemaatError.message);
      } else if (jemaatData) {
        setJemaat(jemaatData);
      }

      // 3. Jadwal Ibadah
      const { data: jadwalData, error: jadwalError } = await supabase
        .from('jadwal_ibadah')
        .select('*');
      if (jadwalError) {
        console.warn('Gagal memuat jadwal_ibadah dari Supabase. Menggunakan data lokal.', jadwalError.message);
      } else if (jadwalData) {
        setJadwal(jadwalData.map(mapJadwalFromDb));
      }

      // 4. Pengumuman
      const { data: pengumumanData, error: pengumumanError } = await supabase
        .from('pengumuman')
        .select('*');
      if (pengumumanError) {
        console.warn('Gagal memuat pengumuman dari Supabase. Menggunakan data lokal.', pengumumanError.message);
      } else if (pengumumanData) {
        setPengumuman(pengumumanData.map(mapPengumumanFromDb));
      }

      // 5. Pelayanan
      const { data: pelayananData, error: pelayananError } = await supabase
        .from('pelayanan')
        .select('*');
      if (pelayananError) {
        console.warn('Gagal memuat pelayanan dari Supabase. Menggunakan data lokal.', pelayananError.message);
      } else if (pelayananData) {
        setPelayanan(pelayananData.map(mapPelayananFromDb));
      }

      // 6. Keuangan Transaksi
      const { data: keuanganData, error: keuanganError } = await supabase
        .from('keuangan_transaksi')
        .select('*')
        .order('tanggal', { ascending: false });
      if (keuanganError) {
        console.warn('Gagal memuat keuangan_transaksi dari Supabase. Menggunakan data lokal.', keuanganError.message);
      } else if (keuanganData) {
        const calculatedSaldo = keuanganData.reduce((acc, curr) => {
          const nominal = Number(curr.nominal);
          return curr.tipe_transaksi === 'Pemasukan' ? acc + nominal : acc - nominal;
        }, 0);
        setKeuangan({
          saldo: calculatedSaldo,
          transaksi: keuanganData
        });
      }

      // 7. Events
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*');
      if (eventsError) {
        console.warn('Gagal memuat events dari Supabase. Menggunakan data lokal.', eventsError.message);
      } else if (eventsData) {
        setEvents(eventsData.map(mapEventFromDb));
      }

      // 8. Kategori Kantong
      const { data: kantongData, error: kantongError } = await supabase
        .from('kategori_kantong')
        .select('*');
      if (kantongError) {
        console.warn('Gagal memuat kategori_kantong dari Supabase.', kantongError.message);
      } else if (kantongData) {
        setKategoriKantong(kantongData.map(mapKategoriKantongFromDb));
      }

      // 9. Kategori Usia
      const { data: usiaData, error: usiaError } = await supabase
        .from('kategori_usia')
        .select('*');
      if (usiaError) {
        console.warn('Gagal memuat kategori_usia dari Supabase.', usiaError.message);
      } else if (usiaData) {
        setKategoriUsia(usiaData.map(mapKategoriUsiaFromDb));
      }

      // 10. Kategori Transaksi
      const { data: katTxData, error: katTxError } = await supabase
        .from('kategori_transaksi')
        .select('*');
      if (katTxError) {
        console.warn('Gagal memuat kategori_transaksi dari Supabase.', katTxError.message);
      } else if (katTxData) {
        setKategoriTransaksi(katTxData.map(mapKategoriTransaksiFromDb));
      }

      // 11. Jadwal Petugas
      const { data: petugasData, error: petugasError } = await supabase
        .from('jadwal_petugas')
        .select('*');
      if (petugasError) {
        console.warn('Gagal memuat jadwal_petugas dari Supabase.', petugasError.message);
      } else if (petugasData) {
        setJadwalPetugas(petugasData.map(mapJadwalPetugasFromDb));
      }

    } catch (e) {
      console.error('Terjadi kesalahan tidak terduga saat memuat data dari Supabase:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // CRUD Handlers connected to Supabase
  
  // 1. Profil
  const saveProfil = async (updated) => {
    const profileId = updated.id || 1;
    const dbData = mapProfileToDb({ ...updated, id: profileId });
    
    const { data, error } = await supabase
      .from('profil_gereja')
      .upsert(dbData)
      .select();
    
    if (error) {
      console.error('Error saving profile to Supabase:', error);
    } else if (data && data[0]) {
      setProfil(mapProfileFromDb(data[0]));
    }
  };

  // 2. Jemaat
  const addJemaat = async (item) => {
    const dataToInsert = { ...item };
    if (!dataToInsert.id || typeof dataToInsert.id === 'number' || (typeof dataToInsert.id === 'string' && dataToInsert.id.trim() === '')) {
      delete dataToInsert.id;
    }
    const { data, error } = await supabase
      .from('jemaat')
      .insert([dataToInsert])
      .select();

    if (error) {
      console.error('Error adding jemaat to Supabase:', error);
    } else if (data && data[0]) {
      setJemaat(prev => [...prev, data[0]]);
    }
  };

  const updateJemaat = async (updated) => {
    const { data, error } = await supabase
      .from('jemaat')
      .update(updated)
      .eq('id', updated.id)
      .select();

    if (error) {
      console.error('Error updating jemaat in Supabase:', error);
    } else if (data && data[0]) {
      setJemaat(prev => prev.map(item => item.id === updated.id ? data[0] : item));
    }
  };

  const deleteJemaat = async (id) => {
    const { error } = await supabase
      .from('jemaat')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting jemaat from Supabase:', error);
    } else {
      setJemaat(prev => prev.filter(item => item.id !== id));
    }
  };

  // 3. Jadwal Ibadah
  const addJadwal = async (item) => {
    const dataToInsert = mapJadwalToDb(item);
    if (!dataToInsert.id || typeof dataToInsert.id === 'number' || (typeof dataToInsert.id === 'string' && dataToInsert.id.trim() === '')) {
      delete dataToInsert.id;
    }
    const { data, error } = await supabase
      .from('jadwal_ibadah')
      .insert([dataToInsert])
      .select();

    if (error) {
      console.error('Error adding jadwal to Supabase:', error);
    } else if (data && data[0]) {
      setJadwal(prev => [...prev, mapJadwalFromDb(data[0])]);
    }
  };

  const updateJadwal = async (updated) => {
    const { data, error } = await supabase
      .from('jadwal_ibadah')
      .update(mapJadwalToDb(updated))
      .eq('id', updated.id)
      .select();

    if (error) {
      console.error('Error updating jadwal in Supabase:', error);
    } else if (data && data[0]) {
      setJadwal(prev => prev.map(item => item.id === updated.id ? mapJadwalFromDb(data[0]) : item));
    }
  };

  const deleteJadwal = async (id) => {
    const { error } = await supabase
      .from('jadwal_ibadah')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting jadwal from Supabase:', error);
    } else {
      setJadwal(prev => prev.filter(item => item.id !== id));
    }
  };

  // 4. Pengumuman
  const addPengumuman = async (item) => {
    const dataToInsert = mapPengumumanToDb(item);
    if (!dataToInsert.id || typeof dataToInsert.id === 'number' || (typeof dataToInsert.id === 'string' && dataToInsert.id.trim() === '')) {
      delete dataToInsert.id;
    }
    const { data, error } = await supabase
      .from('pengumuman')
      .insert([dataToInsert])
      .select();

    if (error) {
      console.error('Error adding pengumuman to Supabase:', error);
    } else if (data && data[0]) {
      setPengumuman(prev => [...prev, mapPengumumanFromDb(data[0])]);
    }
  };

  const updatePengumuman = async (updated) => {
    const { data, error } = await supabase
      .from('pengumuman')
      .update(mapPengumumanToDb(updated))
      .eq('id', updated.id)
      .select();

    if (error) {
      console.error('Error updating pengumuman in Supabase:', error);
    } else if (data && data[0]) {
      setPengumuman(prev => prev.map(item => item.id === updated.id ? mapPengumumanFromDb(data[0]) : item));
    }
  };

  const deletePengumuman = async (id) => {
    const { error } = await supabase
      .from('pengumuman')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting pengumuman from Supabase:', error);
    } else {
      setPengumuman(prev => prev.filter(item => item.id !== id));
    }
  };

  // 5. Pelayanan
  const addPelayanan = async (item) => {
    const dataToInsert = mapPelayananToDb(item);
    if (!dataToInsert.id || typeof dataToInsert.id === 'number' || (typeof dataToInsert.id === 'string' && dataToInsert.id.trim() === '')) {
      delete dataToInsert.id;
    }
    const { data, error } = await supabase
      .from('pelayanan')
      .insert([dataToInsert])
      .select();

    if (error) {
      console.error('Error adding pelayanan to Supabase:', error);
    } else if (data && data[0]) {
      setPelayanan(prev => [...prev, mapPelayananFromDb(data[0])]);
    }
  };

  const updatePelayanan = async (updated) => {
    const { data, error } = await supabase
      .from('pelayanan')
      .update(mapPelayananToDb(updated))
      .eq('id', updated.id)
      .select();

    if (error) {
      console.error('Error updating pelayanan in Supabase:', error);
    } else if (data && data[0]) {
      setPelayanan(prev => prev.map(item => item.id === updated.id ? mapPelayananFromDb(data[0]) : item));
    }
  };

  const deletePelayanan = async (id) => {
    const { error } = await supabase
      .from('pelayanan')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting pelayanan from Supabase:', error);
    } else {
      setPelayanan(prev => prev.filter(item => item.id !== id));
    }
  };

  // 6. Keuangan (Transaksi)
  const addTransaksi = async (item) => {
    const dataToInsert = { ...item };
    if (!dataToInsert.id || typeof dataToInsert.id === 'number' || (typeof dataToInsert.id === 'string' && dataToInsert.id.trim() === '')) {
      delete dataToInsert.id;
    }
    const { data, error } = await supabase
      .from('keuangan_transaksi')
      .insert([dataToInsert])
      .select();

    if (error) {
      console.error('Error adding transaksi to Supabase:', error);
    } else if (data && data[0]) {
      setKeuangan(prev => {
        const nominal = Number(data[0].nominal);
        const updatedBalance = data[0].tipe_transaksi === 'Pemasukan'
          ? prev.saldo + nominal
          : prev.saldo - nominal;
        return {
          saldo: updatedBalance,
          transaksi: [data[0], ...prev.transaksi]
        };
      });
    }
  };

  const updateTransaksi = async (updated) => {
    const { data, error } = await supabase
      .from('keuangan_transaksi')
      .update(updated)
      .eq('id', updated.id)
      .select();

    if (error) {
      console.error('Error updating transaksi in Supabase:', error);
    } else if (data && data[0]) {
      setKeuangan(prev => {
        const orig = prev.transaksi.find(t => t.id === updated.id);
        if (!orig) return prev;
        
        let tempBalance = prev.saldo;
        if (orig.tipe_transaksi === 'Pemasukan') {
          tempBalance -= Number(orig.nominal);
        } else {
          tempBalance += Number(orig.nominal);
        }

        const newNominal = Number(data[0].nominal);
        if (data[0].tipe_transaksi === 'Pemasukan') {
          tempBalance += newNominal;
        } else {
          tempBalance -= newNominal;
        }

        return {
          saldo: tempBalance,
          transaksi: prev.transaksi.map(t => t.id === updated.id ? data[0] : t)
        };
      });
    }
  };

  const deleteTransaksi = async (id) => {
    const { error } = await supabase
      .from('keuangan_transaksi')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting transaksi from Supabase:', error);
    } else {
      setKeuangan(prev => {
        const orig = prev.transaksi.find(t => t.id === id);
        if (!orig) return prev;

        let tempBalance = prev.saldo;
        if (orig.tipe_transaksi === 'Pemasukan') {
          tempBalance -= Number(orig.nominal);
        } else {
          tempBalance += Number(orig.nominal);
        }

        return {
          saldo: tempBalance,
          transaksi: prev.transaksi.filter(t => t.id !== id)
        };
      });
    }
  };

  // 7. Event/Acara
  const addEvent = async (item) => {
    const dataToInsert = mapEventToDb(item);
    if (!dataToInsert.id || typeof dataToInsert.id === 'number' || (typeof dataToInsert.id === 'string' && dataToInsert.id.trim() === '')) {
      delete dataToInsert.id;
    }
    const { data, error } = await supabase
      .from('events')
      .insert([dataToInsert])
      .select();

    if (error) {
      console.error('Error adding event to Supabase:', error);
    } else if (data && data[0]) {
      setEvents(prev => [...prev, mapEventFromDb(data[0])]);
    }
  };

  const updateEvent = async (updated) => {
    const { data, error } = await supabase
      .from('events')
      .update(mapEventToDb(updated))
      .eq('id', updated.id)
      .select();

    if (error) {
      console.error('Error updating event in Supabase:', error);
    } else if (data && data[0]) {
      setEvents(prev => prev.map(item => item.id === updated.id ? mapEventFromDb(data[0]) : item));
    }
  };

  const deleteEvent = async (id) => {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting event from Supabase:', error);
    } else {
      setEvents(prev => prev.filter(item => item.id !== id));
    }
  };

  // 8. Kategori Kantong
  const addKategoriKantong = async (item) => {
    const dataToInsert = mapKategoriKantongToDb(item);
    if (!dataToInsert.id || typeof dataToInsert.id === 'number' || (typeof dataToInsert.id === 'string' && dataToInsert.id.trim() === '')) {
      delete dataToInsert.id;
    }
    const { data, error } = await supabase
      .from('kategori_kantong')
      .insert([dataToInsert])
      .select();

    if (error) {
      console.error('Error adding kategori kantong to Supabase:', error);
    } else if (data && data[0]) {
      setKategoriKantong(prev => [...prev, mapKategoriKantongFromDb(data[0])]);
    }
  };

  const updateKategoriKantong = async (updated) => {
    const { data, error } = await supabase
      .from('kategori_kantong')
      .update(mapKategoriKantongToDb(updated))
      .eq('id', updated.id)
      .select();

    if (error) {
      console.error('Error updating kategori kantong in Supabase:', error);
    } else if (data && data[0]) {
      setKategoriKantong(prev => prev.map(item => item.id === updated.id ? mapKategoriKantongFromDb(data[0]) : item));
    }
  };

  const deleteKategoriKantong = async (id) => {
    const { error } = await supabase
      .from('kategori_kantong')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting kategori kantong from Supabase:', error);
    } else {
      setKategoriKantong(prev => prev.filter(item => item.id !== id));
    }
  };

  // 9. Kategori Usia
  const addKategoriUsia = async (item) => {
    const dataToInsert = mapKategoriUsiaToDb(item);
    if (!dataToInsert.id || typeof dataToInsert.id === 'number' || (typeof dataToInsert.id === 'string' && dataToInsert.id.trim() === '')) {
      delete dataToInsert.id;
    }
    const { data, error } = await supabase
      .from('kategori_usia')
      .insert([dataToInsert])
      .select();

    if (error) {
      console.error('Error adding kategori usia to Supabase:', error);
    } else if (data && data[0]) {
      setKategoriUsia(prev => [...prev, mapKategoriUsiaFromDb(data[0])]);
    }
  };

  const updateKategoriUsia = async (updated) => {
    const { data, error } = await supabase
      .from('kategori_usia')
      .update(mapKategoriUsiaToDb(updated))
      .eq('id', updated.id)
      .select();

    if (error) {
      console.error('Error updating kategori usia in Supabase:', error);
    } else if (data && data[0]) {
      setKategoriUsia(prev => prev.map(item => item.id === updated.id ? mapKategoriUsiaFromDb(data[0]) : item));
    }
  };

  const deleteKategoriUsia = async (id) => {
    const { error } = await supabase
      .from('kategori_usia')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting kategori usia from Supabase:', error);
    } else {
      setKategoriUsia(prev => prev.filter(item => item.id !== id));
    }
  };

  // 10. Kategori Transaksi
  const addKategoriTransaksi = async (item) => {
    const dataToInsert = mapKategoriTransaksiToDb(item);
    if (!dataToInsert.id || typeof dataToInsert.id === 'number' || (typeof dataToInsert.id === 'string' && dataToInsert.id.trim() === '')) {
      delete dataToInsert.id;
    }
    const { data, error } = await supabase
      .from('kategori_transaksi')
      .insert([dataToInsert])
      .select();

    if (error) {
      console.error('Error adding kategori transaksi to Supabase:', error);
    } else if (data && data[0]) {
      setKategoriTransaksi(prev => [...prev, mapKategoriTransaksiFromDb(data[0])]);
    }
  };

  const updateKategoriTransaksi = async (updated) => {
    const { data, error } = await supabase
      .from('kategori_transaksi')
      .update(mapKategoriTransaksiToDb(updated))
      .eq('id', updated.id)
      .select();

    if (error) {
      console.error('Error updating kategori transaksi in Supabase:', error);
    } else if (data && data[0]) {
      setKategoriTransaksi(prev => prev.map(item => item.id === updated.id ? mapKategoriTransaksiFromDb(data[0]) : item));
    }
  };

  const deleteKategoriTransaksi = async (id) => {
    const { error } = await supabase
      .from('kategori_transaksi')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting kategori transaksi from Supabase:', error);
    } else {
      setKategoriTransaksi(prev => prev.filter(item => item.id !== id));
    }
  };

  // 11. Jadwal Petugas
  const addJadwalPetugas = async (item) => {
    const dataToInsert = mapJadwalPetugasToDb(item);
    if (!dataToInsert.id || typeof dataToInsert.id === 'number' || (typeof dataToInsert.id === 'string' && dataToInsert.id.trim() === '')) {
      delete dataToInsert.id;
    }
    const { data, error } = await supabase
      .from('jadwal_petugas')
      .insert([dataToInsert])
      .select();

    if (error) {
      console.error('Error adding jadwal petugas to Supabase:', error);
    } else if (data && data[0]) {
      setJadwalPetugas(prev => [...prev, mapJadwalPetugasFromDb(data[0])]);
    }
  };

  const updateJadwalPetugas = async (updated) => {
    const { data, error } = await supabase
      .from('jadwal_petugas')
      .update(mapJadwalPetugasToDb(updated))
      .eq('id', updated.id)
      .select();

    if (error) {
      console.error('Error updating jadwal petugas in Supabase:', error);
    } else if (data && data[0]) {
      setJadwalPetugas(prev => prev.map(item => item.id === updated.id ? mapJadwalPetugasFromDb(data[0]) : item));
    }
  };

  const deleteJadwalPetugas = async (id) => {
    const { error } = await supabase
      .from('jadwal_petugas')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting jadwal petugas from Supabase:', error);
    } else {
      setJadwalPetugas(prev => prev.filter(item => item.id !== id));
    }
  };

  // Reset database back to original defaults on Supabase
  const resetDatabase = async () => {
    const confirmReset = window.confirm('Apakah Anda yakin ingin mereset seluruh database di Supabase kembali ke data bawaan? Semua data saat ini akan terhapus.');
    if (!confirmReset) return;

    setIsLoading(true);
    try {
      // 1. Delete all existing records
      await supabase.from('jadwal_petugas').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('keuangan_transaksi').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('pelayanan').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('pengumuman').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('jadwal_ibadah').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('jemaat').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('profil_gereja').delete().neq('id', 0);
      await supabase.from('kategori_transaksi').delete().neq('id', 0);
      await supabase.from('kategori_usia').delete().neq('id', 0);
      await supabase.from('kategori_kantong').delete().neq('id', 0);

      // 2. Insert initial data (re-seeding)
      // Profile
      await supabase.from('profil_gereja').insert([mapProfileToDb({
        ...initialProfil,
        id: 1,
        fotoGembala: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=500"
      })]);

      // Jemaat (generate new simple items to let DB assign IDs if necessary, or pass initialJemaat directly)
      const cleanJemaat = initialJemaat.map(({ id, ...rest }) => rest);
      await supabase.from('jemaat').insert(cleanJemaat);

      // Jadwal Ibadah
      await supabase.from('jadwal_ibadah').insert(initialJadwal.map(({ id, ...rest }) => mapJadwalToDb(rest)));

      // Pengumuman
      await supabase.from('pengumuman').insert(initialPengumuman.map(({ id, ...rest }) => mapPengumumanToDb(rest)));

      // Pelayanan
      await supabase.from('pelayanan').insert(initialPelayanan.map(({ id, ...rest }) => mapPelayananToDb(rest)));

      // Keuangan
      await supabase.from('keuangan_transaksi').insert(initialKeuangan.transaksi.map(({ id, ...rest }) => rest));

      // Events
      await supabase.from('events').insert(initialEvents.map(({ id, ...rest }) => mapEventToDb(rest)));

      // Kategori Kantong
      await supabase.from('kategori_kantong').insert(initialKategoriKantong.map(({ id, ...rest }) => mapKategoriKantongToDb(rest)));

      // Kategori Usia
      await supabase.from('kategori_usia').insert(initialKategoriUsia.map(({ id, ...rest }) => mapKategoriUsiaToDb(rest)));

      // Kategori Transaksi
      await supabase.from('kategori_transaksi').insert([
        { nama_kategori: "Persembahan Mingguan", tipe: "Pemasukan" },
        { nama_kategori: "Persepuluhan", tipe: "Pemasukan" },
        { nama_kategori: "Donasi Khusus", tipe: "Pemasukan" },
        { nama_kategori: "Bunga Bank", tipe: "Pemasukan" },
        { nama_kategori: "Operasional Gedung", tipe: "Pengeluaran" },
        { nama_kategori: "Diakonia", tipe: "Pengeluaran" },
        { nama_kategori: "Sekretariat", tipe: "Pengeluaran" },
        { nama_kategori: "Honor Pembicara", tipe: "Pengeluaran" },
        { nama_kategori: "Pembangunan", tipe: "Pengeluaran" }
      ].map(({ id, ...rest }) => mapKategoriTransaksiToDb(rest)));

      // Reload
      await loadAllData();
      alert('Database Supabase berhasil direset ke data bawaan!');
    } catch (e) {
      console.error('Error resetting database on Supabase:', e);
      alert('Gagal mereset database: ' + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChurchContext.Provider value={{
      isLoading,
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
