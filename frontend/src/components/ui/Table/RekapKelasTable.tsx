import { Clock, Flag, Sigma } from "lucide-react";
import { Column, DataTable } from "./Table";

/* ---------- Tipe & helper ---------- */

export type RekapKelasRow = {
  kelas: string;
  upacara: number; // jumlah kasus saat upacara
  harian: number; // jumlah kasus hari biasa / jam KBM
};

/**
 * Mengelompokkan daftar kasus mentah (mis. `kasusList`) menjadi baris rekap per kelas.
 * Aturan "upacara" sama dengan komponen lain: /upacara/i pada field `situasi`.
 * Hasil diurutkan dari kasus terbanyak.
 */
export function buildRekapRows(
  items: { kelas: string; situasi: string }[],
): RekapKelasRow[] {
  const map = new Map<string, RekapKelasRow>();
  for (const { kelas, situasi } of items) {
    const row = map.get(kelas) ?? { kelas, upacara: 0, harian: 0 };
    if (/upacara/i.test(situasi)) row.upacara += 1;
    else row.harian += 1;
    map.set(kelas, row);
  }
  return [...map.values()].sort(
    (a, b) =>
      b.upacara + b.harian - (a.upacara + a.harian) ||
      a.kelas.localeCompare(b.kelas),
  );
}

const pct = (part: number, total: number) => (total ? (part / total) * 100 : 0);

function MiniStat({
  label,
  value,
  className = "",
}: {
  label: string;
  value: number;
  className?: string;
}) {
  return (
    <div className="text-center">
      <div className="text-label-sm text-secondary">{label}</div>
      <div className={`text-body-lg font-bold ${className}`}>{value}</div>
    </div>
  );
}

/* ---------- Komponen ---------- */

type Props = {
  rows: RekapKelasRow[];
  /** Teks di kolom terakhir baris total */
  footerNote?: string;
  emptyMessage?: string;
  /** Class tambahan untuk pembungkus (mis. "bg-surface-container-lowest shadow-sm") */
  className?: string;
};

export function RekapKelasTable({
  rows,
  footerNote = "100% data diverifikasi PMR",
  emptyMessage = "Belum ada data untuk direkap.",
  className,
}: Props) {
  const totals = rows.reduce(
    (acc, r) => ({
      upacara: acc.upacara + r.upacara,
      harian: acc.harian + r.harian,
    }),
    { upacara: 0, harian: 0 },
  );
  const grandTotal = totals.upacara + totals.harian;
  const maxTotal = Math.max(0, ...rows.map((r) => r.upacara + r.harian));
  const isTop = (r: RekapKelasRow) => {
    const t = r.upacara + r.harian;
    return t > 0 && t === maxTotal; // kelas dengan kasus terbanyak
  };

  const columns: Column<RekapKelasRow>[] = [
    {
      key: "kelas",
      header: "Kelas",
      cellClassName: "font-semibold",
      cell: (r) => (
        <div className="flex items-center gap-space-sm">
          <span
            className={`h-2 w-2 rounded-full ${
              isTop(r) ? "bg-primary-container" : "bg-secondary/40"
            }`}
          />
          <span className="text-headline-md tracking-tight">{r.kelas}</span>
        </div>
      ),
      footer: (
        <div className="flex items-center gap-space-xs">
          <Sigma size={18} className="text-primary" />
          <span className="text-headline-md">Total Keseluruhan</span>
        </div>
      ),
    },
    {
      key: "total",
      header: "Total Kasus",
      align: "center",
      cell: (r) => (
        <span
          className={`inline-flex h-8 min-w-[32px] items-center justify-center rounded-lg px-2.5 text-body-lg font-bold ${
            isTop(r)
              ? "bg-primary-fixed text-primary"
              : "bg-surface-container text-on-surface"
          }`}
        >
          {r.upacara + r.harian}
        </span>
      ),
      footer: (
        <span className="text-headline-md font-bold text-primary">
          {grandTotal}
        </span>
      ),
    },
    {
      key: "upacara",
      header: "Saat Upacara",
      align: "center",
      cellClassName: "font-semibold text-tertiary",
      cell: (r) => (
        <div className="inline-flex items-center gap-1">
          <Flag size={15} className="opacity-75" />
          <span>{r.upacara}</span>
        </div>
      ),
      footer: (
        <span className="text-headline-md font-bold text-tertiary">
          {totals.upacara}
        </span>
      ),
    },
    {
      key: "harian",
      header: "Hari Biasa",
      align: "center",
      cellClassName: "font-semibold text-secondary",
      cell: (r) => (
        <div className="inline-flex items-center gap-1">
          <Clock size={15} className="opacity-75" />
          <span>{r.harian}</span>
        </div>
      ),
      footer: (
        <span className="text-headline-md font-bold text-secondary">
          {totals.harian}
        </span>
      ),
    },
    {
      key: "proporsi",
      header: "Proporsi Kejadian",
      minWidth: 200,
      cell: (r) => {
        const total = r.upacara + r.harian;
        const pU = pct(r.upacara, total);
        const pB = pct(r.harian, total);
        return (
          <div className="flex w-full max-w-[220px] flex-col gap-1">
            <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-surface-container">
              <div
                className="h-full bg-secondary-container transition-all duration-500"
                style={{ width: `${pU}%` }}
                title={`Upacara: ${r.upacara} kasus (${Math.round(pU)}%)`}
              />
              <div
                className="h-full bg-primary-container transition-all duration-500"
                style={{ width: `${pB}%` }}
                title={`Hari Biasa: ${r.harian} kasus (${Math.round(pB)}%)`}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] font-medium text-secondary">
              <span>Upacara {Math.round(pU)}%</span>
              <span>Biasa {Math.round(pB)}%</span>
            </div>
          </div>
        );
      },
      footer: footerNote,
      footerClassName: "text-body-sm font-normal text-secondary",
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={rows}
      getRowKey={(r) => r.kelas}
      caption="Rekap kasus per kelas"
      emptyMessage={emptyMessage}
      density="roomy"
      minTableWidth={640}
      className={className}
      renderMobileCard={(r) => (
        <div className="flex items-center justify-between gap-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
          <div className="flex min-w-0 items-center gap-space-sm">
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${
                isTop(r) ? "bg-primary-container" : "bg-secondary/40"
              }`}
            />
            <div className="min-w-0">
              <div className="text-label-sm uppercase tracking-wider text-secondary">
                Kelas
              </div>
              <div className="truncate text-headline-md tracking-tight text-on-surface">
                {r.kelas}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-space-md">
            <MiniStat
              label="Upacara"
              value={r.upacara}
              className="text-tertiary"
            />
            <MiniStat
              label="Harian"
              value={r.harian}
              className="text-secondary"
            />
            <div
              className={`rounded-lg px-2.5 py-1 text-center ${
                isTop(r)
                  ? "bg-primary-fixed text-primary"
                  : "bg-surface-container text-on-surface"
              }`}
            >
              <div className="text-label-sm">Total</div>
              <div className="text-body-lg font-bold">
                {r.upacara + r.harian}
              </div>
            </div>
          </div>
        </div>
      )}
      mobileFooter={
        <div className="flex flex-wrap items-center justify-between gap-space-sm rounded-xl bg-surface-container-high/60 p-space-md font-semibold text-on-surface">
          <div className="flex items-center gap-space-xs">
            <Sigma size={18} className="text-primary" />
            <span className="text-headline-md">Total Keseluruhan</span>
          </div>
          <div className="flex items-center gap-space-md">
            <MiniStat
              label="Upacara"
              value={totals.upacara}
              className="text-tertiary"
            />
            <MiniStat
              label="Harian"
              value={totals.harian}
              className="text-secondary"
            />
            <div className="rounded-lg bg-primary-fixed px-2.5 py-1 text-center text-primary">
              <div className="text-label-sm">Total</div>
              <div className="text-body-lg font-bold">{grandTotal}</div>
            </div>
          </div>
        </div>
      }
    />
  );
}
