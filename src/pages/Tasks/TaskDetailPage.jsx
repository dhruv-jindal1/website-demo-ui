// ─── TaskDetailPage ───────────────────────────────────────────
// Branch: feature/task-form  |  Owner: Person 3
// Route:  /tasks/:id

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTasks } from '../../hooks/useTasks';
import { formatDuration } from '../../utils/fakeData';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function TaskDetailPage() {
  const { id } = useParams();
  const { tasks, updateTask } = useTasks();
  const navigate = useNavigate();
  const task = tasks.find((t) => t.id === id);

  const [running, setRunning]   = useState(false);
  const [elapsed, setElapsed]   = useState(task?.duration ?? 0);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [running]);

  if (!task) {
    return (
      <div>
        <p style={{ color: 'var(--color-text-muted)', padding: '40px 0' }}>Task not found.</p>
        <Button variant="outline" onClick={() => navigate('/dashboard')}>← Back</Button>
      </div>
    );
  }

  const handleStop = () => {
    setRunning(false);
    updateTask(id, { duration: elapsed, status: 'completed' });
  };

  return (
    <div style={{ maxWidth: '560px' }}>
      <button onClick={() => navigate(-1)} style={styles.backBtn}>← Back</button>

      <Card style={{ marginBottom: '20px', textAlign: 'center' }}>
        <h1 style={styles.taskTitle}>{task.title}</h1>
        <p style={styles.project}>{task.project}</p>

        {/* Timer display */}
        <div style={styles.timerDisplay}>
          {formatDuration(elapsed)}
        </div>

        <div style={styles.timerActions}>
          {!running ? (
            <Button onClick={() => setRunning(true)} style={{ padding: '12px 32px', fontSize: '15px' }}>
              ▶ Start timer
            </Button>
          ) : (
            <Button variant="danger" onClick={handleStop} style={{ padding: '12px 32px', fontSize: '15px' }}>
              ◼ Stop timer
            </Button>
          )}
        </div>
      </Card>

      {/* Task meta */}
      <Card>
        <h2 style={styles.sectionTitle}>Details</h2>
        <div style={styles.metaGrid}>
          {[
            { label: 'Status', value: task.status },
            { label: 'Date',   value: task.date },
            { label: 'Tags',   value: task.tags?.join(', ') || '—' },
          ].map(({ label, value }) => (
            <div key={label} style={styles.metaRow}>
              <span style={styles.metaLabel}>{label}</span>
              <span style={styles.metaValue}>{value}</span>
            </div>
          ))}
        </div>

        <div style={styles.editRow}>
          <Button variant="outline" onClick={() => navigate(`/tasks/${id}/edit`)}>Edit task</Button>
        </div>
      </Card>
    </div>
  );
}

const styles = {
  backBtn: { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: '16px', padding: 0 },
  taskTitle: { fontSize: '22px', fontWeight: '700', marginBottom: '6px' },
  project: { fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '28px' },
  timerDisplay: { fontSize: '56px', fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', letterSpacing: '-2px', margin: '0 0 24px' },
  timerActions: { display: 'flex', justifyContent: 'center', marginBottom: '8px' },
  sectionTitle: { fontSize: '15px', fontWeight: '600', marginBottom: '14px' },
  metaGrid: { display: 'flex', flexDirection: 'column', gap: '0' },
  metaRow: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--color-border)' },
  metaLabel: { fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: '500' },
  metaValue: { fontSize: '13px', fontWeight: '500', textTransform: 'capitalize' },
  editRow: { display: 'flex', justifyContent: 'flex-end', marginTop: '16px' },
};
