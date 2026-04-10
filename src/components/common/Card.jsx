export default function Card({ children, style, onClick, className = '' }) {
  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 24px',
        boxShadow: 'var(--shadow-sm)',
        cursor: onClick ? 'pointer' : 'default',
        transition: onClick ? 'box-shadow 0.15s' : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}