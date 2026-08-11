import { useEffect, useRef, useState } from "react";
import {
  Bell,
  Search,
  ChevronDown,
  LogOut,
  TrendingUp,
  Newspaper,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  logout,
  getCurrentUser,
} from "../services/authService";

function Navbar() {
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "market",
      title: "Market Updates",
      message: "Check the latest stock market activity.",
      time: "Just now",
      unread: true,
    },
    {
      id: 2,
      type: "news",
      title: "Financial News",
      message: "New financial market news is available.",
      time: "Recently",
      unread: true,
    },
    {
      id: 3,
      type: "portfolio",
      title: "Portfolio",
      message: "Review your latest portfolio performance.",
      time: "Recently",
      unread: true,
    },
  ]);

  const profileRef = useRef(null);
  const searchRef = useRef(null);
  const notificationRef = useRef(null);

  const user = getCurrentUser();

  const userName =
    user?.name ||
    user?.username ||
    "User";

  const userEmail =
    user?.email || "";

  // ======================================================
  // CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
  // ======================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setSearchOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout = () => {
    logout();

    setProfileOpen(false);

    navigate("/login", {
      replace: true,
    });
  };

  // ======================================================
  // SEARCH
  // ======================================================

  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchQuery.trim();

    if (!query) {
      return;
    }

    setSearchOpen(false);

    /*
      Send the user to the Stocks page.

      The Stocks page can then use the query from the URL
      if/when search integration is added there.
    */

    navigate(
      `/stocks?search=${encodeURIComponent(query)}`
    );
  };

  // ======================================================
  // NOTIFICATIONS
  // ======================================================

  const handleNotifications = () => {
    setNotificationOpen((previous) => !previous);

    setProfileOpen(false);
    setSearchOpen(false);

    // Mark notifications as read
    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  };

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  // ======================================================
  // PROFILE
  // ======================================================

  const handleProfile = () => {
    setProfileOpen((previous) => !previous);

    setSearchOpen(false);
    setNotificationOpen(false);
  };

  // ======================================================
  // MAIN UI
  // ======================================================

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

        {/* ==================================================
            SEARCH
        ================================================== */}

        <div
          ref={searchRef}
          className="relative"
        >

          <button
            type="button"
            onClick={() => {
              setSearchOpen((previous) => !previous);
              setNotificationOpen(false);
              setProfileOpen(false);
            }}
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
            aria-label="Search"
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

          {/* SEARCH DROPDOWN */}

          {searchOpen && (
            <div
              className="
                absolute
                right-0
                top-14
                w-80
                bg-slate-900
                border
                border-slate-800
                rounded-xl
                shadow-2xl
                p-3
                z-50
              "
            >

              <form onSubmit={handleSearch}>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    bg-slate-950
                    border
                    border-slate-800
                    rounded-lg
                    px-3
                    py-2.5
                  "
                >

                  <Search
                    size={17}
                    className="text-slate-500"
                  />

                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(event) =>
                      setSearchQuery(
                        event.target.value
                      )
                    }
                    placeholder="Search stocks..."
                    className="
                      flex-1
                      bg-transparent
                      outline-none
                      text-sm
                      text-white
                      placeholder:text-slate-600
                    "
                  />

                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() =>
                        setSearchQuery("")
                      }
                      className="text-slate-500 hover:text-white"
                    >
                      <X size={15} />
                    </button>
                  )}

                </div>

                <button
                  type="submit"
                  disabled={!searchQuery.trim()}
                  className="
                    w-full
                    mt-3
                    py-2.5
                    rounded-lg
                    bg-green-500
                    hover:bg-green-600
                    disabled:bg-slate-800
                    disabled:text-slate-600
                    text-white
                    text-sm
                    font-semibold
                    transition
                  "
                >
                  Search Stocks
                </button>

              </form>

            </div>
          )}

        </div>

        {/* ==================================================
            NOTIFICATIONS
        ================================================== */}

        <div
          ref={notificationRef}
          className="relative"
        >

          <button
            type="button"
            onClick={handleNotifications}
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

            {/* UNREAD INDICATOR */}

            {unreadCount > 0 && (
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
            )}

          </button>

          {/* NOTIFICATION DROPDOWN */}

          {notificationOpen && (
            <div
              className="
                absolute
                right-0
                top-14
                w-80
                bg-slate-900
                border
                border-slate-800
                rounded-xl
                shadow-2xl
                overflow-hidden
                z-50
              "
            >

              <div
                className="
                  px-4
                  py-4
                  border-b
                  border-slate-800
                  flex
                  items-center
                  justify-between
                "
              >

                <div>

                  <p className="text-sm font-semibold text-white">
                    Notifications
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    Your latest updates
                  </p>

                </div>

                {unreadCount > 0 && (
                  <span
                    className="
                      text-[10px]
                      font-semibold
                      px-2
                      py-1
                      rounded-full
                      bg-green-500/10
                      text-green-400
                    "
                  >
                    {unreadCount} new
                  </span>
                )}

              </div>

              <div className="max-h-80 overflow-y-auto">

                {notifications.length > 0 ? (
                  notifications.map(
                    (notification) => (
                      <div
                        key={notification.id}
                        className="
                          px-4
                          py-4
                          border-b
                          border-slate-800/70
                          hover:bg-slate-800/40
                          transition
                        "
                      >

                        <div className="flex gap-3">

                          <div
                            className="
                              w-9
                              h-9
                              shrink-0
                              rounded-lg
                              bg-slate-800
                              flex
                              items-center
                              justify-center
                            "
                          >

                            {notification.type ===
                            "market" ? (
                              <TrendingUp
                                size={17}
                                className="text-green-400"
                              />
                            ) : notification.type ===
                              "news" ? (
                              <Newspaper
                                size={17}
                                className="text-blue-400"
                              />
                            ) : (
                              <Bell
                                size={17}
                                className="text-purple-400"
                              />
                            )}

                          </div>

                          <div className="min-w-0">

                            <div className="flex items-center gap-2">

                              <p className="text-sm font-semibold text-white">
                                {notification.title}
                              </p>

                              {notification.unread && (
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                              )}

                            </div>

                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                              {notification.message}
                            </p>

                            <p className="text-[10px] text-slate-600 mt-2">
                              {notification.time}
                            </p>

                          </div>

                        </div>

                      </div>
                    )
                  )
                ) : (
                  <div className="px-4 py-8 text-center">

                    <Bell
                      size={25}
                      className="mx-auto text-slate-600 mb-3"
                    />

                    <p className="text-sm text-slate-400">
                      No notifications
                    </p>

                  </div>
                )}

              </div>

            </div>
          )}

        </div>

        {/* ==================================================
            DIVIDER
        ================================================== */}

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

        {/* ==================================================
            USER PROFILE
        ================================================== */}

        <div
          ref={profileRef}
          className="relative"
        >

          <button
            type="button"
            onClick={handleProfile}
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

            {/* AVATAR */}

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
                {userName
                  .charAt(0)
                  .toUpperCase()}
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

            {/* USER INFORMATION */}

            <div className="hidden sm:block text-left">

              <p className="text-sm font-semibold text-white">
                {userName}
              </p>

              <p className="text-xs text-slate-500">
                Personal
              </p>

            </div>

            <ChevronDown
              size={16}
              className={`
                hidden
                sm:block
                text-slate-500
                transition-transform
                ${
                  profileOpen
                    ? "rotate-180"
                    : ""
                }
              `}
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

              <div
                className="
                  px-4
                  py-4
                  border-b
                  border-slate-800
                "
              >

                <p className="text-sm font-semibold text-white">
                  {userName}
                </p>

                {userEmail && (
                  <p className="text-xs text-slate-500 mt-1 truncate">
                    {userEmail}
                  </p>
                )}

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