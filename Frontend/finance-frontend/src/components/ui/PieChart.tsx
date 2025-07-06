"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Transaction } from "@/types";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F", "#FFBB28"];

type CategoryData = {
  [key: string]: {
    name: string;
    value: number;
  };
};

export default function CategoryPieChart({ transactions }: { transactions: Transaction[] }) {
  const categoryData = Object.values(
    transactions.reduce((acc: CategoryData, tx: Transaction) => {
      if (!acc[tx.category]) {
        acc[tx.category] = { name: tx.category, value: 0 };
      }
      acc[tx.category].value += tx.amount;
      return acc;
    }, {})
  );

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={categoryData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
        >
          {categoryData.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
