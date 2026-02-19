import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
  LineChart, Line,
} from 'recharts';
import { useMonthlyExpenses } from '../hooks/useMonthlyExpenses';
import { useOneTimeExpenses } from '../hooks/useOneTimeExpenses';
import { CATEGORY_LABELS, CATEGORY_COLORS, type ExpenseCategory } from '../types';
import {
  formatCurrency,
  formatMonth,
  getCurrentMonth,
  addMonths,
  getAmountForMonth,
  isActiveInMonth,
  formatMonthChart,
} from '../lib/utils';

const LINE_PALETTE = [
  '#4f46e5', '#f59e0b', '#10b981', '#ef4444',
  '#8b5cf6', '#ec4899', '#06b6d4', '#f97316',
];

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <h2 className="chart-card-title">{title}</h2>
        {subtitle && <p className="chart-card-subtitle">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function CurrencyTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s: number, p: any) => s + (p.value ?? 0), 0);
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <strong>{formatCurrency(p.value)}</strong>
        </p>
      ))}
      {payload.length > 1 && (
        <p className="chart-tooltip-total">Total: <strong>{formatCurrency(total)}</strong></p>
      )}
    </div>
  );
}

function PieTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{name}</p>
      <p><strong>{formatCurrency(value)}</strong></p>
    </div>
  );
}

function CustomLegend({ payload }: any) {
  return (
    <div className="chart-legend">
      {payload?.map((entry: any) => (
        <span key={entry.value} className="chart-legend-item">
          <span className="chart-legend-dot" style={{ background: entry.color }} />
          {entry.value}
        </span>
      ))}
    </div>
  );
}

export function GraficosPage() {
  const { data: monthly = [], isLoading: loadingMonthly } = useMonthlyExpenses();
  const { data: oneTime = [], isLoading: loadingOneTime } = useOneTimeExpenses();
  const isLoading = loadingMonthly || loadingOneTime;

  const [categoryMonth, setCategoryMonth] = useState(getCurrentMonth);

  const last6 = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => addMonths(getCurrentMonth(), -(5 - i))),
    []
  );

  // ── Stacked bar: mensais + avulsos per month ────────────────────────────
  const barData = useMemo(() =>
    last6.map(month => {
      const mensais = monthly
        .filter(e => isActiveInMonth(e, month))
        .reduce((sum, e) => sum + getAmountForMonth(e, month), 0);
      const avulsos = oneTime
        .filter(e => e.date.startsWith(month))
        .reduce((sum, e) => sum + e.amount, 0);
      return { month: formatMonthChart(month), Mensais: mensais, Avulsos: avulsos };
    }),
    [monthly, oneTime, last6]
  );

  // ── Donut: category breakdown for selected month ────────────────────────
  const categoryData = useMemo(() => {
    const totals: Partial<Record<ExpenseCategory, number>> = {};
    monthly
      .filter(e => isActiveInMonth(e, categoryMonth))
      .forEach(e => {
        totals[e.category] = (totals[e.category] ?? 0) + getAmountForMonth(e, categoryMonth);
      });
    oneTime
      .filter(e => e.date.startsWith(categoryMonth))
      .forEach(e => {
        totals[e.category] = (totals[e.category] ?? 0) + e.amount;
      });
    return Object.entries(totals)
      .filter(([, v]) => v > 0)
      .sort(([, a], [, b]) => b - a)
      .map(([cat, value]) => ({
        name: CATEGORY_LABELS[cat as ExpenseCategory],
        value,
        color: CATEGORY_COLORS[cat as ExpenseCategory].text,
      }));
  }, [monthly, oneTime, categoryMonth]);

  const categoryTotal = categoryData.reduce((s, d) => s + d.value, 0);

  // ── Line: variable expenses over last 6 months ──────────────────────────
  const variableExpenses = useMemo(
    () => monthly.filter(e => e.isVariable),
    [monthly]
  );

  const lineData = useMemo(() =>
    last6.map(month => {
      const point: Record<string, string | number> = { month: formatMonthChart(month) };
      variableExpenses.forEach(e => { point[e.name] = getAmountForMonth(e, month); });
      return point;
    }),
    [variableExpenses, last6]
  );

  const yTickFormatter = (v: number) =>
    v >= 1000 ? `R$${(v / 1000).toFixed(1)}k` : `R$${v}`;

  if (isLoading) {
    return (
      <div className="page">
        <div className="page-header">
          <h1 className="page-title">Gráficos</h1>
        </div>
        <div className="charts-grid">
          {[1, 2, 3].map(i => (
            <div key={i} className="chart-card">
              <div className="skeleton" style={{ height: '1rem', width: '40%', marginBottom: '1.5rem' }} />
              <div className="skeleton" style={{ height: 260, borderRadius: 8 }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Gráficos</h1>
      </div>

      <div className="charts-grid">

        {/* ── Stacked bar ── */}
        <ChartCard
          title="Resumo mensal"
          subtitle="Mensais + avulsos nos últimos 6 meses"
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData} barCategoryGap="35%" barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={yTickFormatter} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={56} />
              <Tooltip content={<CurrencyTooltip />} cursor={{ fill: '#f1f5f9' }} />
              <Legend content={<CustomLegend />} />
              <Bar dataKey="Mensais" stackId="a" fill="#4f46e5" radius={[0, 0, 4, 4]} />
              <Bar dataKey="Avulsos" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* ── Donut ── */}
        <ChartCard title="Gastos por categoria">
          <div className="chart-month-nav">
            <button className="month-nav-btn" onClick={() => setCategoryMonth(m => addMonths(m, -1))}>
              <ChevronLeft size={16} />
            </button>
            <span className="month-nav-label" style={{ textTransform: 'capitalize', minWidth: 120, fontSize: '.875rem' }}>
              {formatMonth(categoryMonth)}
            </span>
            <button className="month-nav-btn" onClick={() => setCategoryMonth(m => addMonths(m, 1))}>
              <ChevronRight size={16} />
            </button>
          </div>

          {categoryData.length === 0 ? (
            <div className="chart-empty">Nenhum gasto neste mês.</div>
          ) : (
            <div className="chart-donut-wrap">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={68}
                    outerRadius={108}
                    paddingAngle={2}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {categoryData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} opacity={0.9} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              <div className="donut-center">
                <span className="donut-center-label">Total</span>
                <span className="donut-center-value">{formatCurrency(categoryTotal)}</span>
              </div>

              <div className="donut-legend">
                {categoryData.map(d => (
                  <div key={d.name} className="donut-legend-item">
                    <span className="donut-legend-dot" style={{ background: d.color }} />
                    <span className="donut-legend-name">{d.name}</span>
                    <span className="donut-legend-value">{formatCurrency(d.value)}</span>
                    <span className="donut-legend-pct">
                      {((d.value / categoryTotal) * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ChartCard>

        {/* ── Line chart ── */}
        {variableExpenses.length > 0 && (
          <ChartCard
            title="Evolução de gastos variáveis"
            subtitle="Valores registrados nos últimos 6 meses"
          >
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={yTickFormatter} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={56} />
                <Tooltip content={<CurrencyTooltip />} />
                <Legend content={<CustomLegend />} />
                {variableExpenses.map((e, i) => (
                  <Line
                    key={e.id}
                    type="monotone"
                    dataKey={e.name}
                    stroke={LINE_PALETTE[i % LINE_PALETTE.length]}
                    strokeWidth={2.5}
                    dot={{ r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

      </div>
    </div>
  );
}
