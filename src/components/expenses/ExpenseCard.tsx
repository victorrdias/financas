import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { ExpenseForm } from './ExpenseForm';
import { useDeleteOneTimeExpense } from '../../hooks/useOneTimeExpenses';
import { formatCurrency, formatDate } from '../../lib/utils';
import type { OneTimeExpense } from '../../types';

interface Props {
  expense: OneTimeExpense;
}

export function ExpenseCard({ expense }: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const deleteMutation = useDeleteOneTimeExpense();

  function handleDelete() {
    if (confirm(`Excluir "${expense.description}"?`)) {
      deleteMutation.mutate(expense.id);
    }
  }

  return (
    <>
      <div className="expense-card">
        <div className="expense-card-main">
          <div className="expense-card-info">
            <div className="expense-card-header">
              <span className="expense-card-name">{expense.description}</span>
            </div>
            <div className="expense-card-meta">
              <Badge category={expense.category} />
              <span className="expense-card-date">{formatDate(expense.date)}</span>
            </div>
          </div>
          <div className="expense-card-right">
            <span className="expense-card-amount">{formatCurrency(expense.amount)}</span>
          </div>
        </div>
        <div className="expense-card-actions">
          <button className="icon-btn" onClick={() => setEditOpen(true)} title="Editar">
            <Pencil size={14} />
          </button>
          <button className="icon-btn icon-btn--danger" onClick={handleDelete} title="Excluir">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Editar gasto">
        <ExpenseForm editing={expense} onClose={() => setEditOpen(false)} />
      </Modal>
    </>
  );
}
