function DashboardCard({
  title,
  value,
  icon,
  color = "bg-green-500",
}) {
  return (
    <div className="bg-slate-800 rounded-2xl p-6 shadow-lg hover:scale-105 transition duration-300">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-slate-400 text-sm">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>
        </div>

        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center ${color}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default DashboardCard;