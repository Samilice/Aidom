import { Link } from 'react-router-dom';

export function About() {
  return (
    <div>
      <section style={{
        background: 'linear-gradient(135deg, #0f172a, #1a56db)',
        color: '#fff', padding: '80px 20px', textAlign: 'center',
      }}>
        <div className="container">
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 12 }}>À propos d'Aidom</h1>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', maxWidth: 560, margin: '0 auto' }}>
            Rendre l'emploi à domicile simple et légal pour tous les particuliers en Suisse.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 720 }}>
          <div className="card" style={{ padding: 32 }}>
            <h2 style={{ marginBottom: 16 }}>Notre histoire</h2>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 16 }}>
              En Suisse, des milliers de particuliers emploient une aide ménagère, une nounou ou
              un babysitter. Pourtant, les démarches administratives restent compliquées :
              cotisations AVS, contrat de travail, assurance accidents, déclarations annuelles...
            </p>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 16 }}>
              Aidom est né d'un constat simple : il devrait être plus facile d'employer quelqu'un
              correctement que de ne pas le déclarer. Notre mission est de supprimer toutes les
              frictions administratives pour que chaque employeur puisse être en règle en quelques
              minutes.
            </p>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
              Conçu et développé en Suisse, Aidom couvre les 26 cantons avec les taux corrects
              et les spécificités de chaque caisse de compensation. Un prix fixe, pas de pourcentage,
              pas de surprise.
            </p>
          </div>

          <div className="grid-3 mt-4">
            <div className="stat-card card">
              <div className="stat-value">26</div>
              <div className="stat-label">Cantons couverts</div>
            </div>
            <div className="stat-card card">
              <div className="stat-value">5 min</div>
              <div className="stat-label">Pour démarrer</div>
            </div>
            <div className="stat-card card">
              <div className="stat-value">CHF 19.—</div>
              <div className="stat-label">Par mois, tout inclus</div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/mission"><button className="btn btn-primary btn-lg">Découvrir notre mission →</button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
