import { useState } from "react";
import {
  Bell,
  Search,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logout, getCurrentUser } from "../services/authService";

function Navbar() {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header
      className="
        h-20
        border-b
        border-slate-800
        bg-slate-950
        flex
        items-center
        justify-end
        px-5
        md:px-8
        lg:px-10
        sticky
        top-0
        z-30
      "
    >

      <div className="flex items-center gap-3">

        {/* SEARCH */}

        <button
          type="button"
          className="
            hidden
            md:flex
            items-center
            gap-2
            w-44
            lg:w-52
            px-3.5
            py-2.5
            rounded-xl
            bg-slate-900
            border
            border-slate-800
            text-slate-500
            hover:text-slate-300
            hover:border-slate-700
            transition-all
            duration-200
          "
        >
          <Search size={17} />

          <span className="text-sm">
            Search
          </span>

          <span
            className="
              ml-auto
              text-[10px]
              px-1.5
              py-0.5
              rounded
              border
              border-slate-700
              text-slate-600
            "
          >
            /
          </span>
        </button>

        {/* NOTIFICATIONS */}

        <button
          type="button"
          className="
            relative
            w-10
            h-10
            rounded-xl
            bg-slate-900
            border
            border-slate-800
            flex
            items-center
            justify-center
            text-slate-400
            hover:text-white
            hover:bg-slate-800
            hover:border-slate-700
            transition-all
            duration-200
          "
          aria-label="Notifications"
        >
          <Bell size={19} />

          <span
            className="
              absolute
              top-2
              right-2
              w-2
              h-2
              bg-green-400
              rounded-full
              border-2
              border-slate-900
            "
          />
        </button>

        {/* DIVIDER */}

        <div
          className="
            hidden
            sm:block
            h-8
            w-px
            bg-slate-800
            mx-1
          "
        />

        {/* USER PROFILE */}

        <div className="relative">

          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="
              flex
              items-center
              gap-2.5
              rounded-xl
              px-2
              py-1.5
              hover:bg-slate-900
              transition-all
              duration-200
            "
            aria-label="Open profile menu"
          >

            {/* Avatar */}

            <div className="relative">

              <div
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-gradient-to-br
                  from-green-400
                  to-emerald-600
                  flex
                  items-center
                  justify-center
                  text-white
                  font-bold
                  shadow-lg
                  shadow-green-500/10
                "
              >
                {(user?.name || "D").charAt(0).toUpperCase()}
              </div>

              <span
                className="
                  absolute
                  bottom-0
                  right-0
                  w-3
                  h-3
                  bg-green-400
                  rounded-full
                  border-2
                  border-slate-950
                "
              />

            </div>

            {/* User information */}

            <div className="hidden sm:block text-left">

              <p className="text-sm font-semibold text-white">
                {user?.name || "Devanshi"}
              </p>

              <p className="text-xs text-slate-500">
                Personal
              </p>

            </div>

            <ChevronDown
              size={16}
              className={`hidden sm:block text-slate-500 transition-transform ${
                profileOpen ? "rotate-180" : ""
              }`}
            />

          </button>

          {/* PROFILE DROPDOWN */}

          {profileOpen && (
            <div
              className="
                absolute
                right-0
                top-14
                w-56
                bg-slate-900
                border
                border-slate-800
                rounded-xl
                shadow-2xl
                overflow-hidden
                z-50
              "
            >

              <div className="px-4 py-4 border-b border-slate-800">

                <p className="text-sm font-semibold text-white">
                  {user?.name || "Devanshi"}
                </p>

                <p className="text-xs text-slate-500 mt-1 truncate">
                  {user?.email || ""}
                </p>

              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  text-sm
                  text-red-400
                  hover:bg-red-500/10
                  transition
                "
              >
                <LogOut size={17} />

                <span>
                  Logout
                </span>

              </button>

            </div>
          )}

        </div>

      </div>

    </header>
  );
}

export default Navbar;