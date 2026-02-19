import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useAddMonthlyExpense, useUpdateMonthlyExpense } from '../../hooks/useMonthlyExpenses';
import { CATEGORY_LABELS, type ExpenseCategory, type MonthlyExpense } from '../../types';
import { getCurrentMonth } from '../../lib/utils';

const categoryOptions = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label }));

interface Props {
  onClose: () => void;
  editing?: MonthlyExpense;
}

export function MonthlyExpenseForm({ onClose, editing }: Props) {
  const [name, setName] = useState(editing?.name ?? '');
  const [category, setCategory] = useState<ExpenseCategory>(editing?.category ?? 'moradia');
  const [hasEndDate, setHasEndDate] = useState(editing ? !!editing.endMonth : false);
  const [startMonth, setStartMonth] = useState(editing?.startMonth ?? getCurrentMonth());
  const [endMonth, setEndMonth] = useState(editing?.endMonth ?? '');
  const [isVariable, setIsVariable] = useState(editing?.isVariable ?? false);
  const [defaultAmount, setDefaultAmount] = useState(String(editing?.defaultAmount ?? ''));
  const [notes, setNotes] = useState(editing?.notes ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const add = useAddMonthlyExpense();
  const update = useUpdateMonthlyExpense();
  const isPending = add.isPending || update.isPending;

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Nome é obrigatório';
    if (!defaultAmount || isNaN(parseFloat(defaultAmount)) || parseFloat(defaultAmount) < 0)
      e.defaultAmount = 'Informe um valor válido';
    if (hasEndDate && !endMonth) e.endMonth = 'Informe a data de término';
    if (hasEndDate && endMonth && endMonth < startMonth) e.endMonth = 'Término deve ser após o início';
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const payload = {
      name: name.trim(),
      category,
      startMonth,
      endMonth: hasEndDate ? endMonth : undefined,
      isVariable,
      defaultAmount: parseFloat(defaultAmount),
      monthlyValues: editing?.monthlyValues ?? {},
      notes: notes.trim() || undefined,
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
        label="Nome"
        placeholder="Ex: Aluguel, Netflix, Conta de Luz..."
        value={name}
        onChange={e => setName(e.target.value)}
        error={errors.name}
        autoFocus
      />

      <Select
        label="Categoria"
        value={category}
        onChange={e => setCategory(e.target.value as ExpenseCategory)}
        options={categoryOptions}
      />

      <div className="field">
        <label className="field-label">Tipo</label>
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              checked={!hasEndDate}
              onChange={() => setHasEndDate(false)}
            />
            Sem data de término
          </label>
          <label className="radio-label">
            <input
              type="radio"
              checked={hasEndDate}
              onChange={() => setHasEndDate(true)}
            />
            Com data de término
          </label>
        </div>
      </div>

      <div className="form-row">
        <Input
          label="Início"
          type="month"
          value={startMonth}
          onChange={e => setStartMonth(e.target.value)}
        />
        {hasEndDate && (
          <Input
            label="Término"
            type="month"
            value={endMonth}
            onChange={e => setEndMonth(e.target.value)}
            error={errors.endMonth}
          />
        )}
      </div>

      <div className="field">
        <label className="field-label">Valor</label>
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              checked={!isVariable}
              onChange={() => setIsVariable(false)}
            />
            Fixo (mesmo valor todo mês)
          </label>
          <label className="radio-label">
            <input
              type="radio"
              checked={isVariable}
              onChange={() => setIsVariable(true)}
            />
            Variável (pode mudar por mês)
          </label>
        </div>
      </div>

      <Input
        label={isVariable ? 'Valor estimado (padrão)' : 'Valor mensal'}
        type="number"
        step="0.01"
        min="0"
        placeholder="0,00"
        value={defaultAmount}
        onChange={e => setDefaultAmount(e.target.value)}
        error={errors.defaultAmount}
        hint={isVariable ? 'Usado quando o valor real do mês não for registrado' : undefined}
      />

      <Input
        label="Observações (opcional)"
        placeholder="Alguma anotação..."
        value={notes}
        onChange={e => setNotes(e.target.value)}
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
