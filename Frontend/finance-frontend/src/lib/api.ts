import axios from "axios";
import { Transaction, Budget } from "@/types";

// Use deployed backend URL for production, localhost for development
const BASE_URL = process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_BASE || "https://finance-tracker-stage3.onrender.com"
    : "http://localhost:5000";

export const getTransactions = () => axios.get<Transaction[]>(`${BASE_URL}/api/transactions`);
export const addTransaction = (data: Transaction) => axios.post(`${BASE_URL}/api/transactions`, data);
export const deleteTransaction = (id: string) => axios.delete(`${BASE_URL}/api/transactions/${id}`);

// Budget API functions
export const getBudgets = (month: string) => axios.get<Budget[]>(`${BASE_URL}/api/budgets?month=${month}`);
export const addBudget = (data: Budget) => axios.post(`${BASE_URL}/api/budgets`, data);
export const updateBudget = (data: Budget) => axios.post(`${BASE_URL}/api/budgets`, data);
