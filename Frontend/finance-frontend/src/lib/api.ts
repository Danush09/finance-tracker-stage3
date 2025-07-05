import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export const getTransactions = () => axios.get(BASE_URL);
export const addTransaction = (data: any) => axios.post(BASE_URL, data);
export const updateTransaction = (id: string, data: any) => axios.put(`${BASE_URL}/${id}`, data);
export const deleteTransaction = (id: string) => axios.delete(`${BASE_URL}/${id}`);
