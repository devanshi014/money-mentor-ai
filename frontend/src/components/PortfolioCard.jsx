import {
  TrendingUp,
  TrendingDown,
  Trash2,
  Pencil,
} from "lucide-react";

function PortfolioCard({
  holding,
  onDelete,
  onEdit,
}) {
  // ======================================================
  // SAFE NUMERIC VALUES
  // ======================================================

  const profit = Number(holding.profit || 0);

  const profitPercent = Number(
    holding.profitPercent || 0
  );

  const buyPrice = Number(
    holding.buyPrice || 0
  );

  const currentPrice = Number(
    holding.currentPrice || 0
  );

  const quantity = Number(
    holding.quantity || 0
  );

  const investment = Number(
    holding.investment || 0
  );

  const currentValue = Number(
    holding.currentValue || 0
  );

  // ======================================================
  // PROFIT / LOSS
  // ======================================================

  const positive = profit >= 0;

  // ======================================================
  // FORMAT CURRENCY
  // ======================================================

  const formatCurrency = (value) => {
    return `₹${Number(value || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <div
      className="
        bg-slate-900
        border
        border-slate-800
        rounded-xl
        p-6
        transition-all
        duration-200
        hover:border-slate-700
        hover:bg-slate-900/90
      "
    >

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex items-start justify-between gap-4">

        {/* STOCK INFORMATION */}

        <div className="min-w-0">

          <h2 className="text-2xl font-bold tracking-tight">
            {holding.symbol || "N/A"}
          </h2>

          <p className="text-slate-400 text-sm mt-1 truncate">
            {holding.company ||
              holding.symbol ||
              "Unknown Company"}
          </p>

        </div>

        {/* TREND ICON */}

        <div
          className={`
            w-10
            h-10
            rounded-xl
            flex
            items-center
            justify-center
            shrink-0
            ${
              positive
                ? "bg-green-500/10"
                : "bg-red-500/10"
            }
          `}
        >

          {positive ? (
            <TrendingUp
              size={22}
              className="text-green-400"
            />
          ) : (
            <TrendingDown
              size={22}
              className="text-red-400"
            />
          )}

        </div>

      </div>

      {/* ==================================================
          PRICE INFORMATION
      ================================================== */}

      <div className="grid grid-cols-2 gap-x-6 gap-y-5 mt-7">

        {/* BUY PRICE */}

        <div>

          <p className="text-xs text-slate-500 uppercase tracking-wide">
            Buy Price
          </p>

          <p className="text-lg font-semibold mt-1">
            {formatCurrency(buyPrice)}
          </p>

        </div>

        {/* LIVE PRICE */}

        <div>

          <p className="text-xs text-slate-500 uppercase tracking-wide">
            Live Price
          </p>

          <p className="text-lg font-semibold mt-1 text-blue-400">
            {formatCurrency(currentPrice)}
          </p>

        </div>

        {/* QUANTITY */}

        <div>

          <p className="text-xs text-slate-500 uppercase tracking-wide">
            Quantity
          </p>

          <p className="text-lg font-semibold mt-1">
            {quantity}
          </p>

        </div>

        {/* INVESTMENT */}

        <div>

          <p className="text-xs text-slate-500 uppercase tracking-wide">
            Investment
          </p>

          <p className="text-lg font-semibold mt-1">
            {formatCurrency(investment)}
          </p>

        </div>

      </div>

      {/* ==================================================
          CURRENT VALUE
      ================================================== */}

      <div
        className="
          mt-7
          rounded-xl
          bg-slate-950/70
          border
          border-slate-800
          p-4
        "
      >

        <p className="text-xs text-slate-500 uppercase tracking-wide">
          Current Value
        </p>

        <p className="text-2xl font-bold mt-1 text-blue-400">
          {formatCurrency(currentValue)}
        </p>

      </div>

      {/* ==================================================
          PROFIT / LOSS
      ================================================== */}

      <div className="mt-6">

        <p className="text-xs text-slate-500 uppercase tracking-wide">
          Profit / Loss
        </p>

        <div className="flex items-center justify-between gap-4 mt-2">

          {/* PROFIT VALUE */}

          <div
            className={`
              text-2xl
              font-bold
              ${
                positive
                  ? "text-green-400"
                  : "text-red-400"
              }
            `}
          >

            {positive ? "+" : "-"}
            {formatCurrency(
              Math.abs(profit)
            )}

          </div>

          {/* PROFIT PERCENTAGE */}

          <div
            className={`
              inline-flex
              items-center
              gap-1.5
              px-3
              py-1.5
              rounded-lg
              text-sm
              font-semibold
              ${
                positive
                  ? "bg-green-500/10 text-green-400"
                  : "bg-red-500/10 text-red-400"
              }
            `}
          >

            {positive ? (
              <TrendingUp size={15} />
            ) : (
              <TrendingDown size={15} />
            )}

            {positive ? "+" : ""}
            {Math.abs(profitPercent).toFixed(2)}%

          </div>

        </div>

      </div>

      {/* ==================================================
          ACTION BUTTONS
      ================================================== */}

      <div className="mt-7 grid grid-cols-2 gap-3">

        {/* EDIT */}

        <button
          type="button"
          onClick={() => onEdit(holding)}
          className="
            flex
            items-center
            justify-center
            gap-2
            py-3
            rounded-lg
            bg-blue-500/10
            border
            border-blue-500/20
            text-blue-400
            hover:bg-blue-500/20
            hover:border-blue-500/30
            font-semibold
            transition
          "
        >

          <Pencil size={17} />

          Edit

        </button>

        {/* DELETE */}

        <button
          type="button"
          onClick={() =>
            onDelete(holding._id)
          }
          className="
            flex
            items-center
            justify-center
            gap-2
            py-3
            rounded-lg
            bg-red-500/10
            border
            border-red-500/20
            text-red-400
            hover:bg-red-500/20
            hover:border-red-500/30
            font-semibold
            transition
          "
        >

          <Trash2 size={17} />

          Delete

        </button>

      </div>

    </div>
  );
}

export default PortfolioCard;