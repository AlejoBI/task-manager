export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

export function getErrorCode(err: unknown): string {
  if (err && typeof err === "object" && "code" in err)
    return String((err as { code: unknown }).code);
  return "";
}
