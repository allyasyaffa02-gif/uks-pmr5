import React, { useState } from "react";
import { useUksKasus } from "../hooks/useUksKasus";
import {
  Search,
  Download,
  Trash2,
  Calendar,
  FileSpreadsheet,
} from "lucide-react";
import { KasusItem } from "../types/uks";

export const DataSpreadsheetPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [situasi, setSituasi] = useState("Semua");

  const { kasusList, isLoading, deleteKasus, isDeleting } = useUksKasus({
    search,
    situasi,
  });

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const handleExportCsv = () => {
    if (!kasusList.length) return;

    const toCsvValue = (val: any) =>
      `"${String(val ?? "").replace(/"/g, '""')}"`;
    const headers = [
      "Tanggal",
      "Jam",
      "Nama",
      "Kelas",
      "Situasi",
      "Keluhan",
      "Penanganan",
    ];
    const rows = kasusList.map((item: KasusItem) => [
      formatDate(item.tanggal),
      item.jam || "",
      item.nama,
      item.kelas,
      item.situasi,
      item.keluhan,
      item.penanganan,
    ]);

    const csvContent = [headers.map(toCsvValue).join(",")]
      .concat(rows.map((r) => r.map(toCsvValue).join(",")))
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `catatan-pmr-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (id: number) => {
    if (
      confirm("Apakah Anda yakin ingin menghapus catatan kasus kesehatan ini?")
    ) {
      await deleteKasus(id);
    }
  };

  return (
    <div className="w-full min-w-0 max-w-full">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-dim"
          />
          <input
            type="text"
            placeholder="Cari nama / kelas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-field border border-white/10 bg-input py-2.5 pl-[38px] pr-3.5 text-[0.92rem] text-ink outline-none transition-[border-color,box-shadow] duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)] placeholder:text-ink-dim focus:border-primary focus:shadow-[0_0_0_3px_var(--color-primary-glow)]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={situasi}
            onChange={(e) => setSituasi(e.target.value)}
            className="flex-1 sm:flex-none min-w-[150px] cursor-pointer rounded-field border border-white/10 bg-input px-3.5 py-2.5 text-[0.92rem] text-ink outline-none transition-[border-color,box-shadow] duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)] focus:border-primary focus:shadow-[0_0_0_3px_var(--color-primary-glow)]"
          >
            <option value="Semua">Semua situasi</option>
            <option value="Saat Upacara">Saat Upacara</option>
            <option value="Hari Biasa">Hari Biasa</option>
          </select>

          <button
            className="flex cursor-pointer items-center justify-center gap-2 rounded-field border border-line bg-white/[0.05] px-4 py-2.5 font-inherit text-[0.88rem] font-semibold text-ink transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleExportCsv}
            disabled={!kasusList.length}
          >
            <Download size={16} />
            <span>Unduh CSV</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center text-ink-muted">
          Memuat data kesehatan siswa...
        </div>
      ) : kasusList.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center text-ink-muted">
          <FileSpreadsheet size={48} />
          <p>Belum ada catatan yang cocok. Isi form di tab "Catat Baru".</p>
        </div>
      ) : (
        <>
          {/* Tampilan Mobile Card (Responsif 100% tanpa scroll horizontal berlebih) */}
          <div className="flex flex-col gap-3 md:hidden">
            {kasusList.map((item: KasusItem) => {
              const isUpacara = /upacara/i.test(item.situasi);
              return (
                <div
                  key={item.id}
                  className="flex flex-col gap-2.5 rounded-box border border-line bg-panel/60 p-3.5 text-[0.88rem]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[0.95rem] font-bold text-white">
                        {item.nama}
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-[0.8rem] font-semibold text-cyan-accent">
                          {item.kelas}
                        </span>
                        <span
                          className={`inline-block rounded-full border px-2 py-0.5 text-[0.7rem] font-bold ${
                            isUpacara
                              ? "border-amber-accent/30 bg-amber-accent/15 text-amber-accent"
                              : "border-cyan-accent/30 bg-cyan-accent/15 text-cyan-accent"
                          }`}
                        >
                          {item.situasi}
                        </span>
                      </div>
                    </div>
                    <button
                      className="cursor-pointer rounded-[6px] p-1.5 text-ink-dim hover:bg-red-400/15 hover:text-red-400"
                      title="Hapus"
                      onClick={() => handleDelete(item.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 text-[0.8rem] font-medium text-ink-dim">
                    <Calendar size={13} />
                    <span>{formatDate(item.tanggal)}</span>
                    {item.jam && <span>• {item.jam}</span>}
                  </div>

                  <div className="grid grid-cols-1 gap-1.5 border-t border-white/[0.06] pt-2 text-[0.83rem]">
                    <div>
                      <span className="font-semibold text-ink-muted">
                        Keluhan:{" "}
                      </span>
                      <span className="text-ink">{item.keluhan}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-ink-muted">
                        Penanganan:{" "}
                      </span>
                      <span className="text-ink">{item.penanganan}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tampilan Table Desktop / Tablet */}
          <div className="hidden w-full min-w-0 max-w-full overflow-x-auto rounded-box border border-line md:block">
          <table className="w-full min-w-[700px] border-collapse text-left text-[0.9rem]">
            <thead>
              <tr>
                {[
                  "Tanggal",
                  "Nama",
                  "Kelas",
                  "Situasi",
                  "Keluhan",
                  "Penanganan",
                  "Aksi",
                ].map((label) => (
                  <th
                    key={label}
                    className="border-b border-line bg-panel px-4 py-3.5 text-[0.8rem] font-bold uppercase tracking-[0.05em] text-ink-muted"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {kasusList.map((item: KasusItem) => {
                const isUpacara = /upacara/i.test(item.situasi);
                return (
                  <tr
                    key={item.id}
                    className="transition-colors duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:bg-white/[0.02]"
                  >
                    <td className="whitespace-nowrap border-b border-white/[0.04] px-4 py-3.5">
                      <div className="flex items-center gap-1.5 font-semibold text-ink">
                        <Calendar size={14} />
                        <span>{formatDate(item.tanggal)}</span>
                      </div>
                      {item.jam && (
                        <span className="text-[0.78rem] text-ink-dim">
                          {item.jam}
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap border-b border-white/[0.04] px-4 py-3.5 font-bold text-white">
                      {item.nama}
                    </td>
                    <td className="whitespace-nowrap border-b border-white/[0.04] px-4 py-3.5 font-semibold text-cyan-accent">
                      {item.kelas}
                    </td>
                    <td className="whitespace-nowrap border-b border-white/[0.04] px-4 py-3.5">
                      <span
                        className={`inline-block rounded-full border px-2.5 py-1 text-[0.75rem] font-bold ${
                          isUpacara
                            ? "border-amber-accent/30 bg-amber-accent/15 text-amber-accent"
                            : "border-cyan-accent/30 bg-cyan-accent/15 text-cyan-accent"
                        }`}
                      >
                        {item.situasi}
                      </span>
                    </td>
                    <td className="max-w-[220px] break-words border-b border-white/[0.04] px-4 py-3.5 text-ink-muted">
                      {item.keluhan}
                    </td>
                    <td className="max-w-[250px] break-words border-b border-white/[0.04] px-4 py-3.5 text-ink-muted">
                      {item.penanganan}
                    </td>
                    <td className="whitespace-nowrap border-b border-white/[0.04] px-4 py-3.5">
                      <button
                        className="cursor-pointer rounded-[6px] p-1.5 text-ink-dim transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:bg-red-400/15 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                        title="Hapus"
                        onClick={() => handleDelete(item.id)}
                        disabled={isDeleting}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </>
      )}
    </div>
  );
};
