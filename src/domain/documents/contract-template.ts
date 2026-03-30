// ============================================
// AIDOM — Contract HTML Template
// ============================================
// Génère le HTML d'un contrat de travail pour employé de maison.

import type { ContractData } from '../../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const TYPE_LABELS = {
  menage: 'employé(e) de maison',
  nounou: 'nounou / garde d\'enfants',
  babysitter: 'babysitter',
};

export function generateContractHtml(data: ContractData): string {
  const { employer, employee } = data;
  const typeLabel = TYPE_LABELS[employee.type];
  const startFormatted = format(new Date(employee.startDate), 'dd MMMM yyyy', { locale: fr });

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #1a1a1a;
      max-width: 700px;
      margin: 40px auto;
      padding: 0 20px;
    }
    h1 { font-size: 16pt; text-align: center; margin-bottom: 30px; }
    h2 { font-size: 12pt; margin-top: 24px; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
    .parties { margin: 20px 0; }
    .party { margin-bottom: 12px; }
    .party strong { display: block; }
    .signature { margin-top: 60px; display: flex; justify-content: space-between; }
    .signature div { width: 45%; border-top: 1px solid #333; padding-top: 8px; text-align: center; }
    .footer { margin-top: 40px; font-size: 9pt; color: #888; text-align: center; }
  </style>
</head>
<body>
  <h1>Contrat de travail<br/><small>Personnel de maison</small></h1>

  <div class="parties">
    <div class="party">
      <strong>Employeur :</strong>
      ${employer.firstName} ${employer.lastName}<br/>
      ${employer.address}<br/>
      ${employer.postalCode} ${employer.city} (${employer.canton})
    </div>
    <div class="party">
      <strong>Employé(e) :</strong>
      ${employee.firstName} ${employee.lastName}<br/>
      Date de naissance : ${format(new Date(employee.dateOfBirth), 'dd.MM.yyyy')}<br/>
      Nationalité : ${employee.nationality}
    </div>
  </div>

  <h2>Article 1 — Objet</h2>
  <p>
    Le présent contrat règle les conditions d'engagement de l'employé(e) en qualité de
    <strong>${typeLabel}</strong> au domicile de l'employeur.
  </p>

  <h2>Article 2 — Début et durée</h2>
  <p>
    Le contrat prend effet le <strong>${startFormatted}</strong>.
    Il est conclu pour une durée indéterminée.
  </p>

  <h2>Article 3 — Temps d'essai</h2>
  <p>
    Le temps d'essai est fixé à <strong>${data.trialPeriodMonths} mois</strong>.
    Durant cette période, le délai de congé est de 7 jours.
  </p>

  <h2>Article 4 — Horaires de travail</h2>
  <p>
    L'employé(e) travaille <strong>${employee.hoursPerWeek} heures par semaine</strong>.
    Les horaires précis sont convenus d'un commun accord.
  </p>

  <h2>Article 5 — Rémunération</h2>
  <p>
    Le salaire horaire brut est fixé à <strong>CHF ${employee.grossHourlyRate.toFixed(2)}</strong>.
    ${data.thirteenthSalary ? 'Un 13ème salaire est prévu, versé en décembre ou au prorata.' : 'Aucun 13ème salaire n\'est prévu.'}
  </p>
  <p>
    Les cotisations sociales (AVS/AI/APG, AC) sont déduites conformément à la loi.
  </p>

  <h2>Article 6 — Vacances</h2>
  <p>
    L'employé(e) a droit à <strong>${data.vacationWeeks} semaines</strong> de vacances par année.
  </p>

  <h2>Article 7 — Résiliation</h2>
  <p>
    Après le temps d'essai, le délai de congé est de <strong>${data.noticePeriodMonths} mois</strong>
    pour la fin d'un mois.
  </p>

  <h2>Article 8 — Assurances</h2>
  <p>
    L'employeur souscrit une assurance accidents (LAA) conformément à la loi.
    Les cotisations AVS/AI/APG et AC sont versées à la caisse de compensation.
  </p>

  ${data.additionalClauses.length > 0 ? `
  <h2>Article 9 — Dispositions particulières</h2>
  <ul>
    ${data.additionalClauses.map((c) => `<li>${c}</li>`).join('\n    ')}
  </ul>
  ` : ''}

  <h2>Droit applicable</h2>
  <p>
    Le présent contrat est soumis au droit suisse. Le contrat-type de travail cantonal pour
    les travailleurs de l'économie domestique s'applique à titre supplétif.
  </p>

  <div class="signature">
    <div>
      L'employeur<br/>
      ${employer.firstName} ${employer.lastName}<br/><br/>
      Date : _______________
    </div>
    <div>
      L'employé(e)<br/>
      ${employee.firstName} ${employee.lastName}<br/><br/>
      Date : _______________
    </div>
  </div>

  <div class="footer">
    Document généré par Aidom — aidom.ch<br/>
    Ce document est un modèle simplifié. Il ne remplace pas un conseil juridique.
  </div>
</body>
</html>`;
}
