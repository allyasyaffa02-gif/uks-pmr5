import React from "react";
import { useUksRekap } from "../hooks/useUksRekap";
import { Download, BarChart2, Info } from "lucide-react";
import { RekapKelasItem } from "../types/uks";
import { RekapKelasTable } from "../../../components/ui/Table/RekapKelasTable";

export const RekapKelasPage: React.FC = () => {
  const { rekapList, isLoading } = useUksRekap();

  const handleExportCsv = () => {
    if (!rekapList.length) return;

    const toCsvValue = (val: any) =>
      `"${String(val ?? "").replace(/"/g, '""')}"`;
    const headers = ["Kelas", "Total Kasus", "Saat Upacara", "Hari Biasa"];
    const rows = rekapList.map((item: RekapKelasItem) => [
      item.kelas,
      item.total,
      item.upacara,
      item.harian,
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
    a.download = `rekap-per-kelas-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
      <div className="p-space-lg flex flex-col sm:flex-row sm:items-center justify-between gap-space-md bg-surface-container-low/50">
        <div className="flex items-center gap-space-sm text-secondary">
          <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center shrink-0 text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px]">info</span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant font-medium">
            Rekap otomatis jumlah kasus per kelas dari seluruh data yang
            tercatat di Posko UKS.
          </p>
        </div>
        <div className="flex items-center gap-space-sm self-end sm:self-auto shrink-0">
          <button
            className="inline-flex items-center gap-space-xs px-space-md py-2 bg-surface-container-lowest text-on-surface hover:bg-surface-container-high rounded-lg shadow-sm font-label-lg text-label-lg transition-all active:scale-[0.98]"
            onClick={handleExportCsv}
            disabled={!rekapList.length}
          >
            <Download size={16} />
            <span>Unduh CSV</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center text-ink-muted">
          Kalkulasi rekapitulasi data...
        </div>
      ) : rekapList.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center text-ink-muted">
          <BarChart2 size={48} />
          <p>Belum ada data untuk direkap.</p>
        </div>
      ) : (
        <>
          <RekapKelasTable rows={rekapList} />
        </>
      )}
    </div>
  );
};
