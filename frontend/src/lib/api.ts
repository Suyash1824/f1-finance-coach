import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8000' });

export interface Transaction {
  id: number;
  date: string;
  merchant: string;
  amount: number;
  type: 'income' | 'expense';
  category: string | null;
  is_recurring: boolean;
}

export interface RecurringExpense {
  merchant: string;
  average_amount: number;
  interval_days: number;
  occurrences: number;
}

export interface Budget {
  id: number;
  category: string;
  monthly_limit: number;
  spent: number;
}

export interface SavingsGoal {
  id: number;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
  onchain_tx_hash: string | null;
}

export interface InsightItem {
  title: string;
  explanation: string;
  action: string;
}

export const getTransactions = () => api.get<Transaction[]>('/transactions').then(r => r.data);

export const importCsv = (file: File) => {
  const form = new FormData();
  form.append('file', file);
  return api.post('/transactions/import', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
};

export const detectRecurring = () =>
  api.post<{ recurring_expenses_found: number; details: RecurringExpense[] }>('/recurring/detect').then(r => r.data);

export const getBudgets = () => api.get<Budget[]>('/budgets').then(r => r.data);

export const createBudget = (category_name: string, monthly_limit: number) =>
  api.post<Budget>('/budgets', { category_name, monthly_limit }).then(r => r.data);

export const getSavingsGoals = () => api.get<SavingsGoal[]>('/savings-goals').then(r => r.data);

export const createSavingsGoal = (name: string, target_amount: number) =>
  api.post<SavingsGoal>('/savings-goals', { name, target_amount }).then(r => r.data);

export const contributeToGoal = (id: number, amount: number) =>
  api.post<SavingsGoal>(`/savings-goals/${id}/contribute`, { amount }).then(r => r.data);

export const verifySavingsGoal = (id: number) =>
  api.post<{ verification_hash: string }>(`/savings-goals/${id}/verify`).then(r => r.data);

export const getInsights = () =>
  api.get<{ insights: InsightItem[] }>('/insights').then(r => r.data.insights);
