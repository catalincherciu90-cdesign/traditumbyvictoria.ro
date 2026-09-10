export default function PageHeader({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <section className="bg-cream-2">
      <div className="mx-auto max-w-3xl px-5 py-14 text-center md:py-20">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="text-3xl text-ink sm:text-4xl md:text-5xl">{title}</h1>
        {subtitle && <p className="mx-auto mt-4 max-w-xl text-ink-soft">{subtitle}</p>}
        <div className="mx-auto mt-6 h-px w-24 bg-gold/50" />
      </div>
    </section>
  );
}
