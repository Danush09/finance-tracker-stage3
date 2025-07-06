"use client";

import { useEffect, useState } from "react";
import { Transaction, Budget } from "@/types";
import { getBudgets } from "@/lib/api";

interface SummaryCardsProps {
  transactions: Transaction[];
  selectedMonth?: string;
}

export default function SummaryCards({ transactions, selectedMonth }: SummaryCardsProps) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(false);

  const currentMonth = selectedMonth || new Date().toISOString().slice(0, 7);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        setLoading(true);
        const response = await getBudgets(currentMonth);
        setBudgets(response.data);
      } catch (error) {
        console.error("Failed to fetch budgets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, [currentMonth]);

  // Filter transactions for current month
  const monthTransactions = transactions.filter(tx => {
    const txMonth = new Date(tx.date).toISOString().slice(0, 7);
    return txMonth === currentMonth;
  });

  const totalSpent = monthTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const remainingBudget = totalBudget - totalSpent;
  const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  // Category breakdown
  const categoryBreakdown = monthTransactions.reduce((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categoryBreakdown)
    .sort(([, a], [, b]) => b - a)[0];

  const recent = [...monthTransactions].sort((a, b) => +new Date(b.date) - +new Date(a.date)).slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
      {/* Total Spent */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <h3 className="text-sm font-medium text-gray-600">Total Spent</h3>
        <p className="text-2xl font-bold text-red-500">₹{totalSpent.toLocaleString()}</p>
        <p className="text-xs text-gray-500 mt-1">{currentMonth}</p>
      </div>

      {/* Budget Status */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <h3 className="text-sm font-medium text-gray-600">Budget Status</h3>
        <p className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          ₹{remainingBudget.toLocaleString()}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {budgetUtilization.toFixed(1)}% of budget used
        </p>
      </div>

      {/* Top Spending Category */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <h3 className="text-sm font-medium text-gray-600">Top Category</h3>
        {topCategory ? (
          <>
            <p className="text-lg font-semibold">{topCategory[0]}</p>
            <p className="text-sm text-gray-600">₹{topCategory[1].toLocaleString()}</p>
          </>
        ) : (
          <p className="text-sm text-gray-500">No spending yet</p>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <h3 className="text-sm font-medium text-gray-600 mb-2">Recent Transactions</h3>
        {recent.length > 0 ? (
          <ul className="text-xs space-y-1">
            {recent.map((tx) => (
              <li key={tx._id} className="flex justify-between">
                <span className="truncate">{tx.description}</span>
                <span className="font-medium">₹{tx.amount}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-gray-500">No recent transactions</p>
        )}
      </div>
    </div>
  );
}
