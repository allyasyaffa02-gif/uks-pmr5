import React from "react";
import { useForm } from "react-hook-form";
import { useUksKasus } from "../hooks/useUksKasus";
import {
  Save,
  UserCheck,
  Calendar,
  Clock,
  AlertCircle,
  Stethoscope,
} from "lucide-react";
import { FormInput } from "../../../components/ui/FormInput";
import { FormTextArea } from "../../../components/ui/FormTextArea";
import { KasusFormValues } from "../../../types/form";

interface CatatBaruPageProps {
  onSuccess: () => void;
}

const toggleClass = (active: boolean) =>
  `flex-1 cursor-pointer rounded-field border px-4 py-2.5 font-inherit text-[0.88rem] font-semibold transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
    active
      ? "border-primary bg-primary/20 text-white"
      : "border-white/10 bg-input text-ink-muted"
  }`;

export const CatatBaruPage: React.FC<CatatBaruPageProps> = ({ onSuccess }) => {
  const { createKasus, isCreating } = useUksKasus();

  const getInitialValues = (): KasusFormValues => {
    const now = new Date();
    const formattedJam = `${String(now.getHours()).padStart(2, "0")}.${String(now.getMinutes()).padStart(2, "0")}`;
    return {
      nama: "",
      kelas: "",
      situasi: "Saat Upacara",
      tanggal: now.toISOString().split("T")[0],
      jam: formattedJam,
      keluhan: "",
      penanganan: "",
    };
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<KasusFormValues>({
    defaultValues: getInitialValues(),
  });

  const situasiValue = watch("situasi");

  const onSubmit = async (data: KasusFormValues) => {
    try {
      await createKasus({
        nama: data.nama.trim(),
        kelas: data.kelas.trim(),
        situasi: data.situasi,
        tanggal: data.tanggal,
        jam: data.jam?.trim(),
        keluhan: data.keluhan.trim(),
        penanganan: data.penanganan.trim(),
      });
      onSuccess();
    } catch (err) {
      console.error("Gagal mencatat kasus baru", err);
    }
  };

  return (
    <div>
      <h2 className="mb-5 flex items-center gap-3 text-[1.25rem] font-bold text-ink">
        Catat kasus baru{" "}
        <span className="inline-block rounded-[6px] border border-primary/30 bg-primary/20 px-2 py-0.5 text-[0.7rem] font-bold tracking-[0.05em] text-red-400">
          FORM PMR
        </span>
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-[18px] max-w-6xl"
      >
        <FormInput
          label="Nama siswa"
          icon={UserCheck}
          placeholder="Nama lengkap"
          registration={register("nama", {
            required: "Nama siswa wajib diisi",
          })}
          error={errors.nama}
        />

        <FormInput
          label="Kelas"
          placeholder="Contoh: X-2"
          registration={register("kelas", { required: "Kelas wajib diisi" })}
          error={errors.kelas}
        />

        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-[0.85rem] font-semibold text-ink-muted">
            Situasi Kejadian
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              className={toggleClass(situasiValue === "Saat Upacara")}
              onClick={() => setValue("situasi", "Saat Upacara")}
            >
              Saat Upacara
            </button>
            <button
              type="button"
              className={toggleClass(situasiValue === "Hari Biasa")}
              onClick={() => setValue("situasi", "Hari Biasa")}
            >
              Hari Biasa
            </button>
          </div>
        </div>

        <FormInput
          label="Tanggal"
          type="date"
          icon={Calendar}
          registration={register("tanggal", {
            required: "Tanggal wajib diisi",
          })}
          error={errors.tanggal}
        />

        <FormInput
          label="Jam kejadian"
          icon={Clock}
          placeholder="Contoh: 07.15"
          registration={register("jam")}
          error={errors.jam}
        />

        <FormTextArea
          label="Keluhan"
          icon={AlertCircle}
          placeholder="Contoh: Pusing, lemas, mual..."
          registration={register("keluhan", {
            required: "Keluhan wajib diisi",
          })}
          error={errors.keluhan}
        />

        <FormTextArea
          label="Penanganan"
          icon={Stethoscope}
          placeholder="Contoh: Dibawa ke ruang UKS, diberi minum, istirahat 15 menit..."
          registration={register("penanganan", {
            required: "Penanganan wajib diisi",
          })}
          error={errors.penanganan}
        />

        <div className="col-span-2 mt-2.5 flex justify-end">
          <button
            type="submit"
            className="flex cursor-pointer items-center gap-2 rounded-field border-none bg-gradient-to-br from-primary to-primary-deep px-6 py-3 font-inherit text-[0.95rem] font-bold text-white shadow-glow transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:-translate-y-px hover:shadow-glow-lg disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isCreating}
          >
            <Save size={18} />
            <span>{isCreating ? "Menyimpan..." : "Catat kasus"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
