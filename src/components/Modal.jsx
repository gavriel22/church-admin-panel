import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  // Close modal when pressing Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
      <div 
        className="fixed inset-0 bg-transparent" 
        onClick={onClose} 
        aria-hidden="true"
      />
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-xl shadow-lg border border-stone-200/80 flex flex-col z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-50 transition-colors focus:outline-none"
            aria-label="Tutup modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 py-4 overflow-y-auto max-h-[calc(90vh-110px)]">
          {children}
        </div>
      </div>
    </div>
  );
}
