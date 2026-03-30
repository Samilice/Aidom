// ============================================
// AIDOM — Les 26 cantons suisses
// ============================================

export interface CantonData {
  code: string;
  name: string;
  nameDE: string;
  nameIT: string;
  region: 'romandie' | 'deutschschweiz' | 'ticino' | 'bilingue';
  language: string;
  afRate: number;       // Allocations familiales (taux employeur)
  adminRate: number;    // Frais d'administration
  minWageHour: number | null; // Salaire minimum horaire si applicable
  hasSimplifiedProcedure: boolean;
  registrationUrl: string;
}

export const CANTONS: CantonData[] = [
  // Romandie
  { code: 'GE', name: 'Genève', nameDE: 'Genf', nameIT: 'Ginevra', region: 'romandie', language: 'fr', afRate: 0.024, adminRate: 0.003, minWageHour: 24.32, hasSimplifiedProcedure: true, registrationUrl: 'https://www.ocas.ch' },
  { code: 'VD', name: 'Vaud', nameDE: 'Waadt', nameIT: 'Vaud', region: 'romandie', language: 'fr', afRate: 0.023, adminRate: 0.003, minWageHour: null, hasSimplifiedProcedure: true, registrationUrl: 'https://www.caisseavsvaud.ch' },
  { code: 'NE', name: 'Neuchâtel', nameDE: 'Neuenburg', nameIT: 'Neuchâtel', region: 'romandie', language: 'fr', afRate: 0.023, adminRate: 0.003, minWageHour: 21.09, hasSimplifiedProcedure: true, registrationUrl: 'https://www.caisseavsne.ch' },
  { code: 'FR', name: 'Fribourg', nameDE: 'Freiburg', nameIT: 'Friburgo', region: 'bilingue', language: 'fr/de', afRate: 0.023, adminRate: 0.003, minWageHour: null, hasSimplifiedProcedure: true, registrationUrl: 'https://www.caisseavsfr.ch' },
  { code: 'VS', name: 'Valais', nameDE: 'Wallis', nameIT: 'Vallese', region: 'bilingue', language: 'fr/de', afRate: 0.021, adminRate: 0.003, minWageHour: null, hasSimplifiedProcedure: true, registrationUrl: 'https://www.caisseavsvs.ch' },
  { code: 'JU', name: 'Jura', nameDE: 'Jura', nameIT: 'Giura', region: 'romandie', language: 'fr', afRate: 0.022, adminRate: 0.003, minWageHour: 21.09, hasSimplifiedProcedure: true, registrationUrl: 'https://www.caisseavsju.ch' },
  // Berne (bilingue)
  { code: 'BE', name: 'Berne', nameDE: 'Bern', nameIT: 'Berna', region: 'bilingue', language: 'fr/de', afRate: 0.018, adminRate: 0.003, minWageHour: null, hasSimplifiedProcedure: true, registrationUrl: 'https://www.akbern.ch' },
  // Deutschschweiz
  { code: 'ZH', name: 'Zurich', nameDE: 'Zürich', nameIT: 'Zurigo', region: 'deutschschweiz', language: 'de', afRate: 0.015, adminRate: 0.003, minWageHour: null, hasSimplifiedProcedure: true, registrationUrl: 'https://www.svazurich.ch' },
  { code: 'LU', name: 'Lucerne', nameDE: 'Luzern', nameIT: 'Lucerna', region: 'deutschschweiz', language: 'de', afRate: 0.020, adminRate: 0.003, minWageHour: null, hasSimplifiedProcedure: true, registrationUrl: 'https://www.ahvluzern.ch' },
  { code: 'UR', name: 'Uri', nameDE: 'Uri', nameIT: 'Uri', region: 'deutschschweiz', language: 'de', afRate: 0.020, adminRate: 0.003, minWageHour: null, hasSimplifiedProcedure: true, registrationUrl: 'https://www.akuri.ch' },
  { code: 'SZ', name: 'Schwyz', nameDE: 'Schwyz', nameIT: 'Svitto', region: 'deutschschweiz', language: 'de', afRate: 0.020, adminRate: 0.003, minWageHour: null, hasSimplifiedProcedure: true, registrationUrl: 'https://www.aksz.ch' },
  { code: 'OW', name: 'Obwald', nameDE: 'Obwalden', nameIT: 'Obvaldo', region: 'deutschschweiz', language: 'de', afRate: 0.018, adminRate: 0.003, minWageHour: null, hasSimplifiedProcedure: true, registrationUrl: 'https://www.akow.ch' },
  { code: 'NW', name: 'Nidwald', nameDE: 'Nidwalden', nameIT: 'Nidvaldo', region: 'deutschschweiz', language: 'de', afRate: 0.018, adminRate: 0.003, minWageHour: null, hasSimplifiedProcedure: true, registrationUrl: 'https://www.aknw.ch' },
  { code: 'GL', name: 'Glaris', nameDE: 'Glarus', nameIT: 'Glarona', region: 'deutschschweiz', language: 'de', afRate: 0.023, adminRate: 0.003, minWageHour: null, hasSimplifiedProcedure: true, registrationUrl: 'https://www.akgl.ch' },
  { code: 'ZG', name: 'Zoug', nameDE: 'Zug', nameIT: 'Zugo', region: 'deutschschweiz', language: 'de', afRate: 0.015, adminRate: 0.003, minWageHour: null, hasSimplifiedProcedure: true, registrationUrl: 'https://www.akzug.ch' },
  { code: 'SO', name: 'Soleure', nameDE: 'Solothurn', nameIT: 'Soletta', region: 'deutschschweiz', language: 'de', afRate: 0.021, adminRate: 0.003, minWageHour: null, hasSimplifiedProcedure: true, registrationUrl: 'https://www.akso.ch' },
  { code: 'BS', name: 'Bâle-Ville', nameDE: 'Basel-Stadt', nameIT: 'Basilea Città', region: 'deutschschweiz', language: 'de', afRate: 0.020, adminRate: 0.003, minWageHour: 21.00, hasSimplifiedProcedure: true, registrationUrl: 'https://www.akbs.ch' },
  { code: 'BL', name: 'Bâle-Campagne', nameDE: 'Basel-Landschaft', nameIT: 'Basilea Campagna', region: 'deutschschweiz', language: 'de', afRate: 0.019, adminRate: 0.003, minWageHour: null, hasSimplifiedProcedure: true, registrationUrl: 'https://www.akbl.ch' },
  { code: 'SH', name: 'Schaffhouse', nameDE: 'Schaffhausen', nameIT: 'Sciaffusa', region: 'deutschschweiz', language: 'de', afRate: 0.020, adminRate: 0.003, minWageHour: null, hasSimplifiedProcedure: true, registrationUrl: 'https://www.svash.ch' },
  { code: 'AR', name: 'Appenzell RE', nameDE: 'Appenzell A.Rh.', nameIT: 'Appenzello Est.', region: 'deutschschweiz', language: 'de', afRate: 0.020, adminRate: 0.003, minWageHour: null, hasSimplifiedProcedure: true, registrationUrl: 'https://www.svar.ch' },
  { code: 'AI', name: 'Appenzell RI', nameDE: 'Appenzell I.Rh.', nameIT: 'Appenzello Int.', region: 'deutschschweiz', language: 'de', afRate: 0.020, adminRate: 0.003, minWageHour: null, hasSimplifiedProcedure: true, registrationUrl: 'https://www.svai.ch' },
  { code: 'SG', name: 'Saint-Gall', nameDE: 'St. Gallen', nameIT: 'San Gallo', region: 'deutschschweiz', language: 'de', afRate: 0.022, adminRate: 0.003, minWageHour: null, hasSimplifiedProcedure: true, registrationUrl: 'https://www.svasg.ch' },
  { code: 'GR', name: 'Grisons', nameDE: 'Graubünden', nameIT: 'Grigioni', region: 'deutschschweiz', language: 'de/rm', afRate: 0.020, adminRate: 0.003, minWageHour: null, hasSimplifiedProcedure: true, registrationUrl: 'https://www.svagr.ch' },
  { code: 'AG', name: 'Argovie', nameDE: 'Aargau', nameIT: 'Argovia', region: 'deutschschweiz', language: 'de', afRate: 0.021, adminRate: 0.003, minWageHour: null, hasSimplifiedProcedure: true, registrationUrl: 'https://www.svaag.ch' },
  { code: 'TG', name: 'Thurgovie', nameDE: 'Thurgau', nameIT: 'Turgovia', region: 'deutschschweiz', language: 'de', afRate: 0.020, adminRate: 0.003, minWageHour: null, hasSimplifiedProcedure: true, registrationUrl: 'https://www.svatg.ch' },
  // Ticino
  { code: 'TI', name: 'Tessin', nameDE: 'Tessin', nameIT: 'Ticino', region: 'ticino', language: 'it', afRate: 0.020, adminRate: 0.003, minWageHour: null, hasSimplifiedProcedure: true, registrationUrl: 'https://www.iasticino.ch' },
];

export function getCantonByCode(code: string): CantonData | undefined {
  return CANTONS.find((c) => c.code === code);
}

export function getCantonsByRegion(region: string): CantonData[] {
  return CANTONS.filter((c) => c.region === region);
}
