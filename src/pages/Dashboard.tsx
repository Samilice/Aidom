import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import { api } from '../lib/api';
import { calculateCosts } from '../domain/calculations';
import type { Reminder, ChecklistItem } from '../types';

export function Dashboard() {
  const { user, employer, employees, loadEmployer, loadEmployees } = useStore();
  const navigate = useNavigate();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      await loadEmployer();
      await loadEmployees();

      const [remRes, chkRes] = await Promise.all([
        api.getReminders(),
        api.getChecklist(),
      ]);
      if (remRes.success) setReminders(remRes.data as Reminder[]);
      if (chkRes.success) setChecklist(chkRes.data as ChecklistItem[]);
      setLoading(false);
    }
    load();
  }, []);

  // Redirect to onboarding if no employer profile
  useEffect(() => {
    if (!loading && !employer) {
      navigate('/onboarding');
    }
  }, [loading, employer]);

  if (loading) {
    return (
      <div className="container page text-center">
        <p className="text-muted">Chargement de votre espace...</p>
      </div>
    );
  }

  if (!employer) return null;

  const pendingReminders = reminders.filter((r) => r.status === 'pending');
  const completedChecklist = checklist.filter((c) => c.completed).length;
  const totalChecklist = checklist.length;

  // Cost summary
  const costSummary = employees.length > 0
    ? employees.reduce((acc, emp) => {
        const costs = calculateCosts({
          grossHourlyRate: emp.grossHourlyRate,
          hoursPerWeek: emp.hoursPerWeek,
          canton: employer.canton as any,
          includeThirteenthSalary: true,
          vacationWeeks: 4,
        });
        return {
          monthly: acc.monthly + costs.totalMonthlyCost,
          annual: acc.annual + costs.totalAnnualCost,
        };
      }, { monthly: 0, annual: 0 })
    : null;

  return (
    <div className="container page">
      <div className="page-header flex-between">
        <div>
          <h1>Bonjour {employer.firstName}</h1>
          <p>Votre espace employeur — {employer.canton}</p>
        </div>
        {!user?.plan && (
          <Link to="/pricing">
            <button className="btn btn-primary btn-sm">Choisir une formule</button>
          </Link>
        )}
      </div>

      {/* Plan status */}
      {user?.plan ? (
        <div className="alert alert-success" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Formule {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} active</span>
          <span className="badge badge-success">Actif</span>
        </div>
      ) : (
        <div className="alert alert-warning">
          Vous utilisez la version gratuite. <Link to="/pricing">Passez à une formule payante</Link> pour accéder aux contrats, fiches de paie et rappels.
        </div>
      )}

      {/* Cost summary */}
      {costSummary && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          marginBottom: 24,
        }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div className="text-sm text-muted">Coût mensuel total</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>
              CHF {costSummary.monthly.toFixed(0)}
            </div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div className="text-sm text-muted">Coût annuel estimé</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              CHF {costSummary.annual.toFixed(0)}
            </div>
          </div>
        </div>
      )}

      {/* Employees */}
      <div className="card">
        <div className="card-header flex-between">
          <h2>Employés ({employees.length})</h2>
          <Link to="/employees/add">
            <button className="btn btn-primary btn-sm">Ajouter</button>
          </Link>
        </div>

        {employees.length === 0 ? (
          <div className="empty-state">
            <h3>Aucun employé</h3>
            <p>Ajoutez votre premier employé pour commencer.</p>
            <Link to="/employees/add">
              <button className="btn btn-primary">Ajouter un employé</button>
            </Link>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Type</th>
                  <th>Heures/sem</th>
                  <th>Salaire horaire</th>
                  <th>Statut</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>{emp.firstName} {emp.lastName}</td>
                    <td>{TYPE_LABELS[emp.type]}</td>
                    <td>{emp.hoursPerWeek}h</td>
                    <td>CHF {emp.grossHourlyRate.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${emp.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                        {emp.status === 'active' ? 'Actif' : 'Terminé'}
                      </span>
                    </td>
                    <td>
                      <Link to={`/employees/${emp.id}`} className="text-sm">Détails</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reminders */}
      {pendingReminders.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2>Rappels à venir ({pendingReminders.length})</h2>
          </div>
          {pendingReminders.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 0',
              borderBottom: '1px solid var(--color-border-light)',
            }}>
              <div>
                <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{r.title}</div>
                <div className="text-sm text-muted">{r.dueDate}</div>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={async () => {
                  await api.updateReminderStatus(r.id, 'done');
                  setReminders(reminders.map((rem) =>
                    rem.id === r.id ? { ...rem, status: 'done' as const } : rem
                  ));
                }}
              >
                Fait
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Checklist progress */}
      {totalChecklist > 0 && (
        <div className="card">
          <div className="card-header flex-between">
            <h2>Checklist administrative</h2>
            <Link to="/checklist" className="text-sm">Voir tout</Link>
          </div>
          <div style={{
            background: 'var(--color-bg-secondary)',
            borderRadius: 'var(--radius)',
            height: 8,
            overflow: 'hidden',
            marginBottom: 8,
          }}>
            <div style={{
              background: 'var(--color-success)',
              height: '100%',
              width: `${(completedChecklist / totalChecklist) * 100}%`,
              borderRadius: 'var(--radius)',
              transition: 'width 0.3s',
            }} />
          </div>
          <p className="text-sm text-muted">
            {completedChecklist} sur {totalChecklist} étapes complétées
          </p>
        </div>
      )}

      {/* Quick actions */}
      {user?.plan && employees.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2>Actions rapides</h2>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to={`/employees/${employees[0].id}`}>
              <button className="btn btn-secondary btn-sm">Générer un contrat</button>
            </Link>
            <Link to={`/employees/${employees[0].id}`}>
              <button className="btn btn-secondary btn-sm">Créer une fiche de paie</button>
            </Link>
            <Link to="/checklist">
              <button className="btn btn-secondary btn-sm">Voir la checklist</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

const TYPE_LABELS: Record<string, string> = {
  menage: 'Ménage',
  nounou: 'Nounou',
  babysitter: 'Babysitter',
};
