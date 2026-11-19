import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import {
  CANDIDATE_LISTS,
  ELECTION_TOTALS,
  type PercentageMode,
} from '../data/electionData';

interface ModeChartProps {
  mode: PercentageMode;
}

export function VotesByListBarChart({ mode }: ModeChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart<'bar'> | null>(null);
  const modeRef = useRef<PercentageMode>(mode);
  modeRef.current = mode;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: CANDIDATE_LISTS.map((l) => `Lista ${l.number}: ${l.name}`),
        datasets: [
          {
            label: 'Votos',
            data: CANDIDATE_LISTS.map((l) => l.votes),
            backgroundColor: CANDIDATE_LISTS.map((l) => l.color),
            borderRadius: 8,
            maxBarThickness: 64,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0f172a',
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => {
                const list = CANDIDATE_LISTS[ctx.dataIndex];
                const currentMode = modeRef.current;
                const pct = currentMode === 'total' ? list.pctTotal : list.pctValid;
                const base = currentMode === 'total' ? 'del total' : 'de válidos';
                return `${list.votes} votos (${pct.toFixed(2)}% ${base})`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            suggestedMax: 320,
            grid: { color: '#f1f5f9' },
            border: { display: false },
            ticks: {
              color: '#64748b',
              font: { family: "'JetBrains Mono', monospace", size: 11 },
            },
            title: {
              display: true,
              text: 'Cantidad de votos',
              color: '#64748b',
              font: { family: "'DM Sans', sans-serif", size: 11, weight: 600 },
            },
          },
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: {
              color: '#334155',
              font: { family: "'DM Sans', sans-serif", size: 11, weight: 600 },
            },
          },
        },
      },
    });

    chartRef.current = chart;
    return () => {
      chart.destroy();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    chartRef.current?.update();
  }, [mode]);

  return <canvas ref={canvasRef} aria-label="Gráfico de barras de votos por lista" />;
}

export function VoteDistributionDoughnutChart({ mode }: ModeChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart<'doughnut'> | null>(null);
  const modeRef = useRef<PercentageMode>(mode);
  modeRef.current = mode;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isInitialTotal = modeRef.current === 'total';
    const chart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: isInitialTotal
          ? [
              'Lista 1: ACCIÓN "SAN RAMON"',
              'Lista 2: CAMINO LUMINOSO',
              'Votos en blanco',
              'Votos nulos',
            ]
          : ['Lista 1: ACCIÓN "SAN RAMON"', 'Lista 2: CAMINO LUMINOSO'],
        datasets: [
          {
            data: isInitialTotal
              ? [
                  CANDIDATE_LISTS[0].votes,
                  CANDIDATE_LISTS[1].votes,
                  ELECTION_TOTALS.blankVotes,
                  ELECTION_TOTALS.nullVotes,
                ]
              : [CANDIDATE_LISTS[0].votes, CANDIDATE_LISTS[1].votes],
            backgroundColor: isInitialTotal
              ? ['#0284c7', '#0d9488', '#94a3b8', '#dc4c4c']
              : ['#0284c7', '#0d9488'],
            borderWidth: 2,
            borderColor: '#ffffff',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '62%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 10,
              boxHeight: 10,
              padding: 12,
              color: '#334155',
              font: { family: "'DM Sans', sans-serif", size: 11, weight: 500 },
            },
          },
          tooltip: {
            backgroundColor: '#0f172a',
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => {
                const val = Number(ctx.raw);
                const currentMode = modeRef.current;
                const denom =
                  currentMode === 'total'
                    ? ELECTION_TOTALS.totalIssued
                    : ELECTION_TOTALS.validVotes;
                const pct = ((val / denom) * 100).toFixed(2);
                const base = currentMode === 'total' ? 'del total' : 'de válidos';
                return `${ctx.label}: ${val} votos (${pct}% ${base})`;
              },
            },
          },
        },
      },
    });

    chartRef.current = chart;
    return () => {
      chart.destroy();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    if (mode === 'total') {
      chart.data.labels = [
        'Lista 1: ACCIÓN "SAN RAMON"',
        'Lista 2: CAMINO LUMINOSO',
        'Votos en blanco',
        'Votos nulos',
      ];
      chart.data.datasets[0].data = [
        CANDIDATE_LISTS[0].votes,
        CANDIDATE_LISTS[1].votes,
        ELECTION_TOTALS.blankVotes,
        ELECTION_TOTALS.nullVotes,
      ];
      chart.data.datasets[0].backgroundColor = [
        '#0284c7',
        '#0d9488',
        '#94a3b8',
        '#dc4c4c',
      ];
    } else {
      chart.data.labels = [
        'Lista 1: ACCIÓN "SAN RAMON"',
        'Lista 2: CAMINO LUMINOSO',
      ];
      chart.data.datasets[0].data = [
        CANDIDATE_LISTS[0].votes,
        CANDIDATE_LISTS[1].votes,
      ];
      chart.data.datasets[0].backgroundColor = ['#0284c7', '#0d9488'];
    }

    chart.update();
  }, [mode]);

  return (
    <canvas
      ref={canvasRef}
      aria-label="Gráfico circular de distribución de votos"
    />
  );
}

export function AttendanceDoughnutChart() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const chart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: [
          `Votaron (${ELECTION_TOTALS.totalIssued})`,
          `Ausentes (${ELECTION_TOTALS.absentVoters})`,
        ],
        datasets: [
          {
            data: [ELECTION_TOTALS.totalIssued, ELECTION_TOTALS.absentVoters],
            backgroundColor: ['#0284c7', '#cbd5e1'],
            borderWidth: 2,
            borderColor: '#ffffff',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '62%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 10,
              boxHeight: 10,
              padding: 14,
              color: '#334155',
              font: { family: "'DM Sans', sans-serif", size: 12, weight: 500 },
            },
          },
          tooltip: {
            backgroundColor: '#0f172a',
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => {
                const val = Number(ctx.raw);
                const pct = ((val / ELECTION_TOTALS.eligibleVoters) * 100).toFixed(2);
                return `${ctx.label.split(' ')[0]}: ${val} electores (${pct}%)`;
              },
            },
          },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-label="Gráfico circular de asistencia electoral"
    />
  );
}
