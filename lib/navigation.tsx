import type { AnchorHTMLAttributes } from "react";
import { appPath, fullUrl } from "./paths";
export function publicUrl(path: string) { return fullUrl(window.location.origin, path); }
function navigate(path: string, replace = false) {
  window.history[replace ? "replaceState" : "pushState"]({}, "", appPath(path));
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo(0, 0);
}
const router = { push: (path: string) => navigate(path), replace: (path: string) => navigate(path, true) };
export function useRouter() { return router; }
export default function Link({href = "/", onClick, ...props}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a {...props} href={appPath(href)} onClick={event => {
    onClick?.(event);
    if (!event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && (!props.target || props.target === "_self")) {
      event.preventDefault(); navigate(href);
    }
  }} />;
}
