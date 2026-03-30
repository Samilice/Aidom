import { Link } from 'react-router-dom';

export function Mission() {
  return (
    <div>
      <section style={{
        background: 'linear-gradient(135deg, #0f172a, #1a56db)',
        color: '#fff', padding: '80px 20px', textAlign: 'center',
      }}>
        <div className="container">
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 12 }}>Notre mission</h1>
          <p style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.7)', maxWidth: 600, margin: '0 auto' }}>
            Faire de l'emploi légal le choix le plus simple pour chaque foyer suisse.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 720 }}>

          <div className="card" style={{ padding: 32, marginBottom: 24 }}>
            <h2 style={{ marginBottom: 16, color: 'var(--color-danger)' }}>Le problème</h2>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, fontSize: '1.05rem' }}>
              On estime que plus de 250'000 ménages en Suisse emploient une aide à domicile
              sans la déclarer. Non pas par mauvaise volonté, mais parce que les démarches
              semblent trop compliquées : formulaires AVS, calcul des cotisations, contrat-type
              cantonal, assurance accidents, déclarations annuelles...
            </p>
          </div>

          <div className="card" style={{ padding: 32, marginBottom: 24 }}>
            <h2 style={{ marginBottom: 16, color: 'var(--color-success)' }}>Notre solution</h2>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, fontSize: '1.05rem' }}>
              Aidom réduit ce processus à 5 minutes. Pas de jargon, pas de formulaires papier,
              pas de calculs manuels. Vous entrez vos données, Aidom génère tout le reste :
              contrat, fiches de paie, calculs de cotisations, rappels d'échéances.
            </p>
          </div>

          <div className="card" style={{ padding: 32 }}>
            <h2 style={{ marginBottom: 16 }}>Nos valeurs</h2>
            <div style={{ display: 'grid', gap: 20 }}>
              {[
                { title: 'Protection des travailleurs', desc: 'En déclarant votre employé(e), vous lui garantissez l\'AVS, l\'assurance accidents et un contrat. C\'est un droit fondamental.' },
                { title: 'Simplicité radicale', desc: 'Si c\'est compliqué, les gens ne le font pas. Chaque écran d\'Aidom ne demande qu\'une seule action.' },
                { title: 'Transparence totale', desc: 'Un prix fixe de CHF 19/mois. Pas de pourcentage, pas de frais cachés, pas de petites lignes.' },
              ].map((v, i) => (
                <div key={i}>
                  <h3 style={{ fontSize: '1rem', marginBottom: 4 }}>{v.title}</h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/signup"><button className="btn btn-primary btn-lg">Commencer gratuitement →</button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
