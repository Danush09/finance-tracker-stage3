import { Transaction } from "@/types";

export default function SummaryCards({ transactions }: { transactions: Transaction[] }) {
  const total = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const recent = [...transactions].sort((a, b) => +new Date(b.date) - +new Date(a.date)).slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Total Expenses</h3>
        <p className="text-lg font-bold text-red-500">₹{total}</p>
      </div>
      <div className="bg-white p-4 rounded shadow col-span-2">
        <h3 className="font-semibold">Recent Transactions</h3>
        <ul className="text-sm mt-2 space-y-1">
          {recent.map((tx) => (
            <li key={tx._id}>
              {tx.date.slice(0, 10)} - {tx.description} (₹{tx.amount})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
