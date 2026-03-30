// ============================================
// AIDOM — Types principaux
// ============================================

// --- Enums ---

export type Canton = 'GE' | 'VD' | 'NE' | 'FR' | 'VS' | 'JU' | 'BE' | 'ZH' | 'LU' | 'UR' | 'SZ' | 'OW' | 'NW' | 'GL' | 'ZG' | 'SO' | 'BS' | 'BL' | 'SH' | 'AR' | 'AI' | 'SG' | 'GR' | 'AG' | 'TG' | 'TI';

export type EmployeeType = 'menage' | 'nounou' | 'babysitter';

export type DossierStatus = 'draft' | 'active' | 'archived';

export type SubscriptionPlan = 'essentiel' | 'duo' | 'serenite';

export type EligibilityResult = 'ok' | 'ok_reserve' | 'hors_perimetre';

export type ReminderType =
  | 'avs_declaration'
  | 'contrat_signature'
  | 'fiche_paie'
  | 'assurance'
  | 'impot_source'
  | 'custom';

export type ReminderStatus = 'pending' | 'done' | 'dismissed';

// --- User / Auth ---

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  plan: SubscriptionPlan | null;
  stripeCustomerId: string | null;
  subscriptionStatus: 'active' | 'past_due' | 'canceled' | null;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

// --- Dossier Employeur ---

export interface Employer {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  address: string;
  postalCode: string;
  city: string;
  canton: Canton;
  phone: string;
  avsNumber: string;
  createdAt: string;
}

// --- Employé ---

export interface Employee {
  id: string;
  employerId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  permitType: string | null;
  avsNumber: string;
  type: EmployeeType;
  grossHourlyRate: number;
  hoursPerWeek: number;
  startDate: string;
  endDate: string | null;
  status: 'active' | 'ended';
  createdAt: string;
}

// --- Simulation / Calculs ---

export interface CostSimulation {
  grossMonthlySalary: number;
  grossAnnualSalary: number;
  employerAVS: number;
  employerAC: number;
  employerLAA: number;
  employerLPP: number;
  vacationProvision: number;
  thirteenthSalaryProvision: number;
  totalMonthlyCost: number;
  totalAnnualCost: number;
  breakdown: CostBreakdownLine[];
}

export interface CostBreakdownLine {
  label: string;
  rate: number | null;
  amount: number;
  type: 'salary' | 'charge' | 'provision' | 'total';
}

// --- Eligibility ---

export interface EligibilityInput {
  canton: Canton;
  employeeType: EmployeeType;
  hoursPerWeek: number;
  isSwissOrPermitC: boolean;
  employerIsCompany: boolean;
  numberOfEmployees: number;
}

export interface EligibilityOutput {
  result: EligibilityResult;
  reasons: string[];
  warnings: string[];
  suggestions: string[];
}

// --- Contrat ---

export interface ContractData {
  employer: Employer;
  employee: Employee;
  trialPeriodMonths: number;
  noticePeriodMonths: number;
  vacationWeeks: number;
  thirteenthSalary: boolean;
  additionalClauses: string[];
}

// --- Fiche de paie ---

export interface PayslipData {
  employee: Employee;
  employer: Employer;
  month: number;
  year: number;
  workedHours: number;
  grossSalary: number;
  deductions: PayslipDeduction[];
  netSalary: number;
}

export interface PayslipDeduction {
  label: string;
  rate: number;
  amount: number;
}

// --- Checklist ---

export interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  category: 'obligatoire' | 'recommande' | 'optionnel';
  completed: boolean;
  dueDescription: string | null;
}

// --- Rappels ---

export interface Reminder {
  id: string;
  employerId: string;
  type: ReminderType;
  title: string;
  description: string | null;
  dueDate: string;
  status: ReminderStatus;
  createdAt: string;
}

// --- API Responses ---

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// --- Pricing ---

export interface PricingPlan {
  id: SubscriptionPlan;
  name: string;
  setupPrice: number;
  annualPrice: number;
  maxEmployees: number;
  features: string[];
  highlighted?: boolean;
}
