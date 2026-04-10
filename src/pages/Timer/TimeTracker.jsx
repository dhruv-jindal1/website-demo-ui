import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { fakeStats } from '../../utils/fakeData';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';


function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function getCurrentDateDisplay() {
  const today = new Date();

  const dayName = today.toLocaleDateString('en-AU', { weekday: 'long' });
  const month = today.toLocaleDateString('en-AU', { month: 'long' });
  const day = today.getDate();

  const getOrdinal = (num) => {
    if (num > 3 && num < 21) return 'th';
    switch (num % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  return {
    day,
    suffix: getOrdinal(day),
    month,
    dayName,
  };
}


export default function TimeTracker() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const firstName = user?.name?.split(' ')[0] || 'User';
  const currentDate = getCurrentDateDisplay();

const overviewStats = [
  {
    label: 'Time logged today',
    value: `${fakeStats.todayHours} hours`,
    helper: 'Hours captured across your work sessions today',
    accent: 'blue',
    backTitle: 'Today breakdown',
    details: [
      { label: 'Goal', value: '5h' },
      { label: 'Completion', value: '70%' },
      { label: 'Deep work', value: '2.1h' },
      { label: 'Last session', value: '48 min' },
    ],
  },
  {
    label: 'Weekly total',
    value: `${fakeStats.weekHours} hours`,
    helper: 'Your tracked time so far this week',
    accent: 'green',
    backTitle: 'Weekly insights',
    details: [
      { label: 'Daily average', value: '3.6h' },
      { label: 'Best day', value: 'Thursday' },
      { label: 'Longest session', value: '1.9h' },
      { label: 'vs last week', value: '+2.4h' },
    ],
  },
  {
    label: 'Monthly total',
    value: `${fakeStats.monthHours} hours`,
    helper: 'Overall time recorded this month',
    accent: 'violet',
    backTitle: 'Monthly progress',
    details: [
      { label: 'Active days', value: '18' },
      { label: 'Target', value: '80h' },
      { label: 'Completion', value: '81%' },
      { label: 'Top category', value: 'Design' },
    ],
  },
  {
    label: 'Tasks in progress',
    value: `${fakeStats.activeTasks}`,
    helper: 'Tasks that are currently active',
    accent: 'amber',
    backTitle: 'Task snapshot',
    details: [
      { label: 'High priority', value: '1' },
      { label: 'Due today', value: '1' },
      { label: 'Overdue', value: '0' },
      { label: 'Next up', value: 'Login page' },
    ],
  },
];

  return (
    <div className="dashboard-page">
      <div className="time-tracker-shell">
        <section className="dashboard-hero">
          <div className="dashboard-hero__content">
            <span className="dashboard-hero__eyebrow">Time tracker</span>
            <h1 className="dashboard-hero__title">
              {getGreeting()}, {firstName}
            </h1>
            <p className="dashboard-hero__subtitle">
              Track your time, review today’s progress, and jump back into work without losing flow.
            </p>
          </div>

          <div className="dashboard-hero__actions">
            <Button
              onClick={() => navigate('/tasks/new')}
              style={{ minWidth: '170px', justifyContent: 'center' }}
            >
              ✚ Add Task
            </Button>

            <Button
              variant="outline"
              style={{ minWidth: '170px', justifyContent: 'center' }}
            >
              ▶ Start Timer
            </Button>

            <div className="dashboard-current-date">
              <span className="dashboard-current-date__daynum">
                {currentDate.day}
                <sup className="dashboard-current-date__suffix">{currentDate.suffix}</sup>
              </span>{' '}
              {currentDate.month}, {currentDate.dayName}
            </div>
          </div>
        </section>

        <section className="time-tracker-floating-stats">
          {overviewStats.map((item, index) => (
            <div
              key={item.label}
              className={`dashboard-flip-card dashboard-flip-card--${item.accent} floating-card floating-card--${index + 1}`}
            >
              <div className="dashboard-flip-card__inner">
                <Card className={`dashboard-stat-card dashboard-stat-card--front dashboard-stat-card--${item.accent}`}>
                  <div className="dashboard-stat-card__glow" />
                  <p className="dashboard-stat-card__label">{item.label}</p>
                  <h3 className="dashboard-stat-card__value">{item.value}</h3>
                  <p className="dashboard-stat-card__helper">{item.helper}</p>
                </Card>

                <Card className={`dashboard-stat-card dashboard-stat-card--back dashboard-stat-card--${item.accent}`}>
                  <div className="dashboard-stat-card__glow" />
                  <p className="dashboard-stat-card__label">{item.backTitle}</p>

                  <div className="dashboard-stat-card__details">
                    {item.details.map((detail) => (
                      <div key={detail.label} className="dashboard-stat-card__detail-row">
                        <span className="dashboard-stat-card__detail-label">{detail.label}</span>
                        <span className="dashboard-stat-card__detail-value">{detail.value}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          ))}
        </section>

        <Card className="dashboard-panel">
          <div className="dashboard-panel__header">
            <div>
              <p className="dashboard-panel__eyebrow">Quick insights</p>
              <h2 className="dashboard-panel__title">Highlights</h2>
            </div>
          </div>

          <div className="dashboard-highlight-list">
            <div className="dashboard-highlight-item">
              <span className="dashboard-highlight-item__title">Top category</span>
              <strong>Engagement • 20h</strong>
            </div>
            <div className="dashboard-highlight-item">
              <span className="dashboard-highlight-item__title">Most recent task</span>
              <strong>Design login page</strong>
            </div>
            <div className="dashboard-highlight-item">
              <span className="dashboard-highlight-item__title">Consistency streak</span>
              <strong>7 days active</strong>
            </div>
            <div className="dashboard-highlight-item">
              <span className="dashboard-highlight-item__title">Suggested next action</span>
              <strong>Create a task and start a focused timer</strong>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

