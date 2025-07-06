"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Category, CategoryOptions } from "@/types";
import { addBudget } from "@/lib/api";
import { toast } from "sonner";

interface BudgetFormProps {
  onBudgetSaved?: () => void;
}

export default function BudgetForm({ onBudgetSaved }: BudgetFormProps) {
  const [form, setForm] = useState<{
    category: string;
    amount: string;
    month: string;
  }>({
    category: "",
    amount: "",
    month: new Date().toISOString().slice(0, 7)
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.amount || !form.month || !form.category) {
      return toast.error("Please fill in all fields");
    }

    if (parseFloat(form.amount) <= 0) {
      return toast.error("Budget amount must be greater than 0");
    }

    try {
      setLoading(true);
      await addBudget({
        category: form.category as Category,
        amount: parseFloat(form.amount),
        month: form.month,
      });

      toast.success("Budget saved successfully!");
      setForm({
        category: "",
        amount: "",
        month: new Date().toISOString().slice(0, 7)
      });

      if (onBudgetSaved) {
        onBudgetSaved();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save budget");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white border p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Set Monthly Budget</h3>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">Category</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Select Category</option>
          {CategoryOptions.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">Budget Amount (₹)</label>
        <Input
          name="amount"
          type="number"
          value={form.amount}
          onChange={handleChange}
          placeholder="Enter budget amount"
          min="0"
          step="0.01"
          required
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">Month</label>
        <Input
          name="month"
          type="month"
          value={form.month}
          onChange={handleChange}
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Budget"}
      </Button>
    </form>
  );
}
