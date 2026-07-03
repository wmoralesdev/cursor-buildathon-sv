/** Update builder hub hash without scrolling the page. */
export function navigateToBuilderSection(sectionId: string) {
  const hash = `#${sectionId}`;
  if (window.location.hash !== hash) {
    window.history.pushState(null, "", hash);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }
}

/** @deprecated Use {@link navigateToBuilderSection}. */
export const scrollToBuilderSection = navigateToBuilderSection;
