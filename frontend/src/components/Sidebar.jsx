import { NavLink } from "react-router-dom";

import {
  Home,
  LayoutDashboard,
  MessageSquare,
  TrendingUp,
  Heart,
  BriefcaseBusiness,
  Newspaper,
  Landmark,
  Wallet,
  BookOpen,
} from "lucide-react";

function Sidebar() {
  // ======================================================
  // NAVIGATION ITEMS
  // ======================================================

  const menuItems = [
    {
      name: "Home",
      icon: Home,
      path: "/",
    },
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "AI Chat",
      icon: MessageSquare,
      path: "/chat",
    },
    {
      name: "Stocks",
      icon: TrendingUp,
      path: "/stocks",
    },
    {
      name: "Watchlist",
      icon: Heart,
      path: "/watchlist",
    },
    {
      name: "Portfolio",
      icon: BriefcaseBusiness,
      path: "/portfolio",
    },
    {
      name: "News",
      icon: Newspaper,
      path: "/news",
    },
    {
      name: "IPO",
      icon: Landmark,
      path: "/ipo",
    },
    {
      name: "Expense",
      icon: Wallet,
      path: "/expense",
    },
    {
      name: "Learn",
      icon: BookOpen,
      path: "/learn",
    },
  ];

  return (
    <aside
      className="
        w-64
        min-w-64
        h-screen
        sticky
        top-0
        flex
        flex-col
        bg-slate-950
        border-r
        border-slate-800
        text-white
      "
    >
      {/* ==================================================
          BRAND
      ================================================== */}

      <div className="px-5 py-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          {/* Logo */}

          <div
            className="
              w-11
              h-11
              rounded-xl
              bg-gradient-to-br
              from-green-400
              to-emerald-600
              flex
              items-center
              justify-center
              shadow-lg
              shadow-green-500/20
              flex-shrink-0
            "
          >
            <span className="text-2xl">💰</span>
          </div>

          {/* Brand */}

          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-white">
              Money Mentor
            </h1>

            <p className="text-xs text-slate-500 mt-0.5">
              AI Finance Assistant
            </p>
          </div>
        </div>
      </div>

      {/* ==================================================
          MENU TITLE
      ================================================== */}

      <div className="px-5 pt-6 pb-3">
        <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-slate-600">
          Menu
        </p>
      </div>

      {/* ==================================================
          NAVIGATION
      ================================================== */}

      <nav className="flex-1 px-3 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `
                  group
                  relative
                  flex
                  items-center
                  gap-3
                  px-4
                  py-2.5
                  rounded-xl
                  transition-all
                  duration-200
                  ${
                    isActive
                      ? `
                        bg-gradient-to-r
                        from-green-500
                        to-emerald-500
                        text-white
                        font-semibold
                        shadow-lg
                        shadow-green-500/10
                      `
                      : `
                        text-slate-400
                        hover:text-white
                        hover:bg-slate-800/70
                      `
                  }
                  `
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active indicator */}

                    {isActive && (
                      <span
                        className="
                          absolute
                          left-0
                          top-1/2
                          -translate-y-1/2
                          w-1
                          h-6
                          bg-white
                          rounded-r-full
                        "
                      />
                    )}

                    {/* Icon */}

                    <Icon
                      size={19}
                      strokeWidth={isActive ? 2.3 : 1.9}
                      className={`
                        flex-shrink-0
                        transition-all
                        duration-200
                        ${
                          isActive
                            ? "text-white"
                            : "text-slate-500 group-hover:text-green-400 group-hover:scale-105"
                        }
                      `}
                    />

                    {/* Name */}

                    <span className="text-sm">
                      {item.name}
                    </span>

                    {/* Active arrow */}

                    {isActive && (
                      <span className="ml-auto text-white/70 text-lg leading-none">
                        ›
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* ==================================================
          AI ASSISTANT CARD
      ================================================== */}

      <div className="px-3 pb-4 pt-4">
        <div
          className="
            rounded-2xl
            bg-gradient-to-br
            from-green-500/10
            via-emerald-500/5
            to-transparent
            border
            border-green-500/20
            p-4
          "
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div
              className="
                w-8
                h-8
                rounded-lg
                bg-green-500/10
                border
                border-green-500/20
                flex
                items-center
                justify-center
              "
            >
              <span className="text-base">🤖</span>
            </div>

            <div>
              <p className="text-sm font-semibold text-green-400">
                AI Assistant
              </p>

              <p className="text-[10px] text-slate-600">
                Money Mentor
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Get personalized insights about your finances,
            stocks and investments.
          </p>
        </div>
      </div>

      {/* ==================================================
          ACCOUNT STATUS
      ================================================== */}

      <div className="border-t border-slate-800 p-4">
        <div
          className="
            rounded-xl
            bg-slate-900/70
            border
            border-slate-800
            px-3
            py-3
          "
        >
          <div className="flex items-center gap-3">
            {/* Status icon */}

            <div
              className="
                w-9
                h-9
                rounded-lg
                bg-green-500/10
                border
                border-green-500/20
                flex
                items-center
                justify-center
                flex-shrink-0
              "
            >
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className="
                    absolute
                    inline-flex
                    h-full
                    w-full
                    rounded-full
                    bg-green-400
                    opacity-50
                    animate-ping
                  "
                />

                <span
                  className="
                    relative
                    inline-flex
                    rounded-full
                    h-2.5
                    w-2.5
                    bg-green-400
                  "
                />
              </span>
            </div>

            {/* Status text */}

            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-200">
                Account Active
              </p>

              <p className="text-xs text-slate-500 mt-0.5 truncate">
                Money Mentor is ready
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;