import React, { useState } from "react";
import { Header } from "../../../components/ui/Header";
import { useJurusan } from "../hooks/useJurusan";
import { CreateJurusanInput, JurusanItem } from "../types/jurusan";
import { MasterJurusanModal } from "../components/MasterJurusanModal";
import { useDebounce } from "../../../hooks/useDebounce";
import {
  Edit2,
  GraduationCap,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";

const MIN_SEARCH_LENGTH = 3;

export const MasterJurusanPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  // di bawah 3 huruf, search dianggap kosong
  const effectiveSearch =
    debouncedSearch.length >= MIN_SEARCH_LENGTH ? debouncedSearch : "";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJurusan, setEditingJurusan] = useState<JurusanItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<JurusanItem | null>(null);

  const {
    jurusanList,
    isLoading,
    createJurusan,
    updateJurusan,
    deleteJurusan,
    isCreating,
    isUpdating,
    isDeleting,
    refetch,
  } = useJurusan(effectiveSearch || undefined);

  const currentYear = new Date().getFullYear();

  const handleOpenAdd = () => {
    setEditingJurusan(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: JurusanItem) => {
    setEditingJurusan(item);
    setIsModalOpen(true);
  };

  const handleSaveJurusan = async (data: CreateJurusanInput) => {
    if (editingJurusan) {
      await updateJurusan({ id: editingJurusan.id, data });
    } else {
      await createJurusan(data);
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      await deleteJurusan(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      {/* Header Aplikasi Terpadu */}
      <Header />

      <main className="w-full flex-1 bg-surface">
        <div className="flex flex-col w-full max-w-7xl mx-auto px-gutter py-space-lg space-y-space-lg sm:px-gutter-desktop">
          {/* Header Judul Halaman */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary-container/15 flex items-center justify-center text-primary shadow-xs">
                <GraduationCap size={26} />
              </div>
              <div>
                <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
                  Master Data Jurusan
                </h1>
                <p className="font-body-md text-body-md text-secondary">
                  Kelola daftar jurusan yang tersedia
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => refetch()}
                title="Muat Ulang Data"
                className="p-2.5 rounded-xl border border-black/10 bg-surface-container-lowest text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors shadow-xs cursor-pointer"
              >
                <RefreshCw
                  size={18}
                  className={isLoading ? "animate-spin" : ""}
                />
              </button>
              <button
                onClick={handleOpenAdd}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-label-lg text-label-lg bg-primary-container text-on-primary-container hover:bg-primary shadow-xs transition-colors cursor-pointer"
              >
                <Plus size={18} />
                <span>Tambah Jurusan</span>
              </button>
            </div>
          </div>

          {/* Ringkasan */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
            <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-xs border border-black/5 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-secondary">
                  Total Jurusan
                </span>
                <span className="font-headline-xl text-headline-xl text-on-surface font-bold mt-1">
                  {isLoading ? "..." : jurusanList.length}
                </span>
                <span className="font-label-sm text-label-sm text-secondary mt-0.5">
                  {effectiveSearch
                    ? "Hasil pencarian"
                    : "Data jurusan terdaftar"}
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary-fixed/30 flex items-center justify-center text-primary">
                <GraduationCap size={24} />
              </div>
            </div>
          </section>

          {/* Search Bar */}
          <section className="bg-surface-container-lowest p-3 rounded-2xl shadow-xs border border-black/5">
            <div className="relative max-w-md">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama jurusan (minimal 3 huruf)"
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
          </section>
          {/* Table Data Jurusan */}
          <section className="bg-surface-container-lowest rounded-2xl shadow-xs border border-black/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-surface-container-high/60 bg-surface-container-low/40">
                    <th className="py-3.5 px-4 font-label-md text-label-md text-secondary font-semibold text-center w-14">
                      No
                    </th>
                    <th className="py-3.5 px-4 font-label-md text-label-md text-secondary font-semibold">
                      Nama Jurusan
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
                        colSpan={3}
                        className="py-12 text-center text-secondary"
                      >
                        <div className="flex flex-col items-center justify-center gap-2">
                          <span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                          <span className="font-body-md">
                            Memuat data jurusan...
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : jurusanList.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="py-16 text-center text-secondary"
                      >
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="w-14 h-14 rounded-2xl bg-surface-container-low flex items-center justify-center text-secondary">
                            <GraduationCap size={28} />
                          </div>
                          <div>
                            <p className="font-headline-md text-headline-md text-on-surface">
                              Tidak ada data jurusan
                            </p>
                            <p className="font-body-sm text-body-sm text-secondary mt-1">
                              {searchTerm
                                ? "Coba ganti kata kunci pencarian"
                                : "Belum ada jurusan yang didaftarkan. Klik Tambah Jurusan untuk memulai."}
                            </p>
                          </div>
                          {!searchTerm && (
                            <button
                              onClick={handleOpenAdd}
                              className="mt-2 flex items-center gap-2 px-4 py-2 rounded-xl text-label-md bg-primary-container text-on-primary-container hover:bg-primary shadow-xs transition-colors cursor-pointer"
                            >
                              <Plus size={16} />
                              <span>Tambah Jurusan Sekarang</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    jurusanList.map((item, index) => (
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
                              <GraduationCap size={16} />
                            </div>
                            <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                              {item.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(item)}
                              title="Edit"
                              className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-primary-container/10 transition-colors cursor-pointer"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(item)}
                              title="Hapus"
                              className="p-2 rounded-lg text-secondary hover:text-error hover:bg-error/10 transition-colors cursor-pointer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
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
            Master Data Jurusan terintegrasi sistem PMR.
          </p>
          <p className="font-body-sm text-body-sm text-secondary">
            © {currentYear} wtfychxx - All rights reserved.
          </p>
        </div>
      </footer>

      {/* Modal Tambah / Edit Jurusan */}
      <MasterJurusanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveJurusan}
        initialData={editingJurusan}
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
                Hapus Data Jurusan?
              </h3>
              <p className="font-body-sm text-body-sm text-secondary mt-1">
                Apakah Anda yakin ingin menghapus jurusan{" "}
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