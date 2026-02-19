import { useState, useMemo } from 'react';
import { Plus, ChevronLeft, ChevronRight, Infinity as InfinityIcon, CalendarCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { MonthlyExpenseForm } from '../components/monthly/MonthlyExpenseForm';
import { MonthlyExpenseCard } from '../components/monthly/MonthlyExpenseCard';
import { useMonthlyExpenses } from '../hooks/useMonthlyExpenses';
import { formatCurrency, formatMonth, getCurrentMonth, addMonths, getAmountForMonth, isActiveInMonth } from '../lib/utils';

export function MonthlyPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth);

  const { data: expenses = [] } = useMonthlyExpenses();

  const continuous = useMemo(
    () => expenses.filter(e => !e.endMonth && isActiveInMonth(e, selectedMonth)),
    [expenses, selectedMonth]
  );

  const withEnd = useMemo(
    () => expenses.filter(e => !!e.endMonth && isActiveInMonth(e, selectedMonth)),
    [expenses, selectedMonth]
  );

  const totalContinuous = useMemo(
    () => continuous.reduce((sum, e) => sum + getAmountForMonth(e, selectedMonth), 0),
    [continuous, selectedMonth]
  );

  const totalWithEnd = useMemo(
    () => withEnd.reduce((sum, e) => sum + getAmountForMonth(e, selectedMonth), 0),
    [withEnd, selectedMonth]
  );

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Gastos Mensais</h1>
        <div className="page-header-right">
          <div className="month-nav">
            <button className="month-nav-btn" onClick={() => setSelectedMonth(m => addMonths(m, -1))}>
              <ChevronLeft size={18} />
            </button>
            <span className="month-nav-label" style={{ textTransform: 'capitalize' }}>
              {formatMonth(selectedMonth)}
            </span>
            <button className="month-nav-btn" onClick={() => setSelectedMonth(m => addMonths(m, 1))}>
              <ChevronRight size={18} />
            </button>
          </div>
          <Button onClick={() => setAddOpen(true)}>
            <Plus size={16} />
            Adicionar
          </Button>
        </div>
      </div>

      <div className="sections-grid">
        <section>
          <div className="section-header">
            <h2 className="section-title">
              <InfinityIcon size={16} />
              Contínuos
            </h2>
            {continuous.length > 0 && (
              <span className="section-total">{formatCurrency(totalContinuous)}</span>
            )}
          </div>
          {continuous.length === 0 ? (
            <div className="empty-state">
              <p>Nenhum gasto contínuo ativo neste mês.</p>
              <Button variant="secondary" size="sm" onClick={() => setAddOpen(true)}>
                <Plus size={14} /> Adicionar
              </Button>
            </div>
          ) : (
            <div className="cards-stack">
              {continuous.map(e => (
                <MonthlyExpenseCard key={e.id} expense={e} selectedMonth={selectedMonth} />
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="section-header">
            <h2 className="section-title">
              <CalendarCheck size={16} />
              Com prazo
            </h2>
            {withEnd.length > 0 && (
              <span className="section-total">{formatCurrency(totalWithEnd)}</span>
            )}
          </div>
          {withEnd.length === 0 ? (
            <div className="empty-state">
              <p>Nenhum gasto com prazo ativo neste mês.</p>
              <Button variant="secondary" size="sm" onClick={() => setAddOpen(true)}>
                <Plus size={14} /> Adicionar
              </Button>
            </div>
          ) : (
            <div className="cards-stack">
              {withEnd.map(e => (
                <MonthlyExpenseCard key={e.id} expense={e} selectedMonth={selectedMonth} />
              ))}
            </div>
          )}
        </section>
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Novo gasto mensal">
        <MonthlyExpenseForm onClose={() => setAddOpen(false)} />
      </Modal>
    </div>
  );
}
