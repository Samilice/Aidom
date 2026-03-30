import { useState } from 'react';

const CATEGORIES = ['Tous', 'Guide', 'Coûts', 'Droit', 'Comparaison', 'Modèle'];

const ARTICLES = [
  { cat: 'Guide', title: 'Comment déclarer votre aide ménagère en 5 étapes', desc: 'Le guide complet pour être en règle avec l\'AVS, les assurances et le contrat de travail.', time: '8 min' },
  { cat: 'Coûts', title: 'Combien coûte une femme de ménage en Suisse ?', desc: 'Salaire horaire, charges sociales, assurances — le calcul complet canton par canton.', time: '6 min' },
  { cat: 'Droit', title: 'Travail au noir en Suisse : quels risques ?', desc: 'Amendes, cotisations rétroactives, poursuites pénales — ce que dit la loi.', time: '5 min' },
  { cat: 'Guide', title: 'Le contrat de travail pour employé de maison', desc: 'Les clauses obligatoires, les spécificités cantonales et nos modèles gratuits.', time: '7 min' },
  { cat: 'Droit', title: 'Les droits de votre employé(e) de maison', desc: 'Vacances, maladie, maternité, congé — ce que prévoit le droit suisse.', time: '6 min' },
  { cat: 'Coûts', title: 'Employer directement vs passer par une agence', desc: 'Comparez les coûts et avantages : emploi direct vs Batmaid, Homeservice, etc.', time: '5 min' },
  { cat: 'Guide', title: 'S\'inscrire à la caisse AVS : le guide pratique', desc: 'Comment vous enregistrer comme employeur auprès de la caisse de compensation.', time: '4 min' },
  { cat: 'Modèle', title: 'Modèle de contrat de travail gratuit', desc: 'Téléchargez notre modèle de contrat conforme au CO Art. 319 ss.', time: '3 min' },
  { cat: 'Droit', title: 'La procédure de décompte simplifiée', desc: 'Comment bénéficier de la procédure simplifiée pour les petits salaires.', time: '4 min' },
  { cat: 'Guide', title: 'L\'assurance accidents (LAA) obligatoire', desc: 'Ce que vous devez savoir sur l\'assurance accidents pour votre employé(e).', time: '5 min' },
  { cat: 'Comparaison', title: 'Aidom vs les autres solutions', desc: 'Prix, fonctionnalités, transparence — notre comparatif honnête.', time: '5 min' },
  { cat: 'Modèle', title: 'Modèle de fiche de paie', desc: 'Exemple de fiche de paie conforme pour un employé de maison.', time: '2 min' },
];

export function Guides() {
  const [filter, setFilter] = useState('Tous');

  const filtered = filter === 'Tous' ? ARTICLES : ARTICLES.filter((a) => a.cat === filter);

  return (
    <div>
      <section style={{
        background: 'linear-gradient(135deg, #0f172a, #1a56db)',
        color: '#fff', padding: '80px 20px', textAlign: 'center',
      }}>
        <div className="container">
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 12 }}>Guides & Ressources</h1>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', maxWidth: 520, margin: '0 auto' }}>
            Tout ce qu'il faut savoir pour employer correctement votre aide à domicile en Suisse.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Category filter */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32, justifyContent: 'center' }}>
            {CATEGORIES.map((cat) => (
              <button key={cat}
                className={`btn btn-sm ${filter === cat ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilter(cat)}>
                {cat}
              </button>
            ))}
          </div>

          {/* Articles grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {filtered.map((article, i) => (
              <div key={i} className="guide-card" style={{ cursor: 'pointer' }}>
                <div className="category">{article.cat}</div>
                <h3>{article.title}</h3>
                <p>{article.desc}</p>
                <div className="meta">
                  <span>⏱ {article.time}</span>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="empty-state">
              <h3>Aucun article dans cette catégorie</h3>
              <p>De nouveaux articles sont publiés régulièrement.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
