import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useStore } from '../lib/store';

export function Signup() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useStore();
  const navigate = useNavigate();

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await api.signup(form);
    setLoading(false);

    if (res.success && res.data) {
      const { user, token } = res.data as any;
      setAuth(user, token);
      navigate('/onboarding');
    } else {
      setError(res.error || 'Erreur lors de la création du compte');
    }
  };

  return (
    <div className="container page" style={{ maxWidth: 420, paddingTop: 60 }}>
      <div className="card">
        <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>Créer votre compte</h1>
        <p className="text-muted text-sm mb-3">Commencez à gérer votre employé simplement</p>

        {error && <div className="alert alert-danger">{error}</div>}

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
            <label>Email</label>
            <input type="email" value={form.email} onChange={update('email')}
              placeholder="votre@email.ch" required />
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input type="password" value={form.password} onChange={update('password')}
              placeholder="Minimum 8 caractères" required minLength={8} />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        <p className="text-sm text-center mt-2">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
