import { Calendar, Trash2 } from "lucide-react"; // TODO: sesuaikan path type milikmu
import { KasusItem } from "../../../modules/uks/types/uks";
import { Column, DataTable } from "./Table";

type Props = {
  kasusList: KasusItem[];
  isDeleting: boolean;
  onDelete: (id: KasusItem["id"]) => void;
  formatDate: (tanggal: KasusItem["tanggal"]) => string;
};

/* ---------- Bagian kecil yang dipakai bersama ---------- */

function KelasBadge({ kelas }: { kelas: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-surface-container-high px-2.5 py-1 text-label-sm font-semibold text-on-surface">
      {kelas}
    </span>
  );
}

function SituasiBadge({ situasi }: { situasi: string }) {
  const isUpacara = /upacara/i.test(situasi);
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-label-sm font-semibold ${
        isUpacara
          ? "bg-tertiary-fixed text-on-tertiary-fixed"
          : "bg-surface-container-low text-secondary"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isUpacara ? "bg-tertiary" : "bg-secondary"
        }`}
      />
      {situasi}
    </span>
  );
}

function DeleteButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      title="Hapus Riwayat"
      aria-label="Hapus riwayat"
      onClick={onClick}
      disabled={disabled}
      className="cursor-pointer rounded-lg p-1.5 text-secondary transition-colors hover:bg-error-container/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Trash2 size={18} />
    </button>
  );
}

/* ---------- Komponen ---------- */

export function KasusResults({
  kasusList,
  isDeleting,
  onDelete,
  formatDate,
}: Props) {
  const columns: Column<KasusItem>[] = [
    {
      key: "tanggal",
      header: "Tanggal & Jam",
      nowrap: true,
      cell: (item) => (
        <>
          <div className="flex items-center gap-space-xs font-semibold text-on-surface">
            <Calendar size={16} className="text-secondary" />
            <span>{formatDate(item.tanggal)}</span>
          </div>
          {/* Tambah " WIB" di sini kalau data `jam` belum memuatnya */}
          {item.jam && (
            <span className="pl-6 text-label-sm text-secondary">
              {item.jam}
            </span>
          )}
        </>
      ),
    },
    {
      key: "nama",
      header: "Nama Siswa",
      nowrap: true,
      cellClassName: "text-body-lg font-bold text-on-surface",
      cell: (item) => item.nama,
    },
    {
      key: "kelas",
      header: "Kelas",
      nowrap: true,
      cell: (item) => <KelasBadge kelas={item.kelas} />,
    },
    {
      key: "situasi",
      header: "Situasi",
      nowrap: true,
      cell: (item) => <SituasiBadge situasi={item.situasi} />,
    },
    {
      key: "keluhan",
      header: "Keluhan",
      minWidth: 160,
      cellClassName: "max-w-[220px] break-words font-medium",
      cell: (item) => item.keluhan,
    },
    {
      key: "penanganan",
      header: "Penanganan UKS",
      minWidth: 220,
      cellClassName: "max-w-[250px] break-words text-secondary",
      cell: (item) => item.penanganan,
    },
    {
      key: "aksi",
      header: "Aksi",
      align: "center",
      nowrap: true,
      cell: (item) => (
        <DeleteButton onClick={() => onDelete(item.id)} disabled={isDeleting} />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={kasusList}
      getRowKey={(item) => item.id}
      caption="Data kasus kesehatan siswa"
      emptyMessage="Belum ada kasus tercatat."
      minTableWidth={700}
      className="bg-surface-container-lowest shadow-sm"
      renderMobileCard={(item) => (
        <div className="flex flex-col gap-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
          <div className="flex items-start justify-between gap-space-sm">
            <div className="min-w-0">
              <div className="break-words text-headline-md text-on-surface">
                {item.nama}
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-space-xs">
                <KelasBadge kelas={item.kelas} />
                <SituasiBadge situasi={item.situasi} />
              </div>
            </div>
            <DeleteButton
              onClick={() => onDelete(item.id)}
              disabled={isDeleting}
            />
          </div>

          <div className="flex items-center gap-space-xs text-label-md text-secondary">
            <Calendar size={14} />
            <span>{formatDate(item.tanggal)}</span>
            {item.jam && <span>• {item.jam}</span>}
          </div>

          <div className="flex flex-col gap-space-sm rounded-lg bg-surface-container-low p-space-sm">
            <div>
              <p className="text-label-sm uppercase tracking-wider text-secondary">
                Keluhan
              </p>
              <p className="break-words text-body-md text-on-surface">
                {item.keluhan}
              </p>
            </div>
            <div>
              <p className="text-label-sm uppercase tracking-wider text-secondary">
                Penanganan UKS
              </p>
              <p className="break-words text-body-md text-on-surface">
                {item.penanganan}
              </p>
            </div>
          </div>
        </div>
      )}
    />
  );
}
