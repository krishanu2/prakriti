import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/* ---------------------------------- Toasts --------------------------------- */

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const showToast = useCallback((message, tone = 'success') => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3200);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="fixed bottom-5 right-5 z-[300] flex flex-col gap-2 items-end pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto px-4 py-3 rounded-md shadow-lg text-sm font-medium max-w-[320px]"
              style={{
                background: t.tone === 'error' ? '#a13d2e' : 'var(--ink)',
                color: 'var(--cream)',
              }}
            >
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}

/* -------------------------------- Confirm dialog ---------------------------- */

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [state, setState] = useState(null); // { title, body, confirmLabel, danger, resolve }

  const confirm = useCallback(({ title, body, confirmLabel = 'Confirm', danger = false }) => {
    return new Promise((resolve) => {
      setState({ title, body, confirmLabel, danger, resolve });
    });
  }, []);

  function handleClose(result) {
    if (state) state.resolve(result);
    setState(null);
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <AnimatePresence>
        {state && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[400] flex items-center justify-center px-5"
            style={{ background: 'rgba(26,25,23,0.45)' }}
            onClick={() => handleClose(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.18 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg max-w-[420px] w-full p-7 shadow-xl"
            >
              <p className="text-h3 text-ink mb-2">{state.title}</p>
              <p className="text-body text-[14px] mb-6">{state.body}</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => handleClose(false)} className="btn-outline !py-2.5 !px-5 !text-[12px]">
                  Cancel
                </button>
                <button
                  onClick={() => handleClose(true)}
                  className="!py-2.5 !px-5 text-[12px] font-semibold uppercase tracking-wide rounded-[2px] text-white"
                  style={{ background: state.danger ? '#a13d2e' : 'var(--ink)' }}
                >
                  {state.confirmLabel}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used inside ConfirmProvider');
  return ctx;
}

/* ----------------------------------- Modal ----------------------------------- */

export function Modal({ title, onClose, children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[350] flex items-center justify-center px-5 py-8 overflow-y-auto"
      style={{ background: 'rgba(26,25,23,0.45)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.97 }}
        transition={{ duration: 0.18 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg max-w-[520px] w-full p-7 shadow-xl my-auto"
      >
        <div className="flex items-start justify-between mb-5">
          <p className="text-h3 text-ink">{title}</p>
          <button onClick={onClose} className="text-xl leading-none text-black/40 hover:text-ink">×</button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

/* --------------------------------- Small bits -------------------------------- */

export function Spinner({ size = 20 }) {
  return (
    <div
      className="animate-spin rounded-full border-2 border-black/10"
      style={{ width: size, height: size, borderTopColor: 'var(--ink)' }}
    />
  );
}

export function EmptyState({ title, body }) {
  return (
    <div className="text-center py-16 px-6 border border-dashed border-black/[0.15] rounded-lg">
      <p className="font-inter font-semibold text-ink mb-1">{title}</p>
      {body && <p className="text-body text-[13px] max-w-[380px] mx-auto">{body}</p>}
    </div>
  );
}
