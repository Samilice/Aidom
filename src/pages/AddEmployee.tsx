import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useStore } from '../lib/store';
import type { EmployeeType } from '../types';

export function AddEmployee() {
  const navigate = useNavigate();
  const { loadEmployees } = useStore();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: 'Suisse',
    permitType: '',
    avsNumber: '',
    type: 'menage' as EmployeeType,
    grossHourlyRate: '28',
    hoursPerWeek: '8',
    startDate: '',
  });

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await api.createEmployee({
      ...form,
      grossHourlyRate: Number(form.grossHourlyRate),
      hoursPerWeek: Number(form.hoursPerWeek),
    });
    setLoading(false);

    if (res.success) {
      await loadEmployees();
      navigate('/dashboard');
    } else {
      setError(res.error || 'Erreur');
    }
  };

  return (
    <div className="container page" style={{ maxWidth: 560 }}>
      <div className="page-header">
        <h1>Ajouter un employé</h1>
        <p>Renseignez les informations de votre employé(e) à domicile.</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Type d'emploi</label>
            <select value={form.type} onChange={update('type')}>
              <option value="menage">Ménage / aide ménagère</option>
              <option value="nounou">Nounou / garde d'enfants</option>
              <option value="babysitter">Babysitter</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Prénom</label>
              <input value={form.firstName} onChange={update('firstName')} required />
            </div>
            <div className="form-group">
              <label>Nom</label>
              <input value={form.lastName} onChange={update('lastName')} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date de naissance</label>
              <input type="date" value={form.dateOfBirth} onChange={update('dateOfBirth')} required />
            </div>
            <div className="form-group">
              <label>Nationalité</label>
              <input value={form.nationality} onChange={update('nationality')} />
            </div>
          </div>

          <div className="form-group">
            <label>Type de permis (si applicable)</label>
            <select value={form.permitType} onChange={update('permitType')}>
              <option value="">Suisse / Permis C</option>
              <option value="B">Permis B</option>
              <option value="L">Permis L</option>
              <option value="F">Permis F</option>
              <option value="N">Permis N</option>
              <option value="other">Autre</option>
            </select>
          </div>

          <div className="form-group">
            <label>N° AVS (optionnel)</label>
            <input value={form.avsNumber} onChange={update('avsNumber')}
              placeholder="756.xxxx.xxxx.xx" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Salaire horaire brut (CHF)</label>
              <input type="number" step="0.5" min="1" value={form.grossHourlyRate}
                onChange={update('grossHourlyRate')} required />
            </div>
            <div className="form-group">
              <label>Heures par semaine</label>
              <input type="number" step="0.5" min="1" max="40" value={form.hoursPerWeek}
                onChange={update('hoursPerWeek')} required />
            </div>
          </div>

          <div className="form-group">
            <label>Date de début</label>
            <input type="date" value={form.startDate} onChange={update('startDate')} required />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="button" className="btn btn-secondary" style={{ flex: 1 }}
              onClick={() => navigate('/dashboard')}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={loading}>
              {loading ? 'Ajout...' : 'Ajouter l\'employé'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
