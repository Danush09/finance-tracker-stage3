"use client";
import SummaryCards from "@/components/ui/SummaryCards";
import CategoryPieChart from "@/components/ui/PieChart";
import SpendingInsights from "@/components/ui/SpendingInsights";
import { useEffect, useState } from "react";
import TransactionForm from "@/components/ui/TransactionForm";
import { getTransactions, addTransaction, deleteTransaction } from "@/lib/api";
import { Transaction } from "@/types";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

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
    <main className="max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Personal Finance Tracker</h1>
          <p className="text-gray-600 mt-1">Track your expenses and manage your budget</p>
        </div>
        <div className="flex space-x-3">
          <Link href="/budgets">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Manage Budgets
            </Button>
          </Link>
        </div>
      </div>

      {/* Month Selector */}
      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <label className="text-sm font-medium text-gray-700">View Month:</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <SummaryCards transactions={transactions} selectedMonth={selectedMonth} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Transaction Form */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
          <TransactionForm onSubmit={handleSubmit} />
        </div>

        {/* Recent Transactions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          <div className="bg-white rounded-lg shadow-sm border">
            {transactions.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No transactions yet. Add your first transaction to get started!
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {transactions
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 5)
                  .map((tx) => (
                    <li key={tx._id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{tx.description}</p>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>{new Date(tx.date).toLocaleDateString()}</span>
                            <span>•</span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              {tx.category}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="font-semibold text-red-600">₹{tx.amount}</span>
                          <button
                            onClick={() => handleDelete(tx._id!)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Spending Insights */}
      <div className="mt-8">
        <SpendingInsights transactions={transactions} selectedMonth={selectedMonth} />
      </div>

      {/* Charts Section */}
      <div className="mt-8 space-y-8">
        {/* Monthly Expenses Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Monthly Expenses Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Total']} />
              <Bar dataKey="total" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Category Breakdown</h2>
          <CategoryPieChart transactions={transactions} />
        </div>
      </div>
    </main>
  );
}
