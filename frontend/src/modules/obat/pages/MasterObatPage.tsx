import React, { useState, useMemo } from "react";
import { Header } from "../../../components/ui/Header";
import { useObat } from "../hooks/useObat";
import { ObatItem, CreateObatInput, ObatFilterStatus } from "../types/obat";
import { ObatModal } from "../components/ObatModal";
import {
  Pill,
  Search,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  Clock,
  Package,
  Layers,
  Calendar,
  X,
  RefreshCw,
} from "lucide-react";
import { useDebounce } from "../../../hooks/useDebounce";

const MIN_SEARCH_LENGTH = 3;

export const MasterObatPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  // di bawah 3 huruf, search dianggap kosong
  const effectiveSearch =
    debouncedSearch.length >= MIN_SEARCH_LENGTH ? debouncedSearch : "";

  const [activeFilter, setActiveFilter] = useState<ObatFilterStatus>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingObat, setEditingObat] = useState<ObatItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ObatItem | null>(null);

  const {
    obatList,
    isLoading,
    summary,
    createObat,
    updateObat,
    deleteObat,
    isCreating,
    isUpdating,
    isDeleting,
    refetch,
  } = useObat({
    search: effectiveSearch,
    status: activeFilter,
  });

  const currentYear = new Date().getFullYear();

  // Helper function to check expiration status
  const getExpirationStatus = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expDate = new Date(dateStr);
    expDate.setHours(0, 0, 0, 0);

    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        label: "Kadaluarsa",
        days: Math.abs(diffDays),
        badgeClass: "bg-error/10 text-error border-error/20",
        isExpired: true,
      };
    }
    if (diffDays <= 30) {
      return {
        label: `${diffDays} hari lagi`,
        days: diffDays,
        badgeClass: "bg-amber-500/10 text-amber-700 border-amber-500/20",
        isExpiringSoon: true,
      };
    }
    return {
      label: "Aman",
      days: diffDays,
      badgeClass: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
      isSafe: true,
    };
  };

  const handleOpenAdd = () => {
    setEditingObat(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ObatItem) => {
    setEditingObat(item);
    setIsModalOpen(true);
  };

  const handleSaveObat = async (data: CreateObatInput) => {
    if (editingObat) {
      await updateObat({ id: editingObat.id, data });
    } else {
      await createObat(data);
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      await deleteObat(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      {/* Header Aplikasi Terpadu */}
      <Header />

      <main className="w-full pt-20 bg-surface flex-1">
        <div className="flex flex-col w-full max-w-7xl mx-auto px-gutter-desktop py-space-lg space-y-space-lg">
          {/* Header Judul Halaman */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary-container/15 flex items-center justify-center text-primary shadow-xs">
                <Pill size={26} />
              </div>
              <div>
                <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
                  Master Data Obat
                </h1>
                <p className="font-body-md text-body-md text-secondary">
                  Kelola inventaris, stok masuk, dan pemantauan masa kedaluwarsa
                  obat UKS
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => refetch()}
                title="Muat Ulang Data"
                className="p-2.5 rounded-xl border border-black/10 bg-surface-container-lowest text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors shadow-xs"
              >
                <RefreshCw
                  size={18}
                  className={isLoading ? "animate-spin" : ""}
                />
              </button>
              <button
                onClick={handleOpenAdd}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-label-lg text-label-lg bg-primary-container text-on-primary-container hover:bg-primary shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Plus size={18} />
                <span>Tambah Obat</span>
              </button>
            </div>
          </div>

          {/* Metric Summary Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
            {/* Card 1: Total Jenis Obat */}
            <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-xs border border-black/5 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-secondary">
                  Total Macam Obat
                </span>
                <span className="font-headline-xl text-headline-xl text-on-surface font-bold mt-1">
                  {summary.totalJenis}
                </span>
                <span className="font-label-sm text-label-sm text-secondary mt-0.5">
                  Tercatat di sistem
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-primary">
                <Layers size={24} />
              </div>
            </div>

            {/* Card 2: Total Satuan / Unit */}
            <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-xs border border-black/5 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-secondary">
                  Total Fisik Stok
                </span>
                <span className="font-headline-xl text-headline-xl text-on-surface font-bold mt-1">
                  {summary.totalStok.toLocaleString("id-ID")}
                </span>
                <span className="font-label-sm text-label-sm text-secondary mt-0.5">
                  Unit seluruh obat
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary-fixed/30 flex items-center justify-center text-primary">
                <Package size={24} />
              </div>
            </div>

            {/* Card 3: Stok Menipis */}
            <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-xs border border-black/5 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-secondary">
                  Stok Menipis (≤ 10)
                </span>
                <span className="font-headline-xl text-headline-xl text-amber-600 font-bold mt-1">
                  {summary.stokMenipis}
                </span>
                <span className="font-label-sm text-label-sm text-amber-600/90 mt-0.5">
                  Perlu restock segera
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                <AlertTriangle size={24} />
              </div>
            </div>

            {/* Card 4: Kedaluwarsa */}
            <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-xs border border-black/5 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-secondary">
                  Kadaluarsa / Mendekati
                </span>
                <span className="font-headline-xl text-headline-xl text-error font-bold mt-1">
                  {summary.kadaluarsa + summary.mendekatiKadaluarsa}
                </span>
                <span className="font-label-sm text-label-sm text-error/90 mt-0.5">
                  {summary.kadaluarsa} lewat, {summary.mendekatiKadaluarsa}{" "}
                  segera
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center text-error">
                <Clock size={24} />
              </div>
            </div>
          </section>

          {/* Filter & Search Bar */}
          <section className="bg-surface-container-lowest p-3 rounded-2xl shadow-xs border border-black/5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama obat (minimal 3 huruf)"
                className="w-full pl-10 pr-9 py-2 rounded-xl bg-surface-container-low border border-black/5 text-on-surface text-body-md placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-on-surface"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-3 py-1.5 rounded-xl text-label-md transition-all whitespace-nowrap cursor-pointer ${
                  activeFilter === "all"
                    ? "bg-primary-container text-on-primary-container font-semibold shadow-xs"
                    : "text-secondary hover:bg-surface-container-low"
                }`}
              >
                Semua ({summary.totalJenis})
              </button>
              <button
                onClick={() => setActiveFilter("low_stock")}
                className={`px-3 py-1.5 rounded-xl text-label-md transition-all whitespace-nowrap cursor-pointer ${
                  activeFilter === "low_stock"
                    ? "bg-amber-500/20 text-amber-800 font-semibold"
                    : "text-secondary hover:bg-surface-container-low"
                }`}
              >
                Stok Menipis ({summary.stokMenipis})
              </button>
              <button
                onClick={() => setActiveFilter("expiring_soon")}
                className={`px-3 py-1.5 rounded-xl text-label-md transition-all whitespace-nowrap cursor-pointer ${
                  activeFilter === "expiring_soon"
                    ? "bg-amber-500/20 text-amber-800 font-semibold"
                    : "text-secondary hover:bg-surface-container-low"
                }`}
              >
                Mendekati Expired ({summary.mendekatiKadaluarsa})
              </button>
              <button
                onClick={() => setActiveFilter("expired")}
                className={`px-3 py-1.5 rounded-xl text-label-md transition-all whitespace-nowrap cursor-pointer ${
                  activeFilter === "expired"
                    ? "bg-error/20 text-error font-semibold"
                    : "text-secondary hover:bg-surface-container-low"
                }`}
              >
                Kadaluarsa ({summary.kadaluarsa})
              </button>
            </div>
          </section>

          {/* Table Data Obat */}
          <section className="bg-surface-container-lowest rounded-2xl shadow-xs border border-black/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-surface-container-high/60 bg-surface-container-low/40">
                    <th className="py-3.5 px-4 font-label-md text-label-md text-secondary font-semibold text-center w-14">
                      No
                    </th>
                    <th className="py-3.5 px-4 font-label-md text-label-md text-secondary font-semibold">
                      Nama Obat
                    </th>
                    <th className="py-3.5 px-4 font-label-md text-label-md text-secondary font-semibold">
                      Satuan
                    </th>
                    <th className="py-3.5 px-4 font-label-md text-label-md text-secondary font-semibold">
                      Sisa Stok
                    </th>
                    <th className="py-3.5 px-4 font-label-md text-label-md text-secondary font-semibold">
                      Tanggal Pengadaan
                    </th>
                    <th className="py-3.5 px-4 font-label-md text-label-md text-secondary font-semibold">
                      Masa Kadaluarsa
                    </th>
                    <th className="py-3.5 px-4 font-label-md text-label-md text-secondary font-semibold text-center w-28">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high/40">
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-12 text-center text-secondary"
                      >
                        <div className="flex flex-col items-center justify-center gap-2">
                          <span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                          <span className="font-body-md">
                            Memuat data obat...
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : obatList.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-16 text-center text-secondary"
                      >
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="w-14 h-14 rounded-2xl bg-surface-container-low flex items-center justify-center text-secondary">
                            <Pill size={28} />
                          </div>
                          <div>
                            <p className="font-headline-md text-headline-md text-on-surface">
                              Tidak ada data obat
                            </p>
                            <p className="font-body-sm text-body-sm text-secondary mt-1">
                              {searchTerm || activeFilter !== "all"
                                ? "Coba ganti kata kunci pencarian atau ubah filter"
                                : "Belum ada obat yang didaftarkan. Klik Tambah Obat untuk memulai."}
                            </p>
                          </div>
                          <button
                            onClick={handleOpenAdd}
                            className="mt-2 flex items-center gap-2 px-4 py-2 rounded-xl text-label-md bg-primary-container text-on-primary-container hover:bg-primary shadow-xs transition-colors"
                          >
                            <Plus size={16} />
                            <span>Tambah Obat Sekarang</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    obatList.map((item, index) => {
                      const expStatus = getExpirationStatus(
                        item.tanggalKadaluarsa,
                      );
                      const isLow = Number(item.stok) <= 10;
                      const isZero = Number(item.stok) === 0;

                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-surface-container-low/50 transition-colors"
                        >
                          <td className="py-3.5 px-4 text-center font-label-md text-secondary">
                            {index + 1}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary shrink-0">
                                <Pill size={16} />
                              </div>
                              <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                                {item.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-body-md text-secondary">
                            <span className="px-2.5 py-1 rounded-md bg-surface-container-low border border-black/5 text-label-sm font-medium">
                              {item.satuan}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-headline-md text-[15px] font-bold ${
                                  isZero
                                    ? "text-error"
                                    : isLow
                                      ? "text-amber-600"
                                      : "text-on-surface"
                                }`}
                              >
                                {item.stok}
                              </span>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                                  isZero
                                    ? "bg-error/10 text-error border-error/20"
                                    : isLow
                                      ? "bg-amber-500/10 text-amber-700 border-amber-500/20"
                                      : "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                                }`}
                              >
                                {isZero
                                  ? "Habis"
                                  : isLow
                                    ? "Menipis"
                                    : "Tersedia"}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-body-md text-secondary">
                            <div className="flex items-center gap-1.5">
                              <Calendar
                                size={14}
                                className="text-secondary/70"
                              />
                              <span>{item.tanggalBeli || "-"}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex flex-col gap-1">
                              <span className="font-body-md text-on-surface">
                                {item.tanggalKadaluarsa || "-"}
                              </span>
                              <span
                                className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full w-max border font-semibold ${expStatus.badgeClass}`}
                              >
                                {expStatus.label}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleOpenEdit(item)}
                                title="Edit Obat"
                                className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-surface-container-high transition-colors"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => setDeleteTarget(item)}
                                title="Hapus Obat"
                                className="p-2 rounded-lg text-secondary hover:text-error hover:bg-error-container/40 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-lowest shadow-[0_-1px_6px_rgba(0,0,0,0.03)] py-space-md mt-auto">
        <div className="max-w-7xl mx-auto px-gutter-desktop flex flex-col sm:flex-row items-center justify-between gap-space-xs text-center sm:text-left">
          <p className="font-body-sm text-body-sm text-secondary">
            Master Data Stok &amp; Inventaris Obat UKS terintegrasi sistem PMR.
          </p>
          <p className="font-body-sm text-body-sm text-secondary">
            © {currentYear} wtfychxx - All rights reserved.
          </p>
        </div>
      </footer>

      {/* Modal Tambah / Edit Obat */}
      <ObatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveObat}
        initialData={editingObat}
        isLoading={isCreating || isUpdating}
      />

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-black/5 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center text-error mx-auto">
              <Trash2 size={24} />
            </div>
            <div className="text-center">
              <h3 className="font-headline-md text-headline-md text-on-surface">
                Hapus Data Obat?
              </h3>
              <p className="font-body-sm text-body-sm text-secondary mt-1">
                Apakah Anda yakin ingin menghapus data obat{" "}
                <span className="font-bold text-on-surface">
                  "{deleteTarget.name}"
                </span>
                ? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl font-label-lg text-secondary hover:bg-surface-container-low transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl font-label-lg bg-error text-white hover:bg-error/90 transition-colors shadow-sm cursor-pointer"
              >
                {isDeleting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
