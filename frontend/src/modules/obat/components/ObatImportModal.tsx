import React, { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileUp,
  Info,
  Loader2,
  Upload,
  X,
  XCircle,
} from "lucide-react";
import { ImportObatResult } from "../types/obat";

interface ObatImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File) => Promise<ImportObatResult>;
  /** Unduh template; mengembalikan pesan kesalahan (null bila berhasil). */
  onDownloadTemplate: () => Promise<string | null>;
  isImporting: boolean;
  isDownloadingTemplate: boolean;
}

/** Batas ukuran file, disamakan dengan batas di backend (5 MB). */
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Ambil pesan error dari response API. Response bertipe Blob (kasus download)
 * dibaca sebagai teks terlebih dahulu agar pesan JSON-nya tetap terbaca.
 */
async function resolveErrorMessage(
  error: any,
  fallback: string,
): Promise<string> {
  const data = error?.response?.data;

  if (typeof data === "string" && data.trim()) return data;
  if (typeof data?.message === "string") return data.message;
  if (Array.isArray(data?.message)) return data.message.join(", ");

  if (typeof Blob !== "undefined" && data instanceof Blob) {
    try {
      const parsed = JSON.parse(await data.text());
      if (typeof parsed?.message === "string") return parsed.message;
    } catch {
      // biarkan memakai pesan fallback
    }
  }

  return fallback;
}

/** Modal import Excel: unduh template, unggah file, lalu tampilkan hasilnya. */
export const ObatImportModal: React.FC<ObatImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
  onDownloadTemplate,
  isImporting,
  isDownloadingTemplate,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ImportObatResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [onlyFailed, setOnlyFailed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Setiap kali modal dibuka, mulai dari kondisi bersih.
  useEffect(() => {
    if (!isOpen) return;

    setFile(null);
    setResult(null);
    setErrorMessage(null);
    setOnlyFailed(false);
    setIsDragging(false);
    if (inputRef.current) inputRef.current.value = "";
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePickFile = (picked: File | null) => {
    setErrorMessage(null);
    setResult(null);

    if (!picked) {
      setFile(null);
      return;
    }

    if (!/\.xlsx$/i.test(picked.name)) {
      setFile(null);
      setErrorMessage(
        "File harus berformat .xlsx sesuai template yang diunduh.",
      );
      return;
    }

    if (picked.size > MAX_FILE_SIZE) {
      setFile(null);
      setErrorMessage("Ukuran file maksimal 5 MB.");
      return;
    }

    setFile(picked);
  };

  const handleUpload = async () => {
    if (!file || isImporting) return;

    setErrorMessage(null);

    try {
      const importResult = await onImport(file);
      setResult(importResult);
      setOnlyFailed(false);
    } catch (error) {
      setResult(null);
      setErrorMessage(
        await resolveErrorMessage(
          error,
          "Gagal mengimport file. Silakan periksa kembali file Anda.",
        ),
      );
    }
  };

  const handleDownload = async () => {
    setErrorMessage(null);

    const message = await onDownloadTemplate();
    if (message) setErrorMessage(message);
  };

  const rows = result
    ? onlyFailed
      ? result.rows.filter((row) => row.status === "failed")
      : result.rows
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-3xl border border-black/5 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Modal */}
        <div className="px-6 py-4.5 border-b border-surface-container-high/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container/15 flex items-center justify-center text-primary">
              <FileSpreadsheet size={22} />
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface">
                Import Data Obat
              </h3>
              <p className="font-body-sm text-body-sm text-secondary">
                Unggah file Excel untuk menambahkan banyak obat sekaligus
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isImporting}
            title="Tutup"
            className="p-2 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5 overflow-y-auto">
          {/* Langkah 1: unduh template */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-surface-container-low/60 border border-black/5 p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 shrink-0 rounded-lg bg-primary-fixed/40 flex items-center justify-center text-primary">
                <Download size={18} />
              </div>
              <div>
                <p className="font-label-lg text-label-lg text-on-surface font-semibold">
                  Langkah 1 — Unduh Template
                </p>
                <p className="font-body-sm text-body-sm text-secondary mt-0.5">
                  Kolom: Nama Obat, Tanggal Beli, Tanggal Kadaluarsa, Stok, dan
                  Satuan.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloadingTemplate}
              className="shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-label-lg text-label-lg border border-black/10 bg-surface-container-lowest text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isDownloadingTemplate ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Download size={16} />
              )}
              <span>Download Template</span>
            </button>
          </div>

          {/* Langkah 2: unggah file */}
          <div className="space-y-3">
            <p className="font-label-lg text-label-lg text-on-surface font-semibold">
              Langkah 2 — Unggah File Excel
            </p>

            <div
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                handlePickFile(event.dataTransfer?.files?.[0] ?? null);
              }}
              className={`rounded-xl border-2 border-dashed p-5 text-center transition-colors ${
                isDragging
                  ? "border-primary bg-primary-container/10"
                  : "border-black/10 bg-surface-container-low/40"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-11 h-11 rounded-xl bg-surface-container-low flex items-center justify-center text-primary">
                  <FileUp size={22} />
                </div>

                {file ? (
                  <>
                    <p className="font-label-lg text-label-lg text-on-surface break-all">
                      {file.name}
                    </p>
                    <p className="font-body-sm text-body-sm text-secondary">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-body-md text-body-md text-on-surface">
                      Tarik &amp; lepas file .xlsx di sini
                    </p>
                    <p className="font-body-sm text-body-sm text-secondary">
                      atau pilih file dari perangkat Anda (maksimal 5 MB)
                    </p>
                  </>
                )}

                <input
                  ref={inputRef}
                  type="file"
                  accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  className="hidden"
                  onChange={(event) =>
                    handlePickFile(event.target.files?.[0] ?? null)
                  }
                />

                <div className="flex items-center gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={isImporting}
                    className="px-4 py-2 rounded-xl font-label-lg text-label-lg border border-black/10 bg-surface-container-lowest text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {file ? "Ganti File" : "Pilih File"}
                  </button>
                  {file && (
                    <button
                      type="button"
                      onClick={() => {
                        handlePickFile(null);
                        if (inputRef.current) inputRef.current.value = "";
                      }}
                      disabled={isImporting}
                      className="px-4 py-2 rounded-xl font-label-lg text-label-lg text-secondary hover:bg-surface-container-low transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-lg bg-surface-container-low/60 border border-black/5 px-3 py-2.5">
              <Info size={15} className="text-primary shrink-0 mt-0.5" />
              <p className="font-body-sm text-body-sm text-secondary">
                Baris dengan satuan kosong atau tidak terdaftar akan dilaporkan
                gagal, sedangkan baris lainnya tetap tersimpan.
              </p>
            </div>

            {errorMessage && (
              <div className="flex items-start gap-2 rounded-lg bg-error/10 border border-error/20 px-3 py-2.5">
                <AlertCircle size={16} className="text-error shrink-0 mt-0.5" />
                <p className="font-body-sm text-body-sm text-error">
                  {errorMessage}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={handleUpload}
              disabled={!file || isImporting}
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-label-lg text-label-lg bg-primary-container text-on-primary-container hover:bg-primary shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isImporting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Memproses Import...</span>
                </>
              ) : (
                <>
                  <Upload size={18} />
                  <span>Upload &amp; Import</span>
                </>
              )}
            </button>
          </div>

          {/* Hasil import per baris */}
          {result && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-label-lg text-label-lg text-on-surface font-semibold">
                  Hasil Import
                </p>
                <div className="flex items-center gap-1 rounded-xl bg-surface-container-low p-0.5">
                  <button
                    type="button"
                    onClick={() => setOnlyFailed(false)}
                    className={`px-3 py-1.5 rounded-lg text-label-md transition-all cursor-pointer ${
                      !onlyFailed
                        ? "bg-surface-container-lowest text-on-surface font-semibold shadow-xs"
                        : "text-secondary hover:text-on-surface"
                    }`}
                  >
                    Semua ({result.summary.total})
                  </button>
                  <button
                    type="button"
                    onClick={() => setOnlyFailed(true)}
                    className={`px-3 py-1.5 rounded-lg text-label-md transition-all cursor-pointer ${
                      onlyFailed
                        ? "bg-error/20 text-error font-semibold shadow-xs"
                        : "text-secondary hover:text-on-surface"
                    }`}
                  >
                    Gagal ({result.summary.failed})
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                <div className="rounded-xl border border-black/5 bg-surface-container-lowest p-3">
                  <p className="font-label-sm text-label-sm text-secondary">
                    Total Diproses
                  </p>
                  <p className="font-headline-md text-headline-md text-on-surface font-bold mt-0.5">
                    {result.summary.total}
                  </p>
                </div>
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
                  <p className="font-label-sm text-label-sm text-emerald-700">
                    Berhasil
                  </p>
                  <p className="font-headline-md text-headline-md text-emerald-700 font-bold mt-0.5">
                    {result.summary.success}
                  </p>
                </div>
                <div className="rounded-xl border border-error/20 bg-error/10 p-3">
                  <p className="font-label-sm text-label-sm text-error">
                    Gagal
                  </p>
                  <p className="font-headline-md text-headline-md text-error font-bold mt-0.5">
                    {result.summary.failed}
                  </p>
                </div>
                <div className="rounded-xl border border-black/5 bg-surface-container-lowest p-3">
                  <p className="font-label-sm text-label-sm text-secondary">
                    Diabaikan
                  </p>
                  <p className="font-headline-md text-headline-md text-on-surface font-bold mt-0.5">
                    {result.summary.skipped}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-black/5 overflow-hidden">
                <div className="overflow-x-auto overflow-y-auto max-h-72">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0">
                      <tr className="border-b border-surface-container-high/60 bg-surface-container-low/90 backdrop-blur-xs">
                        <th className="px-3 py-2 font-label-md text-label-md text-secondary">
                          Baris
                        </th>
                        <th className="px-3 py-2 font-label-md text-label-md text-secondary">
                          Nama Obat
                        </th>
                        <th className="px-3 py-2 font-label-md text-label-md text-secondary">
                          Status
                        </th>
                        <th className="px-3 py-2 font-label-md text-label-md text-secondary">
                          Keterangan
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-3 py-6 text-center font-body-sm text-body-sm text-secondary"
                          >
                            Tidak ada baris untuk ditampilkan.
                          </td>
                        </tr>
                      ) : (
                        rows.map((row) => (
                          <tr
                            key={row.row}
                            className="border-b border-surface-container-high/40 last:border-0"
                          >
                            <td className="px-3 py-2 font-body-sm text-body-sm text-secondary">
                              {row.row}
                            </td>
                            <td className="px-3 py-2 font-body-sm text-body-sm text-on-surface">
                              {row.name}
                            </td>
                            <td className="px-3 py-2">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-label-sm font-medium ${
                                  row.status === "success"
                                    ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                                    : "bg-error/10 text-error border-error/20"
                                }`}
                              >
                                {row.status === "success" ? (
                                  <CheckCircle2 size={12} />
                                ) : (
                                  <XCircle size={12} />
                                )}
                                {row.status === "success"
                                  ? "Berhasil"
                                  : "Gagal"}
                              </span>
                            </td>
                            <td className="px-3 py-2 font-body-sm text-body-sm text-secondary">
                              {row.message}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {result.summary.success > 0 && (
                <p className="font-body-sm text-body-sm text-secondary">
                  {result.summary.success} baris berhasil disimpan dan sudah
                  masuk ke daftar Master Data Obat.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-surface-container-high/60 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isImporting}
            className="px-5 py-2.5 rounded-xl font-label-lg text-label-lg text-secondary hover:bg-surface-container-low transition-colors cursor-pointer disabled:opacity-50"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
