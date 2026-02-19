export type ExpenseCategory =
  | 'alimentacao'
  | 'moradia'
  | 'transporte'
  | 'saude'
  | 'educacao'
  | 'lazer'
  | 'assinaturas'
  | 'outro';

export const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  alimentacao: 'Alimentação',
  moradia: 'Moradia',
  transporte: 'Transporte',
  saude: 'Saúde',
  educacao: 'Educação',
  lazer: 'Lazer',
  assinaturas: 'Assinaturas',
  outro: 'Outro',
};

export const CATEGORY_COLORS: Record<ExpenseCategory, { bg: string; text: string }> = {
  alimentacao: { bg: '#fff7ed', text: '#c2410c' },
  moradia: { bg: '#eff6ff', text: '#1d4ed8' },
  transporte: { bg: '#fefce8', text: '#a16207' },
  saude: { bg: '#f0fdf4', text: '#15803d' },
  educacao: { bg: '#faf5ff', text: '#7e22ce' },
  lazer: { bg: '#fdf2f8', text: '#be185d' },
  assinaturas: { bg: '#eef2ff', text: '#4338ca' },
  outro: { bg: '#f8fafc', text: '#475569' },
};

export interface OneTimeExpense {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // YYYY-MM-DD
  createdAt: string;
}

export interface MonthlyExpense {
  id: string;
  name: string;
  category: ExpenseCategory;
  startMonth: string; // YYYY-MM
  endMonth?: string; // YYYY-MM, undefined = no end date
  isVariable: boolean; // if true, amount can differ per month
  defaultAmount: number; // base/estimated amount
  monthlyValues: Record<string, number>; // YYYY-MM -> actual amount
  paidMonths: Record<string, boolean>; // YYYY-MM -> paid
  notes?: string;
  createdAt: string;
}
