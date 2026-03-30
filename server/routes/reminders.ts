import { Hono } from 'hono';
import { dbRun, dbGet, dbAll } from '../db/index.js';
import { authMiddleware, type Env } from '../middleware/auth.js';

const reminders = new Hono<Env>();
reminders.use('*', authMiddleware);

reminders.get('/', async (c) => {
  const userId = (c as any).get('userId') as string;
  const emp = await dbGet(c.env.DB, 'SELECT id FROM employers WHERE user_id = ?', [userId]);
  if (!emp) return c.json({ success: true, data: [] });
  const rows = await dbAll(c.env.DB, 'SELECT * FROM reminders WHERE employer_id = ? ORDER BY due_date ASC', [emp.id]);
  return c.json({ success: true, data: rows.map((r: any) => ({ id: r.id, employerId: r.employer_id, type: r.type, title: r.title, description: r.description, dueDate: r.due_date, status: r.status, createdAt: r.created_at })) });
});

reminders.put('/:id/status', async (c) => {
  const userId = (c as any).get('userId') as string;
  const emp = await dbGet(c.env.DB, 'SELECT id FROM employers WHERE user_id = ?', [userId]);
  const body = await c.req.json();
  await dbRun(c.env.DB, 'UPDATE reminders SET status = ? WHERE id = ? AND employer_id = ?', [body.status, c.req.param('id'), emp?.id]);
  return c.json({ success: true });
});

export default reminders;
