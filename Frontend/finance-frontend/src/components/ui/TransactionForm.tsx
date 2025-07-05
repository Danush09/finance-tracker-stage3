"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/types";

type Props = {
  onSubmit: (form: Transaction) => void;
  initialData?: Partial<Transaction>;
};

export default function TransactionForm({ onSubmit, initialData = {} }: Props) {
  const [form, setForm] = useState({
    amount: initialData.amount || "",
    date: initialData.date || "",
    description: initialData.description || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount || !form.date || !form.description) return alert("All fields are required");
    onSubmit({ ...form, amount: Number(form.amount) });
    setForm({ amount: "", date: "", description: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border bg-white p-4 rounded-lg shadow-sm">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
        <Input name="amount" type="number" placeholder="Amount" value={form.amount} onChange={handleChange} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <Input name="date" type="date" value={form.date} onChange={handleChange} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <Input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
      </div>

      <div>
        <Button type="submit" className="w-full">Save Transaction</Button>
      </div>
    </form>
  );
}
