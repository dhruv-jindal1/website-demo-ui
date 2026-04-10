import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/chronotrack-logo.png';
import PageTransition from '../Page Transition/PageTransition';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = () => {
    if (!email.trim()) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Enter a valid email address';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateEmail();
    setError(validationError);

    if (validationError) return;

    try {
      setIsSubmitting(true);

      // TODO: connect real reset password API here
      await new Promise((resolve) => setTimeout(resolve, 900));

      setSent(true);
      setError('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const emailInputStyle = {
    ...styles.input,
    borderColor: error ? '#ef4444' : focused ? '#3b82f6' : '#dbe3ee',
    boxShadow: focused
      ? error
        ? '0 0 0 4px rgba(239,68,68,0.10)'
        : '0 0 0 4px rgba(59,130,246,0.10)'
      : 'none',
  };

  return (
    <PageTransition>
    <div style={styles.page}>
      <style>{`
        @keyframes ct-spin { to { transform: rotate(360deg); } }
        @keyframes floatSoft {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0px); }
        }

        @media (max-width: 560px) {
          .forgot-card {
            padding: 22px !important;
            border-radius: 20px !important;
          }

          .forgot-title {
            font-size: 28px !important;
          }
        }
      `}</style>

      <div style={styles.bgGlow1} aria-hidden="true" />
      <div style={styles.bgGlow2} aria-hidden="true" />
      <div style={styles.gridOverlay} aria-hidden="true" />

      <div className="forgot-card" style={styles.card}>
        <div style={styles.topRow}>
          <Link to="/login" style={styles.backLink}>← Back to sign in</Link>

          <div style={styles.badge}>
            <span style={styles.badgeDot} />
            Account recovery
          </div>
        </div>

        <div style={styles.logoWrap}>
          <img src={logo} alt="ChronoTrack" style={styles.logoImg} />
        </div>

        <div style={styles.header}>
          <h1 className="forgot-title" style={styles.title}>Reset password</h1>
          <p style={styles.subtitle}>
            Enter your email address and we’ll send you a link to reset your password.
          </p>
        </div>

        {sent ? (
          <div style={styles.successBox}>
            <div style={styles.successIcon}>✓</div>
            <h3 style={styles.successTitle}>Check your inbox</h3>
            <p style={styles.successText}>
              A password reset link has been sent to <strong>{email}</strong>.
            </p>

            <div style={styles.successActions}>
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setEmail('');
                }}
                style={styles.secondaryBtn}
              >
                Use another email
              </button>

              <Link to="/login" style={styles.primaryLinkBtn}>
                Back to sign in
              </Link>
            </div>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} noValidate style={styles.form}>
              <div>
                <label style={styles.label}>Email address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  style={emailInputStyle}
                  autoComplete="email"
                />
                {error && <p style={styles.error}>{error}</p>}
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
                    Sending reset link...
                  </span>
                ) : (
                  'Send reset link'
                )}
              </button>
            </form>

            <div style={styles.footerArea}>
              <p style={styles.footer}>
                Remembered your password?{' '}
                <Link to="/login" style={styles.link}>Back to sign in</Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
    </PageTransition>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #eef4ff 0%, #f8fafc 45%, #f4f7fb 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
  },

  bgGlow1: {
    position: 'absolute',
    top: '-120px',
    left: '-100px',
    width: '360px',
    height: '360px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(59,130,246,0.16) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  bgGlow2: {
    position: 'absolute',
    bottom: '-120px',
    right: '-80px',
    width: '320px',
    height: '320px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(52,211,153,0.12) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  gridOverlay: {
    position: 'absolute',
    inset: 0,
    background:
      'linear-gradient(rgba(15,23,42,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.025) 1px, transparent 1px)',
    backgroundSize: '42px 42px',
    opacity: 0.4,
    pointerEvents: 'none',
  },

  card: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: '480px',
    background: 'rgba(255,255,255,0.82)',
    backdropFilter: 'blur(18px)',
    border: '1px solid rgba(255,255,255,0.65)',
    borderRadius: '24px',
    padding: '30px',
    boxShadow: '0 20px 60px rgba(15,23,42,0.10)',
    animation: 'floatSoft 5s ease-in-out infinite',
  },

  topRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    marginBottom: '22px',
  },
  backLink: {
    color: '#64748b',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '7px',
    padding: '7px 12px',
    borderRadius: '999px',
    background: '#eff6ff',
    border: '1px solid #bfdbfe',
    fontSize: '12px',
    fontWeight: '600',
    color: '#1d4ed8',
  },
  badgeDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: '#3b82f6',
    display: 'inline-block',
  },

  logoWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  logoImg: {
    height: '112px',
    width: 'auto',
    marginLeft: '-20px',
  },

  header: {
    textAlign: 'center',
    marginBottom: '26px',
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: '34px',
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: '-0.03em',
  },
  subtitle: {
    margin: 0,
    fontSize: '15px',
    lineHeight: '1.7',
    color: '#64748b',
    maxWidth: '360px',
    marginInline: 'auto',
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#334155',
  },
  input: {
    width: '100%',
    padding: '13px 14px',
    borderRadius: '14px',
    border: '1px solid #dbe3ee',
    fontSize: '14px',
    color: '#0f172a',
    outline: 'none',
    boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.9)',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  },
  error: {
    marginTop: '7px',
    fontSize: '12px',
    color: '#ef4444',
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    borderRadius: '14px',
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

  successBox: {
    textAlign: 'center',
    padding: '10px 0 2px',
  },
  successIcon: {
    width: '58px',
    height: '58px',
    borderRadius: '50%',
    margin: '0 auto 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#ecfdf5',
    color: '#16a34a',
    fontSize: '26px',
    fontWeight: '700',
    border: '1px solid #bbf7d0',
  },
  successTitle: {
    margin: '0 0 8px 0',
    fontSize: '22px',
    fontWeight: '700',
    color: '#0f172a',
  },
  successText: {
    margin: '0 auto 22px',
    maxWidth: '360px',
    fontSize: '14px',
    lineHeight: '1.7',
    color: '#64748b',
  },
  successActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  secondaryBtn: {
    width: '100%',
    padding: '13px',
    borderRadius: '14px',
    border: '1px solid #dbe3ee',
    background: '#fff',
    color: '#0f172a',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  primaryLinkBtn: {
    width: '100%',
    padding: '13px',
    borderRadius: '14px',
    background: '#0f172a',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    textDecoration: 'none',
    textAlign: 'center',
    boxSizing: 'border-box',
  },

  footerArea: {
    marginTop: '24px',
    paddingTop: '18px',
    borderTop: '1px solid #e8edf3',
  },
  footer: {
    margin: 0,
    textAlign: 'center',
    fontSize: '13px',
    color: '#64748b',
  },
  link: {
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: '600',
  },
};