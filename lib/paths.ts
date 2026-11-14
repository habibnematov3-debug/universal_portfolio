export const BASE = "/universal_portfolio/";
export function appPath(path: string) {
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) {
    throw new Error("Invalid internal path");
  }
  const result = new URL(BASE + path.slice(1), "https://portfolio.invalid");
  if (!result.pathname.startsWith(BASE)) throw new Error("Invalid internal path");
  return result.pathname + result.search + result.hash;
}
export function routePath(pathname: string) {
  if (pathname === BASE.slice(0, -1)) return "/";
  if (!pathname.startsWith(BASE)) return "/404";
  return "/" + pathname.slice(BASE.length).replace(/\/+$/, "");
}
export function fullUrl(origin: string, path: string) {
  return new URL(appPath(path), origin).href;
}
