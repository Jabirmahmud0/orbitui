export default function App() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(83,109,254,0.22),_transparent_28%),linear-gradient(180deg,_var(--color-surface-strong)_0%,_#08101f_100%)] text-[var(--color-foreground)]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />
      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 py-20 sm:px-10 lg:px-12">
        <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:items-end">
          <div className="space-y-7">
            <p className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent-soft)] shadow-[0_20px_80px_rgba(15,23,42,0.35)] backdrop-blur">
              OrbitUI Foundations
            </p>
            <div className="space-y-5">
              <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.06em] sm:text-6xl lg:text-7xl">
                Tailwind v4 is now driving the library shell.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[color:var(--color-foreground-muted)] sm:text-lg">
                This scaffold now runs on the Tailwind CSS v4 toolchain with a token-ready base layer,
                Vite plugin integration, and a preview surface that can evolve into the full design system.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-surface-overlay)] px-4 py-2 text-sm text-[var(--color-foreground-muted)]">
                Tailwind v4
              </span>
              <span className="rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-surface-overlay)] px-4 py-2 text-sm text-[var(--color-foreground-muted)]">
                PostCSS wired
              </span>
              <span className="rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-surface-overlay)] px-4 py-2 text-sm text-[var(--color-foreground-muted)]">
                Theme-token base layer
              </span>
            </div>
          </div>
          <aside className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/8 p-5 shadow-[0_24px_100px_rgba(8,15,31,0.55)] backdrop-blur-xl">
            <div className="rounded-[1.5rem] border border-white/10 bg-[var(--color-surface-overlay)] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent-soft)]">
                Current milestone
              </p>
              <p className="mt-4 text-2xl font-semibold tracking-[-0.04em]">Task 1.2 complete</p>
              <p className="mt-2 text-sm leading-7 text-[var(--color-foreground-muted)]">
                Base styles, gradient canvas, and Tailwind-powered layout primitives are in place.
              </p>
            </div>
            <div className="grid gap-3 rounded-[1.5rem] border border-white/10 bg-[#0b152c]/80 p-5">
              <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                <span className="text-sm text-[var(--color-foreground-muted)]">Foundation</span>
                <span className="text-sm font-medium text-emerald-300">2 / 4 tasks</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-white/8">
                <div className="h-full w-1/2 rounded-full bg-[linear-gradient(90deg,_#8b5cf6_0%,_#38bdf8_100%)]" />
              </div>
              <p className="text-sm leading-7 text-[var(--color-foreground-muted)]">
                Next up: linting, formatting, and test infrastructure.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
