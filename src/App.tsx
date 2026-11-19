import { useState } from 'react';
import { Award, Download, Printer } from 'lucide-react';
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

const KPI_TOP_ACCENT: Record<string, string> = {
  neutral: 'border-t-sky-600',
  emerald: 'border-t-teal-600',
  amber: 'border-t-amber-500',
  slate: 'border-t-slate-400',
  rose: 'border-t-rose-400',
};

export default function App() {
  const [mode, setMode] = useState<PercentageMode>('total');
  const [crestError, setCrestError] = useState(false);
  const isTotal = mode === 'total';
  const winnerList = CANDIDATE_LISTS.find((l) => l.winner) ?? CANDIDATE_LISTS[1];

  const winnerPct = isTotal
    ? winnerList.pctTotal.toFixed(2)
    : winnerList.pctValid.toFixed(2);

  return (
    <div className="min-h-screen bg-[#f4f8fb] text-slate-900">
      {/* Top Bar Contract: 3 zones — Wordmark | 4 single-line links | 1 primary action */}
      <header className="no-print md:sticky md:top-0 z-20 border-b border-sky-200/80 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-4 py-3 sm:gap-8 sm:px-6">
          <a
            href="#resumen"
            className="flex items-center gap-2.5 font-display text-base font-extrabold tracking-tight text-sky-950 whitespace-nowrap shrink-0"
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
          </a>

          <nav
            aria-label="Navegación de secciones"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
          >
            <a
              href="#resumen"
              className="hover:text-sky-800 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Resumen
            </a>
            <a
              href="#indicadores"
              className="hover:text-sky-800 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Indicadores
            </a>
            <a
              href="#graficos"
              className="hover:text-sky-800 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Gráficos
            </a>
            <a
              href="#resultados"
              className="hover:text-sky-800 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Resultados
            </a>
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={downloadResultsCsv}
              className="inline-flex items-center gap-2 rounded-lg bg-sky-700 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-sky-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 whitespace-nowrap shrink-0 cursor-pointer sm:px-4"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Exportar CSV</span>
            </button>
          </div>
        </div>

        <nav
          aria-label="Navegación móvil de secciones"
          className="flex items-center justify-between gap-4 overflow-x-auto border-t border-sky-100 px-4 py-2.5 text-xs font-medium text-slate-600 md:hidden"
        >
          <a
            href="#resumen"
            className="hover:text-sky-800 whitespace-nowrap shrink-0"
          >
            Resumen
          </a>
          <a
            href="#indicadores"
            className="hover:text-sky-800 whitespace-nowrap shrink-0"
          >
            Indicadores
          </a>
          <a
            href="#graficos"
            className="hover:text-sky-800 whitespace-nowrap shrink-0"
          >
            Gráficos
          </a>
          <a
            href="#resultados"
            className="hover:text-sky-800 whitespace-nowrap shrink-0"
          >
            Resultados
          </a>
        </nav>
      </header>

      <main className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
        {/* 1. Encabezado Institucional en Celeste Suave + Insignia */}
        <section
          id="resumen"
          aria-label="Encabezado electoral"
          className="scroll-mt-20 rounded-xl border border-sky-200 bg-gradient-to-br from-[#e0f2fe] via-[#eff8ff] to-white px-6 py-6 text-slate-900 sm:px-8 sm:py-7"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4 sm:gap-5">
              {!crestError ? (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-sky-200/80 bg-white p-2 sm:h-24 sm:w-24">
                  <img
                    src={ELECTION_META.crestUrl}
                    alt="Insignia oficial de la I.E.E. San Ramón de Cajamarca"
                    referrerPolicy="no-referrer"
                    onError={() => setCrestError(true)}
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-sky-200 bg-white font-display text-xl font-extrabold text-sky-800 sm:h-24 sm:w-24">
                  SR
                </div>
              )}

              <div className="space-y-1.5">
                <p className="text-xs font-bold tracking-wide text-sky-800">
                  {ELECTION_META.institution} · {ELECTION_META.location}
                </p>
                <h1 className="font-display text-xl font-extrabold leading-tight tracking-tight text-slate-900 text-balance sm:text-3xl">
                  {ELECTION_META.title}
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600 lg:shrink-0 lg:justify-end">
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

        {/* 2. Selector de Base Porcentual & Acción de Impresión */}
        <section
          aria-label="Selector de cálculo de porcentaje"
          className="no-print flex flex-col gap-3 rounded-xl border border-sky-200/80 bg-white px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between"
        >
          <span className="text-sm font-medium text-slate-600">
            Visualización de porcentajes en gráficos y tabla:
          </span>

          <div className="flex flex-wrap items-center gap-3">
            <div
              role="group"
              aria-label="Base porcentual"
              className="inline-flex rounded-lg border border-sky-200/80 bg-sky-50/70 p-1"
            >
              <button
                type="button"
                onClick={() => setMode('total')}
                aria-pressed={isTotal}
                className={`rounded-md px-3.5 py-2 text-xs font-semibold transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 ${
                  isTotal
                    ? 'bg-sky-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-sky-900'
                }`}
              >
                % sobre el total de votos (561)
              </button>
              <button
                type="button"
                onClick={() => setMode('valid')}
                aria-pressed={!isTotal}
                className={`rounded-md px-3.5 py-2 text-xs font-semibold transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 ${
                  !isTotal
                    ? 'bg-sky-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-sky-900'
                }`}
              >
                % sobre votos válidos (488)
              </button>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-sky-50/60 hover:text-sky-900 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
            >
              <Printer className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Imprimir</span>
            </button>
          </div>
        </section>

        {/* 3. Tarjeta Destacada de la Lista Ganadora */}
        <section
          aria-label="Lista ganadora"
          className="rounded-xl border border-teal-200/90 bg-gradient-to-br from-teal-50/60 via-sky-50/30 to-white p-6 sm:p-7"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
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

            <div className="grid grid-cols-3 divide-x divide-teal-200/80 rounded-lg border border-teal-200/80 bg-white">
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

        {/* 4. Tarjetas de Indicadores (KPI) */}
        <section id="indicadores" aria-label="Indicadores generales" className="scroll-mt-20">
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4 lg:grid-cols-7">
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

        {/* 5. Gráficos Electorales */}
        <section
          id="graficos"
          aria-label="Gráficos electorales"
          className="scroll-mt-20 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {/* Gráfico 1: Barras */}
          <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-5">
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
            <div className="relative h-[260px] w-full">
              <VotesByListBarChart mode={mode} />
            </div>
          </article>

          {/* Gráfico 2: Dona Distribución */}
          <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-5">
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
            <div className="relative h-[260px] w-full">
              <VoteDistributionDoughnutChart mode={mode} />
            </div>
          </article>

          {/* Gráfico 3: Dona Asistencia */}
          <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 md:col-span-2 lg:col-span-1">
            <header className="mb-4">
              <h3 className="font-display text-base font-bold text-slate-900">
                Asistencia electoral
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Votaron (561) vs. Ausentes (159) sobre 720 hábiles
              </p>
            </header>
            <div className="relative h-[260px] w-full">
              <AttendanceDoughnutChart />
            </div>
          </article>
        </section>

        {/* 6. Tabla de Detalle por Lista */}
        <section
          id="resultados"
          aria-label="Tabla de detalle por lista"
          className="scroll-mt-20 rounded-xl border border-slate-200 bg-white p-5 sm:p-6"
        >
          <header className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <h3 className="font-display text-base font-bold text-slate-900">
                Detalle de resultados por lista
              </h3>
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

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
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
      </main>

      <footer className="mx-auto flex max-w-[1200px] items-center justify-center gap-2 px-4 pb-8 pt-2 text-center text-xs text-slate-500 sm:px-6">
        {!crestError && (
          <img
            src={ELECTION_META.crestUrl}
            alt=""
            aria-hidden="true"
            referrerPolicy="no-referrer"
            className="h-4 w-4 object-contain opacity-80"
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
