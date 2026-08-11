import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function ExpenseBarChart({ expenses }) {
  const monthlyData = {};

  expenses.forEach((expense) => {
    const date = new Date(expense.createdAt);

    const month = date.toLocaleString("default", {
      month: "short",
    });

    if (monthlyData[month]) {
      monthlyData[month] += Number(expense.amount);
    } else {
      monthlyData[month] = Number(expense.amount);
    }
  });

  const data = Object.keys(monthlyData).map((month) => ({
    month,
    amount: monthlyData[month],
  }));

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-6">
        📈 Monthly Expenses
      </h2>

      {data.length === 0 ? (
        <p className="text-slate-400 text-center">
          No expense data available.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="amount"
              fill="#22c55e"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default ExpenseBarChart;