import axios from "axios";
import { Transaction } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export const getTransactions = () => axios.get<Transaction[]>(`${BASE_URL}/transactions`);
export const addTransaction = (data: Transaction) => axios.post(`${BASE_URL}/transactions`, data);
export const deleteTransaction = (id: string) => axios.delete(`${BASE_URL}/transactions/${id}`);
