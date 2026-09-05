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
    <div className="panel-container">
      <div className="toolbar">
        <div className="rekap-note">
          <Info size={16} />
          <span>
            Rekap otomatis jumlah kasus per kelas dari seluruh data yang
            tercatat.
          </span>
        </div>
        <button
          className="btn-outline"
          onClick={handleExportCsv}
          disabled={!rekapList.length}
        >
          <Download size={16} />
          <span>Unduh CSV</span>
        </button>
      </div>

      {isLoading ? (
        <div className="loading-box">Kalkulasi rekapitulasi data...</div>
      ) : rekapList.length === 0 ? (
        <div className="empty-box">
          <BarChart2 size={48} />
          <p>Belum ada data untuk direkap.</p>
        </div>
      ) : (
        <div className="table-scroll">
          <table className="rekap-table">
            <thead>
              <tr>
                <th>Kelas</th>
                <th className="num-cell">Total Kasus</th>
                <th className="num-cell">Saat Upacara</th>
                <th className="num-cell">Hari Biasa</th>
              </tr>
            </thead>
            <tbody>
              {rekapList.map((item: RekapKelasItem, index) => (
                <tr key={index}>
                  <td className="kelas-rekap">{item.kelas}</td>
                  <td className="num-cell highlight">{item.total}</td>
                  <td className="num-cell">{item.upacara}</td>
                  <td className="num-cell">{item.harian}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td>Total</td>
                <td className="num-cell">{totalAll}</td>
                <td className="num-cell">{totalUpacara}</td>
                <td className="num-cell">{totalHarian}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};
