export type PercentageMode = 'total' | 'valid';

export interface CandidateList {
  number: number;
  name: string;
  candidate: string;
  votes: number;
  pctTotal: number;
  pctValid: number;
  color: string;
  winner: boolean;
}

export interface KpiMetric {
  id: string;
  label: string;
  value: string;
  sublabel: string;
  tone: 'neutral' | 'emerald' | 'amber' | 'slate' | 'rose';
}

export const ELECTION_META = {
  institution: 'I.E.E. "SAN RAMÓN"',
  location: 'La Recoleta (Cajamarca)',
  title: 'Elecciones Democráticas del Municipio Escolar Sanramonino 2027',
  pollingStation: 'Local La Recoleta (Cajamarca)',
  date: '6 de noviembre de 2026',
  year: '2027',
  crestUrl: '/assets/aistudio/INSIGNIA_db8811a1.png',
};

export const ELECTION_TOTALS = {
  eligibleVoters: 720,
  totalIssued: 561,
  participationPct: 77.92,
  absentVoters: 159,
  absentPct: 22.08,
  validVotes: 488,
  validPctOfIssued: 86.99,
  blankVotes: 29,
  blankPctOfIssued: 5.17,
  nullVotes: 44,
  nullPctOfIssued: 7.84,
  voteMargin: 60,
};

export const CANDIDATE_LISTS: CandidateList[] = [
  {
    number: 1,
    name: 'ACCIÓN "SAN RAMON"',
    candidate: 'GOICOCHEA GUTIERREZ, JEFERSON MANUEL',
    votes: 214,
    pctTotal: 38.15,
    pctValid: 43.85,
    color: '#0284c7',
    winner: false,
  },
  {
    number: 2,
    name: 'CAMINO LUMINOSO',
    candidate: 'ROJAS ROBLES, YEIRU',
    votes: 274,
    pctTotal: 48.84,
    pctValid: 56.15,
    color: '#0d9488',
    winner: true,
  },
];

export const KPI_METRICS: KpiMetric[] = [
  {
    id: 'eligible',
    label: 'Electores hábiles',
    value: '720',
    sublabel: 'Padrón electoral',
    tone: 'neutral',
  },
  {
    id: 'issued',
    label: 'Votos emitidos',
    value: '561',
    sublabel: 'Total en urna',
    tone: 'neutral',
  },
  {
    id: 'participation',
    label: 'Participación',
    value: '77.92%',
    sublabel: '561 de 720 electores',
    tone: 'emerald',
  },
  {
    id: 'absent',
    label: 'Ausentismo',
    value: '159',
    sublabel: '22.08% del padrón',
    tone: 'amber',
  },
  {
    id: 'valid',
    label: 'Votos válidos',
    value: '488',
    sublabel: '86.99% de emitidos',
    tone: 'emerald',
  },
  {
    id: 'blank',
    label: 'Votos en blanco',
    value: '29',
    sublabel: '5.17% de emitidos',
    tone: 'slate',
  },
  {
    id: 'null',
    label: 'Votos nulos',
    value: '44',
    sublabel: '7.84% de emitidos',
    tone: 'rose',
  },
];

export function downloadResultsCsv(): void {
  const rows = [
    ['Institución', ELECTION_META.institution],
    ['Proceso Electoral', ELECTION_META.title],
    ['Mesa / Local', ELECTION_META.pollingStation],
    ['Fecha', ELECTION_META.date],
    [],
    ['N°', 'Lista', 'Candidato', 'Votos', '% del total (561)', '% de válidos (488)', 'Estado'],
    ...CANDIDATE_LISTS.map((list) => [
      String(list.number),
      list.name,
      list.candidate,
      String(list.votes),
      `${list.pctTotal.toFixed(2)}%`,
      `${list.pctValid.toFixed(2)}%`,
      list.winner ? 'Ganadora' : 'Lista participante',
    ]),
    [],
    ['Resumen General', 'Cantidad', 'Porcentaje'],
    ['Votos válidos', String(ELECTION_TOTALS.validVotes), `${ELECTION_TOTALS.validPctOfIssued.toFixed(2)}%`],
    ['Votos en blanco', String(ELECTION_TOTALS.blankVotes), `${ELECTION_TOTALS.blankPctOfIssued.toFixed(2)}%`],
    ['Votos nulos', String(ELECTION_TOTALS.nullVotes), `${ELECTION_TOTALS.nullPctOfIssued.toFixed(2)}%`],
    ['Votos emitidos', String(ELECTION_TOTALS.totalIssued), `${ELECTION_TOTALS.participationPct.toFixed(2)}%`],
    ['Ausentismo', String(ELECTION_TOTALS.absentVoters), `${ELECTION_TOTALS.absentPct.toFixed(2)}%`],
    ['Electores hábiles', String(ELECTION_TOTALS.eligibleVoters), '100.00%'],
  ];

  const csvContent = rows
    .map((row) =>
      row
        .map((cell) => `"${cell.replace(/"/g, '""')}"`)
        .join(',')
    )
    .join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'resultados_san_ramon_2027.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
