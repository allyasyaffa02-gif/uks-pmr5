import React, { useState } from "react";
import { useUksKasus } from "../hooks/useUksKasus";
import { Search, Download, FileSpreadsheet } from "lucide-react";
import { KasusItem } from "../types/uks";
import { getFieldClass } from "../../../components/ui/fieldStyles";
import { KasusResults } from "../../../components/ui/Table/KasusResult";

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
    <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
      <div className="p-space-md bg-surface-container-lowest flex flex-col md:flex-row items-stretch md:items-center justify-between gap-space-md">
        <div className="relative flex-1 max-w-xl">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-dim"
          />
          <input
            type="text"
            placeholder="Cari nama / kelas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`pl-10 ${getFieldClass()}`}
          />
        </div>

        <div className="flex items-center gap-space-sm flex-wrap sm:flex-nowrap">
          <select
            value={situasi}
            onChange={(e) => setSituasi(e.target.value)}
            className="w-full appearance-none bg-surface-container-low text-on-surface font-label-md text-label-md py-2.5 pl-space-md pr-9 rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_#dc2626] cursor-pointer"
          >
            <option value="Semua">Semua situasi</option>
            <option value="Saat Upacara">Saat Upacara</option>
            <option value="Hari Biasa">Hari Biasa</option>
          </select>

          <button
            className="flex items-center justify-center gap-space-xs px-space-md py-2.5 bg-surface-container-low hover:bg-surface-container-high text-on-surface hover:text-primary rounded-lg font-label-md text-label-md transition-all shadow-sm active:scale-95 whitespace-nowrap"
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
          <KasusResults
            kasusList={kasusList}
            isDeleting={isDeleting}
            onDelete={handleDelete}
            formatDate={formatDate}
          />
        </>
      )}
    </div>
  );
};
