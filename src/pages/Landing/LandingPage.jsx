import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import logo from '../../assets/chronotrack-logo.png';
import PageTransition from '../Page Transition/PageTransition';

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const features = useMemo(
    () => [
      {
        icon: '⏱',
        title: 'One-click tracking',
        desc: 'Start a timer instantly and log work without breaking focus.',
        color: '#6395ff',
      },
      {
        icon: '📊',
        title: 'Clear reports',
        desc: 'Understand where your hours go with visual weekly and monthly summaries.',
        color: '#34d399',
      },
      {
        icon: '🗂',
        title: 'Project organisation',
        desc: 'Group tasks by project, client, or category for cleaner tracking.',
        color: '#fbbf24',
      },
      {
        icon: '📅',
        title: 'Calendar view',
        desc: 'See tracked sessions laid out visually so gaps and overloads stand out.',
        color: '#f472b6',
      },
      {
        icon: '🔔',
        title: 'Smart reminders',
        desc: 'Get nudges when you forget to start or stop a timer.',
        color: '#c084fc',
      },
      {
        icon: '⚡',
        title: 'Fast by design',
        desc: 'A clean interface with less clutter, fewer steps, and faster actions.',
        color: '#fb923c',
      },
    ],
    []
  );

  const faqs = [
    {
      q: 'Who is ChronoTrack for?',
      a: 'ChronoTrack is ideal for academic professionals who want a cleaner way to track work and understand how their time is being spent.',
    },
    {
      q: 'Can I see reports by day, week, or month?',
      a: 'Yes. ChronoTrack is designed to make time insights easy to understand with summaries across daily, weekly, and monthly views.',
    },
    {
      q: 'Do I need training to use it?',
      a: 'No. The interface is intentionally simple so new users can start tracking in minutes without a complicated setup process.',
    },
    {
      q: 'Can I export my data anytime?',
      a: 'Yes. Export-friendly reporting is part of the product direction so users can take their data wherever they need it.',
    },
  ];

  const testimonials = [
    {
      name: 'Andy Jones',
      role: 'Project Coordinator',
      text: 'ChronoTrack helped me understand where my week was actually going. It made planning much easier.',
    },
    {
      name: 'Emily Chen',
      role: 'University Tutor',
      text: 'The interface feels clean and simple. I could start using it straight away without learning anything complicated.',
    },
    {
      name: 'David Smith',
      role: 'Freelance Designer',
      text: 'I like how visual the tracking feels. It is quick, clear, and doesn’t get in the way of my workflow.',
    },
  ];

  return (
    <PageTransition>
    <div style={s.root}>
      <GoogleFonts />

      <nav
        style={{
          ...s.nav,
          ...(scrolled ? s.navScrolled : {}),
        }}
      >
        <div style={s.navLeft}>
          <img src={logo} alt="ChronoTrack" style={s.navLogo} />
         { /*<span style={s.brandText}>ChronoTrackk</span> */}
        </div>

        <div style={s.navLinks}>
          <a href="#features" style={s.navLink}>Features</a>
          <a href="#benefits" style={s.navLink}>Benefits</a>
          <a href="#how" style={s.navLink}>How it works</a>
          <a href="#faq" style={s.navLink}>FAQ</a>
        </div>

        <div style={s.navActions}>
          <Link to="/login" style={s.navLogin}>Sign in</Link>
          <Link to="/register" style={s.navCta}>Get started</Link>
        </div>
      </nav>

      <section style={s.hero}>
        <div style={s.heroBg} aria-hidden="true">
          <div style={s.heroDot1} />
          <div style={s.heroDot2} />
          <div style={s.gridGlow} />
        </div>

        <div style={s.heroContent}>
          <div style={s.heroLeft}>
            <div style={s.heroTag}>Smarter time tracking for modern work</div>

            <h1 style={s.heroTitle}>
              Track time with
              <br />
              <span style={s.heroAccent}>clarity, speed,</span>
              <br />
              and less effort.
            </h1>

            <p style={s.heroSub}>
              ChronoTrack helps users log tasks, manage projects, review reports,
              and stay in control of every working hour through one clean and focused platform.
            </p>

            <div style={s.heroCtas}>
              <Link to="/register" style={s.ctaPrimary}>Start for free</Link>
              <Link to="/login" style={s.ctaSecondary}>Sign in</Link>
            </div>

            <div style={s.quickStats}>
              <div style={s.quickStatCard}>
                <div style={s.quickStatValue}>Fast</div>
                <div style={s.quickStatLabel}>Quick task logging</div>
              </div>
              <div style={s.quickStatCard}>
                <div style={s.quickStatValue}>Clear</div>
                <div style={s.quickStatLabel}>Readable reports</div>
              </div>
              <div style={s.quickStatCard}>
                <div style={s.quickStatValue}>Simple</div>
                <div style={s.quickStatLabel}>Low learning curve</div>
              </div>
            </div>
          </div>

          <div style={s.heroRight}>
            <div style={s.mockup}>
              <div style={s.mockupBar}>
                <div style={s.mockupDot} />
                <div style={s.mockupDot} />
                <div style={s.mockupDot} />
              </div>

              <div style={s.mockupBody}>
                <div style={s.statRow}>
                  {[
                    { label: 'Today', value: '4h 22m', color: '#6395ff' },
                    { label: 'This week', value: '21h 08m', color: '#34d399' },
                    { label: 'Active tasks', value: '6', color: '#fbbf24' },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={s.statCard}>
                      <div style={{ ...s.statDot, background: color }} />
                      <p style={s.statLabel}>{label}</p>
                      <p style={{ ...s.statValue, color }}>{value}</p>
                    </div>
                  ))}
                </div>

                <div style={s.liveBadge}>Live overview</div>

                <div style={s.taskList}>
                  {[
                    { name: 'Design system audit', time: '2h 10m', tag: 'Design', pct: 68 },
                    { name: 'API integration', time: '1h 32m', tag: 'Dev', pct: 48 },
                    { name: 'Weekly planning', time: '0h 40m', tag: 'Planning', pct: 21 },
                    { name: 'Client presentation', time: '0h 22m', tag: 'Client', pct: 14 },
                  ].map(({ name, time, tag, pct }) => (
                    <div key={name} style={s.taskRow}>
                      <div style={s.taskLeft}>
                        <span style={s.taskName}>{name}</span>
                        <span style={s.taskTag}>{tag}</span>
                      </div>
                      <div style={s.taskRight}>
                        <div style={s.barTrack}>
                          <div style={{ ...s.barFill, width: `${pct}%` }} />
                        </div>
                        <span style={s.taskTime}>{time}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={s.miniInsights}>
                  <div style={s.insightChip}>Best for focused work</div>
                  <div style={s.insightChip}>Easy to review weekly progress</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={s.trustStrip}>
        <div style={s.trustInner}>
          <span style={s.trustText}>Designed for clarity</span>
          <span style={s.trustDivider}>•</span>
          <span style={s.trustText}>Built for productivity</span>
          <span style={s.trustDivider}>•</span>
          <span style={s.trustText}>Made for everyday use</span>
        </div>
      </section>

      <section id="features" style={s.features}>
        <div style={s.sectionHead}>
          <p style={s.sectionTag}>Features</p>
          <h2 style={s.sectionTitle}>Everything you need to track time well</h2>
          <p style={s.sectionSub}>
            A focused set of tools that helps users log, organise, and review work without unnecessary complexity.
          </p>
        </div>

        <div style={s.featureGrid}>
          {features.map(({ icon, title, desc, color }) => (
            <div
              key={title}
              style={s.featureCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = `${color}66`;
                e.currentTarget.style.boxShadow = `0 24px 50px ${color}18`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  ...s.featureIcon,
                  background: `${color}18`,
                  border: `1px solid ${color}40`,
                }}
              >
                <span>{icon}</span>
              </div>
              <h3 style={s.featureTitle}>{title}</h3>
              <p style={s.featureDesc}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="benefits" style={s.benefits}>
        <div style={s.sectionHead}>
          <p style={s.sectionTag}>Why it matters</p>
          <h2 style={s.sectionTitle}>Built to improve how people work</h2>
        </div>

        <div style={s.benefitGrid}>
          <div style={s.benefitCardLarge}>
            <h3 style={s.benefitTitle}>See where time really goes</h3>
            <p style={s.benefitDesc}>
              Get a clearer picture of work patterns and make better decisions about planning, focus, and workload.
            </p>
          </div>

          <div style={s.benefitCard}>
            <h3 style={s.benefitTitle}>Reduce manual effort</h3>
            <p style={s.benefitDesc}>
              Fewer steps means tracking feels easier and more consistent.
            </p>
          </div>

          <div style={s.benefitCard}>
            <h3 style={s.benefitTitle}>Stay organised</h3>
            <p style={s.benefitDesc}>
              Keep work grouped by project, task, and reporting period.
            </p>
          </div>

          <div style={s.benefitCard}>
            <h3 style={s.benefitTitle}>Review progress faster</h3>
            <p style={s.benefitDesc}>
              Check summaries quickly without digging through scattered entries.
            </p>
          </div>
        </div>
      </section>

      <section id="how" style={s.how}>
        <div style={s.sectionHead}>
          <p style={s.sectionTag}>How it works</p>
          <h2 style={s.sectionTitle}>Start tracking in three simple steps</h2>
        </div>

        <div style={s.steps}>
          {[
            {
              n: '01',
              title: 'Create an account',
              desc: 'Sign up and access your workspace in just a few moments.',
            },
            {
              n: '02',
              title: 'Track tasks and time',
              desc: 'Add tasks, organise them, and start timing your work.',
            },
            {
              n: '03',
              title: 'Review reports',
              desc: 'Use summaries and visual reports to understand your productivity.',
            },
          ].map(({ n, title, desc }) => (
            <div key={n} style={s.stepCard}>
              <div style={s.stepNum}>{n}</div>
              <h3 style={s.stepTitle}>{title}</h3>
              <p style={s.stepDesc}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={s.testimonials}>
        <div style={s.sectionHead}>
          <p style={s.sectionTag}>User feedback</p>
          <h2 style={s.sectionTitle}>What people like about it</h2>
        </div>

        <div style={s.testimonialGrid}>
          {testimonials.map((item) => (
            <div key={item.name} style={s.testimonialCard}>
              <p style={s.testimonialText}>“{item.text}”</p>
              <div style={s.testimonialMeta}>
                <div style={s.avatarCircle}>{item.name.charAt(0)}</div>
                <div>
                  <div style={s.testimonialName}>{item.name}</div>
                  <div style={s.testimonialRole}>{item.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" style={s.faq}>
        <div style={s.sectionHead}>
          <p style={s.sectionTag}>FAQ</p>
          <h2 style={s.sectionTitle}>Common questions</h2>
        </div>

        <div style={s.faqList}>
          {faqs.map((item, index) => {
            const isOpen = activeFaq === index;
            return (
              <div key={item.q} style={s.faqItem}>
                <button
                  style={s.faqButton}
                  onClick={() => setActiveFaq(isOpen ? -1 : index)}
                >
                  <span>{item.q}</span>
                  <span style={s.faqIcon}>{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && <p style={s.faqAnswer}>{item.a}</p>}
              </div>
            );
          })}
        </div>
      </section>

      <section style={s.cta}>
        <div style={s.ctaInner}>
          <h2 style={s.ctaTitle}>Ready to take control of your time?</h2>
          <p style={s.ctaSub}>
            Start with a clean interface, faster tracking, and clearer reporting.
          </p>
          <div style={s.ctaGroup}>
            <Link to="/register" style={s.ctaBannerBtn}>Create account</Link>
            <Link to="/login" style={s.ctaGhostBtn}>Sign in</Link>
          </div>
        </div>
      </section>

      <footer style={s.footer}>
        <div style={s.footerTop}>
          <div style={s.footerBrand}>
            <img src={logo} alt="ChronoTrack" style={s.footerLogo} />
            <div>
              <p style={s.footerBrandSub}>
                A clean time tracking experience for people who want clarity, not clutter.
              </p>
            </div>
          </div>

          <div style={s.footerCols}>
            <div>
              <h4 style={s.footerHeading}>Product</h4>
              <a href="#features" style={s.footerLink}>Features</a>
              <a href="#how" style={s.footerLink}>How it works</a>
              <a href="#faq" style={s.footerLink}>FAQ</a>
            </div>

            <div>
              <h4 style={s.footerHeading}>Account</h4>
              <Link to="/login" style={s.footerLink}>Sign in</Link>
              <Link to="/register" style={s.footerLink}>Create account</Link>
              <Link to="/forgot-password" style={s.footerLink}>Forgot password</Link>
            </div>
          </div>
        </div>

        <div style={s.footerBottom}>
          <p style={s.footerText}>© {new Date().getFullYear()} ChronoTrack. All rights reserved.</p>
          <a href="#top" style={s.backToTop}>Back to top ↑</a>
        </div>
      </footer>
    </div>
    </PageTransition>
  );
}

function GoogleFonts() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

      * { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      body { background: #0a0a0a; }

      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(24px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes floaty {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-8px); }
        100% { transform: translateY(0px); }
      }

      @media (max-width: 1100px) {
        .landing-hero-content {
          grid-template-columns: 1fr !important;
        }

        .landing-feature-grid,
        .landing-testimonial-grid,
        .landing-footer-cols,
        .landing-benefit-grid,
        .landing-steps {
          grid-template-columns: 1fr !important;
        }
      }

      @media (max-width: 900px) {
        .landing-nav-links {
          display: none !important;
        }

        .landing-nav {
          padding: 0 20px !important;
        }

        .landing-section,
        .landing-features,
        .landing-how,
        .landing-faq,
        .landing-benefits,
        .landing-testimonials,
        .landing-cta {
          padding-left: 20px !important;
          padding-right: 20px !important;
        }

        .landing-hero {
          padding: 48px 20px 60px !important;
        }

        .landing-hero-title {
          font-size: 50px !important;
        }

        .landing-section-title {
          font-size: 36px !important;
        }

        .landing-footer-top {
          flex-direction: column !important;
          align-items: flex-start !important;
        }

        .landing-footer-bottom {
          flex-direction: column !important;
          gap: 12px !important;
          align-items: flex-start !important;
        }

        .landing-quick-stats {
          grid-template-columns: 1fr !important;
        }

        .landing-stat-row {
          grid-template-columns: 1fr !important;
        }
      }

      @media (max-width: 560px) {
        .landing-hero-title {
          font-size: 40px !important;
        }

        .landing-hero-ctas {
          flex-direction: column !important;
          align-items: stretch !important;
        }

        .landing-nav-actions {
          gap: 8px !important;
        }
      }
    `}</style>
  );
}

const FONT_DISPLAY = "'Instrument Serif', Georgia, serif";
const FONT_BODY = "'DM Sans', system-ui, sans-serif";

const s = {
  root: {
    background: '#0a0a0a',
    color: '#fff',
    fontFamily: FONT_BODY,
    minHeight: '100vh',
    overflowX: 'hidden',
  },

  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 64px',
    height: '74px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'rgba(10,10,10,0.72)',
    backdropFilter: 'blur(14px)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  navScrolled: {
    boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
  },
  navLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  navLogo: {
    height: '78px',
    width: 'auto',
    filter: 'brightness(0) invert(1)',
  },
  brandText: {
    fontSize: '18px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
  },
  navLinks: {
    display: 'flex',
    gap: '28px',
  },
  navLink: {
    color: 'rgba(255,255,255,0.65)',
    textDecoration: 'none',
    fontSize: '14px',
    transition: '0.2s ease',
  },
  navActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  navLogin: {
    color: 'rgba(255,255,255,0.85)',
    textDecoration: 'none',
    fontSize: '14px',
    padding: '10px 14px',
    borderRadius: '10px',
  },
  navCta: {
    background: 'linear-gradient(135deg, #ffffff, #d9e4ff)',
    color: '#0a0a0a',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '700',
    padding: '11px 18px',
    borderRadius: '10px',
    boxShadow: '0 10px 30px rgba(255,255,255,0.12)',
  },

  hero: {
    position: 'relative',
    padding: '80px 64px 72px',
    overflow: 'hidden',
  },
  heroBg: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
  },
  heroDot1: {
    position: 'absolute',
    top: '-220px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '760px',
    height: '760px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,149,255,0.16) 0%, transparent 70%)',
  },
  heroDot2: {
    position: 'absolute',
    right: '-120px',
    bottom: '-120px',
    width: '420px',
    height: '420px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(52,211,153,0.10) 0%, transparent 70%)',
  },
  gridGlow: {
    position: 'absolute',
    inset: 0,
    background:
      'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
    backgroundSize: '60px 60px',
    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)',
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '1220px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1.05fr 0.95fr',
    gap: '42px',
    alignItems: 'center',
  },
  heroLeft: {
    animation: 'fadeUp 0.7s ease both',
  },
  heroRight: {
    animation: 'fadeUp 0.9s 0.15s ease both',
  },
  heroTag: {
    display: 'inline-block',
    padding: '8px 14px',
    borderRadius: '999px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.03)',
    color: 'rgba(255,255,255,0.72)',
    fontSize: '12px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: '22px',
  },
  heroTitle: {
    fontFamily: FONT_DISPLAY,
    fontSize: '76px',
    lineHeight: '1.02',
    fontWeight: '400',
    letterSpacing: '-0.03em',
    marginBottom: '20px',
  },
  heroAccent: {
    fontStyle: 'italic',
    color: '#b5c8ff',
  },
  heroSub: {
    fontSize: '17px',
    lineHeight: '1.8',
    color: 'rgba(255,255,255,0.7)',
    maxWidth: '620px',
    marginBottom: '30px',
  },
  heroCtas: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '28px',
  },
  ctaPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #ffffff, #dce7ff)',
    color: '#0a0a0a',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '700',
    padding: '15px 24px',
    borderRadius: '12px',
  },
  ctaSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '600',
    padding: '15px 24px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.03)',
  },

  quickStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
  },
  quickStatCard: {
    padding: '16px',
    borderRadius: '14px',
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.03)',
  },
  quickStatValue: {
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '6px',
  },
  quickStatLabel: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.62)',
    lineHeight: '1.5',
  },

  mockup: {
    background: 'linear-gradient(180deg, #151515, #101010)',
    border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: '22px',
    overflow: 'hidden',
    boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
    animation: 'floaty 5s ease-in-out infinite',
  },
  mockupBar: {
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
    padding: '14px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    background: '#0d0d0d',
  },
  mockupDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.18)',
  },
  mockupBody: {
    padding: '24px',
  },
  statRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '16px',
  },
  statCard: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '16px',
  },
  statDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    marginBottom: '10px',
  },
  statLabel: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.45)',
    marginBottom: '4px',
  },
  statValue: {
    fontSize: '22px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
  },
  liveBadge: {
    display: 'inline-block',
    marginBottom: '14px',
    padding: '7px 12px',
    borderRadius: '999px',
    background: 'rgba(52,211,153,0.12)',
    color: '#7ee7b8',
    border: '1px solid rgba(52,211,153,0.28)',
    fontSize: '12px',
    fontWeight: '600',
  },
  taskList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '16px',
  },
  taskRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '14px',
    padding: '14px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  taskLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  taskName: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.88)',
  },
  taskTag: {
    fontSize: '10px',
    padding: '4px 8px',
    borderRadius: '999px',
    background: 'rgba(255,255,255,0.08)',
    color: 'rgba(255,255,255,0.5)',
  },
  taskRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    minWidth: '140px',
  },
  barTrack: {
    width: '82px',
    height: '5px',
    borderRadius: '999px',
    background: 'rgba(255,255,255,0.10)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: '999px',
    background: 'linear-gradient(90deg, #6395ff, #34d399)',
  },
  taskTime: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.55)',
    minWidth: '52px',
    textAlign: 'right',
  },
  miniInsights: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  insightChip: {
    padding: '8px 12px',
    borderRadius: '999px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: 'rgba(255,255,255,0.72)',
    fontSize: '12px',
  },

  trustStrip: {
    padding: '0 64px 20px',
  },
  trustInner: {
    maxWidth: '1220px',
    margin: '0 auto',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    padding: '18px 0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },
  trustText: {
    color: 'rgba(255,255,255,0.56)',
    fontSize: '14px',
  },
  trustDivider: {
    color: 'rgba(255,255,255,0.18)',
  },

  sectionHead: {
    textAlign: 'center',
    maxWidth: '780px',
    margin: '0 auto 54px',
  },
  sectionTag: {
    fontSize: '12px',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.42)',
    marginBottom: '14px',
  },
  sectionTitle: {
    fontFamily: FONT_DISPLAY,
    fontSize: '50px',
    fontWeight: '400',
    lineHeight: '1.08',
    letterSpacing: '-0.03em',
    marginBottom: '14px',
  },
  sectionSub: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: '16px',
    lineHeight: '1.8',
  },

  features: {
    padding: '100px 64px',
    maxWidth: '1220px',
    margin: '0 auto',
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '18px',
  },
  featureCard: {
    padding: '28px',
    borderRadius: '18px',
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02))',
    transition: '0.25s ease',
  },
  featureIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    marginBottom: '18px',
  },
  featureTitle: {
    fontSize: '17px',
    fontWeight: '700',
    marginBottom: '10px',
  },
  featureDesc: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.62)',
    lineHeight: '1.7',
  },

  benefits: {
    padding: '30px 64px 100px',
    maxWidth: '1220px',
    margin: '0 auto',
  },
  benefitGrid: {
    display: 'grid',
    gridTemplateColumns: '1.4fr 1fr 1fr',
    gap: '18px',
  },
  benefitCardLarge: {
    gridRow: 'span 2',
    padding: '32px',
    borderRadius: '20px',
    background: 'linear-gradient(135deg, rgba(99,149,255,0.14), rgba(255,255,255,0.03))',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  benefitCard: {
    padding: '28px',
    borderRadius: '20px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  benefitTitle: {
    fontSize: '20px',
    fontWeight: '700',
    marginBottom: '12px',
  },
  benefitDesc: {
    color: 'rgba(255,255,255,0.68)',
    lineHeight: '1.75',
    fontSize: '15px',
  },

  how: {
    padding: '100px 64px',
    maxWidth: '1220px',
    margin: '0 auto',
  },
  steps: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '18px',
  },
  stepCard: {
    padding: '28px',
    borderRadius: '18px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  stepNum: {
    fontFamily: FONT_DISPLAY,
    fontSize: '56px',
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.16)',
    lineHeight: 1,
    marginBottom: '18px',
  },
  stepTitle: {
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '10px',
  },
  stepDesc: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.62)',
    lineHeight: '1.7',
  },

  testimonials: {
    padding: '30px 64px 100px',
    maxWidth: '1220px',
    margin: '0 auto',
  },
  testimonialGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '18px',
  },
  testimonialCard: {
    padding: '26px',
    borderRadius: '18px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  testimonialText: {
    color: 'rgba(255,255,255,0.78)',
    lineHeight: '1.8',
    marginBottom: '22px',
    fontSize: '15px',
  },
  testimonialMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatarCircle: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6395ff, #8ab2ff)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    color: '#fff',
  },
  testimonialName: {
    fontSize: '14px',
    fontWeight: '700',
  },
  testimonialRole: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.52)',
  },

  faq: {
    padding: '20px 64px 100px',
    maxWidth: '980px',
    margin: '0 auto',
  },
  faqList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  faqItem: {
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    background: 'rgba(255,255,255,0.03)',
    overflow: 'hidden',
  },
  faqButton: {
    width: '100%',
    background: 'transparent',
    color: '#fff',
    border: 'none',
    padding: '20px 22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    textAlign: 'left',
  },
  faqIcon: {
    fontSize: '22px',
    color: 'rgba(255,255,255,0.7)',
  },
  faqAnswer: {
    padding: '0 22px 20px',
    color: 'rgba(255,255,255,0.68)',
    lineHeight: '1.8',
    fontSize: '15px',
  },

  cta: {
    padding: '20px 64px 100px',
  },
  ctaInner: {
    maxWidth: '1220px',
    margin: '0 auto',
    padding: '76px 28px',
    borderRadius: '24px',
    textAlign: 'center',
    background: 'linear-gradient(135deg, rgba(99,149,255,0.16), rgba(255,255,255,0.04))',
    border: '1px solid rgba(255,255,255,0.10)',
  },
  ctaTitle: {
    fontFamily: FONT_DISPLAY,
    fontSize: '52px',
    fontWeight: '400',
    letterSpacing: '-0.03em',
    marginBottom: '14px',
  },
  ctaSub: {
    fontSize: '16px',
    color: 'rgba(255,255,255,0.68)',
    marginBottom: '30px',
  },
  ctaGroup: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '14px',
    flexWrap: 'wrap',
  },
  ctaBannerBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#fff',
    color: '#0a0a0a',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '700',
    padding: '15px 26px',
    borderRadius: '12px',
  },
  ctaGhostBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255,255,255,0.03)',
    color: '#fff',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '600',
    padding: '15px 26px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.12)',
  },

  footer: {
    borderTop: '1px solid rgba(255,255,255,0.06)',
    padding: '34px 64px 30px',
  },
  footerTop: {
    maxWidth: '1220px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '40px',
    paddingBottom: '26px',
  },
  footerBrand: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
    maxWidth: '420px',
  },
  footerLogo: {
    height: '80px',
    width: 'auto',
    filter: 'brightness(0) invert(1)',
    opacity: 0.9,
    marginTop: '-22px',
  },
  footerBrandTitle: {
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '8px',
  },
  footerBrandSub: {
    color: 'rgba(255,255,255,0.58)',
    lineHeight: '1.7',
    fontSize: '14px',
  },
  footerCols: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(140px, 1fr))',
    gap: '36px',
  },
  footerHeading: {
    fontSize: '14px',
    fontWeight: '700',
    marginBottom: '12px',
  },
  footerLink: {
    display: 'block',
    color: 'rgba(255,255,255,0.56)',
    textDecoration: 'none',
    marginBottom: '10px',
    fontSize: '14px',
  },
  footerBottom: {
    maxWidth: '1220px',
    margin: '0 auto',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    paddingTop: '18px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.38)',
  },
  backToTop: {
    color: 'rgba(255,255,255,0.62)',
    textDecoration: 'none',
    fontSize: '13px',
  },
};