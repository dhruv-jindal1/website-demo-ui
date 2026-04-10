import { useMemo, useState } from 'react';
import { useTasks } from '../../hooks/useTasks';
import Card from '../../components/common/Card';
import './ReportsPage.css';

const VIEW_TABS = ['Summary', 'Detailed'];

function formatSeconds(totalSeconds = 0) {
  const safe = Number(totalSeconds) || 0;
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;

  return [
    String(hours).padStart(2, '0'),
    String(minutes).padStart(2, '0'),
    String(seconds).padStart(2, '0'),
  ].join(':');
}

function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

function getDaysAgoString(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
}

function getCategoryColor(index) {
  const palette = [
    '#5B6ACF',
    '#A548C5',
    '#32B6A1',
    '#F59E0B',
    '#EC4899',
    '#3B82F6',
    '#8B5CF6',
    '#14B8A6',
  ];
  return palette[index % palette.length];
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const { tasks } = useTasks();

  const [activeTab, setActiveTab] = useState('Summary');
  const [rangeType, setRangeType] = useState('weekly');
  const [dateFrom, setDateFrom] = useState(getDaysAgoString(6));
  const [dateTo, setDateTo] = useState(getTodayString());
  const [exportOpen, setExportOpen] = useState(false);

  const resolvedRange = useMemo(() => {
    const today = getTodayString();

    if (rangeType === 'weekly') {
      return {
        from: getDaysAgoString(6),
        to: today,
      };
    }

    if (rangeType === 'monthly') {
      return {
        from: getDaysAgoString(29),
        to: today,
      };
    }

    return {
      from: dateFrom,
      to: dateTo,
    };
  }, [rangeType, dateFrom, dateTo]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (!task.date) return false;
      return task.date >= resolvedRange.from && task.date <= resolvedRange.to;
    });
  }, [tasks, resolvedRange]);

  const categoryData = useMemo(() => {
    const map = {};

    filteredTasks.forEach((task) => {
      const category = task.category || 'Uncategorized';
      const duration = Number(task.duration) || 0;

      if (!map[category]) {
        map[category] = {
          name: category,
          duration: 0,
          taskCount: 0,
        };
      }

      map[category].duration += duration;
      map[category].taskCount += 1;
    });

    const result = Object.values(map).sort((a, b) => b.duration - a.duration);

    return result.map((item, index) => ({
      ...item,
      color: getCategoryColor(index),
    }));
  }, [filteredTasks]);

  const totalDuration = useMemo(() => {
    return categoryData.reduce((sum, item) => sum + item.duration, 0);
  }, [categoryData]);

  const totalTasks = filteredTasks.length;
  const totalCategories = categoryData.length;

  const dailyData = useMemo(() => {
    const map = {};

    filteredTasks.forEach((task) => {
      const key = task.date;
      const duration = Number(task.duration) || 0;

      if (!map[key]) {
        map[key] = {
          date: key,
          duration: 0,
          taskCount: 0,
        };
      }

      map[key].duration += duration;
      map[key].taskCount += 1;
    });

    return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredTasks]);

  const maxDuration = useMemo(() => {
    if (!dailyData.length) return 0;
    return Math.max(...dailyData.map((item) => item.duration));
  }, [dailyData]);

  const donutSegments = useMemo(() => {
    if (!totalDuration) return [];
    let start = 0;

    return categoryData.map((item) => {
      const percent = item.duration / totalDuration;
      const end = start + percent * 100;
      const segment = {
        ...item,
        start,
        end,
        percent: percent * 100,
      };
      start = end;
      return segment;
    });
  }, [categoryData, totalDuration]);

  const donutBackground = useMemo(() => {
    if (!donutSegments.length) {
      return 'conic-gradient(#e5e7eb 0% 100%)';
    }

    const parts = donutSegments.map(
      (segment) => `${segment.color} ${segment.start}% ${segment.end}%`
    );

    return `conic-gradient(${parts.join(', ')})`;
  }, [donutSegments]);

  const handleExportCSV = () => {
    const rows = [
      ['Category', 'Task Title', 'Date', 'Duration', 'Description'],
      ...filteredTasks.map((task) => [
        task.category || 'Uncategorized',
        task.title || '',
        task.date || '',
        task.duration || 0,
        task.description || '',
      ]),
    ];

    const csv = rows
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')
      )
      .join('\n');

    downloadFile(csv, 'chronotrack-report.csv', 'text/csv;charset=utf-8;');
    setExportOpen(false);
  };

  const handleExportExcel = () => {
    const rows = [
      ['Category', 'Task Title', 'Date', 'Duration', 'Description'],
      ...filteredTasks.map((task) => [
        task.category || 'Uncategorized',
        task.title || '',
        task.date || '',
        task.duration || 0,
        task.description || '',
      ]),
    ];

    const content = rows.map((row) => row.join('\t')).join('\n');
    downloadFile(
      content,
      'chronotrack-report.xls',
      'application/vnd.ms-excel'
    );
    setExportOpen(false);
  };

  const handleExportPDF = () => {
    setExportOpen(false);
    window.print();
  };

  return (
    <div className="reports-page">
      <div className="reports-topbar">
        <div className="reports-topbar__left">
          <div className="reports-report-type">
            <span>TIME REPORT</span>
          </div>

          <div className="reports-tabs">
            {VIEW_TABS.map((tab) => (
              <button
                key={tab}
                className={`reports-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

      <div className="reports-topbar__right">
        <div className="reports-range-picker">
          <span className="reports-range-picker__label">Report period</span>
          <strong className="reports-range-picker__value">
            {resolvedRange.from} - {resolvedRange.to}
          </strong>
        </div>

        <button
          className="reports-arrow-btn"
          onClick={() => {
            setRangeType('custom');
            setDateFrom(getDaysAgoString(13));
            setDateTo(getDaysAgoString(7));
          }}
          title="Previous range"
        >
          ‹
        </button>

        <button
          className="reports-arrow-btn"
          onClick={() => {
            if (rangeType === 'monthly') {
              setDateFrom(getDaysAgoString(29));
              setDateTo(getTodayString());
            } else {
              setDateFrom(getDaysAgoString(6));
              setDateTo(getTodayString());
            }
            setRangeType('custom');
          }}
          title="Current range"
        >
          ›
        </button>
      </div>
      </div>

      <div className="reports-filterbar">
        <div className="reports-filterbar__left">
          <div className="reports-filter-chip reports-filter-chip--title">FILTER</div>

          <div className="reports-filter-chip-group">
            <button
              className={`reports-filter-chip ${rangeType === 'weekly' ? 'active' : ''}`}
              onClick={() => setRangeType('weekly')}
            >
              Weekly
            </button>

            <button
              className={`reports-filter-chip ${rangeType === 'monthly' ? 'active' : ''}`}
              onClick={() => setRangeType('monthly')}
            >
              Monthly
            </button>

            <button
              className={`reports-filter-chip ${rangeType === 'custom' ? 'active' : ''}`}
              onClick={() => setRangeType('custom')}
            >
              Custom
            </button>
          </div>

          <div className="reports-date-inputs">
            <input
              type="date"
              value={resolvedRange.from}
              onChange={(e) => {
                setRangeType('custom');
                setDateFrom(e.target.value);
              }}
            />
            <input
              type="date"
              value={resolvedRange.to}
              onChange={(e) => {
                setRangeType('custom');
                setDateTo(e.target.value);
              }}
            />
          </div>
        </div>

        <div className="reports-filterbar__right">
          <button className="reports-action-btn">Apply</button>

          <div className="reports-export">
            <button
              className="reports-action-btn reports-action-btn--secondary"
              onClick={() => setExportOpen((prev) => !prev)}
            >
              Export ▾
            </button>

            {exportOpen && (
              <div className="reports-export-menu">
                <button onClick={handleExportPDF}>Save as PDF</button>
                <button onClick={handleExportCSV}>Save as CSV</button>
                <button onClick={handleExportExcel}>Save as Excel</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="reports-summary-strip">
        <div className="reports-summary-strip__item">
          <span>Total</span>
          <strong>{formatSeconds(totalDuration)}</strong>
        </div>

        <div className="reports-summary-strip__item">
          <span>Tasks</span>
          <strong>{totalTasks}</strong>
        </div>

        <div className="reports-summary-strip__item">
          <span>Categories</span>
          <strong>{totalCategories}</strong>
        </div>

        <div className="reports-summary-strip__item">
           <span>Top category</span>
           <strong>{categoryData[0]?.name || '—'}</strong>
        </div>
      </div>

      {activeTab === 'Summary' && (
        <>
          <div className="reports-summary-layout">
            <Card>
              <div className="reports-section">
                <div className="reports-section__header">
                  <h2>Category summary</h2>
                  <p>See how your tracked time is distributed across categories.</p>
                </div>

                <div className="reports-summary-table-wrap">
                  <table className="reports-summary-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Duration</th>
                        <th>Share</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoryData.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="reports-empty-cell">
                            No report data available for this range.
                          </td>
                        </tr>
                      ) : (
                        categoryData.map((item) => {
                          const share = totalDuration
                            ? ((item.duration / totalDuration) * 100).toFixed(2)
                            : '0.00';

                          return (
                            <tr key={item.name}>
                              <td>
                                <div className="reports-category-cell">
                                  <span
                                    className="reports-category-dot"
                                    style={{ background: item.color }}
                                  />
                                  <span>{item.name}</span>
                                </div>
                              </td>
                              <td>{formatSeconds(item.duration)}</td>
                              <td>{share}%</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>

            <Card>
              <div className="reports-section reports-section--center">
                <div className="reports-donut-wrap">
                  <div
                    className="reports-donut"
                    style={{ background: donutBackground }}
                  >
                    <div className="reports-donut__center">
                      <span>{formatSeconds(totalDuration)}</span>
                    </div>
                  </div>
                </div>

                <div className="reports-donut-legend">
                  {categoryData.map((item) => {
                    const share = totalDuration
                      ? ((item.duration / totalDuration) * 100).toFixed(2)
                      : '0.00';

                    return (
                      <div key={item.name} className="reports-donut-legend__item">
                        <span
                          className="reports-category-dot"
                          style={{ background: item.color }}
                        />
                        <span className="reports-donut-legend__name">{item.name}</span>
                        <span className="reports-donut-legend__duration">
                          {formatSeconds(item.duration)}
                        </span>
                        <span className="reports-donut-legend__share">{share}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>

          <Card>
            <div className="reports-section">
              <div className="reports-section__header">
                <h2>Daily activity</h2>
                <p>A simple overview of how much time was logged each day.</p>
              </div>

              <div className="reports-bar-list">
                {dailyData.length === 0 ? (
                  <div className="reports-empty-state">
                    No daily activity found for the selected period.
                  </div>
                ) : (
                  dailyData.map((day) => {
                    const width = maxDuration
                      ? `${(day.duration / maxDuration) * 100}%`
                      : '0%';

                    return (
                      <div key={day.date} className="reports-bar-row">
                        <div className="reports-bar-row__top">
                          <span>{day.date}</span>
                          <span>{formatSeconds(day.duration)}</span>
                        </div>

                        <div className="reports-bar-track">
                          <div
                            className="reports-bar-fill"
                            style={{ width }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </Card>
        </>
      )}

      {activeTab === 'Detailed' && (
        <Card>
          <div className="reports-section">
            <div className="reports-section__header">
              <h2>Detailed entries</h2>
              <p>Review each tracked task inside the selected date range.</p>
            </div>

            <div className="reports-summary-table-wrap">
              <table className="reports-summary-table">
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="reports-empty-cell">
                        No detailed entries available.
                      </td>
                    </tr>
                  ) : (
                    filteredTasks.map((task) => (
                      <tr key={task.id}>
                        <td>{task.title || 'Untitled task'}</td>
                        <td>{task.category || 'Uncategorized'}</td>
                        <td>{task.date || '-'}</td>
                        <td>{formatSeconds(Number(task.duration) || 0)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}