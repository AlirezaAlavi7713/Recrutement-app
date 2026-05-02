import "../css/Skeleton.css";

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-card__top">
        <div className="skeleton skeleton-avatar" />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div className="skeleton skeleton-line" style={{ width: "60%" }} />
          <div className="skeleton skeleton-line" style={{ width: "40%" }} />
        </div>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.8rem" }}>
        <div className="skeleton skeleton-badge" />
        <div className="skeleton skeleton-badge" />
      </div>
      <div className="skeleton skeleton-line" style={{ marginTop: "0.8rem", width: "30%" }} />
      <div className="skeleton skeleton-line" style={{ marginTop: "0.4rem" }} />
      <div className="skeleton skeleton-line" style={{ width: "80%" }} />
      <div className="skeleton skeleton-btn" />
    </div>
  );
}

export function SkeletonList({ count = 6 }) {
  return (
    <div className="offres__grid">
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}
