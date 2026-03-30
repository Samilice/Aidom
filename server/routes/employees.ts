import { Hono } from 'hono';
import { dbRun, dbGet, dbAll } from '../db/index.js';
import { generateId } from '../lib/id.js';
import { authMiddleware, type Env } from '../middleware/auth.js';

const employees = new Hono<Env>();
employees.use('*', authMiddleware);

async function getEmployerId(db: any, userId: string): Promise<string | null> {
  const emp = await dbGet(db, 'SELECT id FROM employers WHERE user_id = ?', [userId]);
  return emp?.id || null;
}

function mapEmployee(row: any) {
  return { id: row.id, employerId: row.employer_id, firstName: row.first_name, lastName: row.last_name, dateOfBirth: row.date_of_birth, nationality: row.nationality, permitType: row.permit_type, avsNumber: row.avs_number, type: row.type, grossHourlyRate: row.gross_hourly_rate, hoursPerWeek: row.hours_per_week, startDate: row.start_date, endDate: row.end_date, status: row.status, createdAt: row.created_at };
}

employees.get('/', async (c) => {
  const userId = (c as any).get('userId') as string;
  const employerId = await getEmployerId(c.env.DB, userId);
  if (!employerId) return c.json({ success: true, data: [] });
  const rows = await dbAll(c.env.DB, 'SELECT * FROM employees WHERE employer_id = ? ORDER BY created_at DESC', [employerId]);
  return c.json({ success: true, data: rows.map(mapEmployee) });
});

employees.get('/:id', async (c) => {
  const userId = (c as any).get('userId') as string;
  const employerId = await getEmployerId(c.env.DB, userId);
  const row = await dbGet(c.env.DB, 'SELECT * FROM employees WHERE id = ? AND employer_id = ?', [c.req.param('id'), employerId]);
  if (!row) return c.json({ success: false, error: 'Employé non trouvé' }, 404);
  return c.json({ success: true, data: mapEmployee(row) });
});

employees.post('/', async (c) => {
  const userId = (c as any).get('userId') as string;
  const db = c.env.DB;
  const employerId = await getEmployerId(db, userId);
  if (!employerId) return c.json({ success: false, error: 'Créez d\'abord votre dossier employeur.' }, 400);
  const user = await dbGet(db, 'SELECT plan FROM users WHERE id = ?', [userId]);
  const countRow = await dbGet(db, 'SELECT COUNT(*) as count FROM employees WHERE employer_id = ? AND status = ?', [employerId, 'active']);
  const maxEmployees = (user?.plan === 'duo' || user?.plan === 'serenite') ? 2 : 1;
  if ((countRow?.count || 0) >= maxEmployees)
    return c.json({ success: false, error: `Votre formule permet ${maxEmployees} employé(s) actif(s) maximum.` }, 403);

  const body = await c.req.json();
  const { firstName, lastName, dateOfBirth, nationality, permitType, avsNumber, type, grossHourlyRate, hoursPerWeek, startDate } = body;
  if (!firstName || !lastName || !dateOfBirth || !type || !grossHourlyRate || !hoursPerWeek || !startDate)
    return c.json({ success: false, error: 'Champs obligatoires manquants.' }, 400);
  const id = generateId('ee');
  await dbRun(db, 'INSERT INTO employees (id, employer_id, first_name, last_name, date_of_birth, nationality, permit_type, avs_number, type, gross_hourly_rate, hours_per_week, start_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, employerId, firstName, lastName, dateOfBirth, nationality || 'Suisse', permitType || null, avsNumber || '', type, grossHourlyRate, hoursPerWeek, startDate]);
  const created = await dbGet(db, 'SELECT * FROM employees WHERE id = ?', [id]);
  return c.json({ success: true, data: mapEmployee(created) }, 201);
});

employees.put('/:id', async (c) => {
  const userId = (c as any).get('userId') as string;
  const db = c.env.DB;
  const employerId = await getEmployerId(db, userId);
  const employeeId = c.req.param('id');
  const existing = await dbGet(db, 'SELECT id FROM employees WHERE id = ? AND employer_id = ?', [employeeId, employerId]);
  if (!existing) return c.json({ success: false, error: 'Employé non trouvé' }, 404);
  const { firstName, lastName, dateOfBirth, nationality, permitType, avsNumber, type, grossHourlyRate, hoursPerWeek, startDate, endDate, status } = await c.req.json();
  await dbRun(db, 'UPDATE employees SET first_name=?, last_name=?, date_of_birth=?, nationality=?, permit_type=?, avs_number=?, type=?, gross_hourly_rate=?, hours_per_week=?, start_date=?, end_date=?, status=? WHERE id=?',
    [firstName, lastName, dateOfBirth, nationality, permitType, avsNumber, type, grossHourlyRate, hoursPerWeek, startDate, endDate || null, status || 'active', employeeId]);
  return c.json({ success: true });
});

export default employees;
