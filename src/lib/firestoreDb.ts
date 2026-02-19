import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import type { OneTimeExpense, MonthlyExpense } from '../types';

export const COLLECTIONS = {
  ONE_TIME: 'one-time-expenses',
  MONTHLY: 'monthly-expenses',
} as const;

/** Strips undefined values so Firestore doesn't throw on them */
function clean<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

// ─── One-time expenses ───────────────────────────────────────────────────────

export const dbOneTime = {
  getAll: async (): Promise<OneTimeExpense[]> => {
    const snap = await getDocs(collection(db, COLLECTIONS.ONE_TIME));
    return snap.docs.map(d => ({ ...d.data(), id: d.id } as OneTimeExpense));
  },

  set: async (item: OneTimeExpense): Promise<void> => {
    await setDoc(doc(db, COLLECTIONS.ONE_TIME, item.id), clean(item));
  },

  delete: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, COLLECTIONS.ONE_TIME, id));
  },

  batchSet: async (items: OneTimeExpense[]): Promise<void> => {
    const batch = writeBatch(db);
    items.forEach(item => {
      batch.set(doc(db, COLLECTIONS.ONE_TIME, item.id), clean(item));
    });
    await batch.commit();
  },
};

// ─── Monthly expenses ────────────────────────────────────────────────────────

export const dbMonthly = {
  getAll: async (): Promise<MonthlyExpense[]> => {
    const snap = await getDocs(collection(db, COLLECTIONS.MONTHLY));
    return snap.docs.map(d => ({ ...d.data(), id: d.id } as MonthlyExpense));
  },

  set: async (item: MonthlyExpense): Promise<void> => {
    await setDoc(doc(db, COLLECTIONS.MONTHLY, item.id), clean(item));
  },

  patch: async (id: string, fields: Record<string, unknown>): Promise<void> => {
    await updateDoc(doc(db, COLLECTIONS.MONTHLY, id), fields);
  },

  delete: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, COLLECTIONS.MONTHLY, id));
  },

  batchSet: async (items: MonthlyExpense[]): Promise<void> => {
    const batch = writeBatch(db);
    items.forEach(item => {
      batch.set(doc(db, COLLECTIONS.MONTHLY, item.id), clean(item));
    });
    await batch.commit();
  },
};
