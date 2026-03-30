// ============================================
// AIDOM — Payslip HTML Template
// ============================================

import type { PayslipData } from '../../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const MONTH_NAMES = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

export function generatePayslipHtml(data: PayslipData): string {
  const monthLabel = MONTH_NAMES[data.month - 1];
  const totalDeductions = data.deductions.reduce((sum, d) => sum + d.amount, 0);

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      font-size: 10pt;
      line-height: 1.5;
      color: #1a1a1a;
      max-width: 650px;
      margin: 30px auto;
      padding: 0 20px;
    }
    h1 { font-size: 14pt; text-align: center; margin-bottom: 4px; }
    .subtitle { text-align: center; color: #666; margin-bottom: 24px; }
    .info-grid { display: flex; justify-content: space-between; margin-bottom: 20px; }
    .info-block { width: 48%; }
    .info-block strong { display: block; margin-bottom: 4px; color: #333; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th, td { padding: 6px 10px; text-align: left; border-bottom: 1px solid #eee; }
    th { background: #f7f7f7; font-weight: 600; font-size: 9pt; text-transform: uppercase; }
    .amount { text-align: right; }
    .total-row { font-weight: 700; border-top: 2px solid #333; background: #f0f4f8; }
    .deduction .amount { color: #c0392b; }
    .net .amount { color: #27ae60; font-size: 12pt; }
    .footer { margin-top: 30px; font-size: 8pt; color: #aaa; text-align: center; }
  </style>
</head>
<body>
  <h1>Fiche de paie</h1>
  <div class="subtitle">${monthLabel} ${data.year}</div>

  <div class="info-grid">
    <div class="info-block">
      <strong>Employeur</strong>
      ${data.employer.firstName} ${data.employer.lastName}<br/>
      ${data.employer.address}<br/>
      ${data.employer.postalCode} ${data.employer.city}
    </div>
    <div class="info-block">
      <strong>Employé(e)</strong>
      ${data.employee.firstName} ${data.employee.lastName}<br/>
      N° AVS : ${data.employee.avsNumber || '—'}<br/>
      Fonction : ${data.employee.type}
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Désignation</th>
        <th class="amount">Taux</th>
        <th class="amount">Montant (CHF)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Heures travaillées</td>
        <td class="amount">${data.workedHours}h</td>
        <td class="amount"></td>
      </tr>
      <tr>
        <td><strong>Salaire brut</strong></td>
        <td class="amount"></td>
        <td class="amount"><strong>${fmt(data.grossSalary)}</strong></td>
      </tr>
      ${data.deductions.map((d) => `
      <tr class="deduction">
        <td>${d.label}</td>
        <td class="amount">${d.rate.toFixed(1)}%</td>
        <td class="amount">- ${fmt(d.amount)}</td>
      </tr>`).join('')}
      <tr class="total-row">
        <td>Total déductions</td>
        <td class="amount"></td>
        <td class="amount">- ${fmt(totalDeductions)}</td>
      </tr>
      <tr class="total-row net">
        <td><strong>Salaire net</strong></td>
        <td class="amount"></td>
        <td class="amount"><strong>${fmt(data.netSalary)}</strong></td>
      </tr>
    </tbody>
  </table>

  <div class="footer">
    Document généré par Aidom — aidom.ch<br/>
    Ce document est un décompte simplifié.
  </div>
</body>
</html>`;
}

function fmt(n: number): string {
  return n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}
