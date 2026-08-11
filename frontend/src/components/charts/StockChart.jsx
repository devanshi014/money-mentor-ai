import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function StockChart({ history }) {
  // ===============================
  // No Data
  // ===============================

  if (!history || history.length === 0) {
    return (
      <div className="bg-slate-800 rounded-xl p-8 text-center text-slate-400">
        <div className="text-4xl mb-3">
          📊
        </div>

        <p>
          No chart data available.
        </p>
      </div>
    );
  }

  // ===============================
  // Prepare Chart Data
  // ===============================

  const chartData = history
    .map((item) => ({
      date: item.date,
      price: Number(item.price),
    }))
    .filter(
      (item) =>
        item.date &&
        Number.isFinite(item.price)
    );

  if (chartData.length === 0) {
    return (
      <div className="bg-slate-800 rounded-xl p-8 text-center text-slate-400">
        <div className="text-4xl mb-3">
          📊
        </div>

        <p>
          No valid price data available.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">

      {/* ===============================
          Chart Header
      =============================== */}

      <div className="flex items-center justify-between mb-6">

        <div>
          <h2 className="text-xl font-bold">
            📈 Price History
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Last 30 trading days
          </p>
        </div>

        <div className="text-sm text-slate-400">
          {chartData.length} data points
        </div>

      </div>

      {/* ===============================
          Chart
      =============================== */}

      <ResponsiveContainer
        width="100%"
        height={400}
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
            stroke="#475569"
          />

          <XAxis
            dataKey="date"
            tick={{
              fill: "#CBD5E1",
              fontSize: 12,
            }}
            axisLine={{
              stroke: "#475569",
            }}
            tickLine={false}
          />

          <YAxis
            tick={{
              fill: "#CBD5E1",
              fontSize: 12,
            }}
            axisLine={{
              stroke: "#475569",
            }}
            tickLine={false}
            tickFormatter={(value) =>
              `₹${value}`
            }
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #475569",
              borderRadius: "8px",
              color: "#ffffff",
            }}
            labelStyle={{
              color: "#CBD5E1",
            }}
            formatter={(value) => [
              `₹${Number(value).toFixed(2)}`,
              "Price",
            ]}
          />

          <Line
            type="monotone"
            dataKey="price"
            stroke="#22C55E"
            strokeWidth={3}
            dot={false}
            activeDot={{
              r: 6,
            }}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}

export default StockChart;