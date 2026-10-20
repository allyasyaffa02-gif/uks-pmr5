import {
  useMutation,
  useQueryClient,
  type QueryKey,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "../components/ui/Toaster";
import type { ApiErrorResponse } from "../types/api";

type ToastMessage<T> = string | ((value: T) => string);

interface UseToastMutationOptions<
  TData,
  TError,
  TVariables,
  TContext,
> extends Omit<
    UseMutationOptions<TData, TError, TVariables, TContext>,
    "onSuccess" | "onError"
  > {
  /** Pesan toast saat mutasi berhasil; kosong = tanpa toast sukses. */
  successMessage?: ToastMessage<TData>;
  /** Pesan toast saat mutasi gagal; kosong = ambil pesan dari error. */
  errorMessage?: ToastMessage<TError>;
  /** Query yang di-invalidate setelah sukses (menggunakan prefix matching). */
  invalidateQueries?: QueryKey;
  onSuccess?: UseMutationOptions<
    TData,
    TError,
    TVariables,
    TContext
  >["onSuccess"];
  onError?: UseMutationOptions<TData, TError, TVariables, TContext>["onError"];
}

const DEFAULT_ERROR_MESSAGE = "Terjadi kesalahan. Silakan coba lagi.";

const resolveMessage = <T,>(value: ToastMessage<T>, target: T): string =>
  typeof value === "function" ? value(target) : value;

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.message ||
      error.message ||
      DEFAULT_ERROR_MESSAGE
    );
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return DEFAULT_ERROR_MESSAGE;
};

/**
 * Pembungkus `useMutation` yang menyeragamkan cara memanggil mutasi API:
 * - menampilkan toast sukses/gagal secara otomatis;
 * - memusatkan `invalidateQueries` setelah sukses.
 */
export function useToastMutation<
  TData = unknown,
  TError = Error,
  TVariables = void,
  TContext = unknown,
>(
  options: UseToastMutationOptions<TData, TError, TVariables, TContext>,
): UseMutationResult<TData, TError, TVariables, TContext> {
  const queryClient = useQueryClient();
  const toast = useToast();

  const {
    successMessage,
    errorMessage,
    invalidateQueries,
    onSuccess,
    onError,
    ...mutationOptions
  } = options;

  return useMutation({
    ...mutationOptions,
    onSuccess: (data, variables, context, mutationContext) => {
      if (successMessage) {
        toast.success(resolveMessage(successMessage, data));
      }

      if (invalidateQueries) {
        queryClient.invalidateQueries({ queryKey: invalidateQueries });
      }

      onSuccess?.(data, variables, context, mutationContext);
    },
    onError: (error, variables, context, mutationContext) => {
      const message = errorMessage
        ? resolveMessage(errorMessage, error)
        : getErrorMessage(error);

      toast.error(message);
      onError?.(error, variables, context, mutationContext);
    },
  });
}