import type { ApiResponse } from "../types/api";

/**
 * Normalisasi payload respons API yang bisa datang sebagai `ApiResponse<T>`
 * (dibungkus `{ message, data, status }`) maupun `T` langsung. Helper ini
 * dipakai lintas service sehingga konsumen tidak perlu tahu bentuk mentahnya.
 */
export const unwrapApiData = <T>(payload: ApiResponse<T> | T): T => {
  if (
    payload !== null &&
    typeof payload === "object" &&
    "data" in payload &&
    !Array.isArray(payload)
  ) {
    return (payload as ApiResponse<T>).data;
  }

  return payload as T;
};