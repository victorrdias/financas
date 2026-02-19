import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useSetMonthlyValue } from '../../hooks/useMonthlyExpenses';
import { formatMonth } from '../../lib/utils';
import type { MonthlyExpense } from '../../types';

interface Props {
  expense: MonthlyExpense;
  month: string;
  onClose: () => void;
}

export function MonthlyValueForm({ expense, month, onClose }: Props) {
  const existing = expense.monthlyValues[month];
  const [amount, setAmount] = useState(existing !== undefined ? String(existing) : '');
  const [error, setError] = useState('');

  const setMonthlyValue = useSetMonthlyValue();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val < 0) {
      setError('Informe um valor válido');
      return;
    }
    setMonthlyValue.mutate({ id: expense.id, month, amount: val }, { onSuccess: onClose });
  }

  return (
    <form onSubmit={handleSubmit} className="form-stack">
      <div className="value-form-info">
        <span className="value-form-label">Gasto</span>
        <strong>{expense.name}</strong>
      </div>
      <div className="value-form-info">
        <span className="value-form-label">Mês</span>
        <strong style={{ textTransform: 'capitalize' }}>{formatMonth(month)}</strong>
      </div>
      <Input
        label="Valor real do mês"
        type="number"
        step="0.01"
        min="0"
        placeholder={String(expense.defaultAmount)}
        value={amount}
        onChange={e => setAmount(e.target.value)}
        error={error}
        hint={`Valor padrão: R$ ${expense.defaultAmount.toFixed(2).replace('.', ',')}`}
        autoFocus
      />
      <div className="form-actions">
        <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button type="submit" loading={setMonthlyValue.isPending}>Registrar</Button>
      </div>
    </form>
  );
}
