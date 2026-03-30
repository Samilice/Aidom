import { Hono } from 'hono';
import { calculateCosts } from '../../src/domain/calculations/index.js';
import { checkEligibility } from '../../src/domain/eligibility/index.js';

const simulation = new Hono();

// POST /api/simulate — public endpoint (no auth needed for free simulator)
simulation.post('/costs', async (c) => {
  const body = await c.req.json();
  const { grossHourlyRate, hoursPerWeek, canton, includeThirteenthSalary, vacationWeeks } = body;

  if (!grossHourlyRate || !hoursPerWeek || !canton) {
    return c.json({ success: false, error: 'Paramètres manquants.' }, 400);
  }

  const result = calculateCosts({
    grossHourlyRate: Number(grossHourlyRate),
    hoursPerWeek: Number(hoursPerWeek),
    canton,
    includeThirteenthSalary: includeThirteenthSalary ?? true,
    vacationWeeks: vacationWeeks ?? 4,
  });

  return c.json({ success: true, data: result });
});

// POST /api/simulate/eligibility — public
simulation.post('/eligibility', async (c) => {
  const body = await c.req.json();
  const result = checkEligibility(body);
  return c.json({ success: true, data: result });
});

export default simulation;
