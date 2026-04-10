import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { TasksProvider } from "./context/TasksContext";
import "./styles/globals.css";

// Layout
import Layout from "./components/layout/Layout";

// Pages
import LandingPage from "./pages/Landing/LandingPage";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage";
import TimeTracker from "./pages/Timer/TimeTracker";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import TaskFormPage from "./pages/Tasks/TaskFormPage";
import TaskDetailPage from "./pages/Tasks/TaskDetailPage";
import CalendarPage from "./pages/Calendar/CalendarPage";
import ImportCalendarPage from "./pages/Calendar/ImportCalendarPage";
import ReportsPage from "./pages/Reports/ReportsPage";
import SettingsPage from "./pages/Settings/SettingsPage";
import CategoryPage from "./pages/Category/CategoryPage";
import OAuthCallbackPage from "./pages/Auth/OAuthCallbackPage";

const isAuthenticated = true;

function PrivateRoute({ children }) {
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AnimatedRoutes({ theme, setTheme }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* <Route path="/login" element={isAuthenticated ? <Navigate to="/timer" replace /> :<LoginPage />} /> */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/callback" element={<OAuthCallbackPage />} />

        <Route
          path="/timer"
          element={
            <PrivateRoute>
              <Layout theme={theme} setTheme={setTheme} />
            </PrivateRoute>
          }
        >
          <Route index element={<TimeTracker />} />
        </Route>

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout theme={theme} setTheme={setTheme} />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardPage />} />
        </Route>

        <Route
          path="/tasks"
          element={
            <PrivateRoute>
              <Layout theme={theme} setTheme={setTheme} />
            </PrivateRoute>
          }
        >
          <Route path="new" element={<TaskFormPage />} />
          <Route path=":id" element={<TaskDetailPage />} />
          <Route path=":id/edit" element={<TaskFormPage />} />
        </Route>

        <Route
          path="/calendar"
          element={
            <PrivateRoute>
              <Layout theme={theme} setTheme={setTheme} />
            </PrivateRoute>
          }
        >
          <Route index element={<CalendarPage />} />
        </Route>

        <Route
          path="/calendar/import"
          element={
            <PrivateRoute>
              <Layout theme={theme} setTheme={setTheme} />
            </PrivateRoute>
          }
        >
          <Route index element={<ImportCalendarPage />} />
        </Route>

        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <Layout theme={theme} setTheme={setTheme} />
            </PrivateRoute>
          }
        >
          <Route index element={<ReportsPage />} />
        </Route>

        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Layout theme={theme} setTheme={setTheme} />
            </PrivateRoute>
          }
        >
          <Route
            index
            element={<SettingsPage theme={theme} setTheme={setTheme} />}
          />
        </Route>

        <Route
          path="/category"
          element={
            <PrivateRoute>
              <Layout theme={theme} setTheme={setTheme} />
            </PrivateRoute>
          }
        >
          <Route index element={<CategoryPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <TasksProvider>
      <BrowserRouter>
        <AnimatedRoutes theme={theme} setTheme={setTheme} />
      </BrowserRouter>
    </TasksProvider>
  );
}
