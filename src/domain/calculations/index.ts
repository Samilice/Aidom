// ============================================
// AIDOM — Cost Calculations
// ============================================
// Calcule le coût employeur total (charges sociales suisses).
// Basé sur les taux 2025 simplifiés pour employés de maison.
// Supporte les 26 cantons.

import type { CostSimulation, CostBreakdownLine, Canton } from '../../types';
import { getCantonByCode } from '../../lib/cantons';

// Taux charges employeur (part employeur uniquement)
const RATES = {
  AVS_AI_APG: 0.053,        // AVS/AI/APG — 5.3% employeur
  AC: 0.011,                // Assurance chômage — 1.1% employeur
  LAA: 0.007,               // LAA (accident non-professionnel) — ~0.7% (simplifié)
  VACANCES_4_SEMAINES: 8.33, // Provision vacances 4 semaines = 8.33% du brut
  TREIZIEME: 8.33,           // 13ème salaire = 8.33% du brut
};

// Fallback rates if canton not found in CANTONS data
const DEFAULT_AF_RATE = 0.020;
const DEFAULT_ADMIN_RATE = 0.003;

interface CalculationInput {
  grossHourlyRate: number;
  hoursPerWeek: number;
  canton: Canton;
  includeThirteenthSalary: boolean;
  vacationWeeks: number; // 4 ou 5
}

export function calculateCosts(input: CalculationInput): CostSimulation {
  const weeksPerMonth = 52 / 12;
  const monthlyHours = input.hoursPerWeek * weeksPerMonth;
  const grossMonthlySalary = Math.round(input.grossHourlyRate * monthlyHours * 100) / 100;
  const grossAnnualSalary = grossMonthlySalary * 12;

  // Get canton-specific rates
  const cantonData = getCantonByCode(input.canton);
  const afRate = cantonData?.afRate ?? DEFAULT_AF_RATE;
  const adminRate = cantonData?.adminRate ?? DEFAULT_ADMIN_RATE;

  const breakdown: CostBreakdownLine[] = [];

  // Salaire brut
  breakdown.push({
    label: 'Salaire brut mensuel',
    rate: null,
    amount: grossMonthlySalary,
    type: 'salary',
  });

  // AVS/AI/APG
  const avsAmount = round(grossMonthlySalary * RATES.AVS_AI_APG);
  breakdown.push({
    label: 'AVS / AI / APG (employeur)',
    rate: RATES.AVS_AI_APG * 100,
    amount: avsAmount,
    type: 'charge',
  });

  // AC
  const acAmount = round(grossMonthlySalary * RATES.AC);
  breakdown.push({
    label: 'Assurance chômage (AC)',
    rate: RATES.AC * 100,
    amount: acAmount,
    type: 'charge',
  });

  // LAA
  const laaAmount = round(grossMonthlySalary * RATES.LAA);
  breakdown.push({
    label: 'Assurance accidents (LAA)',
    rate: RATES.LAA * 100,
    amount: laaAmount,
    type: 'charge',
  });

  // Allocations familiales
  const afAmount = round(grossMonthlySalary * afRate);
  breakdown.push({
    label: 'Allocations familiales (AF)',
    rate: afRate * 100,
    amount: afAmount,
    type: 'charge',
  });

  // Administration
  const adminAmount = round(grossMonthlySalary * adminRate);
  breakdown.push({
    label: 'Frais d\'administration',
    rate: adminRate * 100,
    amount: adminAmount,
    type: 'charge',
  });

  // Provision vacances
  const vacRate = input.vacationWeeks === 5 ? 10.64 : RATES.VACANCES_4_SEMAINES;
  const vacAmount = round(grossMonthlySalary * (vacRate / 100));
  breakdown.push({
    label: `Provision vacances (${input.vacationWeeks} semaines)`,
    rate: vacRate,
    amount: vacAmount,
    type: 'provision',
  });

  // 13ème salaire
  let thirteenthAmount = 0;
  if (input.includeThirteenthSalary) {
    thirteenthAmount = round(grossMonthlySalary * (RATES.TREIZIEME / 100));
    breakdown.push({
      label: '13ème salaire (provision)',
      rate: RATES.TREIZIEME,
      amount: thirteenthAmount,
      type: 'provision',
    });
  }

  // Total
  const totalCharges = avsAmount + acAmount + laaAmount + afAmount + adminAmount;
  const totalProvisions = vacAmount + thirteenthAmount;
  const totalMonthlyCost = grossMonthlySalary + totalCharges + totalProvisions;

  breakdown.push({
    label: 'Coût total mensuel employeur',
    rate: null,
    amount: round(totalMonthlyCost),
    type: 'total',
  });

  return {
    grossMonthlySalary,
    grossAnnualSalary,
    employerAVS: avsAmount,
    employerAC: acAmount,
    employerLAA: laaAmount,
    employerLPP: 0,
    vacationProvision: vacAmount,
    thirteenthSalaryProvision: thirteenthAmount,
    totalMonthlyCost: round(totalMonthlyCost),
    totalAnnualCost: round(totalMonthlyCost * 12),
    breakdown,
  };
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

// Taux charges employé (pour fiche de paie — part employé)
export const EMPLOYEE_RATES = {
  AVS_AI_APG: 0.053,  // 5.3%
  AC: 0.011,          // 1.1%
};

export function calculateEmployeeDeductions(grossSalary: number) {
  const avsDeduction = round(grossSalary * EMPLOYEE_RATES.AVS_AI_APG);
  const acDeduction = round(grossSalary * EMPLOYEE_RATES.AC);
  const totalDeductions = avsDeduction + acDeduction;
  const netSalary = round(grossSalary - totalDeductions);

  return {
    deductions: [
      { label: 'AVS / AI / APG', rate: EMPLOYEE_RATES.AVS_AI_APG * 100, amount: avsDeduction },
      { label: 'Assurance chômage (AC)', rate: EMPLOYEE_RATES.AC * 100, amount: acDeduction },
    ],
    totalDeductions,
    netSalary,
  };
}
