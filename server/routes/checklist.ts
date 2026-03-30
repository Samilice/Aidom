import { Hono } from 'hono';
import { dbRun, dbGet, dbAll } from '../db/index.js';
import { generateId } from '../lib/id.js';
import { authMiddleware } from '../middleware/auth.js';
import { generateChecklist } from '../../src/domain/documents/checklist.js';

const checklist = new Hono();
checklist.use('*', authMiddleware);

function getEmployerData(userId: string) {
  return dbGet('SELECT * FROM employers WHERE user_id = ?', [userId]);
}

checklist.get('/', (c) => {
  const userId = (c as any).get('userId') as string;
  const employer = getEmployerData(userId);
  if (!employer) return c.json({ success: true, data: [] });

  let items = dbAll('SELECT * FROM checklist_items WHERE employer_id = ? ORDER BY sort_order ASC', [employer.id]);

  if (items.length === 0) {
    const employee = dbGet('SELECT type FROM employees WHERE employer_id = ? LIMIT 1', [employer.id]);
    const employeeType = employee?.type || 'menage';
    const generated = generateChecklist(employer.canton, employeeType);

    generated.forEach((item, i) => {
      const id = generateId('chk');
      dbRun(
        'INSERT INTO checklist_items (id, employer_id, label, description, category, completed, due_description, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [id, employer.id, item.label, item.description, item.category, 0, item.dueDescription, i]
      );
    });

    items = dbAll('SELECT * FROM checklist_items WHERE employer_id = ? ORDER BY sort_order ASC', [employer.id]);
  }

  return c.json({
    success: true,
    data: items.map((item: any) => ({
      id: item.id, label: item.label, description: item.description,
      category: item.category, completed: !!item.completed, dueDescription: item.due_description,
    })),
  });
});

checklist.put('/:id', async (c) => {
  const userId = (c as any).get('userId') as string;
  const employer = getEmployerData(userId);
  if (!employer) return c.json({ success: false, error: 'Dossier employeur manquant' }, 400);

  const body = await c.req.json();
  dbRun('UPDATE checklist_items SET completed = ? WHERE id = ? AND employer_id = ?',
    [body.completed ? 1 : 0, c.req.param('id'), employer.id]);

  return c.json({ success: true });
});

export default checklist;
