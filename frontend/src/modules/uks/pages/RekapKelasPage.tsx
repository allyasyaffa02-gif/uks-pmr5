import React from "react";
import { useUksRekap } from "../hooks/useUksRekap";
import { Download, BarChart2, Info } from "lucide-react";
import { RekapKelasItem } from "../types/uks";

export const RekapKelasPage: React.FC = () => {
  const { rekapList, isLoading } = useUksRekap();

  const totalAll = rekapList.reduce((sum, item) => sum + item.total, 0);
  const totalUpacara = rekapList.reduce((sum, item) => sum + item.upacara, 0);
  const totalHarian = rekapList.reduce((sum, item) => sum + item.harian, 0);

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
    <div className="w-full min-w-0 max-w-full">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex flex-1 items-center gap-2 text-[0.85rem] text-ink-muted">
          <Info size={16} />
          <span>
            Rekap otomatis jumlah kasus per kelas dari seluruh data yang
            tercatat.
          </span>
        </div>
        <button
          className="flex cursor-pointer items-center gap-2 rounded-field border border-line bg-white/[0.05] px-4 py-2.5 font-inherit text-[0.88rem] font-semibold text-ink transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleExportCsv}
          disabled={!rekapList.length}
        >
          <Download size={16} />
          <span>Unduh CSV</span>
        </button>
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
          {/* Tampilan Mobile Card (Responsif 100% tanpa scroll horizontal) */}
          <div className="grid grid-cols-1 gap-3 sm:hidden">
            {rekapList.map((item: RekapKelasItem, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-box border border-line bg-panel/60 p-3.5"
              >
                <div>
                  <div className="text-[0.75rem] font-bold uppercase tracking-wider text-ink-muted">
                    Kelas
                  </div>
                  <div className="text-[1.05rem] font-bold text-cyan-accent">
                    {item.kelas}
                  </div>
                </div>
                <div className="flex items-center gap-3.5 text-right text-[0.83rem]">
                  <div>
                    <div className="text-[0.72rem] text-ink-dim">Upacara</div>
                    <div className="font-bold text-ink">{item.upacara}</div>
                  </div>
                  <div>
                    <div className="text-[0.72rem] text-ink-dim">Harian</div>
                    <div className="font-bold text-ink">{item.harian}</div>
                  </div>
                  <div className="border-l border-white/10 pl-3">
                    <div className="text-[0.72rem] text-amber-accent">Total</div>
                    <div className="text-[0.98rem] font-extrabold text-amber-accent">
                      {item.total}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between rounded-box border border-primary/30 bg-primary/10 p-3.5 font-bold">
              <div className="text-[0.95rem] text-white">Total Keseluruhan</div>
              <div className="flex items-center gap-3.5 text-right text-[0.85rem]">
                <div>
                  <div className="text-[0.72rem] text-ink-muted">Upacara</div>
                  <div className="text-white">{totalUpacara}</div>
                </div>
                <div>
                  <div className="text-[0.72rem] text-ink-muted">Harian</div>
                  <div className="text-white">{totalHarian}</div>
                </div>
                <div className="border-l border-white/10 pl-3">
                  <div className="text-[0.72rem] text-amber-accent">Total</div>
                  <div className="text-[1.05rem] font-extrabold text-amber-accent">
                    {totalAll}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tampilan Tabel Desktop / Tablet */}
          <div className="hidden w-full min-w-0 max-w-full overflow-x-auto rounded-box border border-line sm:block">
            <table className="w-full border-collapse text-left text-[0.9rem]">
              <thead>
                <tr>
                  <th className="border-b border-line bg-panel px-4 py-3.5 text-[0.8rem] font-bold uppercase tracking-[0.05em] text-ink-muted">
                    Kelas
                  </th>
                  <th className="border-b border-line bg-panel px-4 py-3.5 text-right text-[0.8rem] font-bold uppercase tracking-[0.05em] text-ink-muted">
                    Total Kasus
                  </th>
                  <th className="border-b border-line bg-panel px-4 py-3.5 text-right text-[0.8rem] font-bold uppercase tracking-[0.05em] text-ink-muted">
                    Saat Upacara
                  </th>
                  <th className="border-b border-line bg-panel px-4 py-3.5 text-right text-[0.8rem] font-bold uppercase tracking-[0.05em] text-ink-muted">
                    Hari Biasa
                  </th>
                </tr>
              </thead>
              <tbody>
                {rekapList.map((item: RekapKelasItem, index) => (
                  <tr
                    key={index}
                    className="transition-colors duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:bg-white/[0.02]"
                  >
                    <td className="border-b border-white/[0.04] px-4 py-3.5 font-semibold text-ink">
                      {item.kelas}
                    </td>
                    <td className="border-b border-white/[0.04] px-4 py-3.5 text-right font-bold text-amber-accent">
                      {item.total}
                    </td>
                    <td className="border-b border-white/[0.04] px-4 py-3.5 text-right font-bold text-ink">
                      {item.upacara}
                    </td>
                    <td className="border-b border-white/[0.04] px-4 py-3.5 text-right font-bold text-ink">
                      {item.harian}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className="bg-panel px-4 py-3.5 font-extrabold text-white">
                    Total
                  </td>
                  <td className="bg-panel px-4 py-3.5 text-right font-extrabold text-white">
                    {totalAll}
                  </td>
                  <td className="bg-panel px-4 py-3.5 text-right font-extrabold text-white">
                    {totalUpacara}
                  </td>
                  <td className="bg-panel px-4 py-3.5 text-right font-extrabold text-white">
                    {totalHarian}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
