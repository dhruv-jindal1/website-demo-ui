import { useMemo, useState } from 'react';
import Card from '../../components/common/Card';
import { fakeTasks, formatDuration } from '../../utils/fakeData';
import './DashboardPage.css'

const CATEGORY_COLORS = {
  Development: 'var(--color-chart-blue, #60a5fa)',
  Design: 'var(--color-chart-violet, #8b5cf6)',
  Documentation: 'var(--color-chart-green, #34d399)',
  Meetings: 'var(--color-chart-amber, #f59e0b)',
  'Bug Fixing': 'var(--color-chart-rose, #f43f5e)',
  Research: 'var(--color-chart-cyan, #22d3ee)',
  Planning: 'var(--color-chart-indigo, #818cf8)',
  General: 'var(--color-chart-slate, #94a3b8)',
};

function formatSecondsToHHMMSS(seconds) {
  const safe = Math.max(0, Math.floor(seconds || 0));
  const hrs = String(Math.floor(safe / 3600)).padStart(2, '0');
  const mins = String(Math.floor((safe % 3600) / 60)).padStart(2, '0');
  const secs = String(safe % 60).padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
}

function getTaskCategory(task) {
  if (task.category) return task.category;
  if (task.tags?.includes('meeting')) return 'Meetings';
  if (task.tags?.includes('docs')) return 'Documentation';
  if (task.tags?.includes('design')) return 'Design';
  if (task.tags?.includes('bug')) return 'Bug Fixing';
  if (task.tags?.includes('research')) return 'Research';
  if (task.tags?.includes('planning')) return 'Planning';
  if (task.tags?.includes('dev')) return 'Development';
  return 'General';
}

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function getStartOfWeek(date) {
  const d = startOfDay(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function getEndOfWeek(date) {
  const start = getStartOfWeek(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return endOfDay(end);
}

function getStartOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getEndOfMonth(date) {
  return endOfDay(new Date(date.getFullYear(), date.getMonth() + 1, 0));
}

function getStartOfYear(date) {
  return new Date(date.getFullYear(), 0, 1);
}

function getEndOfYear(date) {
  return endOfDay(new Date(date.getFullYear(), 11, 31));
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function addMonths(date, months) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function addYears(date, years) {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
}

function getDatesInRange(startDate, endDate) {
  const dates = [];
  const current = startOfDay(startDate);
  const end = startOfDay(endDate);

  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

function getMonthsInYear(yearDate) {
  return Array.from({ length: 12 }, (_, index) => {
    const d = new Date(yearDate.getFullYear(), index, 1);
    d.setHours(0, 0, 0, 0);
    return d;
  });
}

function isSameDay(dateA, dateB) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

function formatAxisDate(date, mode) {
  if (mode === 'yearly') {
    return date.toLocaleDateString('en-AU', { month: 'short' });
  }

  if (mode === 'today') {
    return date.toLocaleDateString('en-AU', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  }

  return date.toLocaleDateString('en-AU', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

function formatRangeLabel(mode, start, end) {
  if (mode === 'today') {
    return start.toLocaleDateString('en-AU', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  if (mode === 'yearly') {
    return start.toLocaleDateString('en-AU', { year: 'numeric' });
  }

  return `${start.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })} - ${end.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })}`;
}

function buildConicGradient(items) {
  const total = items.reduce((sum, item) => sum + item.value, 0);

  if (!total) {
    return 'conic-gradient(var(--color-surface-muted, #334155) 0deg 360deg)';
  }

  let currentAngle = 0;

  const stops = items.map((item) => {
    const slice = (item.value / total) * 360;
    const start = currentAngle;
    const end = currentAngle + slice;
    currentAngle = end;
    return `${item.color} ${start}deg ${end}deg`;
  });

  return `conic-gradient(${stops.join(', ')})`;
}

function getTasksBetween(tasks, start, end) {
  return tasks.filter((task) => {
    const taskDate = new Date(task.date);
    taskDate.setHours(12, 0, 0, 0);
    return taskDate >= start && taskDate <= end;
  });
}

function buildPieData(tasks) {
  const grouped = tasks.reduce((acc, task) => {
    const category = getTaskCategory(task);
    acc[category] = (acc[category] || 0) + task.duration;
    return acc;
  }, {});

  return Object.entries(grouped)
    .map(([name, value]) => ({
      name,
      value,
      color: CATEGORY_COLORS[name] || CATEGORY_COLORS.General,
    }))
    .sort((a, b) => b.value - a.value);
}

function getTopCategory(tasks) {
  if (!tasks.length) return '--';

  const grouped = tasks.reduce((acc, task) => {
    const category = getTaskCategory(task);
    acc[category] = (acc[category] || 0) + task.duration;
    return acc;
  }, {});

  return Object.entries(grouped).sort((a, b) => b[1] - a[1])[0]?.[0] || '--';
}

function getRecentTask(tasks) {
  const sorted = [...tasks].sort((a, b) => {
    const byDate = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (byDate !== 0) return byDate;
    return b.id.localeCompare(a.id);
  });

  return sorted[0]?.title || '--';
}

function getYTicks(maxValueSeconds) {
  const safeMax = Math.max(maxValueSeconds, 3600);
  const roundedMax = Math.ceil(safeMax / 1800) * 1800;
  const step = roundedMax / 5;
  return Array.from({ length: 6 }, (_, index) => roundedMax - step * index);
}

function formatTickHours(seconds) {
  return `${(seconds / 3600).toFixed(1)}h`;
}

export default function DashboardPage() {
  const realToday = new Date();

  const [rangeType, setRangeType] = useState('today');
  const [anchorDate, setAnchorDate] = useState(realToday);
  const [customFrom, setCustomFrom] = useState(
    startOfDay(realToday).toISOString().split('T')[0]
  );
  const [customTo, setCustomTo] = useState(
    startOfDay(realToday).toISOString().split('T')[0]
  );
  const [hoveredBar, setHoveredBar] = useState(null);
  const [hoveredPie, setHoveredPie] = useState(null);

  const { startDate, endDate } = useMemo(() => {
    if (rangeType === 'today') {
      return {
        startDate: startOfDay(anchorDate),
        endDate: endOfDay(anchorDate),
      };
    }

    if (rangeType === 'weekly') {
      return {
        startDate: getStartOfWeek(anchorDate),
        endDate: getEndOfWeek(anchorDate),
      };
    }

    if (rangeType === 'monthly') {
      return {
        startDate: getStartOfMonth(anchorDate),
        endDate: getEndOfMonth(anchorDate),
      };
    }

    if (rangeType === 'yearly') {
      return {
        startDate: getStartOfYear(anchorDate),
        endDate: getEndOfYear(anchorDate),
      };
    }

    return {
      startDate: new Date(`${customFrom}T00:00:00`),
      endDate: new Date(`${customTo}T23:59:59`),
    };
  }, [rangeType, anchorDate, customFrom, customTo]);

  const filteredTasks = useMemo(
    () => getTasksBetween(fakeTasks, startDate, endDate),
    [startDate, endDate]
  );

  const totalSeconds = filteredTasks.reduce((sum, task) => sum + task.duration, 0);
  const topCategory = getTopCategory(filteredTasks);
  const recentTask = getRecentTask(filteredTasks);

  const rawBarData = useMemo(() => {
    if (rangeType === 'yearly') {
      return getMonthsInYear(startDate).map((monthDate) => {
        const monthTasks = filteredTasks.filter((task) => {
          const taskDate = new Date(task.date);
          return (
            taskDate.getFullYear() === monthDate.getFullYear() &&
            taskDate.getMonth() === monthDate.getMonth()
          );
        });

        const grouped = monthTasks.reduce((acc, task) => {
          const category = getTaskCategory(task);
          acc[category] = (acc[category] || 0) + task.duration;
          return acc;
        }, {});

        const segments = Object.entries(grouped)
          .map(([name, value]) => ({
            name,
            value,
            color: CATEGORY_COLORS[name] || CATEGORY_COLORS.General,
          }))
          .sort((a, b) => b.value - a.value);

        return {
          label: formatAxisDate(monthDate, 'yearly'),
          rawDate: monthDate.toISOString().split('T')[0],
          totalSeconds: segments.reduce((sum, item) => sum + item.value, 0),
          segments,
        };
      });
    }

    return getDatesInRange(startDate, endDate).map((date) => {
      const dayTasks = filteredTasks.filter((task) => isSameDay(new Date(task.date), date));

      const grouped = dayTasks.reduce((acc, task) => {
        const category = getTaskCategory(task);
        acc[category] = (acc[category] || 0) + task.duration;
        return acc;
      }, {});

      const segments = Object.entries(grouped)
        .map(([name, value]) => ({
          name,
          value,
          color: CATEGORY_COLORS[name] || CATEGORY_COLORS.General,
        }))
        .sort((a, b) => b.value - a.value);

      return {
        label: formatAxisDate(date, rangeType),
        rawDate: date.toISOString().split('T')[0],
        totalSeconds: segments.reduce((sum, item) => sum + item.value, 0),
        segments,
      };
    });
  }, [filteredTasks, rangeType, startDate, endDate]);

  const maxBarValueSeconds = Math.max(...rawBarData.map((item) => item.totalSeconds), 0);

  const barData = useMemo(() => {
    return rawBarData.map((item) => ({
      ...item,
      scaledHeightPercent:
        maxBarValueSeconds > 0 ? (item.totalSeconds / maxBarValueSeconds) * 100 : 0,
      segments: item.segments.map((segment) => ({
        ...segment,
        stackPercent: item.totalSeconds > 0 ? (segment.value / item.totalSeconds) * 100 : 0,
      })),
    }));
  }, [rawBarData, maxBarValueSeconds]);

  const pieData = useMemo(() => buildPieData(filteredTasks), [filteredTasks]);
  const pieTotal = pieData.reduce((sum, item) => sum + item.value, 0);
  const pieBackground = useMemo(() => buildConicGradient(pieData), [pieData]);
  const yAxisTicks = getYTicks(maxBarValueSeconds);

  function goToPreviousRange() {
    if (rangeType === 'today') setAnchorDate((prev) => addDays(prev, -1));
    if (rangeType === 'weekly') setAnchorDate((prev) => addDays(prev, -7));
    if (rangeType === 'monthly') setAnchorDate((prev) => addMonths(prev, -1));
    if (rangeType === 'yearly') setAnchorDate((prev) => addYears(prev, -1));
  }

  function goToNextRange() {
    if (rangeType === 'today') setAnchorDate((prev) => addDays(prev, 1));
    if (rangeType === 'weekly') setAnchorDate((prev) => addDays(prev, 7));
    if (rangeType === 'monthly') setAnchorDate((prev) => addMonths(prev, 1));
    if (rangeType === 'yearly') setAnchorDate((prev) => addYears(prev, 1));
  }

  function resetToToday() {
    const today = new Date();
    setRangeType('today');
    setAnchorDate(today);
    const iso = startOfDay(today).toISOString().split('T')[0];
    setCustomFrom(iso);
    setCustomTo(iso);
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-page__title">Dashboard</h1>
          <p className="dashboard-page__subtitle">
            Review tracked time, activity trends, and category distribution.
          </p>
        </div>

        <div className="dashboard-toolbar">
          <div className="dashboard-range-toggle">
            <button
              className={rangeType === 'today' ? 'is-active' : ''}
              onClick={() => {
                setRangeType('today');
                setAnchorDate(new Date());
              }}
            >
              Today
            </button>
            <button
              className={rangeType === 'weekly' ? 'is-active' : ''}
              onClick={() => setRangeType('weekly')}
            >
              Weekly
            </button>
            <button
              className={rangeType === 'monthly' ? 'is-active' : ''}
              onClick={() => setRangeType('monthly')}
            >
              Monthly
            </button>
            <button
              className={rangeType === 'yearly' ? 'is-active' : ''}
              onClick={() => setRangeType('yearly')}
            >
              Yearly
            </button>
            <button
              className={rangeType === 'custom' ? 'is-active' : ''}
              onClick={() => setRangeType('custom')}
            >
              Custom
            </button>
          </div>

          {rangeType !== 'custom' ? (
            <div className="dashboard-nav-range">
              <button className="dashboard-nav-range__btn" onClick={goToPreviousRange}>
                ‹
              </button>
              <div className="dashboard-nav-range__label">
                {formatRangeLabel(rangeType, startDate, endDate)}
              </div>
              <button className="dashboard-nav-range__btn" onClick={goToNextRange}>
                ›
              </button>
            </div>
          ) : (
            <div className="dashboard-custom-dates">
              <label>
                <span>From</span>
                <input
                  type="date"
                  value={customFrom}
                  onChange={(e) => setCustomFrom(e.target.value)}
                />
              </label>

              <label>
                <span>To</span>
                <input
                  type="date"
                  value={customTo}
                  onChange={(e) => setCustomTo(e.target.value)}
                />
              </label>

              <button className="dashboard-nav-range__today-btn" onClick={resetToToday}>
                Today
              </button>
            </div>
          )}
        </div>
      </div>

      <section className="dashboard-summary-grid">
        <Card className="dashboard-summary-card">
          <span className="dashboard-summary-card__label">Total time</span>
          <strong className="dashboard-summary-card__value">
            {formatSecondsToHHMMSS(totalSeconds)}
          </strong>
        </Card>

        <Card className="dashboard-summary-card">
          <span className="dashboard-summary-card__label">Top Category</span>
          <strong className="dashboard-summary-card__value">{topCategory}</strong>
        </Card>

        <Card className="dashboard-summary-card">
          <span className="dashboard-summary-card__label">Recent Task</span>
          <strong className="dashboard-summary-card__value dashboard-summary-card__value--small">
            {recentTask}
          </strong>
        </Card>
      </section>

      <section className="dashboard-chart-layout">
        <Card className="dashboard-chart-card dashboard-chart-card--bar">
          <div className="dashboard-chart-card__header">
            <div>
              <p className="dashboard-chart-card__eyebrow">Bar graph</p>
              <h2 className="dashboard-chart-card__title">Tracked time over period</h2>
            </div>
          </div>

          <div className="dashboard-real-chart">
            <div className="dashboard-real-chart__top">
              <span className="dashboard-real-chart__y-title">Hours tracked</span>
            </div>

            <div className="dashboard-real-chart__body">
              <div className="dashboard-real-chart__y-axis">
                {yAxisTicks.map((tick, index) => (
                  <span key={`${tick}-${index}`}>{formatTickHours(tick)}</span>
                ))}
              </div>

              <div className="dashboard-real-chart__plot">
                {yAxisTicks.map((tick, index) => (
                  <div
                    key={`${tick}-line-${index}`}
                    className="dashboard-real-chart__grid-line"
                    style={{ top: `${(index / (yAxisTicks.length - 1)) * 100}%` }}
                  />
                ))}

                <div className="dashboard-real-chart__bars">
                  {barData.map((item) => (
                    <div
                      key={item.rawDate}
                      className="dashboard-real-chart__bar-group"
                      onMouseEnter={() => setHoveredBar(item)}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      <div className="dashboard-real-chart__value-wrap">
                        <span className="dashboard-real-chart__bar-value">
                          {formatSecondsToHHMMSS(item.totalSeconds)}
                        </span>
                      </div>

                      <div className="dashboard-real-chart__bar-track">
                        <div
                          className="dashboard-real-chart__bar-shell"
                          style={{ height: `${item.scaledHeightPercent}%` }}
                        >
                          <div className="dashboard-real-chart__bar-stack">
                            {item.segments.map((segment) => (
                              <div
                                key={segment.name}
                                className="dashboard-real-chart__bar-segment"
                                style={{
                                  height: `${segment.stackPercent}%`,
                                  background: segment.color,
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <span className="dashboard-real-chart__x-label">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="dashboard-real-chart__x-title">
              {rangeType === 'yearly' ? 'Months' : 'Dates'}
            </div>
          </div>

          {hoveredBar && (
            <div className="dashboard-hover-card">
              <h4>{hoveredBar.label}</h4>
              <p>Total tracked: {formatSecondsToHHMMSS(hoveredBar.totalSeconds)}</p>

              <div className="dashboard-hover-card__list">
                {hoveredBar.segments.length === 0 ? (
                  <div className="dashboard-hover-card__row">
                    <span>No tracked entries</span>
                    <strong>00:00:00</strong>
                  </div>
                ) : (
                  hoveredBar.segments.map((detail) => (
                    <div key={detail.name} className="dashboard-hover-card__row">
                      <span>{detail.name}</span>
                      <strong>{formatDuration(detail.value)}</strong>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </Card>

        <Card className="dashboard-chart-card dashboard-chart-card--pie">
          <div className="dashboard-chart-card__header">
            <div>
              <p className="dashboard-chart-card__eyebrow">Pie chart</p>
              <h2 className="dashboard-chart-card__title">Time distribution by category</h2>
            </div>
          </div>

          <div className="dashboard-pie-stack">
            <div className="dashboard-pie-visual">
              <div
                className="dashboard-pie-chart"
                style={{ backgroundImage: pieBackground }}
              >
                <div className="dashboard-pie-chart__center">
                  <strong>{formatDuration(pieTotal)}</strong>
                  <span>Total tracked</span>
                </div>
              </div>
            </div>

            <div className="dashboard-pie-legend">
              {pieData.length === 0 ? (
                <div className="dashboard-pie-empty">No tracked data in this range.</div>
              ) : (
                pieData.map((item) => {
                  const percentage = pieTotal
                    ? ((item.value / pieTotal) * 100).toFixed(1)
                    : '0.0';

                  return (
                    <div
                      key={item.name}
                      className="dashboard-pie-legend__item"
                      onMouseEnter={() => setHoveredPie(item)}
                      onMouseLeave={() => setHoveredPie(null)}
                    >
                      <div className="dashboard-pie-legend__main">
                        <span
                          className="dashboard-pie-legend__dot"
                          style={{ backgroundColor: item.color }}
                        />
                        <span>{item.name}</span>
                      </div>

                      <div className="dashboard-pie-legend__meta">
                        <strong>{formatDuration(item.value)}</strong>
                        <span>{percentage}%</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {hoveredPie && (
            <div className="dashboard-hover-card dashboard-hover-card--pie">
              <h4>{hoveredPie.name}</h4>
              <p>{formatDuration(hoveredPie.value)} tracked</p>
              <p>
                {pieTotal ? ((hoveredPie.value / pieTotal) * 100).toFixed(1) : '0.0'}%
                of selected period
              </p>
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}