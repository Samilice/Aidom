// ============================================
// AIDOM — Eligibility Engine
// ============================================
// Détermine si un cas est dans le périmètre du produit.
// Retourne : ok | ok_reserve | hors_perimetre

import type { EligibilityInput, EligibilityOutput, Canton } from '../../types';

const CANTONS_ROMANDS: Canton[] = ['GE', 'VD', 'NE', 'FR', 'VS', 'JU', 'BE'];

export function checkEligibility(input: EligibilityInput): EligibilityOutput {
  const reasons: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // --- Cas hors périmètre ---

  if (input.employerIsCompany) {
    reasons.push('Aidom est destiné aux particuliers, pas aux entreprises.');
    return { result: 'hors_perimetre', reasons, warnings, suggestions };
  }

  if (!CANTONS_ROMANDS.includes(input.canton)) {
    reasons.push('Aidom couvre uniquement la Suisse romande (GE, VD, NE, FR, VS, JU, BE).');
    return { result: 'hors_perimetre', reasons, warnings, suggestions };
  }

  if (input.numberOfEmployees > 2) {
    reasons.push('Aidom permet de gérer 1 ou 2 employés maximum.');
    return { result: 'hors_perimetre', reasons, warnings, suggestions };
  }

  // --- OK avec réserve ---

  let hasReserve = false;

  if (!input.isSwissOrPermitC) {
    hasReserve = true;
    warnings.push(
      'Votre employé(e) n\'a pas la nationalité suisse ni un permis C. ' +
      'Des démarches supplémentaires peuvent être nécessaires (permis de travail).'
    );
    suggestions.push(
      'Vérifiez le type de permis auprès de votre commune ou sur le site du canton.'
    );
  }

  if (input.hoursPerWeek > 30) {
    hasReserve = true;
    warnings.push(
      'Un emploi à plus de 30h/semaine peut nécessiter des démarches particulières ' +
      '(assurance LPP obligatoire, etc.).'
    );
  }

  if (input.employeeType === 'nounou' && input.hoursPerWeek > 25) {
    hasReserve = true;
    warnings.push(
      'Pour une nounou à plus de 25h/semaine, des obligations supplémentaires peuvent s\'appliquer.'
    );
  }

  // --- OK ---

  if (hasReserve) {
    suggestions.push(
      'Aidom peut vous accompagner, mais vérifiez les points mentionnés ci-dessus.'
    );
    return { result: 'ok_reserve', reasons: [], warnings, suggestions };
  }

  return {
    result: 'ok',
    reasons: [],
    warnings: [],
    suggestions: ['Votre situation est standard. Aidom peut vous accompagner sans problème.'],
  };
}
