import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, TrendingDown, CalendarDays, Layers, CheckCircle2, Circle } from 'lucide-react';
import { useMonthlyExpenses, useToggleMonthlyPaid } from '../hooks/useMonthlyExpenses';
import { useOneTimeExpenses } from '../hooks/useOneTimeExpenses';
import { Badge } from '../components/ui/Badge';
import { SkeletonSummaryCard, SkeletonSection } from '../components/ui/Skeleton';
import {
  formatCurrency,
  formatMonth,
  formatDate,
  getCurrentMonth,
  addMonths,
  getAmountForMonth,
  isActiveInMonth,
} from '../lib/utils';

export function DashboardPage() {
  const [month, setMonth] = useState(getCurrentMonth);
  const { data: monthly = [], isLoading: loadingMonthly } = useMonthlyExpenses();
  const { data: oneTime = [], isLoading: loadingOneTime } = useOneTimeExpenses();
  const isLoading = loadingMonthly || loadingOneTime;
  const togglePaid = useToggleMonthlyPaid();

  const activeMonthly = useMemo(
    () => monthly.filter(e => isActiveInMonth(e, month)),
    [monthly, month]
  );

  const monthlyOneTime = useMemo(
    () => oneTime.filter(e => e.date.startsWith(month)).sort((a, b) => b.date.localeCompare(a.date)),
    [oneTime, month]
  );

  const totalMonthly = useMemo(
    () => activeMonthly.reduce((sum, e) => sum + getAmountForMonth(e, month), 0),
    [activeMonthly, month]
  );

  const totalOneTime = useMemo(
    () => monthlyOneTime.reduce((sum, e) => sum + e.amount, 0),
    [monthlyOneTime]
  );

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <div className="month-nav">
          <button className="month-nav-btn" onClick={() => setMonth(m => addMonths(m, -1))}>
            <ChevronLeft size={18} />
          </button>
          <span className="month-nav-label" style={{ textTransform: 'capitalize' }}>
            {formatMonth(month)}
          </span>
          <button className="month-nav-btn" onClick={() => setMonth(m => addMonths(m, 1))}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="summary-grid">
        {isLoading ? (
          <>
            <SkeletonSummaryCard />
            <SkeletonSummaryCard />
            <SkeletonSummaryCard />
          </>
        ) : (
          <>
            <div className="summary-card summary-card--monthly">
              <div className="summary-card-icon"><CalendarDays size={20} /></div>
              <div className="summary-card-content">
                <span className="summary-card-label">Gastos Mensais</span>
                <span className="summary-card-value">{formatCurrency(totalMonthly)}</span>
                <span className="summary-card-sub">{activeMonthly.length} ativo{activeMonthly.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
            <div className="summary-card summary-card--onetime">
              <div className="summary-card-icon"><TrendingDown size={20} /></div>
              <div className="summary-card-content">
                <span className="summary-card-label">Gastos Avulsos</span>
                <span className="summary-card-value">{formatCurrency(totalOneTime)}</span>
                <span className="summary-card-sub">{monthlyOneTime.length} gasto{monthlyOneTime.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
            <div className="summary-card summary-card--total">
              <div className="summary-card-icon"><Layers size={20} /></div>
              <div className="summary-card-content">
                <span className="summary-card-label">Total do Mês</span>
                <span className="summary-card-value summary-card-value--total">
                  {formatCurrency(totalMonthly + totalOneTime)}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="dashboard-sections">
        <section className="dashboard-section">
          <div className="section-header-with-meta">
            <h2 className="section-title">
              <CalendarDays size={16} />
              Mensais ativos
            </h2>
            {!isLoading && activeMonthly.length > 0 && (() => {
              const paidCount = activeMonthly.filter(e => (e.paidMonths ?? {})[month]).length;
              return (
                <span className="paid-counter">{paidCount}/{activeMonthly.length} pagos</span>
              );
            })()}
          </div>
          {isLoading ? (
            <SkeletonSection rows={4} />
          ) : activeMonthly.length === 0 ? (
            <p className="empty-text">Nenhum gasto mensal ativo neste mês.</p>
          ) : (
            <div className="list-stack">
              {activeMonthly.map(e => {
                const isPaid = !!(e.paidMonths ?? {})[month];
                return (
                  <div key={e.id} className={`list-row list-row--payable ${isPaid ? 'list-row--paid' : ''}`}>
                    <button
                      className="paid-toggle"
                      onClick={() => togglePaid.mutate({ id: e.id, month })}
                      title={isPaid ? 'Marcar como pendente' : 'Marcar como pago'}
                    >
                      {isPaid
                        ? <CheckCircle2 size={18} className="paid-icon paid-icon--paid" />
                        : <Circle size={18} className="paid-icon paid-icon--pending" />
                      }
                    </button>
                    <div className="list-row-left">
                      <span className={`list-row-name ${isPaid ? 'list-row-name--paid' : ''}`}>{e.name}</span>
                      <Badge category={e.category} />
                      {e.isVariable && e.monthlyValues[month] === undefined && (
                        <span className="tag-estimated">estimado</span>
                      )}
                    </div>
                    <div className="list-row-right">
                      <span className="list-row-amount">{formatCurrency(getAmountForMonth(e, month))}</span>
                      {isPaid && <span className="paid-badge">Pago</span>}
                    </div>
                  </div>
                );
              })}
              <div className="list-total">
                <span>Total mensais</span>
                <span>{formatCurrency(totalMonthly)}</span>
              </div>
            </div>
          )}
        </section>

        <section className="dashboard-section">
          <h2 className="section-title">
            <TrendingDown size={16} />
            Avulsos do mês
          </h2>
          {isLoading ? (
            <SkeletonSection rows={3} />
          ) : monthlyOneTime.length === 0 ? (
            <p className="empty-text">Nenhum gasto avulso neste mês.</p>
          ) : (
            <div className="list-stack">
              {monthlyOneTime.map(e => (
                <div key={e.id} className="list-row">
                  <div className="list-row-left">
                    <span className="list-row-name">{e.description}</span>
                    <Badge category={e.category} />
                    <span className="list-row-date">{formatDate(e.date)}</span>
                  </div>
                  <span className="list-row-amount">{formatCurrency(e.amount)}</span>
                </div>
              ))}
              <div className="list-total">
                <span>Total avulsos</span>
                <span>{formatCurrency(totalOneTime)}</span>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
