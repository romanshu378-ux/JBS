import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, X } from 'lucide-react';

// ─── Toast Component ──────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -20, scale: 0.95 }}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white font-medium text-sm ${
      type === 'success' ? 'bg-green-600' : 'bg-red-600'
    }`}
  >
    {type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
    <span className="flex-1">{message}</span>
    <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
      <X size={16} />
    </button>
  </motion.div>
);

// ─── Toast Container ──────────────────────────────────────────────────────────
export const ToastContainer = ({ toasts, removeToast }) => (
  <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 min-w-[280px]">
    <AnimatePresence>
      {toasts.map((t) => (
        <Toast key={t.id} {...t} onClose={() => removeToast(t.id)} />
      ))}
    </AnimatePresence>
  </div>
);

// ─── useToast Hook ────────────────────────────────────────────────────────────
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, addToast, removeToast, success: (m) => addToast(m, 'success'), error: (m) => addToast(m, 'error') };
};
