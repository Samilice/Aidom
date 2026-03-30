import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../lib/store';
import { useI18n, LANGUAGES } from '../../lib/i18n';

export function Header() {
  const { user, logout } = useStore();
  const navigate = useNavigate();
  const { lang, setLang, t } = useI18n();
  const [langOpen, setLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const currentLang = LANGUAGES.find((l) => l.code === lang)!;

  return (
    <header style={{
      background: 'rgba(255,255,255,0.97)',
      borderBottom: '1px solid var(--color-border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{
        maxWidth: 'var(--max-width)',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 'var(--header-height)',
        padding: '0 24px',
      }}>
        {/* Logo — Aidom avec touche de rouge suisse */}
        <Link to={user ? '/dashboard' : '/'} style={{
          fontWeight: 800,
          fontSize: '1.4rem',
          textDecoration: 'none',
          letterSpacing: '-0.03em',
          display: 'flex',
          alignItems: 'baseline',
          gap: 0,
        }}>
          <span style={{ color: 'var(--color-primary)' }}>Ai</span>
          <span style={{ color: '#dc2626' }}>d</span>
          <span style={{ color: 'var(--color-primary)' }}>om</span>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {user ? (
            <>
              <NavLink to="/dashboard">{t('nav.dashboard')}</NavLink>
              <NavLink to="/simulateur">{t('nav.simulator')}</NavLink>
              <NavLink to="/guides">{t('nav.guides')}</NavLink>
              <span className="text-sm text-muted" style={{ padding: '0 8px' }}>{user.firstName}</span>
              <button onClick={() => { logout(); navigate('/'); }} className="btn btn-secondary btn-sm">
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <>
              <NavLink to="/comment-ca-marche">{t('nav.howItWorks')}</NavLink>
              <NavLink to="/simulateur">{t('nav.simulator')}</NavLink>
              <NavLink to="/tarifs">{t('nav.pricing')}</NavLink>
              <NavLink to="/guides">{t('nav.guides')}</NavLink>

              {/* Language dropdown */}
              <div ref={dropdownRef} style={{ position: 'relative', marginLeft: 8 }}>
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '6px 10px', fontSize: '0.82rem', fontWeight: 600,
                    fontFamily: 'inherit', border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius)', background: '#fff',
                    cursor: 'pointer', color: 'var(--color-text-secondary)',
                  }}
                >
                  {currentLang.flag}
                  <svg width="12" height="12" viewBox="0 0 12 12" style={{
                    transform: langOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.15s',
                  }}>
                    <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </svg>
                </button>

                {langOpen && (
                  <div style={{
                    position: 'absolute', top: '100%', right: 0, marginTop: 4,
                    background: '#fff', border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)',
                    padding: 4, minWidth: 140, zIndex: 200,
                  }}>
                    {LANGUAGES.map((l) => (
                      <button key={l.code}
                        onClick={() => { setLang(l.code); setLangOpen(false); }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                          padding: '8px 12px', border: 'none', background: lang === l.code ? 'var(--color-primary-light)' : 'transparent',
                          borderRadius: 'var(--radius)', cursor: 'pointer', fontFamily: 'inherit',
                          fontSize: '0.85rem', fontWeight: lang === l.code ? 600 : 400,
                          color: lang === l.code ? 'var(--color-primary)' : 'var(--color-text)',
                          textAlign: 'left',
                        }}
                      >
                        <span style={{ fontWeight: 700, fontSize: '0.78rem', width: 22 }}>{l.flag}</span>
                        {l.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/login" style={{ marginLeft: 6 }}>
                <button className="btn btn-secondary btn-sm">{t('nav.login')}</button>
              </Link>
              <Link to="/signup">
                <button className="btn btn-primary btn-sm">{t('nav.signup')}</button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} style={{
      padding: '8px 12px', fontSize: '0.875rem', fontWeight: 500,
      color: 'var(--color-text-secondary)', textDecoration: 'none',
      borderRadius: 'var(--radius)', transition: 'color 0.15s',
    }}>
      {children}
    </Link>
  );
}
