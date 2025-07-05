"use client";
import SummaryCards from "@/components/ui/SummaryCards";
import CategoryPieChart from "@/components/ui/PieChart";

import { useEffect, useState } from "react";
import TransactionForm from "@/components/ui/TransactionForm";
import { getTransactions, addTransaction, deleteTransaction } from "@/lib/api";
import { Transaction } from "@/types";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchTransactions = async () => {
    const res = await getTransactions();
    setTransactions(res.data);
  };

  const handleSubmit = async (data: Transaction) => {
    await addTransaction(data);
    fetchTransactions();
  };

  const handleDelete = async (id: string) => {
    await deleteTransaction(id);
    fetchTransactions();
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const chartData = Object.values(
    transactions.reduce((acc: Record<string, { month: string; total: number }>, tx: Transaction) => {
      const month = new Date(tx.date).toLocaleString("default", { month: "short", year: "numeric" });
      acc[month] = acc[month] || { month, total: 0 };
      acc[month].total += tx.amount;
      return acc;
    }, {})
  );

  return (
    <main className="container">
      <h1>Personal Finance Tracker</h1>
      <TransactionForm onSubmit={handleSubmit} />
      <h2>Transactions</h2>
      <ul className="space-y-2">
        {transactions.map((tx) => (
          <li key={tx._id} className="transaction-item">
            <div>
              <p className="transaction-description">{tx.description}</p>
              <small className="transaction-meta">{tx.date.slice(0, 10)} — ₹{tx.amount}</small>
            </div>
            <button onClick={() => handleDelete(tx._id!)} className="delete-button">Delete</button>
          </li>
        ))}
      </ul>

      <h2>Monthly Expenses</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#6366f1" />
        </BarChart>
      </ResponsiveContainer>

      
<SummaryCards transactions={transactions} />

<h2 className="mt-8 font-semibold">Category Breakdown</h2>
<CategoryPieChart transactions={transactions} />
    </main>
  );
}
