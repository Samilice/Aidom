import { Hono } from 'hono';
import { dbRun, dbGet } from '../db/index.js';
import { generateId } from '../lib/id.js';
import { authMiddleware } from '../middleware/auth.js';

const employer = new Hono();
employer.use('*', authMiddleware);

employer.get('/', (c) => {
  const userId = (c as any).get('userId') as string;
  const emp = dbGet('SELECT * FROM employers WHERE user_id = ?', [userId]);

  if (!emp) return c.json({ success: true, data: null });

  return c.json({
    success: true,
    data: {
      id: emp.id, userId: emp.user_id, firstName: emp.first_name, lastName: emp.last_name,
      address: emp.address, postalCode: emp.postal_code, city: emp.city, canton: emp.canton,
      phone: emp.phone, avsNumber: emp.avs_number, createdAt: emp.created_at,
    },
  });
});

employer.post('/', async (c) => {
  const userId = (c as any).get('userId') as string;
  const body = await c.req.json();
  const { firstName, lastName, address, postalCode, city, canton, phone, avsNumber } = body;

  if (!firstName || !lastName || !address || !postalCode || !city || !canton || !phone) {
    return c.json({ success: false, error: 'Tous les champs obligatoires doivent être remplis.' }, 400);
  }

  const existing = dbGet('SELECT id FROM employers WHERE user_id = ?', [userId]);
  if (existing) {
    return c.json({ success: false, error: 'Un dossier employeur existe déjà.' }, 409);
  }

  const id = generateId('emp');
  dbRun(
    'INSERT INTO employers (id, user_id, first_name, last_name, address, postal_code, city, canton, phone, avs_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, userId, firstName, lastName, address, postalCode, city, canton, phone, avsNumber || '']
  );

  return c.json({
    success: true,
    data: { id, firstName, lastName, address, postalCode, city, canton, phone, avsNumber: avsNumber || '' },
  }, 201);
});

employer.put('/', async (c) => {
  const userId = (c as any).get('userId') as string;
  const body = await c.req.json();
  const { firstName, lastName, address, postalCode, city, canton, phone, avsNumber } = body;

  dbRun(
    'UPDATE employers SET first_name=?, last_name=?, address=?, postal_code=?, city=?, canton=?, phone=?, avs_number=? WHERE user_id=?',
    [firstName, lastName, address, postalCode, city, canton, phone, avsNumber || '', userId]
  );

  return c.json({ success: true });
});

export default employer;
