export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white/80">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} Minimal Blog Starter.</p>
        <p className="text-slate-400">Built with Next.js, Tailwind, and Markdown content.</p>
      </div>
    </footer>
  );
}
