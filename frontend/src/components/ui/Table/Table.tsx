import type { ReactNode } from "react";

/* ---------- Tipe ---------- */

export type Column<T> = {
  /** Kunci unik kolom */
  key: string;
  /** Isi header kolom */
  header: ReactNode;
  /** Cara menampilkan sel untuk satu baris */
  cell: (row: T, index: number) => ReactNode;
  /** Isi sel di baris footer (isi salah satu kolom saja pun cukup untuk memunculkan footer) */
  footer?: ReactNode;
  align?: "left" | "center" | "right";
  nowrap?: boolean;
  /** Lebar minimal kolom, dalam px */
  minWidth?: number;
  cellClassName?: string;
  footerClassName?: string;
};

type Props<T> = {
  columns: Column<T>[];
  data: T[];
  getRowKey: (row: T) => string | number;
  /** Teks untuk pembaca layar */
  caption?: string;
  emptyMessage?: string;
  /** "default" = padat (spreadsheet), "roomy" = lega (rekap) */
  density?: "default" | "roomy";
  /** Lebar minimal tabel (px) sebelum mulai bisa digeser */
  minTableWidth?: number;
  /**
   * Kalau diisi: di bawah breakpoint md data tampil sebagai kartu ini,
   * dan tabel hanya tampil di md ke atas. Kalau kosong: tabel selalu tampil.
   */
  renderMobileCard?: (row: T, index: number) => ReactNode;
  /** Breakpoint peralihan kartu <-> tabel (default "md") */
  mobileBreakpoint?: "sm" | "md";
  /** Ditampilkan setelah kartu-kartu mobile (mis. kartu total) */
  mobileFooter?: ReactNode;
  /** Class tambahan untuk pembungkus tabel (mis. gaya kartu) */
  className?: string;
};

/* ---------- Gaya ---------- */

const padding = {
  default: { th: "px-space-md py-space-sm", td: "px-space-md py-space-md" },
  roomy: { th: "px-space-lg py-3", td: "px-space-lg py-4" },
} as const;

const breakpoint = {
  sm: { cards: "sm:hidden", table: "hidden sm:block" },
  md: { cards: "md:hidden", table: "hidden md:block" },
} as const;

const alignClass = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

/* ---------- Komponen ---------- */

export function DataTable<T>({
  columns,
  data,
  getRowKey,
  caption,
  emptyMessage = "Belum ada data.",
  density = "default",
  minTableWidth = 640,
  renderMobileCard,
  mobileBreakpoint = "md",
  mobileFooter,
  className = "",
}: Props<T>) {
  const pad = padding[density];
  const bp = breakpoint[mobileBreakpoint];
  const hasFooter =
    data.length > 0 && columns.some((c) => c.footer !== undefined);

  return (
    <>
      {/* Mobile: kartu (hanya jika renderMobileCard diberikan) */}
      {renderMobileCard && (
        <div className={`flex flex-col gap-space-md ${bp.cards}`}>
          {data.length === 0 && (
            <p className="rounded-xl bg-surface-container-lowest p-space-lg text-center text-secondary shadow-sm">
              {emptyMessage}
            </p>
          )}
          {data.map((row, i) => (
            <div key={getRowKey(row)}>{renderMobileCard(row, i)}</div>
          ))}
          {data.length > 0 && mobileFooter}
        </div>
      )}

      {/* Tablet / desktop: tabel */}
      <div
        className={`${
          renderMobileCard ? bp.table : "block"
        } w-full min-w-0 max-w-full overflow-x-auto rounded-xl ${className}`}
      >
        <table
          className="w-full border-collapse text-left text-body-md"
          style={{ minWidth: minTableWidth }}
        >
          {caption && <caption className="sr-only">{caption}</caption>}

          <thead>
            <tr className="bg-surface-container-low text-label-sm uppercase tracking-wider text-secondary">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  style={col.minWidth ? { minWidth: col.minWidth } : undefined}
                  className={`${pad.th} ${alignClass[col.align ?? "left"]} ${
                    col.nowrap ? "whitespace-nowrap" : ""
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="text-on-surface">
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-space-lg py-space-xl text-center text-secondary"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
            {data.map((row, i) => (
              <tr
                key={getRowKey(row)}
                className="transition-colors even:bg-surface-container-low/40 hover:bg-surface-container-low/70"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`${pad.td} ${alignClass[col.align ?? "left"]} ${
                      col.nowrap ? "whitespace-nowrap" : ""
                    } ${col.cellClassName ?? ""}`}
                  >
                    {col.cell(row, i)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>

          {hasFooter && (
            <tfoot>
              <tr className="bg-surface-container-high/60 font-semibold text-on-surface">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`${pad.td} ${alignClass[col.align ?? "left"]} ${
                      col.footerClassName ?? ""
                    }`}
                  >
                    {col.footer}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </>
  );
}
