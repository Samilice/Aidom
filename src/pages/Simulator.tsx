import { useState } from 'react';
import { calculateCosts } from '../domain/calculations';
import { CANTONS } from '../lib/cantons';
import type { CostSimulation } from '../types';

export function Simulator() {
  const [form, setForm] = useState({
    grossHourlyRate: '28',
    hoursPerWeek: '8',
    canton: 'GE',
    includeThirteenthSalary: true,
    vacationWeeks: 4,
  });
  const [result, setResult] = useState<CostSimulation | null>(null);

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const val = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm({ ...form, [field]: val });
    setResult(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sim = calculateCosts({
      grossHourlyRate: Number(form.grossHourlyRate),
      hoursPerWeek: Number(form.hoursPerWeek),
      canton: form.canton as any,
      includeThirteenthSalary: form.includeThirteenthSalary,
      vacationWeeks: form.vacationWeeks,
    });
    setResult(sim);
  };

  return (
    <div>
      <section style={{
        background: 'linear-gradient(135deg, #0f172a, #1a56db)',
        color: '#fff', padding: '60px 20px', textAlign: 'center',
      }}>
        <div className="container">
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>
            Calculateur de coûts employeur
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>
            Estimez votre coût total en tant qu'employeur. Gratuit, sans inscription.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 740 }}>
          <div className="calculator-card">
            <form onSubmit={handleSubmit}>
              <div className="form-row" style={{ marginBottom: 20 }}>
                <div className="form-group">
                  <label>Salaire horaire brut (CHF)</label>
                  <input type="number" step="0.5" min="1" value={form.grossHourlyRate}
                    onChange={update('grossHourlyRate')} required />
                  <div className="hint">Salaire minimum recommandé : CHF 21-30/h selon le canton</div>
                </div>
                <div className="form-group">
                  <label>Heures par semaine</label>
                  <input type="number" step="0.5" min="1" max="40" value={form.hoursPerWeek}
                    onChange={update('hoursPerWeek')} required />
                </div>
              </div>

              <div className="form-row" style={{ marginBottom: 20 }}>
                <div className="form-group">
                  <label>Canton</label>
                  <select value={form.canton} onChange={update('canton')}>
                    {CANTONS.map((c) => (
                      <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Semaines de vacances</label>
                  <select value={form.vacationWeeks}
                    onChange={(e) => setForm({ ...form, vacationWeeks: Number(e.target.value) })}>
                    <option value={4}>4 semaines</option>
                    <option value={5}>5 semaines</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 24 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" checked={form.includeThirteenthSalary}
                    onChange={update('includeThirteenthSalary')} style={{ width: 'auto' }} />
                  Inclure le 13ème salaire
                </label>
              </div>

              <button type="submit" className="btn btn-primary btn-lg btn-block">
                Calculer mon coût →
              </button>
            </form>
          </div>

          {result && (
            <div className="card mt-3" style={{ padding: 32 }}>
              <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Résultat de la simulation</h2>

              <div className="grid-2" style={{ gap: 16, marginBottom: 28 }}>
                <div className="calculator-result">
                  <div className="label">Coût mensuel total</div>
                  <div className="big-number">CHF {result.totalMonthlyCost.toFixed(2)}</div>
                </div>
                <div className="calculator-result" style={{ background: 'linear-gradient(135deg, #fffbeb, #fef3c7)' }}>
                  <div className="label">Coût annuel total</div>
                  <div className="big-number" style={{ color: 'var(--color-warning)' }}>CHF {result.totalAnnualCost.toFixed(2)}</div>
                </div>
              </div>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Poste</th>
                      <th style={{ textAlign: 'right' }}>Taux</th>
                      <th style={{ textAlign: 'right' }}>Montant/mois</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.breakdown.map((line, i) => (
                      <tr key={i} style={line.type === 'total' ? { fontWeight: 700, background: 'var(--color-bg-secondary)' } : {}}>
                        <td>{line.label}</td>
                        <td style={{ textAlign: 'right' }}>{line.rate !== null ? `${line.rate.toFixed(1)}%` : ''}</td>
                        <td style={{ textAlign: 'right' }}>CHF {line.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="alert alert-info mt-2" style={{ fontSize: '0.82rem' }}>
                Estimation basée sur les taux OFAS/BSV 2025. Les montants réels peuvent varier
                selon votre caisse de compensation. Ce simulateur ne constitue pas un conseil fiscal.
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
