import { Workbook } from "exceljs";
import type { CellValue, Worksheet } from "exceljs";

/**
 * Utilitas murni (tanpa akses database) untuk membuat template import obat dan
 * membaca kembali file Excel yang diunggah pengguna.
 *
 * Dipisah dari service supaya logika pembuatan template serta parsing/validasi
 * baris bisa diuji tanpa Prisma maupun koneksi database.
 */

/** Nama sheet data pada template (sheet pertama yang dibaca saat import). */
export const OBAT_TEMPLATE_SHEET = "Data Obat";
/** Nama sheet petunjuk pengisian. */
export const OBAT_TEMPLATE_GUIDE_SHEET = "Petunjuk";
/** Nama file template yang diunduh pengguna. */
export const OBAT_TEMPLATE_FILE_NAME = "template-import-obat.xlsx";
/** Batas maksimal baris data yang boleh diimpor dalam satu file. */
export const OBAT_IMPORT_MAX_ROWS = 1000;
/** Batas ukuran file unggahan (5 MB). */
export const OBAT_IMPORT_MAX_FILE_SIZE = 5 * 1024 * 1024;
/** Batas nilai stok yang diterima (menghindari angka tak masuk akal). */
const OBAT_MAX_STOK = 1_000_000;
/** Panjang maksimal nama obat (selaras dengan kolom varchar di database). */
const OBAT_MAX_NAME_LENGTH = 120;

/** Kunci kolom template import obat. */
export type ObatColumnKey =
  | "name"
  | "tanggalBeli"
  | "tanggalKadaluarsa"
  | "stok"
  | "satuan";

interface ObatColumnSpec {
  key: ObatColumnKey;
  /** Judul kolom yang ditulis ke template. */
  header: string;
  /** Variasi judul yang tetap diterima saat membaca file kiriman pengguna. */
  aliases: string[];
  width: number;
}

/** Susunan kolom template; urutan di sini menentukan urutan header di file. */
const OBAT_COLUMNS: ObatColumnSpec[] = [
  {
    key: "name",
    header: "Nama Obat",
    aliases: ["nama", "nama obat", "obat"],
    width: 34,
  },
  {
    key: "tanggalBeli",
    header: "Tanggal Beli",
    aliases: ["tgl beli", "tanggal pengadaan", "tanggal beli/pengadaan"],
    width: 16,
  },
  {
    key: "tanggalKadaluarsa",
    header: "Tanggal Kadaluarsa",
    aliases: [
      "tanggal kedaluwarsa",
      "tgl kadaluarsa",
      "kadaluarsa",
      "kedaluwarsa",
      "expired",
    ],
    width: 20,
  },
  {
    key: "stok",
    header: "Stok",
    aliases: ["stock", "jumlah", "qty"],
    width: 10,
  },
  {
    key: "satuan",
    header: "Satuan",
    aliases: ["unit", "satuan obat"],
    width: 16,
  },
];

/** Satu baris hasil parsing file Excel (sudah dikonversi ke tipe aplikasi). */
export interface ParsedObatRow {
  /** Nomor baris pada file Excel (baris judul = 1). */
  rowNumber: number;
  name: string;
  tanggalBeli: Date | null;
  tanggalKadaluarsa: Date | null;
  stok: number | null;
  satuan: string;
  /** Pesan kesalahan format/kelengkapan; `null` berarti baris valid. */
  error: string | null;
}

export interface ParsedObatSheet {
  rows: ParsedObatRow[];
  /** Jumlah baris yang diabaikan karena seluruh selnya kosong. */
  skippedEmptyRows: number;
}

/** Error struktur file (header tidak dikenali, file rusak, melebihi batas). */
export class ObatImportFileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ObatImportFileError";
  }
}

/** Normalisasi judul kolom: huruf kecil tanpa spasi/tanda baca. */
function normalizeText(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

/** Tanggal -> "YYYY-MM-DD" (mengikuti format yang dipakai API obat). */
function formatIsoDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

/** Ambil teks dari sebuah sel Excel, apa pun tipe selnya. */
function cellToString(value: CellValue): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
  if (value instanceof Date) return formatIsoDate(value);

  const cell = value as Record<string, any>;

  if (Array.isArray(cell.richText)) {
    return cell.richText
      .map((part: any) => part?.text ?? "")
      .join("")
      .trim();
  }
  if (typeof cell.error === "string") return cell.error;
  if (typeof cell.text === "string") return cell.text.trim();
  if ("result" in cell) return cellToString(cell.result as CellValue);
  if (typeof cell.hyperlink === "string") return cell.hyperlink.trim();

  return String(value).trim();
}

/** Tahun 2 digit ("26") diperlakukan sebagai 2026. */
function normalizeYear(year: number): number {
  if (year >= 100) return year;
  return year < 70 ? 2000 + year : 1900 + year;
}

/**
 * Bangun Date pada tengah malam UTC. Nilai yang "meluber" seperti 31/02/2026
 * (yang oleh JS Date digeser menjadi 03/03/2026) ditolak sebagai tidak valid.
 */
function buildUtcDate(year: number, month: number, day: number): Date | null {
  if (year < 1900 || year > 9999) return null;
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

/** Serial number tanggal Excel (epoch 1899-12-30) -> Date UTC. */
function excelSerialToDate(serial: number): Date | null {
  if (!Number.isFinite(serial) || serial < 1 || serial > 2958465) return null;

  const date = new Date(
    Date.UTC(1899, 11, 30) + Math.round(serial) * 24 * 60 * 60 * 1000,
  );

  if (Number.isNaN(date.getTime())) return null;

  return buildUtcDate(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
  );
}

/**
 * Terima sel tanggal Excel (Date), serial number, atau teks dengan format
 * DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY, maupun YYYY-MM-DD.
 */
function parseObatDate(value: CellValue): Date | null {
  if (value === null || value === undefined || value === "") return null;

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null;
    return buildUtcDate(
      value.getUTCFullYear(),
      value.getUTCMonth() + 1,
      value.getUTCDate(),
    );
  }

  if (typeof value === "number") return excelSerialToDate(value);

  const text = cellToString(value);
  if (!text) return null;

  const parts = text.match(/^(\d{1,4})[/\-.](\d{1,2})[/\-.](\d{1,4})$/);
  if (parts) {
    const [, first, second, third] = parts;
    // Bagian pertama 4 digit berarti format ISO (YYYY-MM-DD); selain itu
    // diasumsikan format Indonesia yang diawali hari (DD/MM/YYYY).
    const isIso = first.length === 4;
    const year = isIso ? Number(first) : normalizeYear(Number(third));
    const month = Number(second);
    const day = isIso ? Number(third) : Number(first);

    const parsed = buildUtcDate(year, month, day);
    if (parsed) return parsed;
  }

  const fallback = new Date(text);
  if (!Number.isNaN(fallback.getTime())) {
    return buildUtcDate(
      fallback.getUTCFullYear(),
      fallback.getUTCMonth() + 1,
      fallback.getUTCDate(),
    );
  }

  return null;
}

/** Konversi sel stok menjadi bilangan bulat non-negatif. */
function parseObatStok(value: CellValue): {
  stok: number | null;
  error: string | null;
} {
  const text = cellToString(value);
  if (!text) return { stok: null, error: "Stok wajib diisi" };

  let normalized = text;
  if (/^\d{1,3}(\.\d{3})+$/.test(normalized)) {
    // "1.000" -> pemisah ribuan gaya Indonesia
    normalized = normalized.replace(/\./g, "");
  } else if (/^\d+,\d+$/.test(normalized)) {
    // "10,5" -> desimal gaya Indonesia
    normalized = normalized.replace(",", ".");
  }

  const parsed = Number(normalized);

  if (!Number.isFinite(parsed)) {
    return { stok: null, error: `Stok "${text}" bukan angka` };
  }
  if (!Number.isInteger(parsed)) {
    return { stok: null, error: `Stok "${text}" harus berupa bilangan bulat` };
  }
  if (parsed < 0) {
    return { stok: null, error: "Stok tidak boleh negatif" };
  }
  if (parsed > OBAT_MAX_STOK) {
    return { stok: null, error: `Stok maksimal ${OBAT_MAX_STOK}` };
  }

  return { stok: parsed, error: null };
}

/** Cari nomor kolom tiap field berdasarkan judul pada baris pertama. */
function resolveColumns(sheet: Worksheet): Record<ObatColumnKey, number> {
  const headerRow = sheet.getRow(1);
  const found: Partial<Record<ObatColumnKey, number>> = {};

  for (let columnNumber = 1; columnNumber <= sheet.columnCount; columnNumber++) {
    const header = normalizeText(
      cellToString(headerRow.getCell(columnNumber).value),
    );
    if (!header) continue;

    const spec = OBAT_COLUMNS.find(
      (column) =>
        found[column.key] === undefined &&
        (normalizeText(column.header) === header ||
          column.aliases.some((alias) => normalizeText(alias) === header)),
    );

    if (spec) found[spec.key] = columnNumber;
  }

  const missing = OBAT_COLUMNS.filter(
    (column) => found[column.key] === undefined,
  ).map((column) => column.header);

  if (missing.length > 0) {
    throw new ObatImportFileError(
      `Kolom berikut tidak ditemukan pada baris pertama file: ${missing.join(
        ", ",
      )}. Silakan gunakan template import obat yang disediakan.`,
    );
  }

  return found as Record<ObatColumnKey, number>;
}

/** Daftar satuan unik & bersih untuk dropdown template. */
function normalizeSatuanNames(satuanNames: string[]): string[] {
  const cleaned = satuanNames
    // koma & kutip ganda akan merusak formula data validation Excel
    .map((name) => String(name ?? "").replace(/[",]/g, "").trim())
    .filter(Boolean);

  return Array.from(new Set(cleaned));
}

/**
 * Buat file template import obat (.xlsx) berisi header, format tanggal, dan
 * dropdown satuan yang diambil dari master satuan obat.
 */
export async function buildObatTemplate(satuanNames: string[]): Promise<Buffer> {
  const workbook = new Workbook();
  workbook.creator = "UKS PMR";
  workbook.lastModifiedBy = "UKS PMR";
  workbook.created = new Date();
  workbook.modified = new Date();

  const dataSheet = workbook.addWorksheet(OBAT_TEMPLATE_SHEET, {
    views: [{ state: "frozen", ySplit: 1 }],
  });

  dataSheet.columns = OBAT_COLUMNS.map((column) => ({
    header: column.header,
    key: column.key,
    width: column.width,
  }));

  const headerRow = dataSheet.getRow(1);
  headerRow.height = 24;
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFB91C1C" },
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });

  // Nomor kolom mengikuti urutan OBAT_COLUMNS di atas.
  const columnNumber: Record<ObatColumnKey, number> = {
    name: 1,
    tanggalBeli: 2,
    tanggalKadaluarsa: 3,
    stok: 4,
    satuan: 5,
  };

  dataSheet.getColumn(columnNumber.tanggalBeli).numFmt = "DD/MM/YYYY";
  dataSheet.getColumn(columnNumber.tanggalKadaluarsa).numFmt = "DD/MM/YYYY";
  dataSheet.getColumn(columnNumber.stok).numFmt = "0";

  const satuanOptions = normalizeSatuanNames(satuanNames);
  const listFormula = `"${satuanOptions.join(",")}"`;

  // Data validation tipe "list" dibatasi Excel maksimal 255 karakter.
  if (satuanOptions.length > 0 && listFormula.length <= 255) {
    for (let row = 2; row <= OBAT_IMPORT_MAX_ROWS + 1; row++) {
      dataSheet.getCell(row, columnNumber.satuan).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: [listFormula],
        showErrorMessage: true,
        errorStyle: "warning",
        errorTitle: "Satuan tidak dikenali",
        error: `Gunakan salah satu satuan berikut: ${satuanOptions.join(", ")}`,
      };
    }
  }

  const guideSheet = workbook.addWorksheet(OBAT_TEMPLATE_GUIDE_SHEET);
  guideSheet.columns = [{ width: 100 }];

  const guideLines = [
    "PETUNJUK PENGISIAN TEMPLATE IMPORT OBAT",
    "",
    `1. Isi data pada sheet "${OBAT_TEMPLATE_SHEET}" mulai baris ke-2.`,
    "2. Kolom wajib diisi: Nama Obat, Tanggal Beli, Tanggal Kadaluarsa, Stok, dan Satuan.",
    "3. Format tanggal: DD/MM/YYYY (contoh 31/12/2026). Format YYYY-MM-DD juga diterima.",
    "4. Stok harus berupa bilangan bulat dan tidak boleh negatif (contoh 25).",
    `5. Satuan wajib dipilih dari daftar berikut: ${
      satuanOptions.length > 0 ? satuanOptions.join(", ") : "(belum ada data satuan)"
    }`,
    "6. Jangan mengubah atau menghapus baris judul (baris ke-1).",
    `7. Maksimal ${OBAT_IMPORT_MAX_ROWS} baris data dalam satu kali unggah.`,
    "",
    "Baris yang tidak memenuhi ketentuan akan dilaporkan gagal beserta alasannya,",
    "sedangkan baris yang valid tetap tersimpan.",
  ];

  guideLines.forEach((line, index) => {
    const cell = guideSheet.getRow(index + 1).getCell(1);
    cell.value = line;
    cell.alignment = { vertical: "top", wrapText: true };
    if (index === 0) cell.font = { bold: true, size: 12 };
  });

  const arrayBuffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(arrayBuffer as ArrayBuffer);
}

/** Apakah seluruh kolom penting pada sebuah baris kosong? */
function isEmptyRow(values: {
  name: string;
  satuan: string;
  tanggalBeli: CellValue;
  tanggalKadaluarsa: CellValue;
  stok: CellValue;
}): boolean {
  return (
    !values.name &&
    !values.satuan &&
    !cellToString(values.tanggalBeli) &&
    !cellToString(values.tanggalKadaluarsa) &&
    !cellToString(values.stok)
  );
}

/**
 * Baca file Excel kiriman pengguna menjadi daftar baris siap validasi.
 * Melempar {@link ObatImportFileError} bila struktur file tidak sesuai.
 */
export async function parseObatWorkbook(
  buffer: Buffer,
): Promise<ParsedObatSheet> {
  if (!buffer || buffer.length === 0) {
    throw new ObatImportFileError("File yang diunggah kosong");
  }

  const workbook = new Workbook();

  try {
    // exceljs mengetik parameter load() sebagai ArrayBuffer, sedangkan runtime
    // menerima Node Buffer apa adanya.
    await workbook.xlsx.load(buffer as unknown as ArrayBuffer);
  } catch {
    throw new ObatImportFileError(
      "File tidak dapat dibaca. Pastikan file berformat .xlsx dan tidak rusak.",
    );
  }

  const sheet = workbook.worksheets[0];
  if (!sheet) {
    throw new ObatImportFileError("File tidak memiliki sheet data");
  }

  const columnNumber = resolveColumns(sheet);

  const rows: ParsedObatRow[] = [];
  let skippedEmptyRows = 0;

  // eachRow hanya mengunjungi baris yang punya nilai, sehingga baris kosong di
  // tengah file tidak membuat baris sesudahnya ikut terlewat (berbeda dengan
  // `actualRowCount` yang cuma menghitung baris berisi).
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // lewati baris judul

    const name = cellToString(row.getCell(columnNumber.name).value);
    const satuan = cellToString(row.getCell(columnNumber.satuan).value);
    const tanggalBeliCell = row.getCell(columnNumber.tanggalBeli).value;
    const tanggalKadaluarsaCell =
      row.getCell(columnNumber.tanggalKadaluarsa).value;
    const stokCell = row.getCell(columnNumber.stok).value;

    if (
      isEmptyRow({
        name,
        satuan,
        tanggalBeli: tanggalBeliCell,
        tanggalKadaluarsa: tanggalKadaluarsaCell,
        stok: stokCell,
      })
    ) {
      skippedEmptyRows += 1;
      return;
    }

    const tanggalBeli = parseObatDate(tanggalBeliCell);
    const tanggalKadaluarsa = parseObatDate(tanggalKadaluarsaCell);
    const stok = parseObatStok(stokCell);

    const errors: string[] = [];

    if (!name) {
      errors.push("Nama obat wajib diisi");
    } else if (name.length > OBAT_MAX_NAME_LENGTH) {
      errors.push(`Nama obat maksimal ${OBAT_MAX_NAME_LENGTH} karakter`);
    }

    if (!cellToString(tanggalBeliCell)) {
      errors.push("Tanggal beli wajib diisi");
    } else if (!tanggalBeli) {
      errors.push("Format tanggal beli tidak dikenali (gunakan DD/MM/YYYY)");
    }

    if (!cellToString(tanggalKadaluarsaCell)) {
      errors.push("Tanggal kadaluarsa wajib diisi");
    } else if (!tanggalKadaluarsa) {
      errors.push(
        "Format tanggal kadaluarsa tidak dikenali (gunakan DD/MM/YYYY)",
      );
    }

    if (stok.error) errors.push(stok.error);

    if (!satuan) errors.push("Satuan wajib diisi");

    rows.push({
      rowNumber,
      name,
      tanggalBeli,
      tanggalKadaluarsa,
      stok: stok.stok,
      satuan,
      error: errors.length > 0 ? errors.join("; ") : null,
    });
  });

  if (rows.length > OBAT_IMPORT_MAX_ROWS) {
    throw new ObatImportFileError(
      `Jumlah baris data (${rows.length}) melebihi batas ${OBAT_IMPORT_MAX_ROWS} baris per file`,
    );
  }

  return { rows, skippedEmptyRows };
}
