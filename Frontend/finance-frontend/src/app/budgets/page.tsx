"use client";

import { useState, useEffect } from "react";
import BudgetForm from "@/components/ui/BudgetForm";
import BudgetList from "@/components/ui/BudgetList";
import BudgetChart from "@/components/ui/BudgetChart";
import { getTransactions } from "@/lib/api";
import { Transaction } from "@/types";
import Link from "next/link";

export default function BudgetPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  //const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await getTransactions();
        setTransactions(response.data);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  const handleBudgetSaved = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <main className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budget Management</h1>
          <p className="text-gray-600 mt-1">Set and track your monthly spending budgets</p>
        </div>
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-700 underline text-sm"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Budget Form */}
        <div className="lg:col-span-1">
          <BudgetForm onBudgetSaved={handleBudgetSaved} />
        </div>

        {/* Budget List */}
        <div className="lg:col-span-1">
          <BudgetList
            selectedMonth={selectedMonth}
            onBudgetUpdate={handleBudgetSaved}
          />
        </div>

        {/* Month Selector */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Select Month</h3>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-sm text-gray-500 mt-2">
              Choose a month to view budget data and spending analysis
            </p>
          </div>
        </div>
      </div>

      {/* Budget Chart */}
      <div className="mt-8">
        <BudgetChart
          month={selectedMonth}
          transactions={transactions}
        />
      </div>
    </main>
  );
}
