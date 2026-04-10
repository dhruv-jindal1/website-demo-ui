// ─── Input ────────────────────────────────────────────────────
// Usage:
//   <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
//   <Input label="Notes" as="textarea" />

export default function Input({ label, id, as = 'input', error, style, ...props }) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  const Tag = as;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', ...style }}>
      {label && (
        <label htmlFor={inputId} style={styles.label}>{label}</label>
      )}
      <Tag
        id={inputId}
        style={{
          ...styles.input,
          ...(as === 'textarea' ? styles.textarea : {}),
          ...(error ? styles.inputError : {}),
        }}
        {...props}
      />
      {error && <span style={styles.error}>{error}</span>}
    </div>
  );
}

const styles = {
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--color-text-secondary)',
  },
  input: {
    padding: '9px 12px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border-strong)',
    background: 'var(--color-surface)',
    fontSize: '14px',
    color: 'var(--color-text-primary)',
    outline: 'none',
    transition: 'border-color 0.15s',
    width: '100%',
  },
  textarea: {
    minHeight: '100px',
    resize: 'vertical',
  },
  inputError: { borderColor: 'var(--color-danger)' },
  error: { fontSize: '12px', color: 'var(--color-danger)' },
};
