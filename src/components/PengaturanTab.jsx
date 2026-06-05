import { useState } from 'react';
import { Palette, Database, RefreshCw, Check, AlertTriangle } from 'lucide-react';

export default function PengaturanTab({ 
  accentColor, 
  setAccentColor, 
  onResetDatabase, 
  accentClasses 
}) {
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const colors = [
    { id: 'amber', name: 'Warm Amber', bg: 'bg-amber-600', text: 'text-amber-700', description: 'Warna bumi yang hangat dan bersahaja.' },
    { id: 'emerald', name: 'Emerald Green', bg: 'bg-emerald-600', text: 'text-emerald-700', description: 'Representasi pertumbuhan iman dan kesegaran.' },
    { id: 'indigo', name: 'Royal Indigo', bg: 'bg-indigo-600', text: 'text-indigo-700', description: 'Tampilan tenang, berwibawa, dan kontemporer.' },
    { id: 'slate', name: 'Classic Slate', bg: 'bg-slate-700', text: 'text-slate-700', description: 'Minimalisme administratif modern klasik.' }
  ];

  const handleReset = () => {
    onResetDatabase();
    setShowConfirmReset(false);
    setResetSuccess(true);
    setTimeout(() => {
      setResetSuccess(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Accent Color Chooser Card */}
        <div className="bg-white border border-stone-200/60 p-5 rounded-xl shadow-xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-stone-100 pb-2.5">
            <Palette className="w-4.5 h-4.5 text-stone-400" />
            <h3 className="text-sm font-semibold text-stone-850">Kustomisasi Tema Aksen</h3>
          </div>
          
          <p className="text-[11px] text-stone-500 leading-relaxed">
            Pilih warna aksen utama yang akan diterapkan pada tombol, tautan navigasi, ikon, dan penanda status di seluruh panel admin.
          </p>

          <div className="space-y-3 pt-2">
            {colors.map((color) => {
              const isSelected = accentColor === color.id;
              return (
                <button
                  key={color.id}
                  onClick={() => setAccentColor(color.id)}
                  className={`
                    w-full flex items-center justify-between p-3 border rounded-lg text-left transition-all focus:outline-none
                    ${isSelected 
                      ? 'border-stone-400 bg-stone-50/50 shadow-xs' 
                      : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/20'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`w-4 h-4 rounded-full ${color.bg} border border-white shadow-xs`} />
                    <div>
                      <p className="text-xs font-bold text-stone-800">{color.name}</p>
                      <p className="text-[10px] text-stone-400 mt-0.5">{color.description}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className={`p-1 rounded-full ${color.bg} text-white`}>
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Database Utility Card */}
        <div className="bg-white border border-stone-200/60 p-5 rounded-xl shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-stone-100 pb-2.5">
              <Database className="w-4.5 h-4.5 text-stone-400" />
              <h3 className="text-sm font-semibold text-stone-850">Utilitas & Basis Data</h3>
            </div>

            <p className="text-[11px] text-stone-500 leading-relaxed">
              Utilitas administrasi ini digunakan untuk memelihara data mock simulasi. Mereset database akan menghapus seluruh data tambahan yang telah Anda buat (jemaat baru, pengumuman baru, jadwal baru, dsb.) dan mengembalikannya ke data bawaan program.
            </p>

            {/* Notification messages */}
            {resetSuccess && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-xs font-medium flex items-center animate-in fade-in duration-200">
                <Check className="w-4 h-4 mr-2" />
                Basis data berhasil direset ke kondisi default!
              </div>
            )}

            {showConfirmReset && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg space-y-3 animate-in slide-in-from-bottom-2 duration-150">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-red-650 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-red-800">Apakah Anda Yakin?</h4>
                    <p className="text-[10.5px] text-red-700 mt-0.5 leading-relaxed font-medium">
                      Tindakan ini permanen. Semua data jemaat, pelayanan, pengumuman, dan laporan keuangan yang baru dicatat akan dihapus sepenuhnya.
                    </p>
                  </div>
                </div>
                <div className="flex justify-end gap-2 text-[10.5px] font-bold">
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="px-2.5 py-1 border border-stone-250 hover:bg-white bg-stone-50/50 rounded text-stone-600 focus:outline-none"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded focus:outline-none"
                  >
                    Ya, Reset Data
                  </button>
                </div>
              </div>
            )}
          </div>

          {!showConfirmReset && (
            <div className="pt-4 border-t border-stone-100">
              <button
                onClick={() => setShowConfirmReset(true)}
                className={`w-full flex items-center justify-center py-2.5 px-4 rounded-lg text-xs font-semibold border border-red-200 text-red-700 bg-red-50/50 hover:bg-red-50 hover:border-red-300 transition-all focus:outline-none`}
              >
                <RefreshCw className="w-3.5 h-3.5 mr-2" />
                Reset Data Simulasi Ke Bawaan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
