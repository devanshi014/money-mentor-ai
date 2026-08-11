import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ======================================================
  // HANDLE INPUT CHANGE
  // ======================================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    // Clear previous error when user starts typing
    if (error) {
      setError("");
    }
  };

  // ======================================================
  // HANDLE LOGIN
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await login({
        email: form.email.trim(),
        password: form.password,
      });

      alert("Login Successful!");

      navigate("/");
    } catch (err) {
      console.error("Login Error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Login Failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // MAIN UI
  // ======================================================

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-5 py-10">

      {/* ==================================================
          LOGIN CARD
      ================================================== */}

      <div className="w-full max-w-md">

        {/* ==================================================
            BRAND
        ================================================== */}

        <div className="text-center mb-8">

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 mb-5">

            <span className="text-3xl">
              💰
            </span>

          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Money Mentor AI
          </h1>

          <p className="text-slate-400 mt-2">
            Your personal finance assistant
          </p>

        </div>

        {/* ==================================================
            FORM CARD
        ================================================== */}

        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-7 md:p-8 shadow-xl"
        >

          {/* HEADER */}

          <div className="mb-7">

            <h2 className="text-2xl font-bold text-white">
              Welcome Back
            </h2>

            <p className="text-slate-400 text-sm mt-2">
              Login to continue to your financial dashboard.
            </p>

          </div>

          {/* ==================================================
              ERROR
          ================================================== */}

          {error && (

            <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">

              <p className="text-sm text-red-400">
                {error}
              </p>

            </div>

          )}

          {/* ==================================================
              EMAIL
          ================================================== */}

          <div className="mb-5">

            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              className="
                w-full
                px-4
                py-3
                rounded-lg
                bg-slate-800
                border
                border-slate-700
                text-white
                placeholder-slate-500
                outline-none
                focus:border-green-500
                focus:ring-2
                focus:ring-green-500/10
                transition
              "
              autoComplete="email"
              required
            />

          </div>

          {/* ==================================================
              PASSWORD
          ================================================== */}

          <div className="mb-6">

            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className="
                w-full
                px-4
                py-3
                rounded-lg
                bg-slate-800
                border
                border-slate-700
                text-white
                placeholder-slate-500
                outline-none
                focus:border-green-500
                focus:ring-2
                focus:ring-green-500/10
                transition
              "
              autoComplete="current-password"
              required
            />

          </div>

          {/* ==================================================
              LOGIN BUTTON
          ================================================== */}

          <button
            type="submit"
            disabled={loading}
            className={`
              w-full
              py-3
              rounded-lg
              font-semibold
              text-white
              transition
              ${
                loading
                  ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }
            `}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* ==================================================
              REGISTER
          ================================================== */}

          <p className="text-slate-400 text-sm mt-6 text-center">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="text-green-400 hover:text-green-300 font-semibold transition"
            >
              Register
            </Link>

          </p>

        </form>

        {/* ==================================================
            DISCLAIMER
        ================================================== */}

        <p className="text-xs text-slate-600 text-center mt-6 leading-relaxed">
          Money Mentor AI provides educational financial information
          and is not professional financial advice.
        </p>

      </div>

    </div>
  );
}

export default Login;