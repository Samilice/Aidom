import { Hono } from 'hono';
import { dbRun, dbGet, dbAll } from '../db/index.js';
import { generateId } from '../lib/id.js';
import { authMiddleware, type Env } from '../middleware/auth.js';
import { generateChecklist } from '../../src/domain/documents/checklist.js';

const checklist = new Hono<Env>();
checklist.use('*', authMiddleware);

checklist.get('/', async (c) => {
  const userId = (c as any).get('userId') as string;
  const db = c.env.DB;
  const employer = await dbGet(db, 'SELECT * FROM employers WHERE user_id = ?', [userId]);
  if (!employer) return c.json({ success: true, data: [] });
  let items = await dbAll(db, 'SELECT * FROM checklist_items WHERE employer_id = ? ORDER BY sort_order ASC', [employer.id]);
  if (items.length === 0) {
    const employee = await dbGet(db, 'SELECT type FROM employees WHERE employer_id = ? LIMIT 1', [employer.id]);
    const generated = generateChecklist(employer.canton, employee?.type || 'menage');
    for (let i = 0; i < generated.length; i++) {
      const item = generated[i];
      await dbRun(db, 'INSERT INTO checklist_items (id, employer_id, label, description, category, completed, due_description, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [generateId('chk'), employer.id, item.label, item.description, item.category, 0, item.dueDescription, i]);
    }
    items = await dbAll(db, 'SELECT * FROM checklist_items WHERE employer_id = ? ORDER BY sort_order ASC', [employer.id]);
  }
  return c.json({ success: true, data: items.map((i: any) => ({ id: i.id, label: i.label, description: i.description, category: i.category, completed: !!i.completed, dueDescription: i.due_description })) });
});

checklist.put('/:id', async (c) => {
  const userId = (c as any).get('userId') as string;
  const employer = await dbGet(c.env.DB, 'SELECT * FROM employers WHERE user_id = ?', [userId]);
  if (!employer) return c.json({ success: false, error: 'Dossier employeur manquant' }, 400);
  const body = await c.req.json();
  await dbRun(c.env.DB, 'UPDATE checklist_items SET completed = ? WHERE id = ? AND employer_id = ?', [body.completed ? 1 : 0, c.req.param('id'), employer.id]);
  return c.json({ success: true });
});

export default checklist;
