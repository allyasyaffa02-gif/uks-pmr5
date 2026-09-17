export function getAuthErrorMessage(err: unknown, fallback: string): string {
  if (typeof err === "object" && err !== null && "response" in err) {
    const resp = (err as { response?: { data?: { message?: string | string[] } } }).response;
    const msg = resp?.data?.message;
    if (Array.isArray(msg)) return msg.join(", ");
    if (typeof msg === "string" && msg) return msg;
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}
