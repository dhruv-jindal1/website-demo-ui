# ChronoTrack — Team Scaffold

A React + Vite time tracker web app.

---

## Quick start

```bash
npm install
npm run dev
```

Then open http://localhost:5173

---

## Folder structure

```
src/
├── components/
│   ├── common/          # Shared UI: Button, Input, Card
│   └── layout/          # Navbar, Layout wrapper
├── hooks/
│   ├── useAuth.js       # Auth state (stub → replace with real auth)
│   └── useTasks.js      # Task CRUD (stub → replace with real API)
├── pages/
│   ├── Auth/            # Login, Register, ForgotPassword
│   ├── Dashboard/       # Main dashboard
│   ├── Tasks/           # Add/Edit task, Task detail + timer
│   ├── Calendar/        # Calendar view
│   ├── Reports/         # Reports + export
│   └── Settings/        # Profile & account settings
├── styles/
│   └── globals.css      # CSS variables + base styles
├── utils/
│   ├── fakeData.js      # Hardcoded data for development
│   └── helpers.js       # Utility functions
├── App.jsx              # All routes defined here
└── main.jsx             # Entry point
```

---

## Branch assignments

| Branch              | Owner    | Pages                       |
| ------------------- | -------- | --------------------------- |
| `feature/auth`      | Dhruv | Login, Register, Forgot PW  |
| `feature/dashboard` | Joydeep | Dashboard, stat cards       |
| `feature/task-form` | Rohan | Add/Edit task, Timer        |
| `feature/calendar`  | Jason | Calendar view               |
| `feature/reports`   | Jack | Reports, charts, CSV export |

---

## Team rules

- **Never commit directly to `main`** after the initial scaffold
- Pull from `main` into your branch at least once a day
- Use `fakeData.js` for now — we'll wire up real APIs together at the end
- Open a PR when your feature is ready, get at least 1 review before merging

---

## Commit message format

```
feat:   add timer widget to task form
fix:    correct date format in calendar
style:  update dashboard card spacing
chore:  add react-router-dom dependency
```

---

## CSS design tokens (globals.css)

All colors, spacing, and typography use CSS variables. Check `src/styles/globals.css` before hardcoding any values.

Key variables:

- `--color-primary` — brand blue
- `--color-bg` — page background
- `--color-surface` — card/component background
- `--color-text-primary / secondary / muted`
- `--radius-md / lg / xl`
- `--font-sans / mono`

## Using Branches (Important)

    # 1. See what branch you're currently on
    git status

    # 2. Switch to your branch (do this at the start of every session)
    git checkout feature/your-branch-name

    # 3. Save your work (do this often — think of it like hitting Ctrl+S)
    git add .
    git commit -m "what I just did"

    # 4. Upload your saved work to GitHub
    git push

# Start of every work session — do this first

    git checkout feature/your-branch-name   # get on your branch
    git fetch origin                        # check for updates
    git merge origin/main                   # pull in any new changes from main

# The golden rules

    - Never work on main directly. Always be on your feature branch.
    - Commit often. Small commits are easier to undo than one giant one. A good rule: if you finished something small, commit it.
    - Pull from main daily. The longer you wait, the messier the merge.
    - Write a real commit message. "stuff" is useless in a week. "add login form validation" tells your teammates exactly what changed.

# Branch Merging Guidelines
When working on your branch, only merge another teammate's branch into yours if you specifically need their changes to build your feature. If your feature works independently, avoid merging to keep things clean.
Final Merge to Main
Once everyone is done, we will merge all branches into main one at a time in this order:

Branch 1 merges into main first
Branch 2 pulls the updated main, then merges into main
Branch 3 pulls the updated main, then merges into main
Repeat until all branches are merged

# Important: If you merged another branch into yours during development, make sure that branch merges into main before yours does.
