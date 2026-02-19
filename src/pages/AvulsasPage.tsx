import { useState, useMemo } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ExpenseForm } from '../components/expenses/ExpenseForm';
import { ExpenseCard } from '../components/expenses/ExpenseCard';
import { SkeletonSection } from '../components/ui/Skeleton';
import { useOneTimeExpenses } from '../hooks/useOneTimeExpenses';
import { formatCurrency, formatMonth, getCurrentMonth, addMonths } from '../lib/utils';

export function AvulsasPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [filterMonth, setFilterMonth] = useState(getCurrentMonth);

  const { data: expenses = [], isLoading } = useOneTimeExpenses();

  const filtered = useMemo(
    () =>
      expenses
        .filter(e => e.date.startsWith(filterMonth))
        .sort((a, b) => b.date.localeCompare(a.date)),
    [expenses, filterMonth]
  );

  const total = useMemo(() => filtered.reduce((sum, e) => sum + e.amount, 0), [filtered]);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Gastos Avulsos</h1>
        <div className="page-header-right">
          <div className="month-nav">
            <button className="month-nav-btn" onClick={() => setFilterMonth(m => addMonths(m, -1))}>
              <ChevronLeft size={18} />
            </button>
            <span className="month-nav-label" style={{ textTransform: 'capitalize' }}>
              {formatMonth(filterMonth)}
            </span>
            <button className="month-nav-btn" onClick={() => setFilterMonth(m => addMonths(m, 1))}>
              <ChevronRight size={18} />
            </button>
          </div>
          <Button onClick={() => setAddOpen(true)}>
            <Plus size={16} />
            Adicionar
          </Button>
        </div>
      </div>

      {!isLoading && filtered.length > 0 && (
        <div className="avulsas-summary">
          <span>{filtered.length} gasto{filtered.length !== 1 ? 's' : ''}</span>
          <span className="avulsas-total">{formatCurrency(total)}</span>
        </div>
      )}

      {isLoading ? (
        <SkeletonSection rows={5} showActions />
      ) : filtered.length === 0 ? (
        <div className="empty-state empty-state--center">
          <p>Nenhum gasto avulso em {formatMonth(filterMonth)}.</p>
          <Button onClick={() => setAddOpen(true)}>
            <Plus size={16} /> Adicionar gasto
          </Button>
        </div>
      ) : (
        <div className="cards-stack">
          {filtered.map(e => (
            <ExpenseCard key={e.id} expense={e} />
          ))}
        </div>
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Novo gasto avulso">
        <ExpenseForm onClose={() => setAddOpen(false)} />
      </Modal>
    </div>
  );
}
