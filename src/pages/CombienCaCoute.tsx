import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CANTONS } from '../lib/cantons';
import { calculateCosts } from '../domain/calculations';
import { PRICING } from '../lib/pricing';

export function CombienCaCoute() {
  const [hourly, setHourly] = useState(28);
  const [hours, setHours] = useState(4);
  const [canton, setCanton] = useState('GE');

  const costs = calculateCosts({
    grossHourlyRate: hourly,
    hoursPerWeek: hours,
    canton: canton as any,
    includeThirteenthSalary: true,
    vacationWeeks: 4,
  });

  const weeklyGross = hourly * hours;
  const monthlyGross = costs.grossMonthlySalary;
  const netToEmployee = monthlyGross * (1 - 0.053 - 0.011); // simplified

  return (
    <div>
      <section style={{
        background: 'linear-gradient(135deg, #0f172a, #1a56db)',
        color: '#fff', padding: '80px 20px', textAlign: 'center',
      }}>
        <div className="container">
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 12 }}>
            Combien ça coûte <span style={{ color: '#fbbf24' }}>vraiment</span> ?
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', maxWidth: 560, margin: '0 auto' }}>
            Le vrai coût d'une aide ménagère en Suisse, charges sociales comprises.
            Pas de mauvaise surprise.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          {/* Calculator */}
          <div className="calculator-card">
            <h2 style={{ marginBottom: 24, textAlign: 'center' }}>Simulez votre situation</h2>

            <div className="grid-3" style={{ gap: 24, marginBottom: 32 }}>
              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 500, marginBottom: 8, fontSize: '0.875rem' }}>
                  Salaire horaire <strong style={{ color: 'var(--color-primary)' }}>CHF {hourly}</strong>
                </label>
                <input type="range" min="15" max="50" step="0.5" value={hourly}
                  onChange={(e) => setHourly(Number(e.target.value))} />
              </div>
              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 500, marginBottom: 8, fontSize: '0.875rem' }}>
                  Heures/semaine <strong style={{ color: 'var(--color-primary)' }}>{hours}h</strong>
                </label>
                <input type="range" min="1" max="30" step="0.5" value={hours}
                  onChange={(e) => setHours(Number(e.target.value))} />
              </div>
              <div>
                <label style={{ fontWeight: 500, marginBottom: 8, fontSize: '0.875rem', display: 'block' }}>Canton</label>
                <select value={canton} onChange={(e) => setCanton(e.target.value)}>
                  {CANTONS.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
                </select>
              </div>
            </div>

            {/* Results */}
            <div className="grid-3" style={{ gap: 16, marginBottom: 24 }}>
              <div className="calculator-result" style={{ background: '#ecfdf5' }}>
                <div className="label">Salaire net employé</div>
                <div className="big-number" style={{ color: 'var(--color-success)', fontSize: '2rem' }}>CHF {netToEmployee.toFixed(0)}</div>
              </div>
              <div className="calculator-result">
                <div className="label">Coût total employeur</div>
                <div className="big-number" style={{ fontSize: '2rem' }}>CHF {costs.totalMonthlyCost.toFixed(0)}</div>
              </div>
              <div className="calculator-result" style={{ background: '#fffbeb' }}>
                <div className="label">Avec Aidom</div>
                <div className="big-number" style={{ color: 'var(--color-warning)', fontSize: '2rem' }}>CHF {(costs.totalMonthlyCost + PRICING.monthly).toFixed(0)}</div>
              </div>
            </div>

            {/* Breakdown */}
            <h3 style={{ marginBottom: 12, fontSize: '1rem' }}>Détail mensuel</h3>
            <div style={{ fontSize: '0.875rem' }}>
              {costs.breakdown.map((line, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between',
                  borderBottom: '1px solid var(--color-border-light)',
                  fontWeight: line.type === 'total' ? 700 : 400,
                  background: line.type === 'total' ? 'var(--color-bg-secondary)' : 'transparent',
                  padding: line.type === 'total' ? '10px 12px' : '8px 0',
                  borderRadius: line.type === 'total' ? 'var(--radius)' : 0,
                  marginTop: line.type === 'total' ? 8 : 0,
                }}>
                  <span>{line.label}</span>
                  <span>CHF {line.amount.toFixed(2)}{line.rate ? ` (${line.rate.toFixed(1)}%)` : ''}</span>
                </div>
              ))}
              <div style={{
                display: 'flex', justifyContent: 'space-between', padding: '10px 12px',
                background: 'var(--color-primary-light)', borderRadius: 'var(--radius)', marginTop: 8,
                fontWeight: 600, color: 'var(--color-primary)',
              }}>
                <span>Abonnement Aidom</span>
                <span>CHF {PRICING.monthly.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Link to="/signup"><button className="btn btn-primary btn-lg">Commencer — 30 jours gratuits →</button></Link>
            </div>
          </div>

          {/* Explanation */}
          <div className="card mt-4" style={{ padding: 32 }}>
            <h2 style={{ marginBottom: 16 }}>Ce que comprend le coût employeur</h2>
            <p className="text-muted mb-3">
              En plus du salaire brut, l'employeur doit payer des cotisations sociales obligatoires.
              Voici les postes principaux :
            </p>
            <div style={{ display: 'grid', gap: 12 }}>
              {[
                { name: 'AVS / AI / APG', rate: '5.3%', desc: 'Assurance vieillesse, invalidité, pertes de gain' },
                { name: 'Assurance chômage (AC)', rate: '1.1%', desc: 'Cotisation employeur obligatoire' },
                { name: 'Assurance accidents (LAA)', rate: '~0.7%', desc: 'Obligatoire dès la 1ère heure de travail' },
                { name: 'Allocations familiales', rate: '1.5-2.4%', desc: 'Variable selon le canton' },
                { name: 'Provision vacances', rate: '8.33%', desc: '4 semaines de vacances (minimum légal)' },
                { name: '13ème salaire', rate: '8.33%', desc: 'Si prévu au contrat (recommandé)' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--color-border-light)' }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>{item.name}</div>
                    <div className="text-xs text-muted">{item.desc}</div>
                  </div>
                  <span className="badge badge-info">{item.rate}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="alert alert-info mt-3">
            Les taux ci-dessus sont des estimations basées sur les données OFAS/BSV 2025.
            Les montants exacts dépendent de votre caisse de compensation cantonale.
          </div>
        </div>
      </section>
    </div>
  );
}
