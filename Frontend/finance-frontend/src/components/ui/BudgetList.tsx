"use client";

import { useEffect, useState } from "react";
import { Budget } from "@/types";
import { getBudgets } from "@/lib/api";

interface BudgetListProps {
  selectedMonth?: string;
}

export default function BudgetList({ selectedMonth }: BudgetListProps) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(selectedMonth || new Date().toISOString().slice(0, 7));

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const response = await getBudgets(currentMonth);
      setBudgets(response.data);
    } catch (err) {
      console.error("Failed to fetch budgets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [currentMonth]);

  useEffect(() => {
    if (selectedMonth) {
      setCurrentMonth(selectedMonth);
    }
  }, [selectedMonth]);

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentMonth(e.target.value);
  };

  const formatMonth = (monthString: string) => {
    const [year, month] = monthString.split('-');
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  if (loading) {
    return (
      <div className="mt-6 text-center py-8">
        <div className="text-gray-500">Loading budgets...</div>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Budget Overview</h3>
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Month:</label>
          <input
            type="month"
            value={currentMonth}
            onChange={handleMonthChange}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {budgets.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No budgets set for {formatMonth(currentMonth)}</p>
          <p className="text-sm text-gray-400 mt-1">Set up budgets to start tracking your spending</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {budgets.map((budget) => (
            <div key={budget._id} className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">{budget.category}</h4>
                  <p className="text-sm text-gray-600">{formatMonth(budget.month)}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">₹{budget.amount.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Monthly Budget</p>
                </div>
              </div>
            </div>
          ))}

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-blue-900">Total Budget</span>
              <span className="text-xl font-bold text-blue-600">
                ₹{budgets.reduce((sum, budget) => sum + budget.amount, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
