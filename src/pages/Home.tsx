import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n';
import { CANTONS, type CantonData } from '../lib/cantons';
import { calculateCosts } from '../domain/calculations';
import { PRICING } from '../lib/pricing';
import { SwissMap } from '../components/ui/SwissMap';

export function Home() {
  return (
    <div>
      <HeroSection />
      <SocialProofBar />
      <CantonMapSection />
      <HowItWorksSection />
      <CalculatorSection />
      <TransparencySection />
      <PricingSection />
      <RiskSection />
      <FeaturesSection />
      <GuidesPreview />
      <FAQSection />
      <CTABanner />
    </div>
  );
}

// ============================================
// HERO — Ton chaleureux, pas technique
// ============================================
function HeroSection() {
  const { t } = useI18n();
  return (
    <section className="hero">
      <div className="hero-shape hero-shape-1" />
      <div className="hero-shape hero-shape-2" />
      <div className="hero-shape hero-shape-3" />
      <div className="hero-content">
        <div className="hero-badge">
          <span className="pulse" />
          {t('hero.badge')}
        </div>
        <h1>
          {t('hero.title1')}<br />
          <span className="highlight">{t('hero.title2')}</span>
        </h1>
        <p className="hero-subtitle">{t('hero.subtitle')}</p>
        <p className="hero-price">
          <span>CHF 19.—</span>{t('pricing.month')} — Prix fixe, tout inclus.
        </p>
        <div className="hero-ctas">
          <Link to="/signup"><button className="btn btn-primary btn-lg">{t('hero.cta1')} →</button></Link>
          <Link to="/simulateur"><button className="btn btn-ghost btn-lg">{t('hero.cta2')}</button></Link>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginTop: 8 }}>
          {t('hero.trial')}
        </p>
        {/* Trust — subtil, pas de jargon technique */}
        <div className="hero-trust">
          <div className="hero-trust-item"><span className="icon">✓</span> Conforme au droit suisse</div>
          <div className="hero-trust-item"><span className="icon">✓</span> Taux officiels 2025</div>
          <div className="hero-trust-item"><span className="icon">✓</span> Vos données sécurisées</div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// SOCIAL PROOF — inspiré Quitt (crédibilité)
// ============================================
function SocialProofBar() {
  return (
    <section style={{
      background: '#fff', borderBottom: '1px solid var(--color-border)',
      padding: '20px 0',
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
        {[
          { n: '26', l: 'Cantons couverts' },
          { n: '5 min', l: 'Pour tout configurer' },
          { n: 'CHF 19.—', l: 'Prix fixe par mois' },
          { n: '~2 min', l: 'Par mois ensuite' },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: 'center', minWidth: 100 }}>
            <div style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--color-primary)' }}>{s.n}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================
// CANTON MAP — SVG interactif
// ============================================
function CantonMapSection() {
  const { t } = useI18n();
  const [selected, setSelected] = useState<CantonData | null>(null);

  return (
    <section className="section section-alt">
      <div className="container">
        <div className="section-header">
          <h2>{t('section.cantons')}</h2>
          <p>{t('section.cantons.desc')}</p>
        </div>

        <SwissMap
          selected={selected?.code || null}
          onSelect={(canton) => setSelected(canton)}
        />

        {selected ? (
          <div className="card mt-3" style={{ maxWidth: 560, margin: '24px auto 0', padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ marginBottom: 4 }}>{selected.name}</h3>
                <span className="badge badge-info" style={{ marginBottom: 12, display: 'inline-block' }}>
                  {selected.region === 'romandie' ? 'Romandie' : selected.region === 'ticino' ? 'Tessin' : selected.region === 'bilingue' ? 'Bilingue' : 'Suisse alémanique'}
                </span>
              </div>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>{selected.code}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
              <InfoCell label="Allocations familiales" value={`${(selected.afRate * 100).toFixed(1)}%`} />
              <InfoCell label="Langue(s)" value={selected.language.toUpperCase()} />
              <InfoCell label="Salaire minimum" value={selected.minWageHour ? `CHF ${selected.minWageHour}/h` : 'Pas de minimum'} />
              <InfoCell label="Procédure simplifiée" value={selected.hasSimplifiedProcedure ? 'Disponible' : 'Standard'} />
            </div>
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: 16 }}>
            Cliquez sur un canton pour voir les détails
          </p>
        )}
      </div>
    </section>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 2 }}>{label}</div>
      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{value}</div>
    </div>
  );
}

// ============================================
// HOW IT WORKS
// ============================================
function HowItWorksSection() {
  const { t } = useI18n();
  const steps = [
    { title: 'Renseignez votre situation', desc: 'Canton, salaire, infos personnelles — c\'est simple et guidé.', time: '5 min' },
    { title: 'Recevez votre contrat', desc: 'Un contrat de travail conforme, prêt à signer et télécharger.', time: 'Immédiat' },
    { title: 'Inscrivez-vous à l\'AVS', desc: 'On prépare le formulaire, vous l\'envoyez à votre caisse.', time: '15 min, une fois' },
    { title: 'Chaque mois, 2 minutes', desc: 'Entrez les heures, la fiche de paie se génère toute seule.', time: '2 min/mois' },
  ];

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <h2>{t('section.howItWorks')}</h2>
          <p>{t('section.howItWorks.desc')}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {steps.map((s, i) => (
            <div key={i} className="step-card">
              <div className="step-number">{i + 1}</div>
              <div className="step-content">
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <span className="step-time">⏱ {s.time}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Link to="/comment-ca-marche" className="text-sm" style={{ color: 'var(--color-primary)' }}>
            En savoir plus sur le fonctionnement →
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================
// CALCULATOR — interactif avec sliders
// ============================================
function CalculatorSection() {
  const { t } = useI18n();
  const [hourly, setHourly] = useState(28);
  const [hours, setHours] = useState(8);
  const [canton, setCanton] = useState('GE');

  const costs = calculateCosts({
    grossHourlyRate: hourly,
    hoursPerWeek: hours,
    canton: canton as any,
    includeThirteenthSalary: true,
    vacationWeeks: 4,
  });

  return (
    <section className="section section-alt">
      <div className="container">
        <div className="section-header">
          <h2>{t('section.cost')}</h2>
          <p>{t('section.cost.desc')}</p>
        </div>

        <div className="calculator-card" style={{ maxWidth: 680, margin: '0 auto' }}>
          <div className="grid-2" style={{ gap: 24, marginBottom: 24 }}>
            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 500, marginBottom: 10 }}>
                Salaire horaire brut <strong style={{ color: 'var(--color-primary)' }}>CHF {hourly}</strong>
              </label>
              <input type="range" min="15" max="50" step="0.5" value={hourly}
                onChange={(e) => setHourly(Number(e.target.value))} />
            </div>
            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 500, marginBottom: 10 }}>
                Heures / semaine <strong style={{ color: 'var(--color-primary)' }}>{hours}h</strong>
              </label>
              <input type="range" min="1" max="30" step="0.5" value={hours}
                onChange={(e) => setHours(Number(e.target.value))} />
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: 6, display: 'block' }}>Canton</label>
            <select value={canton} onChange={(e) => setCanton(e.target.value)} style={{ maxWidth: 300 }}>
              {CANTONS.map((c) => <option key={c.code} value={c.code}>{c.name} ({c.code})</option>)}
            </select>
          </div>

          <div className="grid-2" style={{ gap: 16, marginBottom: 16 }}>
            <div className="calculator-result">
              <div className="big-number">CHF {costs.totalMonthlyCost.toFixed(0)}</div>
              <div className="label">Coût mensuel employeur</div>
            </div>
            <div className="calculator-result" style={{ background: 'linear-gradient(135deg, #fffbeb, #fef3c7)' }}>
              <div className="big-number" style={{ color: 'var(--color-warning)' }}>CHF {(costs.totalMonthlyCost + PRICING.monthly).toFixed(0)}</div>
              <div className="label">Total avec Aidom inclus</div>
            </div>
          </div>

          <details style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600, padding: '8px 0', color: 'var(--color-text)' }}>
              Voir le détail des charges ▾
            </summary>
            <div style={{ marginTop: 8 }}>
              {costs.breakdown.filter(l => l.type !== 'total').map((line, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid var(--color-border-light)' }}>
                  <span>{line.label}</span>
                  <span style={{ fontWeight: 500 }}>CHF {line.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </details>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Link to="/combien-ca-coute"><button className="btn btn-primary">Analyse complète des coûts →</button></Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// TRANSPARENCY — ce qu'on fait / ce que vous faites
// Inspiré Clino mais ton plus chaleureux
// ============================================
function TransparencySection() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 800 }}>
        <div className="section-header">
          <h2>On est transparents</h2>
          <p>Aidom est votre outil. Vous restez l'employeur — aucune procuration nécessaire.</p>
        </div>

        <div className="grid-2" style={{ gap: 20 }}>
          <div className="card" style={{ padding: 28 }}>
            <h3 style={{ color: 'var(--color-primary)', marginBottom: 14, fontSize: '1rem' }}>
              Aidom s'occupe de
            </h3>
            {['Calcul automatique des cotisations', 'Génération du contrat de travail',
              'Fiches de paie mensuelles en PDF', 'Formulaire AVS pré-rempli',
              'Déclaration annuelle', 'Rappels pour chaque échéance'].map((item, i) => (
              <div key={i} style={{ padding: '7px 0', fontSize: '0.9rem', borderBottom: '1px solid var(--color-border-light)', display: 'flex', gap: 8 }}>
                <span style={{ color: 'var(--color-success)', flexShrink: 0 }}>✓</span>{item}
              </div>
            ))}
            <div style={{ marginTop: 12, fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              Vous économisez 30 à 60 min par mois
            </div>
          </div>

          <div className="card" style={{ padding: 28 }}>
            <h3 style={{ color: 'var(--color-text-secondary)', marginBottom: 14, fontSize: '1rem' }}>
              Ce qui reste de votre côté
            </h3>
            {[
              { task: 'Envoi du formulaire à la caisse AVS', time: '~15 min, 1 fois' },
              { task: 'Signature du contrat', time: '~2 min, 1 fois' },
              { task: 'Saisie des heures chaque mois', time: '~30 sec' },
              { task: 'Transfert du salaire', time: '~1 min' },
            ].map((item, i) => (
              <div key={i} style={{ padding: '7px 0', fontSize: '0.9rem', borderBottom: '1px solid var(--color-border-light)', display: 'flex', justifyContent: 'space-between' }}>
                <span>{item.task}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>{item.time}</span>
              </div>
            ))}
            <div style={{ marginTop: 12, fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              ~20 min au total pour démarrer, puis ~2 min/mois
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// PRICING — simple, une seule formule
// ============================================
function PricingSection() {
  const { t } = useI18n();
  return (
    <section className="section section-alt">
      <div className="container">
        <div className="section-header">
          <h2>{t('section.pricing')}</h2>
          <p>{t('section.pricing.desc')}</p>
        </div>

        <div className="pricing-hero-card">
          <div style={{ textAlign: 'center' }}>
            <span className="badge badge-success" style={{ marginBottom: 12 }}>Essai gratuit 30 jours</span>
            <div style={{ marginBottom: 16 }}>
              <span className="price-tag">
                <sup>CHF</sup> 19<sub>.—{t('pricing.month')}</sub>
              </span>
            </div>
            <p className="text-sm text-muted" style={{ marginBottom: 20 }}>
              Tout inclus. Pas de pourcentage. Pas de surprise.
            </p>
            <ul style={{ listStyle: 'none', textAlign: 'left', marginBottom: 24 }}>
              {PRICING.features.slice(0, 6).map((f, i) => (
                <li key={i} style={{ padding: '8px 0', borderBottom: '1px solid var(--color-border-light)', fontSize: '0.9rem', display: 'flex', gap: 10 }}>
                  <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <Link to="/signup">
              <button className="btn btn-primary btn-lg btn-block">{t('pricing.cta')}</button>
            </Link>
            <p className="text-xs text-muted mt-1">Aucune carte de crédit pour commencer</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// RISK — ton sérieux mais pas alarmiste
// ============================================
function RiskSection() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <h2>Pourquoi déclarer ?</h2>
          <p>Au-delà de l'obligation légale, déclarer protège vous et votre employé(e).</p>
        </div>
        <div className="grid-3" style={{ maxWidth: 800, margin: '0 auto' }}>
          <div className="card" style={{ textAlign: 'center', padding: 24 }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-danger)', marginBottom: 4 }}>CHF 40'000</div>
            <div className="text-sm text-muted">Amende maximale pour travail non déclaré</div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: 24 }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-warning)', marginBottom: 4 }}>5 ans</div>
            <div className="text-sm text-muted">Cotisations rétroactives avec intérêts</div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: 24 }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-success)', marginBottom: 4 }}>Protégé(e)</div>
            <div className="text-sm text-muted">AVS, accidents, droits pour votre employé(e)</div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link to="/guides" className="text-sm" style={{ color: 'var(--color-primary)' }}>
            En savoir plus sur les obligations →
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================
// FEATURES
// ============================================
function FeaturesSection() {
  const { t } = useI18n();
  const features = [
    { icon: '📋', title: 'Contrat de travail', desc: 'Conforme au CO et au contrat-type cantonal. Généré, téléchargé, signé.' },
    { icon: '💰', title: 'Calculateur en temps réel', desc: 'Salaire, charges, coût total — ajustez et voyez le résultat immédiatement.' },
    { icon: '📄', title: 'Fiches de paie PDF', desc: 'Chaque mois, entrez les heures. La fiche se génère automatiquement.' },
    { icon: '✅', title: 'Checklist par canton', desc: 'Les étapes à suivre, personnalisées pour votre canton et votre situation.' },
    { icon: '🔔', title: 'Rappels automatiques', desc: 'AVS, assurance, déclarations — on vous prévient avant chaque échéance.' },
    { icon: '🗂️', title: 'Tout au même endroit', desc: 'Contrats, fiches de paie, rappels, checklist — un seul tableau de bord.' },
  ];

  return (
    <section className="section section-alt">
      <div className="container">
        <div className="section-header">
          <h2>{t('section.features')}</h2>
          <p>{t('section.features.desc')}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {features.map((f, i) => (
            <div key={i} className="card card-feature">
              <div className="icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// GUIDES PREVIEW
// ============================================
function GuidesPreview() {
  const { t } = useI18n();
  const guides = [
    { cat: 'Guide', title: 'Déclarer votre aide ménagère en 5 étapes', desc: 'Le guide complet pour être en règle.', time: '8 min' },
    { cat: 'Coûts', title: 'Combien coûte une femme de ménage ?', desc: 'Salaire, charges, le vrai calcul.', time: '6 min' },
    { cat: 'Droit', title: 'Le contrat de travail expliqué', desc: 'Clauses, modèles, spécificités cantonales.', time: '7 min' },
  ];

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <h2>{t('section.guides')}</h2>
          <p>{t('section.guides.desc')}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {guides.map((g, i) => (
            <Link key={i} to="/guides" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="guide-card">
                <div className="category">{g.cat}</div>
                <h3>{g.title}</h3>
                <p>{g.desc}</p>
                <div className="meta"><span>⏱ {g.time}</span></div>
              </div>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link to="/guides"><button className="btn btn-secondary btn-sm">Tous les articles →</button></Link>
        </div>
      </div>
    </section>
  );
}

// ============================================
// FAQ
// ============================================
function FAQSection() {
  const { t } = useI18n();
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs = [
    { q: 'Suis-je obligé(e) de déclarer mon aide ménagère ?', a: 'Oui, en Suisse, c\'est une obligation dès la première heure de travail. Aidom rend cette démarche simple et rapide.' },
    { q: 'Combien coûte Aidom ?', a: 'CHF 19.—/mois, prix fixe. Pas de pourcentage, pas de frais cachés. Les 30 premiers jours sont gratuits, sans carte de crédit.' },
    { q: 'Puis-je résilier à tout moment ?', a: 'Oui, sans condition. La résiliation prend effet à la fin du mois en cours.' },
    { q: 'Aidom fonctionne-t-il dans mon canton ?', a: 'Oui, les 26 cantons suisses sont couverts avec les taux corrects de chaque caisse.' },
    { q: 'Combien d\'employés puis-je gérer ?', a: 'Autant que vous voulez, sans surcoût.' },
    { q: 'Mes données sont-elles protégées ?', a: 'Oui. Hébergement en Suisse, conforme à la nLPD. Vos données ne sont jamais partagées.' },
  ];

  return (
    <section className="section section-alt" id="faq">
      <div className="container" style={{ maxWidth: 700 }}>
        <div className="section-header">
          <h2>{t('section.faq')}</h2>
        </div>
        {faqs.map((faq, i) => (
          <div key={i} className="faq-item">
            <button className={`faq-question ${openIdx === i ? 'open' : ''}`}
              onClick={() => setOpenIdx(openIdx === i ? null : i)}>
              {faq.q}
              <span className="chevron">▼</span>
            </button>
            {openIdx === i && <div className="faq-answer">{faq.a}</div>}
          </div>
        ))}
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link to="/faq" className="text-sm" style={{ color: 'var(--color-primary)' }}>Voir toutes les questions →</Link>
        </div>
      </div>
    </section>
  );
}

// ============================================
// CTA BANNER
// ============================================
function CTABanner() {
  const { t } = useI18n();
  return (
    <section style={{
      background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))',
      padding: '60px 20px', textAlign: 'center', color: '#fff',
    }}>
      <div className="container">
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: 12 }}>
          Prêt(e) à simplifier tout ça ?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 480, margin: '0 auto 24px' }}>
          Commencez gratuitement. Aucune carte requise. Résiliable quand vous voulez.
        </p>
        <Link to="/signup"><button className="btn btn-white btn-lg">{t('hero.cta1')} →</button></Link>
      </div>
    </section>
  );
}
