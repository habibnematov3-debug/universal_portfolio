export function siteUrl(): string {
  const candidate =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000");
  try {
    const url = new URL(candidate);
    if (["https:", "http:"].includes(url.protocol)) return url.origin;
  } catch {}
  return "http://localhost:3000";
}
