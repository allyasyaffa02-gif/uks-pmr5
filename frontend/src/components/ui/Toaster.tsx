import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import type { LucideIcon } from "lucide-react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

export type ToastVariant = "success" | "error" | "info";

export interface ToastItem {
  id: number;
  variant: ToastVariant;
  message: string;
}

/** Durasi default sebuah notifikasi tampil sebelum otomatis ditutup. */
const DEFAULT_DURATION_MS = 4000;

interface ToastContextValue {
  /** Tutup satu notifikasi berdasarkan id-nya. */
  dismiss: (id: number) => void;
  /** Tampilkan notifikasi dengan varian yang dipilih. */
  show: (message: string, variant?: ToastVariant, durationMs?: number) => void;
  success: (message: string, durationMs?: number) => void;
  error: (message: string, durationMs?: number) => void;
  info: (message: string, durationMs?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const VARIANT_CONFIG: Record<
  ToastVariant,
  { icon: LucideIcon; accentClass: string }
> = {
  success: { icon: CheckCircle2, accentClass: "text-emerald-500" },
  error: { icon: AlertCircle, accentClass: "text-error" },
  info: { icon: Info, accentClass: "text-secondary" },
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idCounter = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback(
    (
      message: string,
      variant: ToastVariant = "info",
      durationMs: number = DEFAULT_DURATION_MS,
    ) => {
      const id = ++idCounter.current;
      setToasts((current) => [...current, { id, variant, message }]);

      if (durationMs > 0) {
        window.setTimeout(() => dismiss(id), durationMs);
      }
    },
    [dismiss],
  );

  const success = useCallback(
    (message: string, durationMs?: number) =>
      show(message, "success", durationMs),
    [show],
  );

  const error = useCallback(
    (message: string, durationMs?: number) => show(message, "error", durationMs),
    [show],
  );

  const info = useCallback(
    (message: string, durationMs?: number) => show(message, "info", durationMs),
    [show],
  );

  const value = useMemo<ToastContextValue>(
    () => ({ dismiss, show, success, error, info }),
    [dismiss, show, success, error, info],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        aria-live="polite"
        className="pointer-events-none fixed right-space-md top-space-md z-[60] flex w-full max-w-sm flex-col gap-space-sm"
      >
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastCard: React.FC<{
  toast: ToastItem;
  onDismiss: (id: number) => void;
}> = ({ toast, onDismiss }) => {
  const { icon: Icon, accentClass } = VARIANT_CONFIG[toast.variant];

  return (
    <div className="pointer-events-auto flex w-full items-start gap-space-sm rounded-lg border border-surface-container-high bg-surface-container-lowest px-space-md py-space-sm shadow-lg animate-in fade-in duration-200">
      <Icon size={18} className={`mt-0.5 shrink-0 ${accentClass}`} />
      <p className="flex-1 font-body-sm text-body-sm text-on-surface">
        {toast.message}
      </p>
      <button
        type="button"
        aria-label="Tutup notifikasi"
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 text-secondary transition-colors hover:text-on-surface"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast harus dipakai di dalam ToastProvider");
  }

  return context;
};