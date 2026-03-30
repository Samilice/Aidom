import { useState } from 'react';

export function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <div>
      <section style={{
        background: 'linear-gradient(135deg, #0f172a, #1a56db)',
        color: '#fff', padding: '80px 20px', textAlign: 'center',
      }}>
        <div className="container">
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 12 }}>Contact</h1>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)' }}>
            Des questions ? Nous sommes là pour vous.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <div className="grid-3" style={{ marginBottom: 40 }}>
            <div className="card" style={{ textAlign: 'center', padding: 28 }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>✉️</div>
              <h3 style={{ fontSize: '1rem', marginBottom: 4 }}>Email</h3>
              <p className="text-sm text-muted">contact@aidom.ch</p>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: 28 }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>💬</div>
              <h3 style={{ fontSize: '1rem', marginBottom: 4 }}>Réponse</h3>
              <p className="text-sm text-muted">Sous 24 heures</p>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: 28 }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>🌍</div>
              <h3 style={{ fontSize: '1rem', marginBottom: 4 }}>Langues</h3>
              <p className="text-sm text-muted">FR, DE, EN, IT, ES</p>
            </div>
          </div>

          <div className="card" style={{ maxWidth: 560, margin: '0 auto', padding: 32 }}>
            <h2 style={{ marginBottom: 20 }}>Nous écrire</h2>

            {sent ? (
              <div className="alert alert-success">
                Merci ! Votre message a été envoyé. Nous vous répondrons sous 24 heures.
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Prénom</label>
                    <input required />
                  </div>
                  <div className="form-group">
                    <label>Nom</label>
                    <input required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" required placeholder="votre@email.ch" />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea rows={5} required placeholder="Comment pouvons-nous vous aider ?" />
                </div>
                <button type="submit" className="btn btn-primary btn-block">Envoyer le message</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
