import {
  TrendingUp,
  TrendingDown,
} from "lucide-react";

function StockCard({
  symbol,
  company,
  price,
  change,
  positive,
}) {
  // ======================================================
  // SAFELY CONVERT PRICE
  // ======================================================

  const parsedPrice = Number(price);

  const numericPrice = Number.isFinite(parsedPrice)
    ? parsedPrice
    : 0;

  // ======================================================
  // SAFELY CONVERT CHANGE
  // ======================================================

  /*
    Supports:
    "1.35"
    "1.35%"
    "-1.35"
    "-1.35%"
    1.35
    -1.35
  */

  const cleanChange = String(change ?? "0")
    .replace("%", "")
    .trim();

  const parsedChange = Number(cleanChange);

  const numericChange = Number.isFinite(parsedChange)
    ? parsedChange
    : 0;

  // ======================================================
  // DETERMINE POSITIVE / NEGATIVE
  // ======================================================

  /*
    Use the actual numeric change instead of the
    `positive` prop so the icon and percentage
    always match the real movement.
  */

  const isPositive = numericChange >= 0;

  // ======================================================
  // FORMAT CHANGE
  // ======================================================

  const formattedChange = `${
    isPositive ? "+" : ""
  }${numericChange.toFixed(2)}%`;

  // ======================================================
  // UI
  // ======================================================

  return (
    <div>
      {/* ==================================================
          STOCK HEADER
      ================================================== */}

      <div className="flex justify-between items-start gap-4">

        {/* Stock Information */}

        <div className="min-w-0">

          <h2 className="text-2xl font-bold text-white">
            {symbol || "N/A"}
          </h2>

          <p className="text-slate-400 text-sm mt-1 truncate">
            {company || symbol || "Unknown Company"}
          </p>

        </div>

        {/* ==================================================
            TREND + CHANGE
        ================================================== */}

        <div
          className={`flex items-center gap-1.5 shrink-0 ${
            isPositive
              ? "text-green-400"
              : "text-red-400"
          }`}
        >

          {isPositive ? (
            <TrendingUp size={25} />
          ) : (
            <TrendingDown size={25} />
          )}

          <span className="text-sm font-semibold">
            {formattedChange}
          </span>

        </div>

      </div>

      {/* ==================================================
          STOCK PRICE
      ================================================== */}

      <div className="mt-6">

        <p className="text-slate-400 text-sm">
          Current Price
        </p>

        <h1 className="text-3xl font-bold mt-1 text-white">
          ₹{numericPrice.toFixed(2)}
        </h1>

      </div>

    </div>
  );
}

export default StockCard;