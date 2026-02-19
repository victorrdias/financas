import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useAddOneTimeExpense, useUpdateOneTimeExpense } from '../../hooks/useOneTimeExpenses';
import { CATEGORY_LABELS, type ExpenseCategory, type OneTimeExpense } from '../../types';

const categoryOptions = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label }));

function today() {
  return new Date().toISOString().split('T')[0];
}

interface Props {
  onClose: () => void;
  editing?: OneTimeExpense;
}

export function ExpenseForm({ onClose, editing }: Props) {
  const [description, setDescription] = useState(editing?.description ?? '');
  const [amount, setAmount] = useState(editing ? String(editing.amount) : '');
  const [category, setCategory] = useState<ExpenseCategory>(editing?.category ?? 'alimentacao');
  const [date, setDate] = useState(editing?.date ?? today());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const add = useAddOneTimeExpense();
  const update = useUpdateOneTimeExpense();
  const isPending = add.isPending || update.isPending;

  function validate() {
    const e: Record<string, string> = {};
    if (!description.trim()) e.description = 'Descrição é obrigatória';
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) < 0)
      e.amount = 'Informe um valor válido';
    if (!date) e.date = 'Informe a data';
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const payload = {
      description: description.trim(),
      amount: parseFloat(amount),
      category,
      date,
    };

    if (editing) {
      update.mutate({ ...editing, ...payload }, { onSuccess: onClose });
    } else {
      add.mutate(payload, { onSuccess: onClose });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-stack">
      <Input
        label="Descrição"
        placeholder="Ex: Supermercado, Restaurante, Cinema..."
        value={description}
        onChange={e => setDescription(e.target.value)}
        error={errors.description}
        autoFocus
      />
      <div className="form-row">
        <Input
          label="Valor"
          type="number"
          step="0.01"
          min="0"
          placeholder="0,00"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          error={errors.amount}
        />
        <Input
          label="Data"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          error={errors.date}
        />
      </div>
      <Select
        label="Categoria"
        value={category}
        onChange={e => setCategory(e.target.value as ExpenseCategory)}
        options={categoryOptions}
      />
      <div className="form-actions">
        <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button type="submit" loading={isPending}>
          {editing ? 'Salvar' : 'Adicionar'}
        </Button>
      </div>
    </form>
  );
}
