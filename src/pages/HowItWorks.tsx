import { Link } from 'react-router-dom';

export function HowItWorks() {
  return (
    <div>
      <section style={{
        background: 'linear-gradient(135deg, #0f172a, #1a56db)',
        color: '#fff', padding: '80px 20px', textAlign: 'center',
      }}>
        <div className="container">
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 12 }}>Comment ça marche</h1>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', maxWidth: 520, margin: '0 auto' }}>
            En quatre étapes, votre employé(e) de maison est déclaré(e) légalement.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 720 }}>
          {STEPS.map((step, i) => (
            <div key={i} className="card" style={{ padding: 32, marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <div className="step-number" style={{ fontSize: '1.3rem', width: 52, height: 52 }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: '1.2rem', marginBottom: 8 }}>{step.title}</h2>
                  <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 12 }}>{step.desc}</p>
                  <span className="step-time">⏱ {step.time}</span>
                </div>
              </div>
            </div>
          ))}

          <div className="divider-text">Ensuite, chaque mois</div>

          <div className="card" style={{ padding: 32, background: 'var(--color-success-light)', border: '1px solid #a7f3d0' }}>
            <h3 style={{ marginBottom: 8 }}>Routine mensuelle (~2 minutes)</h3>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
              Entrez les heures travaillées → Aidom génère la fiche de paie → vous transférez
              le salaire net. C'est tout.
            </p>
          </div>

          <div className="divider-text">Ce qu'Aidom fait / Ce que vous faites</div>

          <div className="grid-2 mt-2">
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ color: 'var(--color-primary)', marginBottom: 12, fontSize: '1rem' }}>Aidom s'occupe de</h3>
              <ul style={{ listStyle: 'none' }}>
                {['Calcul des cotisations sociales', 'Génération du contrat de travail', 'Fiches de paie mensuelles',
                  'Préparation formulaire AVS', 'Déclaration annuelle', 'Rappels d\'échéances'].map((item, i) => (
                  <li key={i} style={{ padding: '6px 0', fontSize: '0.9rem', borderBottom: '1px solid var(--color-border-light)' }}>
                    <span style={{ color: 'var(--color-success)', marginRight: 8 }}>✓</span>{item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ color: 'var(--color-text-secondary)', marginBottom: 12, fontSize: '1rem' }}>Vous faites</h3>
              <ul style={{ listStyle: 'none' }}>
                {[
                  { task: 'S\'inscrire à la caisse AVS', time: '~15 min, 1 fois' },
                  { task: 'Signer le contrat', time: '~2 min, 1 fois' },
                  { task: 'Entrer les heures mensuelles', time: '~30 sec/mois' },
                  { task: 'Transférer le salaire', time: '~1 min/mois' },
                ].map((item, i) => (
                  <li key={i} style={{ padding: '6px 0', fontSize: '0.9rem', borderBottom: '1px solid var(--color-border-light)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{item.task}</span>
                    <span className="text-xs text-muted">{item.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="alert alert-info mt-3">
            <strong>Aucune procuration nécessaire.</strong> Vous restez l'employeur. Aidom est votre
            outil, pas un intermédiaire.
          </div>

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link to="/signup"><button className="btn btn-primary btn-lg">Commencer — 30 jours gratuits →</button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}

const STEPS = [
  {
    title: 'Entrez vos données',
    desc: 'Renseignez votre canton, le salaire horaire et les informations de votre employé(e). Aidom s\'adapte automatiquement aux taux de votre canton.',
    time: '5 minutes',
  },
  {
    title: 'Recevez votre contrat',
    desc: 'Aidom génère un contrat de travail conforme au Code des obligations (Art. 319 ss.) et au contrat-type cantonal. Téléchargez-le en PDF, signez-le.',
    time: 'Immédiat',
  },
  {
    title: 'Inscrivez-vous à l\'AVS',
    desc: 'Aidom vous fournit le formulaire pré-rempli pour vous inscrire comme employeur auprès de la caisse de compensation de votre canton.',
    time: '~15 minutes (une seule fois)',
  },
  {
    title: 'Générez vos fiches de paie',
    desc: 'Chaque mois, entrez les heures travaillées. Aidom calcule le brut, les déductions et génère la fiche de paie PDF.',
    time: '2 minutes par mois',
  },
];
