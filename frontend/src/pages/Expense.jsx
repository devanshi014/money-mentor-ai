import { useEffect, useState } from "react";

import {
  getExpenses,
  addExpense as addExpenseService,
  deleteExpense as deleteExpenseService,
} from "../services/expenseService";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import ExpenseSummary from "../components/analytics/ExpenseSummary";
import ExpensePieChart from "../components/analytics/ExpensePieChart";
import ExpenseBarChart from "../components/analytics/ExpenseBarChart";

import {
  WalletCards,
  Plus,
  Receipt,
  Trash2,
  BarChart3,
} from "lucide-react";

function Expense() {
  const [expenses, setExpenses] = useState([]);

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
  });

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  // ======================================================
  // FETCH EXPENSES
  // ======================================================

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);

      const data = await getExpenses();

      setExpenses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Expense Fetch Error:", err);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // FORM CHANGE
  // ======================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ======================================================
  // ADD EXPENSE
  // ======================================================

  const handleAddExpense = async () => {
    if (
      !form.title.trim() ||
      !form.amount ||
      !form.category.trim()
    ) {
      return;
    }

    try {
      setAdding(true);

      await addExpenseService({
        title: form.title.trim(),
        amount: Number(form.amount),
        category: form.category.trim(),
      });

      setForm({
        title: "",
        amount: "",
        category: "",
      });

      await fetchExpenses();
    } catch (err) {
      console.error("Add Expense Error:", err);
    } finally {
      setAdding(false);
    }
  };

  // ======================================================
  // DELETE EXPENSE
  // ======================================================

  const handleDeleteExpense = async (id) => {
    try {
      await deleteExpenseService(id);

      await fetchExpenses();
    } catch (err) {
      console.error("Delete Expense Error:", err);
    }
  };

  // ======================================================
  // FORMAT CURRENCY
  // ======================================================

  const formatCurrency = (value) => {
    const number = Number(value || 0);

    return `₹${number.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // ======================================================
  // MAIN UI
  // ======================================================

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">

      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <Sidebar />

      {/* ==================================================
          MAIN AREA
      ================================================== */}

      <div className="flex-1 min-w-0">

        {/* ==================================================
            NAVBAR
        ================================================== */}

        <Navbar />

        <main className="px-5 py-7 md:px-8 lg:px-10 max-w-[1600px] mx-auto">

          {/* ==================================================
              PAGE CONTEXT
              No duplicate "Expenses" heading here.
              Navbar already displays the page title.
          ================================================== */}

          <section className="mb-8">

            <div className="flex items-center gap-2 mb-3">

              <span className="relative flex h-2.5 w-2.5">

                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-40 animate-ping" />

                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />

              </span>

              <span className="text-xs font-semibold uppercase tracking-wider text-green-400">
                Personal Finance
              </span>

            </div>

            <p className="text-sm md:text-base text-slate-400 max-w-2xl">
              Track your spending, understand your expenses,
              and monitor your financial habits.
            </p>

          </section>

          {/* ==================================================
              EXPENSE SUMMARY
          ================================================== */}

          <section className="mb-8">

            <div className="flex items-center gap-2 mb-5">

              <WalletCards
                size={19}
                className="text-green-400"
              />

              <h2 className="text-xl md:text-2xl font-semibold">
                Expense Overview
              </h2>

            </div>

            <ExpenseSummary expenses={expenses} />

          </section>

          {/* ==================================================
              ADD EXPENSE
          ================================================== */}

          <section className="mb-10">

            <div className="mb-5">

              <div className="flex items-center gap-2">

                <Plus
                  size={19}
                  className="text-green-400"
                />

                <h2 className="text-xl md:text-2xl font-semibold">
                  Add Expense
                </h2>

              </div>

              <p className="text-sm text-slate-500 mt-1">
                Record a new expense to keep your finances up to date.
              </p>

            </div>

            <div
              className="
                rounded-xl
                bg-slate-900
                border
                border-slate-800
                p-6
              "
            >

              <div className="grid md:grid-cols-3 gap-5">

                {/* ==================================================
                    TITLE
                ================================================== */}

                <div>

                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Expense Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    placeholder="e.g. Grocery shopping"
                    value={form.title}
                    onChange={handleChange}
                    className="
                      w-full
                      px-4
                      py-3
                      rounded-xl
                      bg-slate-950
                      border
                      border-slate-800
                      text-white
                      placeholder:text-slate-600
                      outline-none
                      transition-all
                      focus:border-green-500/50
                      focus:ring-2
                      focus:ring-green-500/10
                    "
                  />

                </div>

                {/* ==================================================
                    AMOUNT
                ================================================== */}

                <div>

                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Amount
                  </label>

                  <div className="relative">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                      ₹
                    </span>

                    <input
                      type="number"
                      name="amount"
                      placeholder="0.00"
                      value={form.amount}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="
                        w-full
                        pl-9
                        pr-4
                        py-3
                        rounded-xl
                        bg-slate-950
                        border
                        border-slate-800
                        text-white
                        placeholder:text-slate-600
                        outline-none
                        transition-all
                        focus:border-green-500/50
                        focus:ring-2
                        focus:ring-green-500/10
                      "
                    />

                  </div>

                </div>

                {/* ==================================================
                    CATEGORY
                ================================================== */}

                <div>

                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Category
                  </label>

                  <input
                    type="text"
                    name="category"
                    placeholder="e.g. Food"
                    value={form.category}
                    onChange={handleChange}
                    className="
                      w-full
                      px-4
                      py-3
                      rounded-xl
                      bg-slate-950
                      border
                      border-slate-800
                      text-white
                      placeholder:text-slate-600
                      outline-none
                      transition-all
                      focus:border-green-500/50
                      focus:ring-2
                      focus:ring-green-500/10
                    "
                  />

                </div>

              </div>

              {/* ==================================================
                  ADD BUTTON
              ================================================== */}

              <div className="mt-5 flex justify-end">

                <button
                  type="button"
                  onClick={handleAddExpense}
                  disabled={
                    adding ||
                    !form.title.trim() ||
                    !form.amount ||
                    !form.category.trim()
                  }
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    px-5
                    py-3
                    rounded-xl
                    bg-gradient-to-r
                    from-green-500
                    to-emerald-500
                    text-white
                    font-semibold
                    shadow-lg
                    shadow-green-500/10
                    transition-all
                    duration-200
                    hover:from-green-400
                    hover:to-emerald-400
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                  "
                >

                  <Plus size={18} />

                  {adding ? "Adding..." : "Add Expense"}

                </button>

              </div>

            </div>

          </section>

          {/* ==================================================
              RECENT EXPENSES
          ================================================== */}

          <section className="mb-10">

            <div className="mb-5">

              <div className="flex items-center gap-2">

                <Receipt
                  size={19}
                  className="text-blue-400"
                />

                <h2 className="text-xl md:text-2xl font-semibold">
                  Recent Expenses
                </h2>

              </div>

              <p className="text-sm text-slate-500 mt-1">
                Your latest recorded transactions
              </p>

            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">

              {/* ==================================================
                  LOADING
              ================================================== */}

              {loading ? (

                <div className="p-10 text-center">

                  <div className="w-8 h-8 mx-auto rounded-full border-2 border-slate-700 border-t-green-400 animate-spin" />

                  <p className="text-sm text-slate-500 mt-4">
                    Loading expenses...
                  </p>

                </div>

              ) : expenses.length === 0 ? (

                /* ==================================================
                    EMPTY STATE
                ================================================== */

                <div className="py-16 px-6 text-center">

                  <div className="w-14 h-14 mx-auto rounded-xl bg-slate-800 flex items-center justify-center mb-5">

                    <Receipt
                      size={25}
                      className="text-slate-500"
                    />

                  </div>

                  <h3 className="text-lg font-semibold">
                    No expenses yet
                  </h3>

                  <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
                    Add your first expense above to start
                    tracking your spending.
                  </p>

                </div>

              ) : (

                /* ==================================================
                    EXPENSE LIST
                ================================================== */

                <div className="divide-y divide-slate-800">

                  {expenses.map((expense) => (

                    <div
                      key={expense._id}
                      className="
                        px-5
                        py-5
                        md:px-6
                        flex
                        flex-col
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        gap-4
                        hover:bg-slate-800/30
                        transition-colors
                      "
                    >

                      {/* ==================================================
                          EXPENSE INFO
                      ================================================== */}

                      <div className="flex items-center gap-4 min-w-0">

                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">

                          <Receipt
                            size={18}
                            className="text-slate-400"
                          />

                        </div>

                        <div className="min-w-0">

                          <h3 className="font-semibold text-slate-100 truncate">
                            {expense.title}
                          </h3>

                          <p className="text-sm text-slate-500 mt-1">
                            {expense.category}
                          </p>

                        </div>

                      </div>

                      {/* ==================================================
                          AMOUNT + DELETE
                      ================================================== */}

                      <div className="flex items-center justify-between sm:justify-end gap-5">

                        <span className="text-lg font-bold text-red-400">
                          -{formatCurrency(expense.amount)}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteExpense(expense._id)
                          }
                          className="
                            w-9
                            h-9
                            rounded-lg
                            flex
                            items-center
                            justify-center
                            bg-red-500/10
                            text-red-400
                            border
                            border-red-500/10
                            hover:bg-red-500/20
                            hover:text-red-300
                            transition-all
                          "
                          aria-label={`Delete ${expense.title}`}
                          title="Delete expense"
                        >

                          <Trash2 size={17} />

                        </button>

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </div>

          </section>

          {/* ==================================================
              ANALYTICS
          ================================================== */}

          <section className="mb-10">

            <div className="mb-5">

              <div className="flex items-center gap-2">

                <BarChart3
                  size={19}
                  className="text-purple-400"
                />

                <h2 className="text-xl md:text-2xl font-semibold">
                  Expense Analytics
                </h2>

              </div>

              <p className="text-sm text-slate-500 mt-1">
                Understand where your money is going
              </p>

            </div>

            <div className="grid lg:grid-cols-2 gap-6">

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

                <ExpensePieChart
                  expenses={expenses}
                />

              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

                <ExpenseBarChart
                  expenses={expenses}
                />

              </div>

            </div>

          </section>

          {/* ==================================================
              DISCLAIMER
          ================================================== */}

          <div className="mt-12 border-t border-slate-800 pt-5">

            <p className="text-xs text-slate-600 text-center leading-relaxed">
              Money Mentor AI provides educational information only.
              It is not professional financial advice or a recommendation
              to buy or sell securities.
            </p>

          </div>

        </main>

      </div>

    </div>
  );
}

export default Expense;