import { create } from 'zustand';
export const useFinanceStore = create((set) => ({
    transactions: [],
    budgets: [],
    totalIncome: 0,
    totalExpenses: 0,
    setTransactions: (transactions) => set({ transactions }),
    setBudgets: (budgets) => set({ budgets }),
    addTransaction: (transaction) => set((state) => ({
        transactions: [transaction, ...state.transactions]
    })),
    updateStats: (income, expenses) => set({
        totalIncome: income,
        totalExpenses: expenses
    })
}));