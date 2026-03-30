import { Link } from 'react-router-dom';
import { useStore } from '../lib/store';
import { PRICING } from '../lib/pricing';
import { useI18n } from '../lib/i18n';
import { api } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export function Pricing() {
  const { user, loadUser } = useStore();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubscribe = async () => {
    if (!user) { navigate('/signup'); return; }
    const res = await api.activatePlan('essentiel');
    if (res.success) { await loadUser(); navigate('/dashboard'); }
  };

  const faqs = [
    { q: 'Y a-t-il des frais cachés ?', a: 'Non. CHF 19.—/mois, c\'est tout. Aucun pourcentage sur les salaires, aucun frais de setup, aucun supplément par employé.' },
    { q: 'Puis-je annuler à tout moment ?', a: 'Oui, sans condition. Résiliez depuis votre compte, l\'abonnement s\'arrête à la fin du mois en cours.' },
    { q: 'L\'essai gratuit nécessite-t-il une carte de crédit ?', a: 'Non. Inscrivez-vous sans carte. Vous ne paierez qu\'après 30 jours si vous décidez de continuer.' },
    { q: 'Combien d\'employés puis-je gérer ?', a: 'Autant que vous voulez. L\'abonnement couvre un nombre illimité d\'employés, sans surcoût.' },
    { q: 'Est-ce moins cher qu\'une agence ?', a: 'Oui, significativement. Une agence facture en général 30-50% du salaire. Aidom coûte un prix fixe de CHF 19/mois quel que soit le salaire ou le nombre d\'heures.' },
  ];

  return (
    <div>
      <section style={{
        background: 'linear-gradient(135deg, #0f172a, #1a56db)',
        color: '#fff', padding: '80px 20px', textAlign: 'center',
      }}>
        <div className="container">
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 12 }}>
            {t('section.pricing')}
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)' }}>
            {t('section.pricing.desc')}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Main pricing card */}
          <div className="pricing-hero-card">
            <div style={{ textAlign: 'center' }}>
              <span className="badge badge-success" style={{ marginBottom: 16 }}>30 jours gratuits</span>
              <div style={{ marginBottom: 20 }}>
                <span className="price-tag">
                  <sup>CHF</sup> 19<sub>.—{t('pricing.month')}</sub>
                </span>
              </div>
              <p className="text-muted text-sm mb-3">
                Prix fixe. Pas de pourcentage. Pas de frais cachés.
              </p>

              <ul style={{ listStyle: 'none', textAlign: 'left', marginBottom: 28 }}>
                {PRICING.features.map((f, i) => (
                  <li key={i} style={{
                    padding: '10px 0', borderBottom: '1px solid var(--color-border-light)',
                    fontSize: '0.925rem', display: 'flex', alignItems: 'center', gap: 12,
                  }}>
                    <span style={{ color: 'var(--color-success)', fontWeight: 700, fontSize: '1.1rem' }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button className="btn btn-primary btn-lg btn-block" onClick={handleSubscribe}>
                {user?.plan ? 'Abonnement actif ✓' : t('pricing.cta')}
              </button>

              <p className="text-xs text-muted mt-1">Aucune carte de crédit requise pour l'essai</p>
            </div>
          </div>

          {/* FAQ */}
          <div style={{ maxWidth: 640, margin: '48px auto 0' }}>
            <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Questions sur les tarifs</h2>
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item">
                <button className={`faq-question ${openFaq === i ? 'open' : ''}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {faq.q}
                  <span className="chevron">▼</span>
                </button>
                {openFaq === i && <div className="faq-answer">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
