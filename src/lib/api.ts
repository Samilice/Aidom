// ============================================
// AIDOM — API Client
// ============================================

const BASE_URL = '/api';

function getToken(): string | null {
  return localStorage.getItem('aidom_token');
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // For HTML responses (contracts, payslips)
  const contentType = res.headers.get('content-type');
  if (contentType?.includes('text/html')) {
    const html = await res.text();
    return { success: true, data: html as unknown as T };
  }

  const json = await res.json();
  return json;
}

export const api = {
  // Auth
  signup: (data: { email: string; password: string; firstName: string; lastName: string }) =>
    request('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  getMe: () => request('/auth/me'),

  // Employer
  getEmployer: () => request('/employer'),
  createEmployer: (data: any) =>
    request('/employer', { method: 'POST', body: JSON.stringify(data) }),
  updateEmployer: (data: any) =>
    request('/employer', { method: 'PUT', body: JSON.stringify(data) }),

  // Employees
  getEmployees: () => request('/employees'),
  getEmployee: (id: string) => request(`/employees/${id}`),
  createEmployee: (data: any) =>
    request('/employees', { method: 'POST', body: JSON.stringify(data) }),
  updateEmployee: (id: string, data: any) =>
    request(`/employees/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Simulation (public)
  simulateCosts: (data: any) =>
    request('/simulate/costs', { method: 'POST', body: JSON.stringify(data) }),
  checkEligibility: (data: any) =>
    request('/simulate/eligibility', { method: 'POST', body: JSON.stringify(data) }),

  // Documents
  generateContract: (employeeId: string, options?: any) =>
    request(`/documents/contract/${employeeId}`, {
      method: 'POST',
      body: JSON.stringify(options || {}),
    }),
  generatePayslip: (employeeId: string, data: { month: number; year: number; workedHours?: number }) =>
    request(`/documents/payslip/${employeeId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getDocuments: () => request('/documents'),

  // Checklist
  getChecklist: () => request('/checklist'),
  toggleChecklistItem: (id: string, completed: boolean) =>
    request(`/checklist/${id}`, { method: 'PUT', body: JSON.stringify({ completed }) }),

  // Reminders
  getReminders: () => request('/reminders'),
  updateReminderStatus: (id: string, status: string) =>
    request(`/reminders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),

  // Stripe
  createCheckout: (plan: string) =>
    request('/stripe/create-checkout', { method: 'POST', body: JSON.stringify({ plan }) }),
  activatePlan: (plan: string) =>
    request('/stripe/activate', { method: 'POST', body: JSON.stringify({ plan }) }),
  getSubscriptionStatus: () => request('/stripe/status'),
};
