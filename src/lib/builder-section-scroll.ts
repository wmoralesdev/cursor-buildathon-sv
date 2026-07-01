/** Scroll to a builder hub section, retrying while lazy chunks mount. */
export function scrollToBuilderSection(sectionId: string) {
  const hash = `#${sectionId}`;
  if (window.location.hash !== hash) {
    window.history.pushState(null, "", hash);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }

  const scroll = () => {
    const el = document.getElementById(sectionId);
    if (!el) return false;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    return true;
  };

  scroll();
  window.setTimeout(scroll, 120);
  window.setTimeout(scroll, 400);
  window.setTimeout(scroll, 900);
}
