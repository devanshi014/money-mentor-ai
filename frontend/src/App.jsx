import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

// =========================================
// PAGES
// =========================================

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Stocks from "./pages/Stocks";
import News from "./pages/News";
import IPO from "./pages/IPO";
import IPODetails from "./pages/IPODetails";
import Expense from "./pages/Expense";
import Learn from "./pages/Learn";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Watchlist from "./pages/Watchlist";
import Portfolio from "./pages/Portfolio";

// =========================================
// APP
// =========================================

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================================
            PUBLIC ROUTES
        ========================================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* =========================================
            PROTECTED MAIN ROUTES
        ========================================= */}

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        <Route
          path="/stocks"
          element={
            <ProtectedRoute>
              <Stocks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/watchlist"
          element={
            <ProtectedRoute>
              <Watchlist />
            </ProtectedRoute>
          }
        />

        <Route
          path="/portfolio"
          element={
            <ProtectedRoute>
              <Portfolio />
            </ProtectedRoute>
          }
        />

        <Route
          path="/news"
          element={
            <ProtectedRoute>
              <News />
            </ProtectedRoute>
          }
        />

        {/* =========================================
            IPO ROUTES
        ========================================= */}

        <Route
          path="/ipo"
          element={
            <ProtectedRoute>
              <IPO />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ipo/:symbol"
          element={
            <ProtectedRoute>
              <IPODetails />
            </ProtectedRoute>
          }
        />

        {/* =========================================
            EXPENSE
        ========================================= */}

        <Route
          path="/expense"
          element={
            <ProtectedRoute>
              <Expense />
            </ProtectedRoute>
          }
        />

        {/* =========================================
            LEARN
        ========================================= */}

        <Route
          path="/learn"
          element={
            <ProtectedRoute>
              <Learn />
            </ProtectedRoute>
          }
        />

        {/* =========================================
            INVALID ROUTE
        ========================================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;