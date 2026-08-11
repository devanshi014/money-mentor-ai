import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function PortfolioHistoryChart({ history }) {
  const chartData = history.map((item) => ({
    date: new Date(item.createdAt).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
      }
    ),

    value: Number(item.totalValue || 0),
  }));

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          📈 Portfolio Performance
        </h2>

        <p className="text-slate-400 mt-1">
          Track how your portfolio value changes over time.
        </p>
      </div>

      {chartData.length < 2 ? (
        <div className="h-72 flex items-center justify-center text-slate-400 text-center">
          <div>
            <p className="text-lg font-semibold">
              Not enough history yet
            </p>

            <p className="text-sm mt-2">
              Continue using your portfolio to build
              performance history.
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full h-80">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <LineChart
              data={chartData}
              margin={{
                top: 10,
                right: 20,
                left: 10,
                bottom: 10,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
              />

              <XAxis
                dataKey="date"
                stroke="#94a3b8"
              />

              <YAxis
                stroke="#94a3b8"
                tickFormatter={(value) =>
                  `₹${value}`
                }
              />

              <Tooltip
                formatter={(value) => [
                  `₹${Number(value).toFixed(2)}`,
                  "Portfolio Value",
                ]}
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />

              <Line
                type="monotone"
                dataKey="value"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{
                  r: 4,
                }}
                activeDot={{
                  r: 6,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default PortfolioHistoryChart;