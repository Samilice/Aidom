import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useStore } from '../lib/store';
import { calculateCosts } from '../domain/calculations';
import type { Employee } from '../types';

export function EmployeeDetail() {
  const { id } = useParams<{ id: string }>();
  const { employer } = useStore();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [docHtml, setDocHtml] = useState<string | null>(null);
  const [docType, setDocType] = useState<'contract' | 'payslip' | null>(null);
  const [payslipMonth, setPayslipMonth] = useState(new Date().getMonth() + 1);
  const [payslipYear, setPayslipYear] = useState(new Date().getFullYear());

  useEffect(() => {
    async function load() {
      if (!id) return;
      const res = await api.getEmployee(id);
      if (res.success && res.data) {
        setEmployee(res.data as Employee);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <div className="container page text-center text-muted">Chargement...</div>;
  if (!employee) return <div className="container page text-center text-muted">Employé non trouvé</div>;

  const costs = employer ? calculateCosts({
    grossHourlyRate: employee.grossHourlyRate,
    hoursPerWeek: employee.hoursPerWeek,
    canton: employer.canton as any,
    includeThirteenthSalary: true,
    vacationWeeks: 4,
  }) : null;

  const handleGenerateContract = async () => {
    if (!id) return;
    setDocType('contract');
    const res = await api.generateContract(id);
    if (res.success && res.data) {
      setDocHtml(res.data as string);
    }
  };

  const handleGeneratePayslip = async () => {
    if (!id) return;
    setDocType('payslip');
    const res = await api.generatePayslip(id, { month: payslipMonth, year: payslipYear });
    if (res.success && res.data) {
      setDocHtml(res.data as string);
    }
  };

  const handlePrint = () => {
    if (!docHtml) return;
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(docHtml);
      win.document.close();
      win.print();
    }
  };

  return (
    <div className="container page">
      <div className="page-header">
        <Link to="/dashboard" className="text-sm">&larr; Retour au tableau de bord</Link>
        <h1 style={{ marginTop: 8 }}>{employee.firstName} {employee.lastName}</h1>
        <p>
          {TYPE_LABELS[employee.type]} — {employee.hoursPerWeek}h/semaine — CHF {employee.grossHourlyRate.toFixed(2)}/h
        </p>
      </div>

      {/* Info card */}
      <div className="card">
        <div className="card-header">
          <h2>Informations</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Info label="Date de naissance" value={employee.dateOfBirth} />
          <Info label="Nationalité" value={employee.nationality} />
          <Info label="N° AVS" value={employee.avsNumber || '—'} />
          <Info label="Date de début" value={employee.startDate} />
          <Info label="Statut" value={employee.status === 'active' ? 'Actif' : 'Terminé'} />
          {employee.permitType && <Info label="Permis" value={employee.permitType} />}
        </div>
      </div>

      {/* Cost card */}
      {costs && (
        <div className="card">
          <div className="card-header">
            <h2>Coûts employeur</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ textAlign: 'center', padding: 16, background: 'var(--color-primary-light)', borderRadius: 'var(--radius)' }}>
              <div className="text-sm text-muted">Par mois</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                CHF {costs.totalMonthlyCost.toFixed(2)}
              </div>
            </div>
            <div style={{ textAlign: 'center', padding: 16, background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius)' }}>
              <div className="text-sm text-muted">Par an</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                CHF {costs.totalAnnualCost.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Documents */}
      <div className="card">
        <div className="card-header">
          <h2>Documents</h2>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
          <button className="btn btn-primary btn-sm" onClick={handleGenerateContract}>
            Générer le contrat
          </button>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <select value={payslipMonth} onChange={(e) => setPayslipMonth(Number(e.target.value))}
              style={{ width: 120, padding: '6px 10px', fontSize: '0.85rem' }}>
              {MONTHS.map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>
            <input type="number" value={payslipYear} onChange={(e) => setPayslipYear(Number(e.target.value))}
              style={{ width: 80, padding: '6px 10px', fontSize: '0.85rem' }} />
            <button className="btn btn-primary btn-sm" onClick={handleGeneratePayslip}>
              Fiche de paie
            </button>
          </div>
        </div>

        {docHtml && (
          <div>
            <div className="flex-between mb-2">
              <span className="badge badge-info">
                {docType === 'contract' ? 'Contrat' : 'Fiche de paie'}
              </span>
              <button className="btn btn-secondary btn-sm" onClick={handlePrint}>
                Imprimer / PDF
              </button>
            </div>
            <div style={{
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              padding: 16,
              maxHeight: 500,
              overflow: 'auto',
              background: '#fff',
            }}>
              <iframe
                srcDoc={docHtml}
                style={{ width: '100%', height: 450, border: 'none' }}
                title="Document preview"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-sm text-muted">{label}</div>
      <div style={{ fontWeight: 500 }}>{value}</div>
    </div>
  );
}

const TYPE_LABELS: Record<string, string> = {
  menage: 'Ménage',
  nounou: 'Nounou',
  babysitter: 'Babysitter',
};

const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];
