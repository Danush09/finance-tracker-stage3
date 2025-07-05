"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Transaction, Category, CategoryOptions } from "@/types";

type Props = {
  onSubmit: (form: Transaction) => void;
  initialData?: Partial<Transaction>;
};

type FormState = {
  amount: string;
  date: string;
  description: string;
  category: string;
};

export default function TransactionForm({ onSubmit, initialData = {} }: Props) {
  const [form, setForm] = useState<FormState>({
    amount: initialData.amount?.toString() || "",
    date: initialData.date || "",
    description: initialData.description || "",
    category: initialData.category || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount || !form.date || !form.description || !form.category)
      return alert("All fields are required");
    onSubmit({
      ...form,
      amount: Number(form.amount),
      category: form.category as Category,
    });
    setForm({ amount: "", date: "", description: "", category: "" });
  };

  return (
    <form className="space-y-4 border bg-white p-4 rounded-lg shadow-sm" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
        <Input
          name="amount"
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <Input name="date" type="date" value={form.date} onChange={handleChange} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <Input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border rounded p-2 text-sm"
          required
        >
          <option value="">Select Category</option>
          {CategoryOptions.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" className="w-full">Save Transaction</Button>
    </form>
  );
}
