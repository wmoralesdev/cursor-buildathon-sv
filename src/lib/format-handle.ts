export function formatHandle(handle: string): string {
  const trimmed = handle.trim();
  if (!trimmed) return "@yourhandle";
  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
}
