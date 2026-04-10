import { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const SETTINGS_TABS = ['Profile', 'Account', 'Preferences', 'Notifications'];

export default function SettingsPage({ theme = 'dark', setTheme }) {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const initials = useMemo(() => {
    const source = user?.name?.trim() || 'User';
    return source
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [user?.name]);

  const [activeTab, setActiveTab] = useState('Profile');
  const [profileImage, setProfileImage] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);
  const [accountSaved, setAccountSaved] = useState(false);
  const [preferencesSaved, setPreferencesSaved] = useState(false);
  const [notificationSaved, setNotificationSaved] = useState(false);

  const [profile, setProfile] = useState({
    fullName: user?.name || '',
    role: 'Productivity User',
    bio: '',
    phone: '',
    location: '',
    company: '',
  });

  const [account, setAccount] = useState({
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [preferences, setPreferences] = useState({
    theme: theme === 'light' ? 'Light' : 'Dark',
    weekStartsOn: 'Monday',
    timeFormat: '12-hour',
    defaultView: 'Weekly',
  });

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    reminderAlerts: true,
    weeklyReports: true,
    productNews: false,
  });

  useEffect(() => {
    setPreferences((prev) => ({
      ...prev,
      theme: theme === 'light' ? 'Light' : 'Dark',
    }));
  }, [theme]);

  const handleProfileChange = (field) => (e) => {
    setProfile((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleAccountChange = (field) => (e) => {
    setAccount((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handlePreferenceChange = (field) => (e) => {
    const value = e.target.value;
    setPreferences((prev) => ({ ...prev, [field]: value }));

    if (field === 'theme' && setTheme) {
      if (value === 'Light') setTheme('light');
      else if (value === 'Dark') setTheme('dark');
      else {
        const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        setTheme(systemPrefersLight ? 'light' : 'dark');
      }
    }
  };

  const handleNotificationToggle = (field) => {
    setNotifications((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2200);
  };

  const handleAccountSave = (e) => {
    e.preventDefault();
    setAccountSaved(true);
    setTimeout(() => setAccountSaved(false), 2200);
  };

  const handlePreferencesSave = () => {
    if (preferences.theme === 'Light' && setTheme) {
      setTheme('light');
    } else if (preferences.theme === 'Dark' && setTheme) {
      setTheme('dark');
    } else if (preferences.theme === 'System' && setTheme) {
      const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      setTheme(systemPrefersLight ? 'light' : 'dark');
    }

    setPreferencesSaved(true);
    setTimeout(() => setPreferencesSaved(false), 2200);
  };

  const handleNotificationsSave = () => {
    setNotificationSaved(true);
    setTimeout(() => setNotificationSaved(false), 2200);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result?.toString() || '');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={styles.page}>
      <style>{`
        @media (max-width: 900px) {
          .settings-tab-row {
            grid-template-columns: repeat(2, 1fr) !important;
          }

          .settings-two-col {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 560px) {
          .settings-tab-row {
            grid-template-columns: 1fr !important;
          }

          .settings-profile-hero {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        }

        .settings-input:focus,
        .settings-select:focus,
        .settings-textarea:focus {
          border-color: var(--color-primary) !important;
          box-shadow: 0 0 0 3px var(--color-primary-light) !important;
        }

        .settings-tab-btn:hover {
          border-color: var(--color-primary) !important;
          transform: translateY(-1px);
        }

        .settings-tab-btn.active {
          background: linear-gradient(135deg, var(--color-primary), var(--color-secondary)) !important;
          color: #fff !important;
          border-color: transparent !important;
          box-shadow: 0 14px 28px rgba(79, 124, 255, 0.22);
        }

        .locked-field:hover .locked-tooltip {
          opacity: 1 !important;
          visibility: visible !important;
          transform: translateY(0) !important;
        }
      `}</style>

      <div style={styles.header}>
        <p style={styles.eyebrow}>Account settings</p>
        <h1 style={styles.title}>Settings</h1>
        <p style={styles.subtitle}>
          Manage your profile details, account security, app preferences, and notifications.
        </p>
      </div>

      <div className="settings-tab-row" style={styles.tabRow}>
        {SETTINGS_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`settings-tab-btn ${activeTab === tab ? 'active' : ''}`}
            style={styles.tabButton}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Profile' && (
        <section style={styles.card}>
          <div className="settings-profile-hero" style={styles.profileHero}>
            <div style={styles.profileIdentity}>
              {profileImage ? (
                <img src={profileImage} alt="Profile" style={styles.avatarImage} />
              ) : (
                <div style={styles.avatar}>{initials}</div>
              )}

              <div>
                <h2 style={styles.profileName}>{profile.fullName || 'User'}</h2>
                <p style={styles.profileEmail}>{user?.email || 'user@email.com'}</p>
                <p style={styles.profileMeta}>ChronoTrack profile</p>
              </div>
            </div>

            <div>
              <button
                type="button"
                style={styles.secondaryBtn}
                onClick={handleImageClick}
              >
                Upload photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          <form onSubmit={handleProfileSave} style={styles.form}>
            <div className="settings-two-col" style={styles.twoCol}>
              <Field
                label="Full name"
                value={profile.fullName}
                onChange={handleProfileChange('fullName')}
                placeholder="Enter your full name"
              />
              <Field
                label="Role"
                value={profile.role}
                onChange={handleProfileChange('role')}
                placeholder="Your role"
              />
            </div>

            <div className="settings-two-col" style={styles.twoCol}>
              <Field
                label="Phone"
                value={profile.phone}
                onChange={handleProfileChange('phone')}
                placeholder="+61 4xx xxx xxx"
              />
              <Field
                label="Location"
                value={profile.location}
                onChange={handleProfileChange('location')}
                placeholder="Melbourne, Australia"
              />
            </div>

            <Field
              label="Company"
              value={profile.company}
              onChange={handleProfileChange('company')}
              placeholder="Company or organisation"
            />

            <div>
              <label style={styles.label}>Bio</label>
              <textarea
                value={profile.bio}
                onChange={handleProfileChange('bio')}
                placeholder="Write a short bio about yourself..."
                style={styles.textarea}
                className="settings-textarea"
              />
            </div>

            <div style={styles.actions}>
              {profileSaved && <span style={styles.savedMsg}>✓ Profile updated</span>}
              <button type="submit" className="btn btn-primary">
                Save profile
              </button>
            </div>
          </form>
        </section>
      )}

      {activeTab === 'Account' && (
        <section style={styles.card}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Account settings</h2>
            <p style={styles.sectionSubtext}>
              Update your email, change password, or manage account access.
            </p>
          </div>

          <form onSubmit={handleAccountSave} style={styles.form}>
            <LockedField
              label="Email address"
              value={account.email}
              message="This email is linked to your account and cannot be changed here."
            />

            <div className="settings-two-col" style={styles.twoCol}>
              <Field
                label="Current password"
                type="password"
                value={account.currentPassword}
                onChange={handleAccountChange('currentPassword')}
                placeholder="••••••••"
              />
              <div />
            </div>

            <div className="settings-two-col" style={styles.twoCol}>
              <Field
                label="New password"
                type="password"
                value={account.newPassword}
                onChange={handleAccountChange('newPassword')}
                placeholder="••••••••"
              />
              <Field
                label="Confirm new password"
                type="password"
                value={account.confirmPassword}
                onChange={handleAccountChange('confirmPassword')}
                placeholder="••••••••"
              />
            </div>

            <div style={styles.actions}>
              {accountSaved && <span style={styles.savedMsg}>✓ Account updated</span>}
              <button type="submit" className="btn btn-primary">
                Update account
              </button>
            </div>
          </form>

          <div style={styles.dangerCard}>
            <h3 style={styles.dangerTitle}>Delete account</h3>
            <p style={styles.sectionSubtext}>
              This action is permanent and cannot be undone once confirmed.
            </p>
            <button type="button" style={styles.dangerBtn}>
              Delete account
            </button>
          </div>
        </section>
      )}

      {activeTab === 'Preferences' && (
        <section style={styles.card}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Preferences</h2>
            <p style={styles.sectionSubtext}>
              Personalize the way ChronoTrack looks and works for you.
            </p>
          </div>

          <div style={styles.form}>
            <SelectField
              label="Theme"
              value={preferences.theme}
              onChange={handlePreferenceChange('theme')}
              options={['Light', 'Dark', 'System']}
            />
            <SelectField
              label="Week starts on"
              value={preferences.weekStartsOn}
              onChange={handlePreferenceChange('weekStartsOn')}
              options={['Monday', 'Sunday']}
            />
            <SelectField
              label="Time format"
              value={preferences.timeFormat}
              onChange={handlePreferenceChange('timeFormat')}
              options={['12-hour', '24-hour']}
            />
            <SelectField
              label="Default dashboard view"
              value={preferences.defaultView}
              onChange={handlePreferenceChange('defaultView')}
              options={['Daily', 'Weekly', 'Monthly']}
            />

            <div style={styles.actions}>
              {preferencesSaved && <span style={styles.savedMsg}>✓ Preferences updated</span>}
              <button type="button" className="btn btn-primary" onClick={handlePreferencesSave}>
                Save preferences
              </button>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'Notifications' && (
        <section style={styles.card}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Notification settings</h2>
            <p style={styles.sectionSubtext}>
              Choose which alerts and updates you want to receive.
            </p>
          </div>

          <div style={styles.settingList}>
            <ToggleRow
              title="Email updates"
              desc="Receive important account and product updates by email."
              checked={notifications.emailUpdates}
              onChange={() => handleNotificationToggle('emailUpdates')}
            />
            <ToggleRow
              title="Reminder alerts"
              desc="Get reminders for time tracking and unfinished sessions."
              checked={notifications.reminderAlerts}
              onChange={() => handleNotificationToggle('reminderAlerts')}
            />
            <ToggleRow
              title="Weekly reports"
              desc="Receive a weekly summary of your tracked activity."
              checked={notifications.weeklyReports}
              onChange={() => handleNotificationToggle('weeklyReports')}
            />
            <ToggleRow
              title="Product news"
              desc="Get updates about new ChronoTrack features."
              checked={notifications.productNews}
              onChange={() => handleNotificationToggle('productNews')}
            />
          </div>

          <div style={{ ...styles.actions, marginTop: '18px' }}>
            {notificationSaved && <span style={styles.savedMsg}>✓ Notifications updated</span>}
            <button type="button" className="btn btn-primary" onClick={handleNotificationsSave}>
              Save notifications
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

function Field({ label, type = 'text', value, onChange, placeholder }) {
  return (
    <div>
      <label style={styles.label}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={styles.input}
        className="settings-input"
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label style={styles.label}>{label}</label>
      <select
        value={value}
        onChange={onChange}
        style={styles.select}
        className="settings-select"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function LockedField({ label, value, message }) {
  return (
    <div>
      <label style={styles.label}>{label}</label>
      <div className="locked-field" style={styles.lockedFieldWrap}>
        <input type="text" value={value} readOnly style={styles.lockedInput} />
        <div style={styles.lockBadge}>🔒</div>
        <div className="locked-tooltip" style={styles.tooltip}>
          {message}
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ title, desc, checked, onChange }) {
  return (
    <div style={styles.toggleRow}>
      <div>
        <p style={styles.toggleTitle}>{title}</p>
        <p style={styles.toggleDesc}>{desc}</p>
      </div>

      <button
        type="button"
        onClick={onChange}
        style={{
          ...styles.toggle,
          background: checked
            ? 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))'
            : 'var(--color-surface-soft)',
          justifyContent: checked ? 'flex-end' : 'flex-start',
        }}
      >
        <span style={styles.toggleKnob} />
      </button>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: '1080px',
    margin: '0 auto',
    padding: '8px 0 32px',
  },
  header: {
    marginBottom: '22px',
  },
  eyebrow: {
    margin: '0 0 8px 0',
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.16em',
    color: 'var(--color-accent)',
  },
  title: {
    margin: '0 0 10px 0',
    fontSize: 'clamp(2rem, 3vw, 2.5rem)',
    fontWeight: '800',
    color: 'var(--color-text-primary)',
    letterSpacing: '-0.03em',
  },
  subtitle: {
    margin: 0,
    fontSize: '15px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.7',
    maxWidth: '720px',
  },
  tabRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '14px',
    marginBottom: '22px',
  },
  tabButton: {
    border: '1px solid var(--color-border)',
    background: 'var(--color-surface)',
    color: 'var(--color-text-primary)',
    padding: '15px 18px',
    borderRadius: '16px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.22s ease',
    boxShadow: 'var(--shadow-sm)',
  },
  card: {
    background:
      'linear-gradient(180deg, var(--glass-1), var(--glass-2)), var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-xl)',
    padding: '24px',
    boxShadow: 'var(--shadow-sm)',
  },
  profileHero: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '24px',
    paddingBottom: '20px',
    borderBottom: '1px solid var(--color-border)',
  },
  profileIdentity: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '25px',
    fontWeight: '800',
    flexShrink: 0,
    boxShadow: '0 18px 32px rgba(79, 124, 255, 0.22)',
  },
  avatarImage: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid var(--color-border-strong)',
  },
  profileName: {
    margin: '0 0 4px 0',
    fontSize: '22px',
    fontWeight: '800',
    color: 'var(--color-text-primary)',
  },
  profileEmail: {
    margin: '0 0 4px 0',
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
  },
  profileMeta: {
    margin: 0,
    fontSize: '13px',
    color: 'var(--color-text-muted)',
  },
  sectionHeader: {
    marginBottom: '18px',
  },
  sectionTitle: {
    margin: '0 0 6px 0',
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--color-text-primary)',
  },
  sectionSubtext: {
    margin: 0,
    fontSize: '13px',
    color: 'var(--color-text-muted)',
    lineHeight: '1.6',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  twoCol: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--color-text-secondary)',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '14px',
    border: '1px solid var(--color-border)',
    fontSize: '14px',
    color: 'var(--color-text-primary)',
    outline: 'none',
    boxSizing: 'border-box',
    background: 'var(--color-surface-soft)',
    transition: 'all 0.2s ease',
  },
  select: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '14px',
    border: '1px solid var(--color-border)',
    fontSize: '14px',
    color: 'var(--color-text-primary)',
    outline: 'none',
    boxSizing: 'border-box',
    background: 'var(--color-surface-soft)',
    transition: 'all 0.2s ease',
  },
  textarea: {
    width: '100%',
    minHeight: '120px',
    padding: '12px 14px',
    borderRadius: '14px',
    border: '1px solid var(--color-border)',
    fontSize: '14px',
    color: 'var(--color-text-primary)',
    outline: 'none',
    boxSizing: 'border-box',
    background: 'var(--color-surface-soft)',
    resize: 'vertical',
    fontFamily: 'inherit',
    transition: 'all 0.2s ease',
  },
  secondaryBtn: {
    border: '1px solid var(--color-border-strong)',
    background: 'var(--color-surface-soft)',
    color: 'var(--color-text-primary)',
    fontSize: '13px',
    fontWeight: '600',
    padding: '10px 14px',
    borderRadius: '14px',
    cursor: 'pointer',
  },
  lockedFieldWrap: {
    position: 'relative',
  },
  lockedInput: {
    width: '100%',
    padding: '12px 42px 12px 14px',
    borderRadius: '14px',
    border: '1px solid var(--color-border)',
    fontSize: '14px',
    color: 'var(--color-text-muted)',
    outline: 'none',
    boxSizing: 'border-box',
    background: 'var(--glass-2)',
    cursor: 'not-allowed',
  },
  lockBadge: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '14px',
    pointerEvents: 'none',
  },
  tooltip: {
    position: 'absolute',
    left: 0,
    top: 'calc(100% + 8px)',
    background: 'var(--panel-deep-solid)',
    color: 'var(--color-text-primary)',
    fontSize: '12px',
    lineHeight: '1.5',
    padding: '8px 10px',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '300px',
    opacity: 0,
    visibility: 'hidden',
    transform: 'translateY(-4px)',
    transition: 'all 0.18s ease',
    zIndex: 5,
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--color-border)',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
    marginTop: '6px',
  },
  savedMsg: {
    fontSize: '13px',
    color: 'var(--color-success)',
    fontWeight: '700',
  },
  settingList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  toggleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '14px',
    paddingBottom: '14px',
    borderBottom: '1px solid var(--color-border)',
  },
  toggleTitle: {
    margin: '0 0 4px 0',
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--color-text-primary)',
  },
  toggleDesc: {
    margin: 0,
    fontSize: '13px',
    lineHeight: '1.6',
    color: 'var(--color-text-muted)',
  },
  toggle: {
    width: '50px',
    height: '28px',
    borderRadius: '999px',
    border: '1px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    padding: '4px',
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'all 0.2s ease',
  },
  toggleKnob: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    background: '#fff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  },
  dangerCard: {
    marginTop: '24px',
    padding: '18px',
    borderRadius: '16px',
    border: '1px solid rgba(255, 107, 122, 0.22)',
    background: 'rgba(255, 107, 122, 0.06)',
  },
  dangerTitle: {
    margin: '0 0 8px 0',
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--color-danger)',
  },
  dangerBtn: {
    marginTop: '12px',
    border: '1px solid rgba(255, 107, 122, 0.26)',
    background: 'rgba(255, 107, 122, 0.14)',
    color: 'var(--color-danger)',
    fontSize: '14px',
    fontWeight: '700',
    padding: '12px 16px',
    borderRadius: '14px',
    cursor: 'pointer',
  },
};