import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dbMonthly } from '../lib/firestoreDb';
import type { MonthlyExpense } from '../types';

export const MONTHLY_KEY = ['monthly-expenses'] as const;

export function useMonthlyExpenses() {
  return useQuery({
    queryKey: MONTHLY_KEY,
    queryFn: () => dbMonthly.getAll(),
  });
}

export function useAddMonthlyExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<MonthlyExpense, 'id' | 'createdAt' | 'paidMonths'>) => {
      const item: MonthlyExpense = {
        ...data,
        paidMonths: {},
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      await dbMonthly.set(item);
      return item;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: MONTHLY_KEY }),
  });
}

export function useUpdateMonthlyExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (item: MonthlyExpense) => {
      await dbMonthly.set(item);
      return item;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: MONTHLY_KEY }),
  });
}

export function useDeleteMonthlyExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await dbMonthly.delete(id);
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: MONTHLY_KEY }),
  });
}

export function useToggleMonthlyPaid() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, month }: { id: string; month: string }) => {
      const cached = qc.getQueryData<MonthlyExpense[]>(MONTHLY_KEY);
      const item = cached?.find(i => i.id === id);
      if (!item) throw new Error('Gasto não encontrado');
      const paid = item.paidMonths ?? {};
      const newPaidMonths = { ...paid, [month]: !paid[month] };
      await dbMonthly.patch(id, { paidMonths: newPaidMonths });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: MONTHLY_KEY }),
  });
}

export function useSetMonthlyValue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, month, amount }: { id: string; month: string; amount: number }) => {
      const cached = qc.getQueryData<MonthlyExpense[]>(MONTHLY_KEY);
      const item = cached?.find(i => i.id === id);
      if (!item) throw new Error('Gasto não encontrado');
      const newValues = { ...item.monthlyValues, [month]: amount };
      await dbMonthly.patch(id, { monthlyValues: newValues });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: MONTHLY_KEY }),
  });
}
