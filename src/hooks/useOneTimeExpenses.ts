import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dbOneTime } from '../lib/firestoreDb';
import type { OneTimeExpense } from '../types';

export const ONE_TIME_KEY = ['one-time-expenses'] as const;

export function useOneTimeExpenses() {
  return useQuery({
    queryKey: ONE_TIME_KEY,
    queryFn: () => dbOneTime.getAll(),
  });
}

export function useAddOneTimeExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<OneTimeExpense, 'id' | 'createdAt'>) => {
      const item: OneTimeExpense = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      await dbOneTime.set(item);
      return item;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ONE_TIME_KEY }),
  });
}

export function useUpdateOneTimeExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (item: OneTimeExpense) => {
      await dbOneTime.set(item);
      return item;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ONE_TIME_KEY }),
  });
}

export function useDeleteOneTimeExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await dbOneTime.delete(id);
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ONE_TIME_KEY }),
  });
}
