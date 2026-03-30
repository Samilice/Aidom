import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useStore } from '../lib/store';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await api.login({ email, password });
    setLoading(false);

    if (res.success && res.data) {
      const { user, token } = res.data as any;
      setAuth(user, token);
      navigate('/dashboard');
    } else {
      setError(res.error || 'Erreur de connexion');
    }
  };

  return (
    <div className="container page" style={{ maxWidth: 420, paddingTop: 60 }}>
      <div className="card">
        <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>Connexion</h1>
        <p className="text-muted text-sm mb-3">Accédez à votre espace Aidom</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.ch" required />
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 caractères" required />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="text-sm text-center mt-2">
          Pas encore de compte ? <Link to="/signup">Créer un compte</Link>
        </p>
      </div>
    </div>
  );
}
