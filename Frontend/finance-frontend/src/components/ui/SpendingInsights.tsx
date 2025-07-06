"use client";

import { Transaction, Budget } from "@/types";
import { useEffect, useState } from "react";
import { getBudgets } from "@/lib/api";

interface SpendingInsightsProps {
    transactions: Transaction[];
    selectedMonth: string;
}

export default function SpendingInsights({ transactions, selectedMonth }: SpendingInsightsProps) {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchBudgets = async () => {
            try {
                setLoading(true);
                const response = await getBudgets(selectedMonth);
                setBudgets(response.data);
            } catch (error) {
                console.error("Failed to fetch budgets:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBudgets();
    }, [selectedMonth]);

    // Filter transactions for selected month
    const monthTransactions = transactions.filter(tx => {
        const txMonth = new Date(tx.date).toISOString().slice(0, 7);
        return txMonth === selectedMonth;
    });

    const totalSpent = monthTransactions.reduce((sum, tx) => sum + tx.amount, 0);
    const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
    const remainingBudget = totalBudget - totalSpent;

    // Calculate spending by category
    const spendingByCategory = monthTransactions.reduce((acc, tx) => {
        acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
        return acc;
    }, {} as Record<string, number>);

    // Find top spending category
    const topCategory = Object.entries(spendingByCategory)
        .sort(([, a], [, b]) => b - a)[0];

    // Calculate budget utilization by category
    const budgetInsights = budgets.map(budget => {
        const spent = spendingByCategory[budget.category] || 0;
        const utilization = (spent / budget.amount) * 100;
        const remaining = budget.amount - spent;

        return {
            category: budget.category,
            budget: budget.amount,
            spent,
            remaining,
            utilization,
            status: utilization > 90 ? 'warning' : utilization > 75 ? 'caution' : 'good'
        };
    });

    // Generate insights
    const insights = [];

    if (totalBudget > 0) {
        const overallUtilization = (totalSpent / totalBudget) * 100;

        if (overallUtilization > 100) {
            insights.push({
                type: 'warning',
                message: `You've exceeded your total budget by ₹${Math.abs(remainingBudget).toLocaleString()}`,
                icon: '⚠️'
            });
        } else if (overallUtilization > 80) {
            insights.push({
                type: 'caution',
                message: `You've used ${overallUtilization.toFixed(1)}% of your total budget`,
                icon: '📊'
            });
        } else {
            insights.push({
                type: 'good',
                message: `You're on track! ${(100 - overallUtilization).toFixed(1)}% of budget remaining`,
                icon: '✅'
            });
        }
    }

    if (topCategory) {
        insights.push({
            type: 'info',
            message: `${topCategory[0]} is your highest spending category (₹${topCategory[1].toLocaleString()})`,
            icon: '📈'
        });
    }

    const overBudgetCategories = budgetInsights.filter(insight => insight.status === 'warning');
    if (overBudgetCategories.length > 0) {
        insights.push({
            type: 'warning',
            message: `${overBudgetCategories.length} category${overBudgetCategories.length > 1 ? 'ies' : 'y'} over budget`,
            icon: '🚨'
        });
    }

    if (insights.length === 0) {
        insights.push({
            type: 'info',
            message: 'Set up budgets to get personalized spending insights',
            icon: '💡'
        });
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Spending Insights</h3>

            {loading ? (
                <div className="text-center py-4 text-gray-500">Loading insights...</div>
            ) : (
                <div className="space-y-4">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-red-600">₹{totalSpent.toLocaleString()}</div>
                            <div className="text-sm text-gray-600">Total Spent</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">₹{totalBudget.toLocaleString()}</div>
                            <div className="text-sm text-gray-600">Total Budget</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                ₹{remainingBudget.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">Remaining</div>
                        </div>
                    </div>

                    {/* Insights */}
                    <div className="space-y-3">
                        {insights.map((insight, index) => (
                            <div
                                key={index}
                                className={`p-3 rounded-lg border-l-4 ${insight.type === 'warning' ? 'bg-red-50 border-red-400' :
                                        insight.type === 'caution' ? 'bg-yellow-50 border-yellow-400' :
                                            insight.type === 'good' ? 'bg-green-50 border-green-400' :
                                                'bg-blue-50 border-blue-400'
                                    }`}
                            >
                                <div className="flex items-center space-x-2">
                                    <span className="text-lg">{insight.icon}</span>
                                    <span className="text-sm font-medium">{insight.message}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Category Budget Status */}
                    {budgetInsights.length > 0 && (
                        <div className="mt-6">
                            <h4 className="font-medium mb-3">Category Budget Status</h4>
                            <div className="space-y-2">
                                {budgetInsights.map((insight) => (
                                    <div key={insight.category} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                        <span className="text-sm font-medium">{insight.category}</span>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-xs text-gray-600">
                                                ₹{insight.spent.toLocaleString()} / ₹{insight.budget.toLocaleString()}
                                            </span>
                                            <span className={`text-xs px-2 py-1 rounded ${insight.status === 'warning' ? 'bg-red-100 text-red-800' :
                                                    insight.status === 'caution' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-green-100 text-green-800'
                                                }`}>
                                                {insight.utilization.toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
} 