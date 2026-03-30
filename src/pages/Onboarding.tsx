import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useStore } from '../lib/store';
import { CANTONS as ALL_CANTONS } from '../lib/cantons';
import type { Canton } from '../types';

export function Onboarding() {
  const { user, setEmployer } = useStore();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    address: '',
    postalCode: '',
    city: '',
    canton: 'GE' as Canton,
    phone: '',
    avsNumber: '',
  });

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await api.createEmployer(form);
    setLoading(false);

    if (res.success && res.data) {
      setEmployer(res.data as any);
      navigate('/dashboard');
    } else {
      setError(res.error || 'Erreur lors de la création du dossier');
    }
  };

  return (
    <div className="container page" style={{ maxWidth: 560 }}>
      <div className="page-header" style={{ textAlign: 'center' }}>
        <h1>Créer votre dossier employeur</h1>
        <p>Ces informations sont nécessaires pour vos documents (contrat, fiches de paie).</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>
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

          <div className="form-group">
            <label>Adresse</label>
            <input value={form.address} onChange={update('address')}
              placeholder="Rue et numéro" required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Code postal</label>
              <input value={form.postalCode} onChange={update('postalCode')}
                placeholder="1200" required />
            </div>
            <div className="form-group">
              <label>Ville</label>
              <input value={form.city} onChange={update('city')} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Canton</label>
              <select value={form.canton} onChange={update('canton')}>
                {ALL_CANTONS.map((c) => (
                  <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Téléphone</label>
              <input value={form.phone} onChange={update('phone')}
                placeholder="+41 79 123 45 67" required />
            </div>
          </div>

          <div className="form-group">
            <label>N° AVS (optionnel)</label>
            <input value={form.avsNumber} onChange={update('avsNumber')}
              placeholder="756.xxxx.xxxx.xx" />
            <div className="hint">Vous pourrez l'ajouter plus tard si vous ne l'avez pas sous la main.</div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Création...' : 'Créer mon dossier'}
          </button>
        </form>
      </div>
    </div>
  );
}
