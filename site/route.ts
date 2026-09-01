const ROUTE_FOCUS_KEY = "calendar-snapshotter:route-focus";

function focusRouteHeading(): void {
  const heading = document.querySelector<HTMLElement>("main h1");
  const announcer = document.querySelector<HTMLElement>("#route-announcer");
  if (!heading) return;
  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
  if (announcer) announcer.textContent = heading.textContent?.trim() || document.title;
}

document.querySelectorAll<HTMLAnchorElement>('a[href^="/"]').forEach((link) => link.addEventListener("click", () => {
  sessionStorage.setItem(ROUTE_FOCUS_KEY, "1");
}));

if (sessionStorage.getItem(ROUTE_FOCUS_KEY) === "1") {
  sessionStorage.removeItem(ROUTE_FOCUS_KEY);
  requestAnimationFrame(focusRouteHeading);
}

window.addEventListener("pageshow", (event) => {
  if (event.persisted || performance.getEntriesByType("navigation").some((entry) => (entry as PerformanceNavigationTiming).type === "back_forward")) {
    requestAnimationFrame(focusRouteHeading);
  }
});
