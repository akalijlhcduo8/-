import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast, language } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      className={`fixed top-24 ${language === 'ar' ? 'left-6' : 'right-6'} z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full`}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border backdrop-blur-xl shadow-2xl transition-all animate-in fade-in slide-in-from-top-3 ${
            toast.type === 'success'
              ? 'bg-[#0f1d17]/95 border-emerald-500/40 text-emerald-100 glow-emerald'
              : toast.type === 'warning'
              ? 'bg-[#221a0f]/95 border-amber-500/40 text-amber-100'
              : 'bg-[#141527]/95 border-purple-500/40 text-purple-100 glow-purple'
          }`}
        >
          <div className="mt-0.5 flex-shrink-0">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-400" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-cyan-400" />}
          </div>

          <div className="flex-1 text-xs">
            <h5 className="font-bold text-sm text-white mb-0.5">{toast.title}</h5>
            <p className="text-slate-300 leading-relaxed">{toast.message}</p>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
