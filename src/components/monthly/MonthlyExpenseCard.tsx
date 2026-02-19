import { useState } from 'react';
import { Pencil, Trash2, TrendingUp, CalendarDays } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { MonthlyExpenseForm } from './MonthlyExpenseForm';
import { MonthlyValueForm } from './MonthlyValueForm';
import { useDeleteMonthlyExpense } from '../../hooks/useMonthlyExpenses';
import { formatCurrency, formatMonth, formatMonthShort, getAmountForMonth } from '../../lib/utils';
import type { MonthlyExpense } from '../../types';

interface Props {
  expense: MonthlyExpense;
  selectedMonth: string;
}

export function MonthlyExpenseCard({ expense, selectedMonth }: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const [valueOpen, setValueOpen] = useState(false);

  const deleteMutation = useDeleteMonthlyExpense();

  const amount = getAmountForMonth(expense, selectedMonth);
  const hasCustomValue = expense.isVariable && expense.monthlyValues[selectedMonth] !== undefined;

  function handleDelete() {
    if (confirm(`Excluir "${expense.name}"? Esta ação não pode ser desfeita.`)) {
      deleteMutation.mutate(expense.id);
    }
  }

  return (
    <>
      <div className="expense-card">
        <div className="expense-card-main">
          <div className="expense-card-info">
            <div className="expense-card-header">
              <span className="expense-card-name">{expense.name}</span>
              {expense.isVariable && (
                <span className={`variable-tag ${hasCustomValue ? 'variable-tag--registered' : ''}`}>
                  <TrendingUp size={11} />
                  {hasCustomValue ? 'valor registrado' : 'variável'}
                </span>
              )}
            </div>
            <div className="expense-card-meta">
              <Badge category={expense.category} />
              {expense.endMonth ? (
                <span className="meta-item">
                  <CalendarDays size={12} />
                  até {formatMonthShort(expense.endMonth)}
                </span>
              ) : (
                <span className="meta-item meta-item--continuous">Contínuo</span>
              )}
              {expense.notes && <span className="meta-item">{expense.notes}</span>}
            </div>
          </div>
          <div className="expense-card-right">
            <span className="expense-card-amount">{formatCurrency(amount)}</span>
            {expense.isVariable && !hasCustomValue && (
              <span className="expense-card-estimated">estimado</span>
            )}
          </div>
        </div>
        <div className="expense-card-actions">
          {expense.isVariable && (
            <Button size="sm" variant="secondary" onClick={() => setValueOpen(true)}>
              Registrar valor — {formatMonth(selectedMonth).split(' de ')[0]}
            </Button>
          )}
          <button className="icon-btn" onClick={() => setEditOpen(true)} title="Editar">
            <Pencil size={14} />
          </button>
          <button className="icon-btn icon-btn--danger" onClick={handleDelete} title="Excluir">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Editar gasto mensal">
        <MonthlyExpenseForm editing={expense} onClose={() => setEditOpen(false)} />
      </Modal>

      <Modal
        open={valueOpen}
        onClose={() => setValueOpen(false)}
        title="Registrar valor do mês"
        size="sm"
      >
        <MonthlyValueForm
          expense={expense}
          month={selectedMonth}
          onClose={() => setValueOpen(false)}
        />
      </Modal>
    </>
  );
}
