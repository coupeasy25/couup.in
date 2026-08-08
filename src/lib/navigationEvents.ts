export function notifyNavigationStart() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("couup:navigation-start"));
  }
}
