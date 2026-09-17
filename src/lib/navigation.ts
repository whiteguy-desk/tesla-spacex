/**
 * Programmatic SPA navigation helper using standard History API and popstate events.
 */
export function navigate(path: string): void {
  if (typeof window !== 'undefined') {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}
