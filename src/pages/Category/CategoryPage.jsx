import { useState } from 'react';
import { useCategories } from '../../hooks/useCategories';

export default function CategoryPage() {
  const { categories, addCategory, deleteCategory } = useCategories();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleAddCategory = (e) => {
    e.preventDefault();

    const result = addCategory(name);

    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    setName('');
    setMessage('');
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Manage</p>
          <h1 style={styles.title}>Categories</h1>
          <p style={styles.subtitle}>
            Create and manage your custom task categories in one place.
          </p>
        </div>
      </div>

      <section style={styles.createCard}>
        <div style={styles.createCardTop}>
          <div>
            <h2 style={styles.cardTitle}>Create new category</h2>
            <p style={styles.cardSubtext}>
              Add categories like Study, Client Work, Meetings, or Travel.
            </p>
          </div>
        </div>

        <form onSubmit={handleAddCategory} style={styles.formRow}>
          <input
            type="text"
            placeholder="e.g. Study, Client Work, Meetings"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />

          <button type="submit" className="btn btn-primary" style={styles.addBtn}>
            Add category
          </button>
        </form>

        {message ? <p style={styles.error}>{message}</p> : null}
      </section>

      <section style={styles.listCard}>
        <div style={styles.listHeader}>
          <div>
            <h2 style={styles.cardTitle}>Existing categories</h2>
            <p style={styles.cardSubtext}>
              Your saved categories are shown below.
            </p>
          </div>

          <div style={styles.countBadge}>
            {categories.length} {categories.length === 1 ? 'category' : 'categories'}
          </div>
        </div>

        <div style={styles.scrollArea}>
          {categories.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>#</div>
              <h3 style={styles.emptyTitle}>No categories yet</h3>
              <p style={styles.emptyText}>
                Create your first category to organize tasks more clearly.
              </p>
            </div>
          ) : (
            <div style={styles.categoryGrid}>
              {categories.map((category) => (
                <div key={category.id} style={styles.categoryItem}>
                  <div style={styles.categoryLeft}>
                    <span
                      style={{
                        ...styles.categoryDot,
                        background: category.color,
                        boxShadow: `0 0 18px ${category.color}55`,
                      }}
                    />
                    <span style={styles.categoryName}>{category.name}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteCategory(category.id)}
                    style={styles.deleteBtn}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

const styles = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },

  header: {
    marginBottom: '4px',
  },

  eyebrow: {
    margin: '0 0 8px 0',
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.16em',
    color: 'var(--color-accent)',
  },

  title: {
    margin: '0 0 10px 0',
    fontSize: 'clamp(2rem, 3vw, 2.7rem)',
    fontWeight: '800',
    color: 'var(--color-text-primary)',
    letterSpacing: '-0.03em',
  },

  subtitle: {
    margin: 0,
    fontSize: '15px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.7',
  },

  createCard: {
    background:
      'linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.02)), var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
    boxShadow: 'var(--shadow-sm)',
  },

  createCardTop: {
    marginBottom: '16px',
  },

  listCard: {
    background:
      'linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.02)), var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
    boxShadow: 'var(--shadow-sm)',
  },

  listHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '16px',
    marginBottom: '18px',
    flexWrap: 'wrap',
  },

  cardTitle: {
    margin: '0 0 6px 0',
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--color-text-primary)',
    letterSpacing: '-0.02em',
  },

  cardSubtext: {
    margin: 0,
    fontSize: '13px',
    color: 'var(--color-text-muted)',
    lineHeight: '1.6',
  },

  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: '14px',
    alignItems: 'center',
  },

  input: {
    width: '100%',
    minHeight: '52px',
    padding: '12px 16px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    background: 'rgba(255, 255, 255, 0.03)',
    color: 'var(--color-text-primary)',
    outline: 'none',
    fontSize: '14px',
  },

  addBtn: {
    minHeight: '52px',
    paddingInline: '22px',
    whiteSpace: 'nowrap',
  },

  error: {
    marginTop: '12px',
    fontSize: '13px',
    color: 'var(--color-danger)',
    fontWeight: '600',
  },

  countBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '8px 12px',
    borderRadius: '999px',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text-secondary)',
    fontSize: '13px',
    fontWeight: '700',
  },

  scrollArea: {
    maxHeight: '460px',
    overflowY: 'auto',
    paddingRight: '6px',
  },

  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '14px',
  },

  categoryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    padding: '18px 18px',
    borderRadius: '18px',
    border: '1px solid var(--color-border)',
    background: 'rgba(255, 255, 255, 0.025)',
  },

  categoryLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    minWidth: 0,
  },

  categoryDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: 'var(--color-primary)',
    boxShadow: '0 0 18px rgba(79, 124, 255, 0.35)',
    flexShrink: 0,
  },

  categoryName: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--color-text-primary)',
    wordBreak: 'break-word',
  },

  deleteBtn: {
    border: '1px solid rgba(255, 107, 122, 0.24)',
    background: 'rgba(255, 107, 122, 0.08)',
    color: 'var(--color-danger)',
    padding: '10px 16px',
    borderRadius: 'var(--radius-md)',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    flexShrink: 0,
  },

  emptyState: {
    minHeight: '240px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    textAlign: 'center',
    gap: '10px',
    borderRadius: '18px',
    border: '1px dashed var(--color-border)',
    background: 'rgba(255,255,255,0.02)',
  },

  emptyIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '18px',
    display: 'grid',
    placeItems: 'center',
    fontSize: '24px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, rgba(79,124,255,0.18), rgba(124,92,255,0.16))',
    color: 'var(--color-text-primary)',
  },

  emptyTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '800',
    color: 'var(--color-text-primary)',
  },

  emptyText: {
    margin: 0,
    maxWidth: '320px',
    color: 'var(--color-text-muted)',
    fontSize: '14px',
    lineHeight: '1.6',
  },
};