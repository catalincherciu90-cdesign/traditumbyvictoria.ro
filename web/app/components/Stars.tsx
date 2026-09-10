export default function Stars({ rating = 5 }: { rating?: number }) {
  const n = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <span className="inline-flex text-gold" aria-label={`${n} din 5 stele`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < n ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.9 6.19 20.9l1.11-6.47L2.6 9.85l6.5-.95L12 2.5z" />
        </svg>
      ))}
    </span>
  );
}
