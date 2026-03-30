// ============================================
// AIDOM — Checklist administrative
// ============================================
// Génère une checklist personnalisée selon le canton et le type d'employé.

import type { ChecklistItem, Canton, EmployeeType } from '../../types';

let counter = 0;
function id() {
  counter++;
  return `chk_${counter}`;
}

export function generateChecklist(
  canton: Canton,
  employeeType: EmployeeType
): ChecklistItem[] {
  counter = 0;
  const items: ChecklistItem[] = [];

  // --- Obligatoire ---

  items.push({
    id: id(),
    label: 'S\'inscrire comme employeur auprès de la caisse AVS',
    description:
      'Contactez la caisse de compensation AVS de votre canton pour vous enregistrer comme employeur de personnel de maison.',
    category: 'obligatoire',
    completed: false,
    dueDescription: 'Avant le début de l\'emploi',
  });

  items.push({
    id: id(),
    label: 'Conclure une assurance accidents (LAA)',
    description:
      'L\'assurance accidents est obligatoire dès la 1ère heure de travail. Souscrivez auprès d\'un assureur reconnu.',
    category: 'obligatoire',
    completed: false,
    dueDescription: 'Avant le début de l\'emploi',
  });

  items.push({
    id: id(),
    label: 'Rédiger et signer le contrat de travail',
    description:
      'Le contrat doit mentionner le salaire, les horaires, les vacances et le délai de congé. Aidom peut le générer pour vous.',
    category: 'obligatoire',
    completed: false,
    dueDescription: 'Avant le début de l\'emploi',
  });

  items.push({
    id: id(),
    label: 'Déclarer les salaires chaque année à la caisse AVS',
    description:
      'Chaque année (en général en janvier), déclarez les salaires versés à la caisse de compensation.',
    category: 'obligatoire',
    completed: false,
    dueDescription: 'Janvier de chaque année',
  });

  items.push({
    id: id(),
    label: 'Verser les cotisations sociales',
    description:
      'Les cotisations (AVS, AC, LAA) doivent être versées régulièrement à la caisse de compensation.',
    category: 'obligatoire',
    completed: false,
    dueDescription: 'Mensuel ou trimestriel selon le canton',
  });

  // Canton GE : procédure simplifiée
  if (canton === 'GE') {
    items.push({
      id: id(),
      label: 'Utiliser le service Chèque emploi (Genève)',
      description:
        'Le canton de Genève propose le système Chèque emploi pour simplifier vos démarches. C\'est recommandé.',
      category: 'recommande',
      completed: false,
      dueDescription: 'Au début de l\'emploi',
    });
  }

  // Canton VD
  if (canton === 'VD') {
    items.push({
      id: id(),
      label: 'S\'enregistrer auprès du Service des emplois (Vaud)',
      description:
        'Le canton de Vaud a un service dédié pour les employeurs de personnel de maison.',
      category: 'recommande',
      completed: false,
      dueDescription: 'Au début de l\'emploi',
    });
  }

  // Nounou : obligations supplémentaires
  if (employeeType === 'nounou') {
    items.push({
      id: id(),
      label: 'Vérifier les qualifications de la nounou',
      description:
        'Assurez-vous que la personne a les qualifications nécessaires pour la garde d\'enfants.',
      category: 'recommande',
      completed: false,
      dueDescription: 'Avant le début de l\'emploi',
    });

    items.push({
      id: id(),
      label: 'Vérifier l\'extrait de casier judiciaire',
      description:
        'Pour la garde d\'enfants, il est recommandé de demander un extrait de casier judiciaire.',
      category: 'recommande',
      completed: false,
      dueDescription: 'Avant le début de l\'emploi',
    });
  }

  // --- Recommandé ---

  items.push({
    id: id(),
    label: 'Souscrire une assurance ménage couvrant les employés',
    description:
      'Vérifiez que votre assurance responsabilité civile ménage couvre les dommages causés par votre employé(e).',
    category: 'recommande',
    completed: false,
    dueDescription: null,
  });

  items.push({
    id: id(),
    label: 'Établir des fiches de paie mensuelles',
    description:
      'Remettez chaque mois une fiche de paie à votre employé(e). Aidom peut les générer.',
    category: 'recommande',
    completed: false,
    dueDescription: 'Fin de chaque mois',
  });

  return items;
}
