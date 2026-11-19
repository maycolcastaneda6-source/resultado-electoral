import { useState } from 'react';
import {
  Award,
  BarChart3,
  ChevronRight,
  Download,
  FileSpreadsheet,
  LayoutDashboard,
  PieChart,
  Printer,
} from 'lucide-react';
import {
  CANDIDATE_LISTS,
  ELECTION_META,
  ELECTION_TOTALS,
  KPI_METRICS,
  downloadResultsCsv,
  type PercentageMode,
} from './data/electionData';
import {
  AttendanceDoughnutChart,
  VoteDistributionDoughnutChart,
  VotesByListBarChart,
} from './components/ElectionCharts';

type TabKey = 'resumen' | 'indicadores' | 'graficos' | 'resultados';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'resumen', label: 'Resumen' },
  { key: 'indicadores', label: 'Indicadores' },
  { key: 'graficos', label: 'Gráficos' },
  { key: 'resultados', label: 'Resultados' },
];

const KPI_TOP_ACCENT: Record<string, string> = {
  neutral: 'border-t-sky-600',
  emerald: 'border-t-teal-600',
  amber: 'border-t-amber-500',
  slate: 'border-t-slate-400',
  rose: 'border-t-rose-400',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('resumen');
  const [mode, setMode] = useState<PercentageMode>('total');
  const [crestError, setCrestError] = useState(false);

  const isTotal = mode === 'total';
  const winnerList = CANDIDATE_LISTS.find((l) => l.winner) ?? CANDIDATE_LISTS[1];
  const orderedLists = [...CANDIDATE_LISTS].sort((a, b) => b.votes - a.votes);

  const winnerPct = isTotal
    ? winnerList.pctTotal.toFixed(2)
    : winnerList.pctValid.toFixed(2);

  const summaryKpis = KPI_METRICS.filter((k) =>
    ['eligible', 'issued', 'participation', 'valid'].includes(k.id)
  );

  const voterBreakdown = [
    {
      label: 'Votos válidos (Listas 1 y 2)',
      count: ELECTION_TOTALS.validVotes,
      pctRoster: ((ELECTION_TOTALS.validVotes / ELECTION_TOTALS.eligibleVoters) * 100).toFixed(2),
      pctIssued: ELECTION_TOTALS.validPctOfIssued.toFixed(2),
      barColor: 'bg-teal-600',
      dotColor: 'bg-teal-600',
    },
    {
      label: 'Votos en blanco',
      count: ELECTION_TOTALS.blankVotes,
      pctRoster: ((ELECTION_TOTALS.blankVotes / ELECTION_TOTALS.eligibleVoters) * 100).toFixed(2),
      pctIssued: ELECTION_TOTALS.blankPctOfIssued.toFixed(2),
      barColor: 'bg-slate-400',
      dotColor: 'bg-slate-400',
    },
    {
      label: 'Votos nulos',
      count: ELECTION_TOTALS.nullVotes,
      pctRoster: ((ELECTION_TOTALS.nullVotes / ELECTION_TOTALS.eligibleVoters) * 100).toFixed(2),
      pctIssued: ELECTION_TOTALS.nullPctOfIssued.toFixed(2),
      barColor: 'bg-rose-400',
      dotColor: 'bg-rose-400',
    },
    {
      label: 'Ausentismo (no votaron)',
      count: ELECTION_TOTALS.absentVoters,
      pctRoster: ELECTION_TOTALS.absentPct.toFixed(2),
      pctIssued: null,
      barColor: 'bg-amber-400',
      dotColor: 'bg-amber-400',
    },
  ];

  const handleSelectTab = (tab: TabKey) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f4f8fb] text-slate-900">
      {/* Top Bar: 3 zones on desktop, clean responsive 2-row tab bar on mobile */}
      <header className="no-print md:sticky md:top-0 z-20 border-b border-sky-200/80 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-4 py-3 sm:gap-8 sm:px-6">
          <button
            type="button"
            onClick={() => handleSelectTab('resumen')}
            className="flex items-center gap-2.5 font-display text-sm font-extrabold tracking-tight text-sky-950 whitespace-nowrap shrink-0 cursor-pointer sm:text-base"
          >
            {!crestError && (
              <img
                src={ELECTION_META.crestUrl}
                alt="Insignia I.E.E. San Ramón"
                referrerPolicy="no-referrer"
                onError={() => setCrestError(true)}
                className="h-7 w-7 object-contain shrink-0"
              />
            )}
            <span>{ELECTION_META.institution}</span>
          </button>

          <nav
            role="tablist"
            aria-label="Pestañas del dashboard"
            className="hidden md:flex items-center gap-2 text-sm font-medium"
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleSelectTab(tab.key)}
                  className={`relative rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 ${
                    isActive
                      ? 'bg-sky-50 text-sky-800'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-sky-700"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={downloadResultsCsv}
              className="inline-flex items-center gap-1.5 rounded-lg bg-sky-700 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-sky-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 whitespace-nowrap shrink-0 cursor-pointer sm:gap-2 sm:px-4"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Exportar CSV</span>
            </button>
          </div>
        </div>

        {/* Mobile Tab Bar: full 4-column responsive tabs */}
        <nav
          role="tablist"
          aria-label="Pestañas móviles del dashboard"
          className="grid grid-cols-4 border-t border-sky-100 bg-white md:hidden"
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleSelectTab(tab.key)}
                className={`relative flex min-h-[44px] items-center justify-center px-1.5 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-sky-50/70 text-sky-800'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="truncate">{tab.label}</span>
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-sky-700"
                  />
                )}
              </button>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto flex max-w-[1200px] flex-col gap-5 px-4 py-5 sm:gap-6 sm:px-6 sm:py-8">
        {/* Encabezado Institucional Persistente */}
        <section
          aria-label="Encabezado electoral"
          className="rounded-xl border border-sky-200 bg-gradient-to-br from-[#e0f2fe] via-[#eff8ff] to-white px-4 py-5 text-slate-900 sm:px-8 sm:py-7"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3.5 sm:items-center sm:gap-5">
              {!crestError ? (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-sky-200/80 bg-white p-1.5 sm:h-24 sm:w-24 sm:p-2">
                  <img
                    src={ELECTION_META.crestUrl}
                    alt="Insignia oficial de la I.E.E. San Ramón de Cajamarca"
                    referrerPolicy="no-referrer"
                    onError={() => setCrestError(true)}
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-sky-200 bg-white font-display text-lg font-extrabold text-sky-800 sm:h-24 sm:w-24 sm:text-xl">
                  SR
                </div>
              )}

              <div className="min-w-0 space-y-1">
                <p className="text-xs font-bold tracking-wide text-sky-800">
                  {ELECTION_META.institution} · {ELECTION_META.location}
                </p>
                <h1 className="font-display text-lg font-extrabold leading-snug tracking-tight text-slate-900 text-balance sm:text-3xl sm:leading-tight">
                  {ELECTION_META.title}
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-sky-200/60 pt-3 text-xs text-slate-600 sm:text-sm lg:shrink-0 lg:justify-end lg:border-t-0 lg:pt-0">
              <span>
                Mesa:{' '}
                <strong className="font-semibold text-sky-950">
                  {ELECTION_META.pollingStation}
                </strong>
              </span>
              <span aria-hidden="true" className="text-sky-400">
                ·
              </span>
              <span>
                Fecha:{' '}
                <strong className="font-semibold text-sky-950">
                  {ELECTION_META.date}
                </strong>
              </span>
            </div>
          </div>
        </section>

        {/* Barra de Selector de Base Porcentual (responsiva en celular y escritorio) */}
        <section
          aria-label="Selector de cálculo de porcentaje"
          className="no-print flex flex-col gap-3 rounded-xl border border-sky-200/80 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-3.5"
        >
          <span className="text-xs font-medium text-slate-600 sm:text-sm">
            Visualización de porcentajes en gráficos y tablas:
          </span>

          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3">
            <div
              role="group"
              aria-label="Base porcentual"
              className="grid grid-cols-1 gap-1 rounded-lg border border-sky-200/80 bg-sky-50/70 p-1 min-[480px]:grid-cols-2 sm:inline-flex"
            >
              <button
                type="button"
                onClick={() => setMode('total')}
                aria-pressed={isTotal}
                className={`min-h-[40px] rounded-md px-3 py-2 text-xs font-semibold transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 sm:whitespace-nowrap ${
                  isTotal
                    ? 'bg-sky-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-sky-900'
                }`}
              >
                % sobre el total (561)
              </button>
              <button
                type="button"
                onClick={() => setMode('valid')}
                aria-pressed={!isTotal}
                className={`min-h-[40px] rounded-md px-3 py-2 text-xs font-semibold transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 sm:whitespace-nowrap ${
                  !isTotal
                    ? 'bg-sky-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-sky-900'
                }`}
              >
                % sobre válidos (488)
              </button>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-sky-50/60 hover:text-sky-900 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
            >
              <Printer className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Imprimir</span>
            </button>
          </div>
        </section>

        {/* PESTAÑA 1: RESUMEN */}
        {activeTab === 'resumen' && (
          <div
            role="tabpanel"
            aria-label="Resumen electoral"
            className="flex flex-col gap-5 sm:gap-6"
          >
            {/* Tarjeta Destacada de la Lista Ganadora */}
            <section
              aria-label="Lista ganadora"
              className="rounded-xl border border-teal-200/90 bg-gradient-to-br from-teal-50/60 via-sky-50/30 to-white p-5 sm:p-7"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold tracking-wide text-teal-800">
                    <Award className="h-4 w-4 text-teal-700" aria-hidden="true" />
                    <span>Lista Ganadora · Lista {winnerList.number}</span>
                  </div>
                  <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                    {winnerList.name}
                  </h2>
                  <p className="text-sm text-slate-600 sm:text-base">
                    Candidato:{' '}
                    <strong className="font-semibold text-slate-900">
                      {winnerList.candidate}
                    </strong>
                  </p>
                </div>

                <div className="grid grid-cols-1 divide-y divide-teal-200/80 rounded-lg border border-teal-200/80 bg-white min-[420px]:grid-cols-3 min-[420px]:divide-x min-[420px]:divide-y-0">
                  <div className="px-4 py-3 text-center sm:px-6">
                    <div className="font-mono-num text-xl font-bold text-teal-700 sm:text-2xl">
                      {winnerList.votes}
                    </div>
                    <div className="mt-0.5 text-xs font-medium text-slate-600">
                      Votos obtenidos
                    </div>
                  </div>
                  <div className="px-4 py-3 text-center sm:px-6">
                    <div className="font-mono-num text-xl font-bold text-teal-700 sm:text-2xl">
                      {winnerPct}%
                    </div>
                    <div className="mt-0.5 text-xs font-medium text-slate-600">
                      {isTotal ? '% del total emitido' : '% de votos válidos'}
                    </div>
                  </div>
                  <div className="px-4 py-3 text-center sm:px-6">
                    <div className="font-mono-num text-xl font-bold text-teal-700 sm:text-2xl">
                      +{ELECTION_TOTALS.voteMargin}
                    </div>
                    <div className="mt-0.5 text-xs font-medium text-slate-600">
                      Diferencia de votos
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 4 Indicadores Clave en Resumen */}
            <section aria-label="Indicadores principales">
              <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
                {summaryKpis.map((kpi) => (
                  <div
                    key={kpi.id}
                    className={`flex flex-col justify-between rounded-xl border border-slate-200 border-t-[3px] bg-white p-4 ${KPI_TOP_ACCENT[kpi.tone]}`}
                  >
                    <span className="text-xs font-semibold text-slate-600">
                      {kpi.label}
                    </span>
                    <div className="mt-2 font-mono-num text-2xl font-bold tracking-tight text-slate-900">
                      {kpi.value}
                    </div>
                    <span className="mt-1 text-xs text-slate-500">
                      {kpi.sublabel}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Comparativa Directa entre Listas */}
            <section
              aria-label="Comparativa directa de votos por lista"
              className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6"
            >
              <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                  <h3 className="font-display text-base font-bold text-slate-900">
                    Comparativa directa de votación
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {isTotal
                      ? 'Porcentaje calculado sobre 561 votos emitidos'
                      : 'Porcentaje calculado sobre 488 votos válidos'}
                  </p>
                </div>
                <span className="text-xs font-medium text-slate-500">
                  Diferencia: +{ELECTION_TOTALS.voteMargin} votos a favor de Lista 2
                </span>
              </div>

              <div className="space-y-4">
                {orderedLists.map((list) => {
                  const pct = isTotal ? list.pctTotal : list.pctValid;
                  return (
                    <div key={list.number} className="space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span
                            className="inline-flex h-6 w-6 items-center justify-center rounded font-mono-num text-xs font-bold text-white"
                            style={{ backgroundColor: list.color }}
                          >
                            {list.number}
                          </span>
                          <span className="font-semibold text-slate-900">
                            {list.name}
                          </span>
                          {list.winner && (
                            <span className="text-xs font-bold text-teal-700">
                              · Ganadora
                            </span>
                          )}
                        </div>
                        <div className="font-mono-num text-xs font-semibold text-slate-700 sm:text-sm">
                          <strong className="text-slate-900">{list.votes}</strong> votos ·{' '}
                          <span className="text-sky-800">{pct.toFixed(2)}%</span>
                        </div>
                      </div>
                      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: list.color,
                          }}
                        />
                      </div>
                      <p className="text-xs text-slate-500">
                        Candidato: {list.candidate}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Accesos rápidos a las otras pestañas */}
            <section
              aria-label="Explorar secciones del tablero"
              className="no-print grid grid-cols-1 gap-3.5 sm:grid-cols-3"
            >
              <button
                type="button"
                onClick={() => handleSelectTab('indicadores')}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-left transition-colors hover:border-sky-300 hover:bg-sky-50/40 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="h-5 w-5 text-sky-700 shrink-0" aria-hidden="true" />
                  <div>
                    <div className="text-sm font-bold text-slate-900">Indicadores</div>
                    <div className="text-xs text-slate-500">7 KPIs y desglose del padrón</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => handleSelectTab('graficos')}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-left transition-colors hover:border-sky-300 hover:bg-sky-50/40 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <PieChart className="h-5 w-5 text-sky-700 shrink-0" aria-hidden="true" />
                  <div>
                    <div className="text-sm font-bold text-slate-900">Gráficos</div>
                    <div className="text-xs text-slate-500">Barras y donas interactivas</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => handleSelectTab('resultados')}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-left transition-colors hover:border-sky-300 hover:bg-sky-50/40 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="h-5 w-5 text-sky-700 shrink-0" aria-hidden="true" />
                  <div>
                    <div className="text-sm font-bold text-slate-900">Resultados</div>
                    <div className="text-xs text-slate-500">Tabla completa y acta final</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
              </button>
            </section>
          </div>
        )}

        {/* PESTAÑA 2: INDICADORES */}
        {activeTab === 'indicadores' && (
          <div
            role="tabpanel"
            aria-label="Indicadores generales"
            className="flex flex-col gap-5 sm:gap-6"
          >
            <section aria-label="Todos los indicadores KPI">
              <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h2 className="font-display text-lg font-bold text-slate-900">
                  Indicadores generales del proceso electoral
                </h2>
                <span className="text-xs text-slate-500">
                  Padrón total: {ELECTION_TOTALS.eligibleVoters} electores hábiles
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3.5 min-[380px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {KPI_METRICS.map((kpi) => (
                  <div
                    key={kpi.id}
                    className={`flex flex-col justify-between rounded-xl border border-slate-200 border-t-[3px] bg-white p-4 ${KPI_TOP_ACCENT[kpi.tone]}`}
                  >
                    <span className="text-xs font-semibold text-slate-600">
                      {kpi.label}
                    </span>
                    <div className="mt-2 font-mono-num text-2xl font-bold tracking-tight text-slate-900">
                      {kpi.value}
                    </div>
                    <span className="mt-1 text-xs text-slate-500">
                      {kpi.sublabel}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Desglose del Padrón Electoral */}
            <section
              aria-label="Composición del padrón electoral"
              className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6"
            >
              <div className="mb-4">
                <h3 className="font-display text-base font-bold text-slate-900">
                  Composición del padrón electoral ({ELECTION_TOTALS.eligibleVoters} electores)
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Distribución proporcional entre votos válidos, blancos, nulos y ausentismo
                </p>
              </div>

              {/* Barra segmentada proporcional */}
              <div className="mb-5 flex h-4 w-full overflow-hidden rounded-full bg-slate-100">
                {voterBreakdown.map((item) => (
                  <div
                    key={item.label}
                    title={`${item.label}: ${item.count} (${item.pctRoster}%)`}
                    className={`${item.barColor} h-full transition-all duration-300`}
                    style={{ width: `${item.pctRoster}%` }}
                  />
                ))}
              </div>

              <div className="divide-y divide-slate-200">
                {voterBreakdown.map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        aria-hidden="true"
                        className={`h-2.5 w-2.5 rounded-sm shrink-0 ${item.dotColor}`}
                      />
                      <span className="text-sm font-medium text-slate-800">
                        {item.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pl-5 font-mono-num text-xs sm:pl-0 sm:text-sm">
                      <span className="font-bold text-slate-900">
                        {item.count} electores
                      </span>
                      <span className="text-slate-600">
                        {item.pctRoster}% del padrón
                      </span>
                      {item.pctIssued && (
                        <span className="text-sky-800">
                          {item.pctIssued}% de emitidos
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* PESTAÑA 3: GRÁFICOS */}
        {activeTab === 'graficos' && (
          <div
            role="tabpanel"
            aria-label="Gráficos electorales"
            className="flex flex-col gap-5 sm:gap-6"
          >
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-sky-700" aria-hidden="true" />
                <h2 className="font-display text-lg font-bold text-slate-900">
                  Visualización gráfica de resultados
                </h2>
              </div>
              <span className="text-xs text-slate-500">
                {isTotal
                  ? 'Porcentajes sobre 561 votos emitidos'
                  : 'Porcentajes sobre 488 votos válidos'}
              </span>
            </div>

            <section
              aria-label="Gráficos electorales"
              className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
            >
              {/* Gráfico 1: Barras */}
              <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                <header className="mb-4">
                  <h3 className="font-display text-base font-bold text-slate-900">
                    Votos por lista
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {isTotal
                      ? 'Comparativa directa (en votos y % sobre el total de 561)'
                      : 'Comparativa directa (en votos y % sobre 488 votos válidos)'}
                  </p>
                </header>
                <div className="relative h-[240px] w-full sm:h-[260px]">
                  <VotesByListBarChart mode={mode} />
                </div>
              </article>

              {/* Gráfico 2: Dona Distribución */}
              <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                <header className="mb-4">
                  <h3 className="font-display text-base font-bold text-slate-900">
                    {isTotal
                      ? 'Distribución de los 561 votos emitidos'
                      : 'Distribución de los 488 votos válidos'}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {isTotal
                      ? 'Incluye listas, votos en blanco y nulos'
                      : 'Excluye votos en blanco (29) y nulos (44)'}
                  </p>
                </header>
                <div className="relative h-[240px] w-full sm:h-[260px]">
                  <VoteDistributionDoughnutChart mode={mode} />
                </div>
              </article>

              {/* Gráfico 3: Dona Asistencia */}
              <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 sm:p-5 md:col-span-2 lg:col-span-1">
                <header className="mb-4">
                  <h3 className="font-display text-base font-bold text-slate-900">
                    Asistencia electoral
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Votaron (561) vs. Ausentes (159) sobre 720 hábiles
                  </p>
                </header>
                <div className="relative h-[240px] w-full sm:h-[260px]">
                  <AttendanceDoughnutChart />
                </div>
              </article>
            </section>
          </div>
        )}

        {/* PESTAÑA 4: RESULTADOS */}
        {activeTab === 'resultados' && (
          <div
            role="tabpanel"
            aria-label="Resultados detallados por lista"
            className="flex flex-col gap-5 sm:gap-6"
          >
            {/* Tabla en tablet/desktop y tarjetas limpias en celular */}
            <section
              aria-label="Detalle de resultados por lista"
              className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6"
            >
              <header className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                  <h2 className="font-display text-base font-bold text-slate-900 sm:text-lg">
                    Detalle de resultados por lista
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {isTotal
                      ? 'Columna resaltada: % del total de votos emitidos (561)'
                      : 'Columna resaltada: % sobre votos válidos (488)'}
                  </p>
                </div>
                <span className="text-xs font-medium text-slate-500">
                  2 listas participantes · 488 votos válidos
                </span>
              </header>

              {/* Vista Móvil: Tarjetas responsivas sin scroll horizontal */}
              <div className="flex flex-col gap-3 md:hidden">
                {CANDIDATE_LISTS.map((list) => (
                  <div
                    key={list.number}
                    className={`rounded-xl border p-4 ${
                      list.winner
                        ? 'border-teal-200 bg-teal-50/40'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md font-mono-num text-xs font-bold text-white"
                          style={{ backgroundColor: list.color }}
                        >
                          {list.number}
                        </span>
                        <div>
                          <div className="font-semibold text-slate-900">
                            {list.name}
                            {list.winner && (
                              <span className="ml-1.5 text-xs font-bold text-teal-700">
                                · Ganadora
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-600">
                            {list.candidate}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2 border-t border-slate-200/80 pt-3 text-center">
                      <div>
                        <div className="text-[11px] font-medium text-slate-500">
                          Votos
                        </div>
                        <div className="font-mono-num text-base font-bold text-slate-900">
                          {list.votes}
                        </div>
                      </div>
                      <div
                        className={`rounded-md py-1 ${
                          isTotal ? 'bg-sky-50 text-sky-900' : ''
                        }`}
                      >
                        <div className="text-[11px] font-medium text-slate-500">
                          % del total
                        </div>
                        <div className="font-mono-num text-sm font-bold">
                          {list.pctTotal.toFixed(2)}%
                        </div>
                      </div>
                      <div
                        className={`rounded-md py-1 ${
                          !isTotal ? 'bg-sky-50 text-sky-900' : ''
                        }`}
                      >
                        <div className="text-[11px] font-medium text-slate-500">
                          % válidos
                        </div>
                        <div className="font-mono-num text-sm font-bold">
                          {list.pctValid.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
                  <div className="flex items-center justify-between font-semibold text-slate-900">
                    <span>Total votos emitidos</span>
                    <span className="font-mono-num">{ELECTION_TOTALS.totalIssued} (100.00%)</span>
                  </div>
                  <p className="mt-1 text-slate-500">
                    Válidos: {ELECTION_TOTALS.validVotes} · Blancos: {ELECTION_TOTALS.blankVotes} · Nulos: {ELECTION_TOTALS.nullVotes}
                  </p>
                </div>
              </div>

              {/* Vista Tablet y Escritorio: Tabla completa */}
              <div className="hidden overflow-x-auto md:block print:block">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-sky-50/50 text-left text-xs font-semibold text-slate-600">
                      <th className="px-4 py-3">N°</th>
                      <th className="px-4 py-3">Lista</th>
                      <th className="px-4 py-3">Candidato</th>
                      <th className="px-4 py-3 text-right">Votos</th>
                      <th
                        className={`px-4 py-3 text-right transition-colors ${
                          isTotal ? 'bg-sky-100/70 text-sky-900 font-bold' : ''
                        }`}
                      >
                        % del total
                      </th>
                      <th
                        className={`px-4 py-3 text-right transition-colors ${
                          !isTotal ? 'bg-sky-100/70 text-sky-900 font-bold' : ''
                        }`}
                      >
                        % de válidos
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {CANDIDATE_LISTS.map((list) => (
                      <tr
                        key={list.number}
                        className={`transition-colors hover:bg-sky-50/30 ${
                          list.winner ? 'bg-teal-50/35' : ''
                        }`}
                      >
                        <td className="px-4 py-3.5">
                          <span
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md font-mono-num text-xs font-bold text-white"
                            style={{ backgroundColor: list.color }}
                          >
                            {list.number}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-slate-900">
                              {list.name}
                            </span>
                            {list.winner && (
                              <span className="text-xs font-bold text-teal-700">
                                · Ganadora
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-slate-700">
                          {list.candidate}
                        </td>
                        <td className="px-4 py-3.5 text-right font-mono-num font-bold text-slate-900">
                          {list.votes}
                        </td>
                        <td
                          className={`px-4 py-3.5 text-right font-mono-num transition-colors ${
                            isTotal
                              ? 'bg-sky-50 font-bold text-sky-900'
                              : 'text-slate-600'
                          }`}
                        >
                          {list.pctTotal.toFixed(2)}%
                        </td>
                        <td
                          className={`px-4 py-3.5 text-right font-mono-num transition-colors ${
                            !isTotal
                              ? 'bg-sky-50 font-bold text-sky-900'
                              : 'text-slate-600'
                          }`}
                        >
                          {list.pctValid.toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-200 bg-slate-50/60 text-xs font-medium text-slate-600">
                      <td className="px-4 py-3" colSpan={3}>
                        Resumen de escrutinio: Válidos ({ELECTION_TOTALS.validVotes}) · Blancos ({ELECTION_TOTALS.blankVotes}) · Nulos ({ELECTION_TOTALS.nullVotes})
                      </td>
                      <td className="px-4 py-3 text-right font-mono-num font-bold text-slate-900">
                        {ELECTION_TOTALS.totalIssued}
                      </td>
                      <td className="px-4 py-3 text-right font-mono-num font-semibold text-slate-700">
                        100.00%
                      </td>
                      <td className="px-4 py-3 text-right font-mono-num text-slate-400">
                        —
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </section>

            {/* Resumen de Acta de Mesa */}
            <section
              aria-label="Resumen oficial de mesa"
              className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6"
            >
              <h3 className="font-display text-base font-bold text-slate-900">
                Resumen de acta electoral
              </h3>
              <dl className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
                <div className="border-b border-slate-100 pb-3 sm:border-b-0 sm:pb-0">
                  <dt className="text-xs font-medium text-slate-500">Institución Educativa</dt>
                  <dd className="mt-0.5 font-semibold text-slate-900">
                    {ELECTION_META.institution} — {ELECTION_META.location}
                  </dd>
                </div>
                <div className="border-b border-slate-100 pb-3 sm:border-b-0 sm:pb-0">
                  <dt className="text-xs font-medium text-slate-500">Lista Proclamada Ganadora</dt>
                  <dd className="mt-0.5 font-semibold text-teal-800">
                    Lista {winnerList.number}: {winnerList.name} ({winnerList.votes} votos)
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-500">Candidato Electo</dt>
                  <dd className="mt-0.5 font-semibold text-slate-900">
                    {winnerList.candidate}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-500">Participación / Ausentismo</dt>
                  <dd className="mt-0.5 font-mono-num text-slate-800">
                    {ELECTION_TOTALS.totalIssued} votantes ({ELECTION_TOTALS.participationPct}%) · {ELECTION_TOTALS.absentVoters} ausentes
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-500">Votos Blancos y Nulos</dt>
                  <dd className="mt-0.5 font-mono-num text-slate-800">
                    {ELECTION_TOTALS.blankVotes} en blanco · {ELECTION_TOTALS.nullVotes} nulos
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-500">Fecha de Escrutinio</dt>
                  <dd className="mt-0.5 font-semibold text-slate-900">
                    {ELECTION_META.date}
                  </dd>
                </div>
              </dl>
            </section>
          </div>
        )}
      </main>

      <footer className="mx-auto flex max-w-[1200px] items-center justify-center gap-2 px-4 pb-8 pt-2 text-center text-xs text-slate-500 sm:px-6">
        {!crestError && (
          <img
            src={ELECTION_META.crestUrl}
            alt=""
            aria-hidden="true"
            referrerPolicy="no-referrer"
            className="h-4 w-4 shrink-0 object-contain opacity-80"
          />
        )}
        <span>
          {ELECTION_META.institution} · {ELECTION_META.pollingStation} ·{' '}
          {ELECTION_META.title}
        </span>
      </footer>
    </div>
  );
}
