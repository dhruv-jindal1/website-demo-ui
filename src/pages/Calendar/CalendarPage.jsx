import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTasks } from "../../hooks/useTasks";
import Card from "../../components/common/Card";
import "./CalendarPage.css";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatDateString(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function formatDisplayDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function CalendarPage() {
  const { tasks } = useTasks();
  const navigate = useNavigate();

  const today = new Date();
  const todayDateStr = formatDateString(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const [current, setCurrent] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });

  const [selectedDate, setSelectedDate] = useState(todayDateStr);

  const firstDay = new Date(current.year, current.month, 1).getDay();
  const daysInMonth = new Date(current.year, current.month + 1, 0).getDate();

  const tasksByDate = useMemo(() => {
    return tasks.reduce((acc, task) => {
      const key = task.date;
      if (!acc[key]) acc[key] = [];
      acc[key].push(task);
      return acc;
    }, {});
  }, [tasks]);

  const selectedDayTasks = tasksByDate[selectedDate] ?? [];

  const monthTaskCount = useMemo(() => {
    const prefix = `${current.year}-${String(current.month + 1).padStart(2, "0")}`;
    return tasks.filter((task) => task.date?.startsWith(prefix)).length;
  }, [tasks, current]);

  const totalTrackedHours = useMemo(() => {
    const prefix = `${current.year}-${String(current.month + 1).padStart(2, "0")}`;
    return tasks
      .filter((task) => task.date?.startsWith(prefix))
      .reduce((sum, task) => sum + Number(task.duration || 0), 0);
  }, [tasks, current]);

  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const prevMonth = () => {
    setCurrent(({ year, month }) =>
      month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 },
    );
  };

  const nextMonth = () => {
    setCurrent(({ year, month }) =>
      month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 },
    );
  };

  const goToToday = () => {
    setCurrent({
      year: today.getFullYear(),
      month: today.getMonth(),
    });
    setSelectedDate(todayDateStr);
  };

  return (
    <div className="calendar-page">
      <div className="calendar-page__header">
        <div>
          <p className="calendar-page__eyebrow">Plan and track your schedule</p>
          <h1 className="calendar-page__title">Calendar</h1>
        </div>

        <div className="calendar-page__header-actions">
          <button
            className="calendar-btn calendar-btn--ghost"
            onClick={goToToday}
          >
            Today
          </button>
          <button
            className="calendar-btn"
            onClick={() => navigate("/calendar/import")}
          >
            Import from Calendar
          </button>
        </div>
      </div>

      <div className="calendar-overview">
        <Card>
          <div className="calendar-stat">
            <span className="calendar-stat__label">Tasks this month</span>
            <strong className="calendar-stat__value">{monthTaskCount}</strong>
          </div>
        </Card>

        <Card>
          <div className="calendar-stat">
            <span className="calendar-stat__label">Tracked hours</span>
            <strong className="calendar-stat__value">
              {totalTrackedHours}h
            </strong>
          </div>
        </Card>

        <Card>
          <div className="calendar-stat">
            <span className="calendar-stat__label">Selected day</span>
            <strong className="calendar-stat__value">
              {selectedDayTasks.length} task
              {selectedDayTasks.length !== 1 ? "s" : ""}
            </strong>
          </div>
        </Card>
      </div>

      <div className="calendar-layout">
        <div className="calendar-main">
          <Card>
            <div className="calendar-toolbar">
              <button className="calendar-nav-btn" onClick={prevMonth}>
                ‹
              </button>

              <div className="calendar-toolbar__title">
                {MONTHS[current.month]} {current.year}
              </div>

              <button className="calendar-nav-btn" onClick={nextMonth}>
                ›
              </button>
            </div>

            <div className="calendar-grid">
              {DAYS.map((day) => (
                <div key={day} className="calendar-grid__day-header">
                  {day}
                </div>
              ))}

              {cells.map((day, index) => {
                if (!day) {
                  return (
                    <div
                      key={`empty-${index}`}
                      className="calendar-grid__empty-cell"
                    />
                  );
                }

                const dateStr = formatDateString(
                  current.year,
                  current.month,
                  day,
                );
                const dayTasks = tasksByDate[dateStr] ?? [];
                const isToday = dateStr === todayDateStr;
                const isSelected = dateStr === selectedDate;

                return (
                  <button
                    key={dateStr}
                    type="button"
                    className={`calendar-cell ${isToday ? "calendar-cell--today" : ""} ${
                      isSelected ? "calendar-cell--selected" : ""
                    }`}
                    onClick={() => setSelectedDate(dateStr)}
                  >
                    <div className="calendar-cell__top">
                      <span
                        className={`calendar-cell__number ${
                          isToday ? "calendar-cell__number--today" : ""
                        }`}
                      >
                        {day}
                      </span>

                      {dayTasks.length > 0 && (
                        <span className="calendar-cell__count">
                          {dayTasks.length}
                        </span>
                      )}
                    </div>

                    <div className="calendar-cell__tasks">
                      {dayTasks.slice(0, 2).map((task) => (
                        <div
                          key={task.id}
                          className="calendar-task-pill"
                          title={task.title}
                        >
                          {task.title.length > 18
                            ? `${task.title.slice(0, 18)}…`
                            : task.title}
                        </div>
                      ))}

                      {dayTasks.length > 2 && (
                        <div className="calendar-cell__more">
                          +{dayTasks.length - 2} more
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="calendar-sidebar">
          <Card>
            <div className="calendar-panel">
              <div className="calendar-panel__header">
                <h3>Day details</h3>
                <p>{formatDisplayDate(selectedDate)}</p>
              </div>

              {selectedDayTasks.length === 0 ? (
                <div className="calendar-empty-state">
                  <p>No tasks scheduled for this day yet.</p>
                </div>
              ) : (
                <div className="calendar-day-task-list">
                  {selectedDayTasks.map((task) => (
                    <div key={task.id} className="calendar-day-task-card">
                      <div className="calendar-day-task-card__top">
                        <h4>{task.title}</h4>
                        {task.duration && <span>{task.duration}h</span>}
                      </div>

                      {task.category && (
                        <p className="calendar-day-task-card__meta">
                          Category: {task.category}
                        </p>
                      )}

                      {task.description && (
                        <p className="calendar-day-task-card__desc">
                          {task.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
