interface SkeletonProps {
  width?: string;
  height?: string;
  radius?: string;
  className?: string;
}

export function Skeleton({ width = '100%', height = '1rem', radius = '6px', className = '' }: SkeletonProps) {
  return (
    <span
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius: radius }}
    />
  );
}

export function SkeletonSummaryCard() {
  return (
    <div className="summary-card">
      <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0 }} />
      <div className="summary-card-content" style={{ gap: '.4rem' }}>
        <Skeleton width="60%" height=".65rem" />
        <Skeleton width="80%" height="1.4rem" />
        <Skeleton width="45%" height=".6rem" />
      </div>
    </div>
  );
}

export function SkeletonListRow() {
  return (
    <div className="list-row" style={{ gap: '.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', flex: 1 }}>
        <Skeleton width="120px" height=".85rem" />
        <Skeleton width="60px" height="1.1rem" radius="999px" />
      </div>
      <Skeleton width="70px" height=".85rem" />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="expense-card">
      <div className="expense-card-main">
        <div className="expense-card-info" style={{ gap: '.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <Skeleton width="140px" height=".9rem" />
            <Skeleton width="70px" height="1.1rem" radius="999px" />
          </div>
          <Skeleton width="90px" height=".7rem" />
        </div>
        <Skeleton width="80px" height="1rem" />
      </div>
      <div className="expense-card-actions" style={{ gap: '.5rem' }}>
        <Skeleton width="130px" height="1.8rem" radius="6px" />
        <Skeleton width="30px" height="30px" radius="6px" />
        <Skeleton width="30px" height="30px" radius="6px" />
      </div>
    </div>
  );
}

export function SkeletonSection({ rows = 3, showActions = false }: { rows?: number; showActions?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
      {Array.from({ length: rows }).map((_, i) =>
        showActions ? <SkeletonCard key={i} /> : <SkeletonListRow key={i} />
      )}
    </div>
  );
}
