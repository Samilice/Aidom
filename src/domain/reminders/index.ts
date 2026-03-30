// ============================================
// AIDOM — Reminders Generator
// ============================================
// Génère des rappels par défaut lors de la création d'un dossier.

import type { Reminder, Canton, EmployeeType } from '../../types';
import { addMonths, addDays, format } from 'date-fns';

export function generateDefaultReminders(
  employerId: string,
  startDate: string,
  canton: Canton,
  employeeType: EmployeeType
): Omit<Reminder, 'id' | 'createdAt'>[] {
  const start = new Date(startDate);
  const reminders: Omit<Reminder, 'id' | 'createdAt'>[] = [];

  // Rappel : signer le contrat (7 jours avant)
  reminders.push({
    employerId,
    type: 'contrat_signature',
    title: 'Signer le contrat de travail',
    description: 'Le contrat doit être signé avant le début de l\'emploi.',
    dueDate: format(addDays(start, -7), 'yyyy-MM-dd'),
    status: 'pending',
  });

  // Rappel : souscrire LAA
  reminders.push({
    employerId,
    type: 'assurance',
    title: 'Souscrire l\'assurance accidents (LAA)',
    description: 'Obligatoire avant le premier jour de travail.',
    dueDate: format(addDays(start, -7), 'yyyy-MM-dd'),
    status: 'pending',
  });

  // Rappel : première fiche de paie (fin du premier mois)
  reminders.push({
    employerId,
    type: 'fiche_paie',
    title: 'Établir la première fiche de paie',
    description: 'Remettez une fiche de paie à votre employé(e) à la fin du premier mois.',
    dueDate: format(addMonths(start, 1), 'yyyy-MM-dd'),
    status: 'pending',
  });

  // Rappel : déclaration AVS annuelle (janvier suivant)
  const nextJanuary = new Date(start.getFullYear() + 1, 0, 31);
  reminders.push({
    employerId,
    type: 'avs_declaration',
    title: 'Déclarer les salaires à la caisse AVS',
    description: 'Déclaration annuelle des salaires versés (janvier).',
    dueDate: format(nextJanuary, 'yyyy-MM-dd'),
    status: 'pending',
  });

  // Rappel : impôt à la source (si applicable, simplifié)
  reminders.push({
    employerId,
    type: 'impot_source',
    title: 'Vérifier l\'impôt à la source',
    description: 'Si votre employé(e) n\'a pas de permis C, l\'impôt à la source peut s\'appliquer.',
    dueDate: format(start, 'yyyy-MM-dd'),
    status: 'pending',
  });

  return reminders;
}
