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
    <div className="panel-container">
      <div className="toolbar">
        <div className="search-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Cari nama / kelas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={situasi}
          onChange={(e) => setSituasi(e.target.value)}
          className="filter-select"
        >
          <option value="Semua">Semua situasi</option>
          <option value="Saat Upacara">Saat Upacara</option>
          <option value="Hari Biasa">Hari Biasa</option>
        </select>

        <button
          className="btn-outline"
          onClick={handleExportCsv}
          disabled={!kasusList.length}
        >
          <Download size={16} />
          <span>Unduh CSV</span>
        </button>
      </div>

      {isLoading ? (
        <div className="loading-box">Memuat data kesehatan siswa...</div>
      ) : kasusList.length === 0 ? (
        <div className="empty-box">
          <FileSpreadsheet size={48} />
          <p>Belum ada catatan yang cocok. Isi form di tab "Catat Baru".</p>
        </div>
      ) : (
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Nama</th>
                <th>Kelas</th>
                <th>Situasi</th>
                <th>Keluhan</th>
                <th>Penanganan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {kasusList.map((item: KasusItem) => {
                const badgeClass = /upacara/i.test(item.situasi)
                  ? "upacara"
                  : "harian";
                return (
                  <tr key={item.id}>
                    <td className="tgl-cell">
                      <div className="tgl-text">
                        <Calendar size={14} />
                        <span>{formatDate(item.tanggal)}</span>
                      </div>
                      {item.jam && <span className="jam-text">{item.jam}</span>}
                    </td>
                    <td className="nama-cell">{item.nama}</td>
                    <td className="kelas-cell">{item.kelas}</td>
                    <td>
                      <span className={`badge ${badgeClass}`}>
                        {item.situasi}
                      </span>
                    </td>
                    <td className="ket-cell">{item.keluhan}</td>
                    <td className="ket-cell">{item.penanganan}</td>
                    <td className="action-cell">
                      <button
                        className="del-btn"
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
      )}
    </div>
  );
};
