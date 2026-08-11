function ExpenseSummary({ expenses }) {
  const totalExpense = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  const highestExpense =
    expenses.length > 0
      ? Math.max(...expenses.map((expense) => Number(expense.amount)))
      : 0;

  const categoryCount = new Set(
    expenses.map((expense) => expense.category)
  ).size;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const thisMonthExpense = expenses
    .filter((expense) => {
      const date = new Date(expense.createdAt);
      return (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    })
    .reduce((sum, expense) => sum + Number(expense.amount), 0);

  const cards = [
    {
      title: "Total Expense",
      value: `₹${totalExpense.toLocaleString()}`,
      color: "bg-green-600",
    },
    {
      title: "This Month",
      value: `₹${thisMonthExpense.toLocaleString()}`,
      color: "bg-blue-600",
    },
    {
      title: "Categories",
      value: categoryCount,
      color: "bg-purple-600",
    },
    {
      title: "Highest Expense",
      value: `₹${highestExpense.toLocaleString()}`,
      color: "bg-red-600",
    },
  ];

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`${card.color} rounded-xl p-6 shadow-lg`}
        >
          <h3 className="text-lg font-semibold text-white">
            {card.title}
          </h3>

          <p className="text-3xl font-bold text-white mt-3">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}

export default ExpenseSummary;