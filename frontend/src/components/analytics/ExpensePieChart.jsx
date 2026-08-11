import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#22c55e",
  "#3b82f6",
  "#facc15",
  "#ef4444",
  "#a855f7",
  "#14b8a6",
  "#f97316",
  "#06b6d4",
];

function ExpensePieChart({ expenses }) {
  const categoryData = {};

  expenses.forEach((expense) => {
    if (categoryData[expense.category]) {
      categoryData[expense.category] += Number(expense.amount);
    } else {
      categoryData[expense.category] = Number(expense.amount);
    }
  });

  const data = Object.keys(categoryData).map((category) => ({
    name: category,
    value: categoryData[category],
  }));

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-white">
        📊 Expenses by Category
      </h2>

      {data.length === 0 ? (
        <p className="text-slate-400 text-center">
          No expense data available.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={120}
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default ExpensePieChart;