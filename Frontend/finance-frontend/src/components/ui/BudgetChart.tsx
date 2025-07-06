"use client";

import { useEffect, useState } from "react";
import { Budget, Transaction } from "@/types";
import { getBudgets } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface BudgetChartProps {
  month: string;
  transactions: Transaction[];
}

interface ChartData {
  category: string;
  budget: number;
  actual: number;
  remaining: number;
}

export default function BudgetChart({ month, transactions }: BudgetChartProps) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await getBudgets(month);
        setBudgets(response.data);
      } catch (error) {
        console.error("Failed to fetch budgets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, [month]);

  if (loading) {
    return <div className="text-center py-8">Loading budget data...</div>;
  }

  // Calculate actual spending by category for the selected month
  const monthTransactions = transactions.filter(tx => {
    const txMonth = new Date(tx.date).toISOString().slice(0, 7); // YYYY-MM format
    return txMonth === month;
  });

  const actualByCategory = monthTransactions.reduce((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
    return acc;
  }, {} as Record<string, number>);

  // Create chart data combining budget and actual spending
  const chartData: ChartData[] = budgets.map(budget => ({
    category: budget.category,
    budget: budget.amount,
    actual: actualByCategory[budget.category] || 0,
    remaining: budget.amount - (actualByCategory[budget.category] || 0)
  }));

  // Add categories that have spending but no budget
  Object.keys(actualByCategory).forEach(category => {
    if (!budgets.find(b => b.category === category)) {
      chartData.push({
        category,
        budget: 0,
        actual: actualByCategory[category],
        remaining: -actualByCategory[category]
      });
    }
  });

  if (chartData.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No budget data available for {month}. Set up budgets to see comparison.
      </div>
    );
  }

  // Custom Tooltip for Spent/Remaining
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 bg-white rounded shadow border">
          <div className="font-semibold mb-1">{data.category}</div>
          <div>
            <span className="font-medium">Spent: </span>
            <span style={{ color: '#10b981', fontWeight: 600 }}>
              ₹{data.actual.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="font-medium">Remaining: </span>
            <span style={{ color: data.remaining >= 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>
              ₹{data.remaining.toLocaleString()}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Budget vs Actual Spending - {month}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="budget" fill="#10b981" name="Budget" />
          <Bar dataKey="actual" fill="#ef4444" name="Actual" />
        </BarChart>
      </ResponsiveContainer>

      {/* Budget insights */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {chartData.map((item) => (
          <div key={item.category} className="p-3 border rounded-lg">
            <h4 className="font-medium text-sm">{item.category}</h4>
            <div className="text-xs space-y-1 mt-2">
              <div className="flex justify-between">
                <span>Budget:</span>
                <span className="font-medium">₹{item.budget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Spent:</span>
                <span className="font-medium">₹{item.actual.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Remaining:</span>
                <span className={`font-medium ${item.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{item.remaining.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
