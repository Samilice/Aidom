import { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQ_DATA = [
  { cat: 'Général', q: 'Suis-je obligé(e) de déclarer mon aide ménagère ?', a: 'Oui. En Suisse, tout employeur privé doit déclarer son personnel de maison dès la première heure de travail et payer les cotisations AVS/AI/APG, l\'assurance chômage (AC) et l\'assurance accidents (LAA). C\'est une obligation légale, quelle que soit la durée ou la fréquence du travail.' },
  { cat: 'Général', q: 'Aidom est-il disponible dans mon canton ?', a: 'Oui, Aidom couvre les 26 cantons suisses. Les taux de cotisation (allocations familiales, frais d\'administration) sont adaptés automatiquement selon votre canton.' },
  { cat: 'Général', q: 'Quels types d\'employés puis-je gérer ?', a: 'Aidom prend en charge les emplois de ménage (femme/homme de ménage, aide ménagère), garde d\'enfants (nounou, babysitter) et aide à domicile.' },
  { cat: 'Tarifs', q: 'Combien coûte Aidom ?', a: 'CHF 19.—/mois, prix fixe. Aucun pourcentage sur les salaires, aucun frais de setup. Les 30 premiers jours sont gratuits.' },
  { cat: 'Tarifs', q: 'Puis-je annuler à tout moment ?', a: 'Oui, votre abonnement est résiliable à tout moment, sans condition ni pénalité. La résiliation prend effet à la fin du mois en cours.' },
  { cat: 'Tarifs', q: 'Dois-je entrer une carte de crédit pour l\'essai gratuit ?', a: 'Non. L\'essai de 30 jours ne nécessite aucune carte de crédit. Vous ne paierez qu\'après avoir décidé de continuer.' },
  { cat: 'Tarifs', q: 'Combien d\'employés puis-je gérer ?', a: 'Autant que vous souhaitez. Le prix est fixe, indépendamment du nombre d\'employés.' },
  { cat: 'Fonctionnement', q: 'Que fait Aidom exactement ?', a: 'Aidom calcule automatiquement les cotisations sociales, génère les contrats de travail et fiches de paie, prépare les formulaires AVS, et vous envoie des rappels pour les échéances importantes. Vous restez l\'employeur — aucune procuration n\'est nécessaire.' },
  { cat: 'Fonctionnement', q: 'Devrai-je quand même contacter la caisse AVS ?', a: 'Oui, une seule fois. Aidom vous fournit le formulaire pré-rempli, mais c\'est vous qui l\'envoyez à votre caisse de compensation cantonale. C\'est une démarche d\'environ 15 minutes.' },
  { cat: 'Fonctionnement', q: 'Les calculs sont-ils fiables ?', a: 'Les calculs sont basés sur les taux officiels publiés par l\'OFAS/BSV et les caisses cantonales. Cependant, Aidom est un outil logiciel et ne remplace pas un conseil fiscal. Nous recommandons de vérifier les montants auprès de votre caisse de compensation.' },
  { cat: 'Légal', q: 'Mon employé(e) est payé(e) en espèces. Est-ce un problème ?', a: 'Non, le mode de paiement (espèces, virement) n\'a aucune incidence sur l\'obligation de déclarer. Aidom fonctionne quel que soit le mode de paiement.' },
  { cat: 'Légal', q: 'Mon employé(e) n\'a pas de permis C. Puis-je utiliser Aidom ?', a: 'Oui. Aidom supporte tous les types de permis (B, C, L, F). Selon le permis, des démarches supplémentaires peuvent être nécessaires (autorisation de travail). Aidom vous signale ces cas.' },
  { cat: 'Légal', q: 'Et l\'assurance accidents (LAA) ?', a: 'L\'assurance accidents est obligatoire dès la première heure de travail. Aidom vous guide pour souscrire cette assurance auprès d\'un assureur reconnu.' },
];

export function FAQ() {
  const [filter, setFilter] = useState('Tous');
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const categories = ['Tous', ...new Set(FAQ_DATA.map(f => f.cat))];
  const filtered = filter === 'Tous' ? FAQ_DATA : FAQ_DATA.filter(f => f.cat === filter);

  return (
    <div>
      <section style={{
        background: 'linear-gradient(135deg, #0f172a, #1a56db)',
        color: '#fff', padding: '80px 20px', textAlign: 'center',
      }}>
        <div className="container">
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 12 }}>Questions fréquentes</h1>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)' }}>
            Tout ce que vous voulez savoir sur Aidom et l'emploi à domicile en Suisse.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 720 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32, justifyContent: 'center' }}>
            {categories.map(cat => (
              <button key={cat} className={`btn btn-sm ${filter === cat ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => { setFilter(cat); setOpenIdx(null); }}>
                {cat}
              </button>
            ))}
          </div>

          {filtered.map((faq, i) => (
            <div key={i} className="faq-item">
              <button className={`faq-question ${openIdx === i ? 'open' : ''}`}
                onClick={() => setOpenIdx(openIdx === i ? null : i)}>
                {faq.q}
                <span className="chevron">▼</span>
              </button>
              {openIdx === i && <div className="faq-answer">{faq.a}</div>}
            </div>
          ))}

          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <p className="text-muted mb-2">Vous n'avez pas trouvé votre réponse ?</p>
            <Link to="/contact"><button className="btn btn-secondary">Nous contacter</button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
