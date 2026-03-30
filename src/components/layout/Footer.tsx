import { Link } from 'react-router-dom';
import { useI18n, LANGUAGES } from '../../lib/i18n';

export function Footer() {
  const { lang, setLang, t } = useI18n();

  return (
    <footer className="footer">
      <div className="container">
        {/* Trust badges — subtils, pas techniques */}
        <div className="footer-trust-badges">
          <div className="footer-trust-badge"><span>✓</span> Conforme au droit suisse</div>
          <div className="footer-trust-badge"><span>✓</span> Vos données protégées</div>
          <div className="footer-trust-badge"><span>✓</span> Taux officiels OFAS 2025</div>
          <div className="footer-trust-badge"><span>✓</span> 30 jours d'essai gratuit</div>
          <div className="footer-trust-badge"><span>✓</span> Résiliable à tout moment</div>
        </div>

        {/* Main grid */}
        <div className="footer-grid" style={{ paddingTop: 40 }}>
          {/* Brand */}
          <div className="footer-col">
            <div className="footer-brand">
              <span style={{ color: '#fff' }}>Ai</span>
              <span style={{ color: '#dc2626' }}>d</span>
              <span style={{ color: '#fff' }}>om</span>
            </div>
            <p className="footer-brand-desc">
              {t('footer.tagline')}<br />
              Conçu et développé en Suisse.
            </p>
            <div style={{ marginTop: 12, display: 'flex', gap: 6 }}>
              {LANGUAGES.map((l) => (
                <button key={l.code}
                  onClick={() => setLang(l.code)}
                  style={{
                    padding: '4px 8px', fontSize: '0.72rem', fontWeight: 600,
                    fontFamily: 'inherit', cursor: 'pointer',
                    background: lang === l.code ? 'var(--color-primary)' : 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: lang === l.code ? '#fff' : '#9ca3af',
                    borderRadius: 'var(--radius)',
                  }}>
                  {l.flag}
                </button>
              ))}
            </div>
          </div>

          {/* Produit */}
          <div className="footer-col">
            <h4>{t('footer.product')}</h4>
            <Link to="/comment-ca-marche">{t('nav.howItWorks')}</Link>
            <Link to="/simulateur">{t('nav.simulator')}</Link>
            <Link to="/combien-ca-coute">Combien ça coûte</Link>
            <Link to="/tarifs">{t('nav.pricing')}</Link>
            <Link to="/signup">Commencer</Link>
          </div>

          {/* Savoir */}
          <div className="footer-col">
            <h4>{t('footer.knowledge')}</h4>
            <Link to="/guides">{t('nav.guides')}</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/a-propos">À propos</Link>
            <Link to="/mission">Notre mission</Link>
            <Link to="/contact">{t('footer.contact')}</Link>
          </div>

          {/* Juridique */}
          <div className="footer-col">
            <h4>{t('footer.legal')}</h4>
            <Link to="/mentions-legales">Mentions légales</Link>
            <Link to="/cgv">Conditions générales</Link>
            <Link to="/confidentialite">Confidentialité</Link>
            <Link to="/sources">Sources</Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Aidom. {t('footer.developed')}.</span>
          <span style={{ fontSize: '0.72rem' }}>
            Taux basés sur les données OFAS/BSV. Ne remplace pas un conseil professionnel.
          </span>
        </div>
      </div>
    </footer>
  );
}
