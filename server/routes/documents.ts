import { Hono } from 'hono';
import { dbGet, dbAll } from '../db/index.js';
import { authMiddleware } from '../middleware/auth.js';
import { generateContractHtml } from '../../src/domain/documents/contract-template.js';
import { generatePayslipHtml } from '../../src/domain/documents/payslip-template.js';
import { calculateEmployeeDeductions } from '../../src/domain/calculations/index.js';

const documents = new Hono();
documents.use('*', authMiddleware);

function getEmployerData(userId: string) {
  return dbGet('SELECT * FROM employers WHERE user_id = ?', [userId]);
}

function mapEmployer(emp: any, userId: string) {
  return {
    id: emp.id, userId, firstName: emp.first_name, lastName: emp.last_name,
    address: emp.address, postalCode: emp.postal_code, city: emp.city,
    canton: emp.canton, phone: emp.phone, avsNumber: emp.avs_number, createdAt: emp.created_at,
  };
}

function mapEmp(e: any) {
  return {
    id: e.id, employerId: e.employer_id, firstName: e.first_name, lastName: e.last_name,
    dateOfBirth: e.date_of_birth, nationality: e.nationality, permitType: e.permit_type,
    avsNumber: e.avs_number, type: e.type, grossHourlyRate: e.gross_hourly_rate,
    hoursPerWeek: e.hours_per_week, startDate: e.start_date, endDate: e.end_date,
    status: e.status, createdAt: e.created_at,
  };
}

documents.post('/contract/:employeeId', async (c) => {
  const userId = (c as any).get('userId') as string;
  const employeeId = c.req.param('employeeId');

  const employer = getEmployerData(userId);
  if (!employer) return c.json({ success: false, error: 'Dossier employeur manquant' }, 400);

  const employee = dbGet('SELECT * FROM employees WHERE id = ? AND employer_id = ?', [employeeId, employer.id]);
  if (!employee) return c.json({ success: false, error: 'Employé non trouvé' }, 404);

  const body = await c.req.json().catch(() => ({}));

  const html = generateContractHtml({
    employer: mapEmployer(employer, userId),
    employee: mapEmp(employee),
    trialPeriodMonths: body.trialPeriodMonths ?? 1,
    noticePeriodMonths: body.noticePeriodMonths ?? 1,
    vacationWeeks: body.vacationWeeks ?? 4,
    thirteenthSalary: body.thirteenthSalary ?? true,
    additionalClauses: body.additionalClauses ?? [],
  });

  return c.html(html);
});

documents.post('/payslip/:employeeId', async (c) => {
  const userId = (c as any).get('userId') as string;
  const employeeId = c.req.param('employeeId');

  const employer = getEmployerData(userId);
  if (!employer) return c.json({ success: false, error: 'Dossier employeur manquant' }, 400);

  const employee = dbGet('SELECT * FROM employees WHERE id = ? AND employer_id = ?', [employeeId, employer.id]);
  if (!employee) return c.json({ success: false, error: 'Employé non trouvé' }, 404);

  const body = await c.req.json();
  const { month, year, workedHours } = body;
  if (!month || !year) return c.json({ success: false, error: 'Mois et année requis.' }, 400);

  const weeksPerMonth = 52 / 12;
  const hours = workedHours ?? employee.hours_per_week * weeksPerMonth;
  const grossSalary = Math.round(employee.gross_hourly_rate * hours * 100) / 100;
  const { deductions, netSalary } = calculateEmployeeDeductions(grossSalary);

  const html = generatePayslipHtml({
    employee: mapEmp(employee),
    employer: mapEmployer(employer, userId),
    month, year,
    workedHours: Math.round(hours * 100) / 100,
    grossSalary, deductions, netSalary,
  });

  return c.html(html);
});

documents.get('/', (c) => {
  const userId = (c as any).get('userId') as string;
  const employer = getEmployerData(userId);
  if (!employer) return c.json({ success: true, data: [] });

  const docs = dbAll('SELECT * FROM documents WHERE employer_id = ? ORDER BY created_at DESC', [employer.id]);
  return c.json({ success: true, data: docs });
});

export default documents;
