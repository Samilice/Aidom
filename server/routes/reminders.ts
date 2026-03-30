import { Hono } from 'hono';
import { dbRun, dbGet, dbAll } from '../db/index.js';
import { authMiddleware } from '../middleware/auth.js';

const reminders = new Hono();
reminders.use('*', authMiddleware);

function getEmployerId(userId: string): string | null {
  const emp = dbGet('SELECT id FROM employers WHERE user_id = ?', [userId]);
  return emp?.id || null;
}

reminders.get('/', (c) => {
  const userId = (c as any).get('userId') as string;
  const employerId = getEmployerId(userId);
  if (!employerId) return c.json({ success: true, data: [] });

  const rows = dbAll('SELECT * FROM reminders WHERE employer_id = ? ORDER BY due_date ASC', [employerId]);
  return c.json({
    success: true,
    data: rows.map((r: any) => ({
      id: r.id, employerId: r.employer_id, type: r.type, title: r.title,
      description: r.description, dueDate: r.due_date, status: r.status, createdAt: r.created_at,
    })),
  });
});

reminders.put('/:id/status', async (c) => {
  const userId = (c as any).get('userId') as string;
  const employerId = getEmployerId(userId);
  const body = await c.req.json();

  dbRun('UPDATE reminders SET status = ? WHERE id = ? AND employer_id = ?',
    [body.status, c.req.param('id'), employerId]);

  return c.json({ success: true });
});

export default reminders;
