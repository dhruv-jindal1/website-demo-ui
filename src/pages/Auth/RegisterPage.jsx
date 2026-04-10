import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import logo from '../../assets/chronotrack-logo.png';
import PageTransition from '../Page Transition/PageTransition';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focused, setFocused] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Enter a valid full name';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    setSubmitError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      setIsSubmitting(true);
      setSubmitError('');

      await register(formData.name, formData.email, formData.password);
      navigate('/dashboard');
    } catch {
      setSubmitError('Unable to create your account right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = (field) => ({
    ...styles.input,
    borderColor: errors[field]
      ? '#ef4444'
      : focused === field
      ? '#3b82f6'
      : '#dbe3ee',
    boxShadow:
      focused === field
        ? errors[field]
          ? '0 0 0 4px rgba(239,68,68,0.10)'
          : '0 0 0 4px rgba(59,130,246,0.10)'
        : 'none',
  });

  const passwordWrapStyle = (field) => ({
    ...styles.passwordWrap,
    borderColor: errors[field]
      ? '#ef4444'
      : focused === field
      ? '#3b82f6'
      : '#dbe3ee',
    boxShadow:
      focused === field
        ? errors[field]
          ? '0 0 0 4px rgba(239,68,68,0.10)'
          : '0 0 0 4px rgba(59,130,246,0.10)'
        : 'none',
  });

  return (
    <PageTransition>
    <div className="register-page" style={styles.page}>
      <style>{`
        @keyframes ct-spin { to { transform: rotate(360deg); } }

        @media (max-width: 980px) {
          .register-page {
            grid-template-columns: 1fr !important;
          }

          .register-left-panel {
            display: none !important;
          }

          .register-right-panel {
            padding: 32px 20px !important;
          }
        }

        @media (max-width: 520px) {
          .register-card {
            max-width: 100% !important;
            padding: 22px !important;
          }

          .register-title {
            font-size: 26px !important;
          }
        }
      `}</style>

      {/* Left panel */}
      <div className="register-left-panel" style={styles.leftPanel}>
        <div style={styles.gridOverlay} aria-hidden="true" />
        <div style={styles.glowTop} aria-hidden="true" />
        <div style={styles.glowBottom} aria-hidden="true" />

        <div style={styles.leftInner}>
          <Link to="/" style={styles.logoLink}>
            <img src={logo} alt="ChronoTrack" style={styles.logoImg} />
          </Link>

          <div style={styles.heroBlock}>
            <div style={styles.eyebrow}>Get started</div>
            <h1 style={styles.heroTitle}>Create your account and start tracking smarter</h1>
            <p style={styles.heroSub}>
              Join ChronoTrack to organise tasks, review reports, and build a clearer picture of where your time goes.
            </p>
          </div>

          <div style={styles.featureGrid}>
            {[
              { color: '#6395ff', label: 'Easy setup', desc: 'Create your account in minutes' },
              { color: '#34d399', label: 'Track clearly', desc: 'Log work with less effort' },
              { color: '#fbbf24', label: 'Stay organised', desc: 'Keep tasks and projects tidy' },
              { color: '#c084fc', label: 'Read insights', desc: 'Review time through simple reports' },
            ].map(({ color, label, desc }) => (
              <div key={label} style={styles.featureCard}>
                <div
                  style={{
                    ...styles.featureDot,
                    background: `${color}22`,
                    border: `1px solid ${color}55`,
                  }}
                >
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                </div>
                <div>
                  <p style={styles.featureTitle}>{label}</p>
                  <p style={styles.featureDesc}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p style={styles.leftFooterText}>
            Already have an account? <Link to="/login" style={styles.leftFooterLink}>Sign in</Link>
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="register-right-panel" style={styles.rightPanel}>
        <div className="register-card" style={styles.card}>
          <Link to="/" style={styles.backLink}>← Back to home</Link>

          <div style={styles.badge}>
            <span style={styles.badgeDot} />
            Free to get started
          </div>

          <h2 className="register-title" style={styles.title}>Create account</h2>
          <p style={styles.subtitle}>Set up your ChronoTrack account and start tracking your time.</p>

          {submitError && <div style={styles.alert}>{submitError}</div>}

          <form onSubmit={handleSubmit} noValidate style={styles.form}>
            <div>
              <label style={styles.label}>Full name</label>
              <input
                type="text"
                placeholder="Alex Johnson"
                value={formData.name}
                onChange={handleChange('name')}
                onFocus={() => setFocused('name')}
                onBlur={() => setFocused('')}
                style={inputStyle('name')}
                autoComplete="name"
              />
              {errors.name && <p style={styles.error}>{errors.name}</p>}
            </div>

            <div>
              <label style={styles.label}>Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange('email')}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused('')}
                style={inputStyle('email')}
                autoComplete="email"
              />
              {errors.email && <p style={styles.error}>{errors.email}</p>}
            </div>

            <div>
              <label style={styles.label}>Password</label>
              <div style={passwordWrapStyle('password')}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={handleChange('password')}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                  style={styles.passwordInput}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  style={styles.showBtn}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && <p style={styles.error}>{errors.password}</p>}
            </div>

            <div>
              <label style={styles.label}>Confirm password</label>
              <div style={passwordWrapStyle('confirmPassword')}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  onFocus={() => setFocused('confirmPassword')}
                  onBlur={() => setFocused('')}
                  style={styles.passwordInput}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  style={styles.showBtn}
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.confirmPassword && <p style={styles.error}>{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                ...styles.submitBtn,
                opacity: isSubmitting ? 0.75 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting ? (
                <span style={styles.spinnerRow}>
                  <svg style={styles.spinner} viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <div style={styles.footerArea}>
            <p style={styles.footer}>
              Already have an account?{' '}
              <Link to="/login" style={styles.link}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
    </PageTransition>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    background: '#f8fafc',
  },

  leftPanel: {
    position: 'relative',
    overflow: 'hidden',
    background: '#0a0a0a',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '56px',
  },
  gridOverlay: {
    position: 'absolute',
    inset: 0,
    background:
      'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
    backgroundSize: '48px 48px',
    opacity: 0.5,
    pointerEvents: 'none',
  },
  glowTop: {
    position: 'absolute',
    top: '-180px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '580px',
    height: '580px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,149,255,0.18) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  glowBottom: {
    position: 'absolute',
    bottom: '-140px',
    right: '-80px',
    width: '340px',
    height: '340px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(52,211,153,0.12) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  leftInner: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '500px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
    alignItems: 'flex-start',
  },
  logoLink: {
    display: 'inline-flex',
    textDecoration: 'none',
  },
  logoImg: {
    height: '40px',
    width: 'auto',
    filter: 'brightness(0) invert(1)',
    opacity: 0.95,
  },
  eyebrow: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '6px 12px',
    borderRadius: '999px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.04)',
    color: 'rgba(255,255,255,0.72)',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    marginBottom: '8px',
  },
  heroBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  heroTitle: {
    margin: 0,
    fontSize: '42px',
    lineHeight: '1.08',
    fontWeight: '700',
    letterSpacing: '-0.03em',
    color: '#fff',
    maxWidth: '430px',
  },
  heroSub: {
    margin: 0,
    fontSize: '16px',
    lineHeight: '1.75',
    color: 'rgba(255,255,255,0.62)',
    maxWidth: '470px',
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    width: '100%',
  },
  featureCard: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    padding: '15px',
    borderRadius: '14px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  featureDot: {
    width: '30px',
    height: '30px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '1px',
  },
  featureTitle: {
    margin: '0 0 4px 0',
    fontSize: '13px',
    fontWeight: '600',
    color: '#fff',
  },
  featureDesc: {
    margin: 0,
    fontSize: '12px',
    color: 'rgba(255,255,255,0.5)',
    lineHeight: '1.5',
  },
  leftFooterText: {
    margin: '6px 0 0 0',
    fontSize: '13px',
    color: 'rgba(255,255,255,0.52)',
  },
  leftFooterLink: {
    color: '#93c5fd',
    textDecoration: 'none',
    fontWeight: '600',
  },

  rightPanel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 24px',
    background: '#f8fafc',
  },
  card: {
    width: '100%',
    maxWidth: '440px',
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '22px',
    padding: '28px',
    boxShadow: '0 20px 50px rgba(15,23,42,0.08)',
  },
  backLink: {
    display: 'inline-block',
    marginBottom: '18px',
    color: '#64748b',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: '500',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '7px',
    padding: '6px 12px',
    borderRadius: '999px',
    background: '#eff6ff',
    border: '1px solid #bfdbfe',
    fontSize: '12px',
    fontWeight: '600',
    color: '#1d4ed8',
    marginBottom: '18px',
    marginLeft: '135px',
  },
  badgeDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: '#3b82f6',
    display: 'inline-block',
  },
  title: {
    margin: '0 0 6px 0',
    fontSize: '30px',
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: '-0.03em',
  },
  subtitle: {
    margin: '0 0 24px 0',
    fontSize: '14px',
    color: '#64748b',
    lineHeight: '1.65',
  },
  alert: {
    marginBottom: '16px',
    padding: '12px 14px',
    borderRadius: '12px',
    background: '#fef2f2',
    color: '#b91c1c',
    fontSize: '13px',
    border: '1px solid #fecaca',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  label: {
    display: 'block',
    marginBottom: '7px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#334155',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '12px',
    border: '1px solid #dbe3ee',
    fontSize: '14px',
    color: '#0f172a',
    outline: 'none',
    boxSizing: 'border-box',
    background: '#fff',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  },
  passwordWrap: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #dbe3ee',
    borderRadius: '12px',
    background: '#fff',
    overflow: 'hidden',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  },
  passwordInput: {
    flex: 1,
    padding: '12px 14px',
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    color: '#0f172a',
    background: 'transparent',
  },
  showBtn: {
    border: 'none',
    background: 'transparent',
    padding: '0 14px',
    color: '#3b82f6',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '12px',
  },
  submitBtn: {
    width: '100%',
    padding: '13px',
    borderRadius: '12px',
    border: 'none',
    background: '#0f172a',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '4px',
    letterSpacing: '-0.01em',
  },
  spinnerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  spinner: {
    width: '16px',
    height: '16px',
    animation: 'ct-spin 0.75s linear infinite',
  },
  link: {
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: '600',
  },
  footerArea: {
    marginTop: '24px',
    paddingTop: '20px',
    borderTop: '1px solid #e8edf3',
  },
  footer: {
    margin: 0,
    textAlign: 'center',
    fontSize: '13px',
    color: '#64748b',
  },
  error: {
    marginTop: '6px',
    fontSize: '12px',
    color: '#ef4444',
  },
};