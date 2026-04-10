export default function Button({
  children,
  variant = 'primary',
  onClick,
  disabled,
  style,
  type = 'button',
  className = '',
}) {
  const variantStyle = {
    primary: {
      background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
      color: '#fff',
      borderColor: 'transparent',
      boxShadow: '0 12px 30px rgba(79, 124, 255, 0.22)',
    },
    outline: {
      background: 'rgba(255, 255, 255, 0.02)',
      color: 'var(--color-text-primary)',
      borderColor: 'var(--color-border-strong)',
    },
    danger: {
      background: 'var(--color-danger)',
      color: '#fff',
      borderColor: 'var(--color-danger)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--color-text-secondary)',
      borderColor: 'transparent',
    },
  }[variant] ?? {};

  return (
    <button
      className={className}
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '10px 18px',
        borderRadius: 'var(--radius-md)',
        fontSize: '14px',
        fontWeight: '700',
        border: '1px solid transparent',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.2s ease',
        fontFamily: 'inherit',
        ...variantStyle,
        ...style,
      }}
    >
      {children}
    </button>
  );
}