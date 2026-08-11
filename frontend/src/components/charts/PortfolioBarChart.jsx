import {
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

function PortfolioBarChart({
  portfolio,
}) {
  if (!portfolio.length) return null;

  const data = portfolio.map((stock) => ({
    name: stock.symbol,
    Investment: stock.investment,
    Current: stock.currentValue,
  }));

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6">
        Investment vs Current Value
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Legend />

          <Bar
            dataKey="Investment"
            fill="#3b82f6"
          />

          <Bar
            dataKey="Current"
            fill="#22c55e"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PortfolioBarChart;