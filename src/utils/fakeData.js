// ─── Fake Data ───────────────────────────────────────────────
// Use this across all pages during development.
// Replace with real API calls in the final phase.

export const fakeUser = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  avatar: null,
};

function toISODate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function daysAgo(days) {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() - days);
  return d;
}

const generatedTasks = [
  { id: '1', title: 'Design login page', project: 'Website Redesign', category: 'Design', duration: 5400, status: 'completed', date: toISODate(daysAgo(28)), tags: ['design'] },
  { id: '2', title: 'Build dashboard layout', project: 'Website Redesign', category: 'Development', duration: 7200, status: 'completed', date: toISODate(daysAgo(27)), tags: ['dev'] },
  { id: '3', title: 'Write API docs', project: 'Internal Tools', category: 'Documentation', duration: 3600, status: 'completed', date: toISODate(daysAgo(26)), tags: ['docs'] },
  { id: '4', title: 'Fix nav bug', project: 'Website Redesign', category: 'Bug Fixing', duration: 1800, status: 'completed', date: toISODate(daysAgo(25)), tags: ['bug'] },
  { id: '5', title: 'Sprint planning', project: 'Internal Tools', category: 'Planning', duration: 2700, status: 'completed', date: toISODate(daysAgo(24)), tags: ['planning'] },
  { id: '6', title: 'Client meeting prep', project: 'Client A', category: 'Meetings', duration: 5400, status: 'completed', date: toISODate(daysAgo(23)), tags: ['meeting'] },
  { id: '7', title: 'Research dashboard interactions', project: 'Internal Tools', category: 'Research', duration: 4500, status: 'completed', date: toISODate(daysAgo(22)), tags: ['research'] },
  { id: '8', title: 'Implement timer controls', project: 'Website Redesign', category: 'Development', duration: 10800, status: 'completed', date: toISODate(daysAgo(21)), tags: ['dev'] },
  { id: '9', title: 'Review component styling', project: 'Website Redesign', category: 'Design', duration: 2700, status: 'completed', date: toISODate(daysAgo(20)), tags: ['design'] },
  { id: '10', title: 'Prepare release notes', project: 'Internal Tools', category: 'Documentation', duration: 1800, status: 'completed', date: toISODate(daysAgo(19)), tags: ['docs'] },
  { id: '11', title: 'Resolve calendar import issue', project: 'Website Redesign', category: 'Bug Fixing', duration: 3600, status: 'completed', date: toISODate(daysAgo(18)), tags: ['bug'] },
  { id: '12', title: 'Team sync meeting', project: 'Internal Tools', category: 'Meetings', duration: 2700, status: 'completed', date: toISODate(daysAgo(17)), tags: ['meeting'] },
  { id: '13', title: 'Refactor reports logic', project: 'Website Redesign', category: 'Development', duration: 9000, status: 'completed', date: toISODate(daysAgo(16)), tags: ['dev'] },
  { id: '14', title: 'UX polish for settings page', project: 'Website Redesign', category: 'Design', duration: 4200, status: 'completed', date: toISODate(daysAgo(15)), tags: ['design'] },
  { id: '15', title: 'Knowledge base draft', project: 'Internal Tools', category: 'Documentation', duration: 3900, status: 'completed', date: toISODate(daysAgo(14)), tags: ['docs'] },
  { id: '16', title: 'Investigate export issue', project: 'Website Redesign', category: 'Bug Fixing', duration: 3000, status: 'completed', date: toISODate(daysAgo(13)), tags: ['bug'] },
  { id: '17', title: 'Monthly roadmap planning', project: 'Internal Tools', category: 'Planning', duration: 4800, status: 'completed', date: toISODate(daysAgo(12)), tags: ['planning'] },
  { id: '18', title: 'Competitor research', project: 'Internal Tools', category: 'Research', duration: 6600, status: 'completed', date: toISODate(daysAgo(11)), tags: ['research'] },
  { id: '19', title: 'Improve dashboard interactions', project: 'Website Redesign', category: 'Development', duration: 8400, status: 'completed', date: toISODate(daysAgo(10)), tags: ['dev'] },
  { id: '20', title: 'Stakeholder check-in', project: 'Internal Tools', category: 'Meetings', duration: 2400, status: 'completed', date: toISODate(daysAgo(9)), tags: ['meeting'] },
  { id: '21', title: 'Improve auth validation', project: 'Website Redesign', category: 'Development', duration: 7200, status: 'completed', date: toISODate(daysAgo(8)), tags: ['dev'] },
  { id: '22', title: 'Redesign task cards', project: 'Website Redesign', category: 'Design', duration: 5400, status: 'completed', date: toISODate(daysAgo(7)), tags: ['design'] },
  { id: '23', title: 'Write onboarding notes', project: 'Internal Tools', category: 'Documentation', duration: 2700, status: 'completed', date: toISODate(daysAgo(6)), tags: ['docs'] },
  { id: '24', title: 'Fix dashboard filter bug', project: 'Website Redesign', category: 'Bug Fixing', duration: 4500, status: 'completed', date: toISODate(daysAgo(5)), tags: ['bug'] },
  { id: '25', title: 'Sprint kickoff', project: 'Internal Tools', category: 'Meetings', duration: 3600, status: 'completed', date: toISODate(daysAgo(4)), tags: ['meeting'] },
  { id: '26', title: 'Explore chart patterns', project: 'Internal Tools', category: 'Research', duration: 3000, status: 'completed', date: toISODate(daysAgo(3)), tags: ['research'] },
  { id: '27', title: 'Build category analytics', project: 'Website Redesign', category: 'Development', duration: 10800, status: 'completed', date: toISODate(daysAgo(2)), tags: ['dev'] },
  { id: '28', title: 'Polish dark mode visuals', project: 'Website Redesign', category: 'Design', duration: 5400, status: 'completed', date: toISODate(daysAgo(1)), tags: ['design'] },
  { id: '29', title: 'Prepare daily summary', project: 'Internal Tools', category: 'Documentation', duration: 1800, status: 'completed', date: toISODate(daysAgo(0)), tags: ['docs'] },
  { id: '30', title: 'Review dashboard metrics', project: 'Internal Tools', category: 'Planning', duration: 2400, status: 'in-progress', date: toISODate(daysAgo(0)), tags: ['planning'] },
];

export const fakeTasks = generatedTasks;

export const fakeProjects = [
  { id: '1', name: 'Website Redesign', color: '#2563eb', totalHours: 24 },
  { id: '2', name: 'Internal Tools', color: '#16a34a', totalHours: 12 },
  { id: '3', name: 'Client A', color: '#d97706', totalHours: 8 },
];

export const fakeStats = {
  todayHours: 3.5,
  weekHours: 18.2,
  monthHours: 64.5,
  activeTasks: 2,
};

// Helper: format seconds → "1h 30m"
export function formatDuration(seconds) {
  if (!seconds) return '0m';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}