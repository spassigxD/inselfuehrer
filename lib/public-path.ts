export function publicPath(
  path: string | null | undefined,
  base = process.env.NEXT_PUBLIC_BASE_PATH ?? "",
): string {
  if (!path) return ""
  if (/^(?:[a-z]+:)?\/\//i.test(path)) return path
  const normalized = path.startsWith("/") ? path : `/${path}`
  if (!base || normalized === base || normalized.startsWith(`${base}/`)) return normalized
  return `${base}${normalized}`
}
