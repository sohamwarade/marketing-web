export function studentUrl(
  path: string,
  params: Record<string, string | undefined> = {}
): string {
  const base = process.env.NEXT_PUBLIC_STUDENT_URL || "https://app.puzzlers.in";
  try {
    const url = new URL(path, base);
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== "") {
        url.searchParams.set(k, v);
      }
    }
    return url.toString();
  } catch {
    return `${base}${path}`;
  }
}
