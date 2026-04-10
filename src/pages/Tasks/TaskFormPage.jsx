import { useState } from 'react';
import { useCategories } from '../../hooks/useCategories';

const TASKS_STORAGE_KEY = 'timeTrack_tasks';

export default function TaskFormPage() {
  const { categories, addCategory } = useCategories();

  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState('');
  const [durationHours, setDurationHours] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState('');

  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const [aiSuggestedCategory, setAiSuggestedCategory] = useState(null);
  const [aiSuggestionMessage, setAiSuggestionMessage] = useState('');
  const [isManualOverride, setIsManualOverride] = useState(false);

  const keywordMap = {
    work: [
      'meeting',
      'client',
      'report',
      'presentation',
      'proposal',
      'office',
      'planning',
      'email',
      'document',
      'manager',
      'deadline',
      'business',
    ],
    study: [
      'study',
      'assignment',
      'exam',
      'quiz',
      'research',
      'lecture',
      'tutorial',
      'class',
      'course',
      'homework',
      'university',
      'assessment',
    ],
    personal: [
      'shopping',
      'groceries',
      'family',
      'home',
      'cleaning',
      'errand',
      'bank',
      'personal',
      'appointment',
      'call',
    ],
    fitness: [
      'gym',
      'exercise',
      'workout',
      'run',
      'walking',
      'yoga',
      'fitness',
      'cardio',
      'training',
    ],
    development: [
      'code',
      'coding',
      'debug',
      'bug',
      'feature',
      'frontend',
      'backend',
      'deploy',
      'react',
      'api',
      'testing',
      'development',
    ],
    design: [
      'design',
      'figma',
      'wireframe',
      'prototype',
      'mockup',
      'ui',
      'ux',
      'branding',
    ],
  };

  const findBestCategoryMatch = (description) => {
    const text = description.trim().toLowerCase();

    if (!text) {
      return { category: null, message: 'Please enter a task description first.' };
    }

    let bestCategory = null;
    let bestScore = 0;

    categories.forEach((category) => {
      const categoryName = category.name.toLowerCase();
      let score = 0;

      if (text.includes(categoryName)) {
        score += 3;
      }

      const relatedKeywords = keywordMap[categoryName] || [];
      relatedKeywords.forEach((keyword) => {
        if (text.includes(keyword)) {
          score += 1;
        }
      });

      if (score > bestScore) {
        bestScore = score;
        bestCategory = category;
      }
    });

    if (!bestCategory) {
      return {
        category: null,
        message: 'No strong AI category suggestion found. Please choose manually.',
      };
    }

    return {
      category: bestCategory,
      message: `Suggested based on your description: ${bestCategory.name}`,
    };
  };

  const handleAiSuggestCategory = () => {
    const result = findBestCategoryMatch(taskDescription);
    setAiSuggestedCategory(result.category);
    setAiSuggestionMessage(result.message);
  };

  const handleUseSuggestedCategory = () => {
    if (!aiSuggestedCategory) return;

    setCategoryId(aiSuggestedCategory.id);
    setShowNewCategory(false);
    setIsManualOverride(false);
    setError('');
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;

    if (value === '__new__') {
      setShowNewCategory(true);
      setCategoryId('');
      setIsManualOverride(true);
      return;
    }

    setShowNewCategory(false);
    setCategoryId(value);
    setIsManualOverride(true);
  };

  const handleCreateCategory = () => {
    const result = addCategory(newCategoryName);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setError('');
    setNewCategoryName('');
    setShowNewCategory(false);
    setCategoryId(result.category.id);
    setIsManualOverride(true);
  };

  const resetForm = () => {
    setTaskName('');
    setTaskDescription('');
    setCategoryId('');
    setDate('');
    setDurationHours('');
    setDurationMinutes('');
    setNotes('');
    setPriority('');
    setNewCategoryName('');
    setShowNewCategory(false);
    setAiSuggestedCategory(null);
    setAiSuggestionMessage('');
    setIsManualOverride(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!taskName.trim()) {
      setError('Task name is required.');
      return;
    }

    if (!taskDescription.trim()) {
      setError('Task description is required.');
      return;
    }

    if (!categoryId) {
      setError('Please select a category.');
      return;
    }

    if (!date) {
      setError('Please select a date.');
      return;
    }

    if (!priority) {
      setError('Please select a priority.');
      return;
    }

    const hours = Number(durationHours || 0);
    const minutes = Number(durationMinutes || 0);

    if (hours < 0 || minutes < 0 || minutes > 59) {
      setError('Please enter a valid duration.');
      return;
    }

    if (hours === 0 && minutes === 0) {
      setError('Please enter a duration greater than 0.');
      return;
    }

    const selectedCategory = categories.find((cat) => cat.id === categoryId);

    const newTask = {
      id: `task-${Date.now()}`,
      name: taskName.trim(),
      description: taskDescription.trim(),
      categoryId,
      categoryName: selectedCategory?.name || '',
      categoryColor: selectedCategory?.color || 'var(--color-primary)',
      date,
      durationHours: hours,
      durationMinutes: minutes,
      totalMinutes: hours * 60 + minutes,
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
      priority,
      aiSuggestedCategoryId: aiSuggestedCategory?.id || '',
      aiSuggestedCategoryName: aiSuggestedCategory?.name || '',
      categoryOverriddenManually: isManualOverride,
    };

    const existingTasks = JSON.parse(localStorage.getItem(TASKS_STORAGE_KEY) || '[]');
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify([...existingTasks, newTask]));

    setError('');
    setSaved(true);
    resetForm();

    setTimeout(() => {
      setSaved(false);
    }, 2200);
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Task Management</p>
          <h1 style={styles.title}>Create Task</h1>
          <p style={styles.subtitle}>
            Add a task, assign it to a category, and track the time spent on it.
          </p>
        </div>
      </div>

      <section style={styles.card}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.grid}>
            <div style={styles.mainColumn}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Task name</label>
                <input
                  type="text"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  placeholder="e.g. Prepare weekly report"
                  style={styles.input}
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Task description</label>
                <textarea
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Describe what this task is about..."
                  style={styles.textarea}
                />
              </div>

              <div style={styles.aiSuggestBox}>
                <div style={styles.aiSuggestTop}>
                  <div>
                    <p style={styles.aiLabel}>AI category suggestion</p>
                    <p style={styles.aiSubtext}>
                      Let AI suggest the most suitable category based on your description.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={handleAiSuggestCategory}
                  >
                    AI Suggest Category
                  </button>
                </div>

                {aiSuggestionMessage ? (
                  <div style={styles.aiResultBox}>
                    <p style={styles.aiMessage}>{aiSuggestionMessage}</p>

                    {aiSuggestedCategory ? (
                      <div style={styles.aiResultActions}>
                        <span
                          style={{
                            ...styles.categoryChip,
                            background: aiSuggestedCategory.color || 'var(--color-accent)',
                          }}
                        >
                          {aiSuggestedCategory.name}
                        </span>

                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleUseSuggestedCategory}
                        >
                          Use suggestion
                        </button>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  style={styles.select}
                >
                  <option value="">Select priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Additional notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes, reminders, or extra details..."
                  style={styles.notesTextarea}
                />
              </div>
            </div>

            <div style={styles.sideColumn}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Category</label>
                <select
                  value={categoryId || (showNewCategory ? '__new__' : '')}
                  onChange={handleCategoryChange}
                  style={styles.select}
                >
                  <option value="" style={styles.option}>
                    Select category
                  </option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.id} style={styles.option}>
                      {category.name}
                    </option>
                  ))}

                  <option value="__new__" style={styles.option}>
                    + Create new category
                  </option>
                </select>

                {categoryId && aiSuggestedCategory && categoryId !== aiSuggestedCategory.id ? (
                  <span style={styles.overrideText}>
                    Manual override active. Your selected category is different from the AI suggestion.
                  </span>
                ) : null}
              </div>

              {showNewCategory && (
                <div style={styles.newCategoryBox}>
                  <label style={styles.label}>New category name</label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Enter category name"
                    style={styles.input}
                  />

                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={handleCreateCategory}
                    style={styles.fullWidthBtn}
                  >
                    Create category
                  </button>
                </div>
              )}

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Time duration</label>
                <div style={styles.durationRow}>
                  <div style={styles.durationBox}>
                    <input
                      type="number"
                      min="0"
                      value={durationHours}
                      onChange={(e) => setDurationHours(e.target.value)}
                      placeholder="0"
                      style={styles.input}
                    />
                    <span style={styles.durationLabel}>Hours</span>
                  </div>

                  <div style={styles.durationBox}>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(e.target.value)}
                      placeholder="0"
                      style={styles.input}
                    />
                    <span style={styles.durationLabel}>Minutes</span>
                  </div>
                </div>
              </div>

              <div style={styles.summaryCard}>
                <p style={styles.summaryLabel}>Task summary</p>

                <div style={styles.summaryRow}>
                  <span style={styles.summaryKey}>Selected category</span>
                  <span style={styles.summaryValue}>
                    {categories.find((cat) => cat.id === categoryId)?.name || 'Not selected'}
                  </span>
                </div>

                <div style={styles.summaryRow}>
                  <span style={styles.summaryKey}>AI suggested</span>
                  <span style={styles.summaryValue}>
                    {aiSuggestedCategory?.name || 'Not generated'}
                  </span>
                </div>

                <div style={styles.summaryRow}>
                  <span style={styles.summaryKey}>Date</span>
                  <span style={styles.summaryValue}>{date || 'Not selected'}</span>
                </div>

                <div style={styles.summaryRow}>
                  <span style={styles.summaryKey}>Duration</span>
                  <span style={styles.summaryValue}>
                    {(durationHours || 0)}h {(durationMinutes || 0)}m
                  </span>
                </div>
              </div>
            </div>
          </div>

          {(error || saved) && (
            <div style={styles.feedbackRow}>
              {error ? <span style={styles.error}>{error}</span> : null}
              {saved ? <span style={styles.saved}>✓ Task created successfully</span> : null}
            </div>
          )}

          <div style={styles.actions}>
            <button type="submit" className="btn btn-primary">
              Save task
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: '1240px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
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
    maxWidth: '720px',
  },

  card: {
    background:
      'linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.02)), var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
    boxShadow: 'var(--shadow-sm)',
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: '1.4fr 0.9fr',
    gap: '20px',
  },

  mainColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },

  sideColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },

  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--color-text-secondary)',
  },

  input: {
    width: '100%',
    minHeight: '48px',
    padding: '12px 14px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    background: 'rgba(255, 255, 255, 0.03)',
    color: 'var(--color-text-primary)',
    outline: 'none',
    fontSize: '14px',
  },

  select: {
    width: '100%',
    minHeight: '48px',
    padding: '12px 14px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    background: 'rgba(255, 255, 255, 0.03)',
    color: 'var(--color-text-primary)',
    outline: 'none',
    fontSize: '14px',
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
  },

  textarea: {
    width: '100%',
    minHeight: '130px',
    padding: '14px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    background: 'rgba(255, 255, 255, 0.03)',
    color: 'var(--color-text-primary)',
    outline: 'none',
    fontSize: '14px',
    resize: 'vertical',
    fontFamily: 'inherit',
  },

  notesTextarea: {
    width: '100%',
    minHeight: '110px',
    padding: '14px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    background: 'rgba(255, 255, 255, 0.03)',
    color: 'var(--color-text-primary)',
    outline: 'none',
    fontSize: '14px',
    resize: 'vertical',
    fontFamily: 'inherit',
  },

  aiSuggestBox: {
    padding: '16px',
    borderRadius: '16px',
    border: '1px solid var(--color-border)',
    background: 'rgba(255, 255, 255, 0.025)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  aiSuggestTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '16px',
    flexWrap: 'wrap',
  },

  aiLabel: {
    margin: '0 0 6px 0',
    fontSize: '13px',
    fontWeight: '800',
    color: 'var(--color-text-primary)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },

  aiSubtext: {
    margin: 0,
    fontSize: '13px',
    lineHeight: '1.6',
    color: 'var(--color-text-secondary)',
  },

  aiResultBox: {
    padding: '14px',
    borderRadius: '14px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--color-border)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  aiMessage: {
    margin: 0,
    fontSize: '13px',
    color: 'var(--color-text-primary)',
    lineHeight: '1.6',
  },

  aiResultActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    flexWrap: 'wrap',
  },

  categoryChip: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '8px 12px',
    borderRadius: '999px',
    color: '#fff',
    fontSize: '13px',
    fontWeight: '700',
  },

  overrideText: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    lineHeight: '1.5',
  },

  newCategoryBox: {
    padding: '16px',
    borderRadius: '16px',
    border: '1px solid var(--color-border)',
    background: 'rgba(255, 255, 255, 0.025)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },

  fullWidthBtn: {
    width: '100%',
  },

  durationRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },

  durationBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  durationLabel: {
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    paddingLeft: '2px',
  },

  summaryCard: {
    padding: '18px',
    borderRadius: '18px',
    border: '1px solid var(--color-border)',
    background: 'rgba(255, 255, 255, 0.025)',
  },

  summaryLabel: {
    margin: '0 0 14px 0',
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--color-accent)',
    textTransform: 'uppercase',
    letterSpacing: '0.14em',
  },

  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    padding: '10px 0',
    borderBottom: '1px solid var(--color-border)',
  },

  summaryKey: {
    fontSize: '13px',
    color: 'var(--color-text-muted)',
  },

  summaryValue: {
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--color-text-primary)',
    textAlign: 'right',
  },

  feedbackRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },

  error: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--color-danger)',
  },

  saved: {
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--color-success)',
  },

  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },

  option: {
    background: '#10182a',
    color: '#f5f7ff',
  },
};