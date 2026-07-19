/**
 * Inline boot script — runs before paint to avoid a light flash
 * when the user prefers (or last chose) night mode.
 */
export function ThemeScript() {
  const code = `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: code }}
      // Must run before first paint; suppress hydration warning on the
      // class that this script may add to <html>.
    />
  );
}
