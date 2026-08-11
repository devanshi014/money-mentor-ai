import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/authService";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // ======================================================
  // HANDLE INPUT CHANGE
  // ======================================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ======================================================
  // HANDLE REGISTER
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await register(form);

      alert("Registration Successful!");

      navigate("/");
    } catch (err) {
      console.error("Registration Error:", err);

      alert(
        err.response?.data?.message ||
          "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md shadow-xl"
      >

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="text-center mb-8">

          <div className="text-4xl mb-3">
            💰
          </div>

          <h1 className="text-3xl text-white font-bold">
            Create Account
          </h1>

          <p className="text-slate-400 mt-2">
            Start your journey with Money Mentor AI
          </p>

        </div>

        {/* ==================================================
            NAME
        ================================================== */}

        <div className="mb-4">

          <label className="block text-sm text-slate-400 mb-2">
            Full Name
          </label>

          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={form.name}
            onChange={handleChange}
            className="
              w-full
              p-3
              rounded-lg
              bg-slate-800
              border
              border-slate-700
              text-white
              placeholder:text-slate-500
              outline-none
              focus:border-green-500
              transition
            "
            required
          />

        </div>

        {/* ==================================================
            EMAIL
        ================================================== */}

        <div className="mb-4">

          <label className="block text-sm text-slate-400 mb-2">
            Email
          </label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            className="
              w-full
              p-3
              rounded-lg
              bg-slate-800
              border
              border-slate-700
              text-white
              placeholder:text-slate-500
              outline-none
              focus:border-green-500
              transition
            "
            required
          />

        </div>

        {/* ==================================================
            PASSWORD
        ================================================== */}

        <div className="mb-6">

          <label className="block text-sm text-slate-400 mb-2">
            Password
          </label>

          <input
            type="password"
            name="password"
            placeholder="Create a password"
            value={form.password}
            onChange={handleChange}
            className="
              w-full
              p-3
              rounded-lg
              bg-slate-800
              border
              border-slate-700
              text-white
              placeholder:text-slate-500
              outline-none
              focus:border-green-500
              transition
            "
            required
          />

        </div>

        {/* ==================================================
            REGISTER BUTTON
        ================================================== */}

        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            bg-green-500
            hover:bg-green-400
            disabled:bg-slate-700
            disabled:text-slate-400
            disabled:cursor-not-allowed
            py-3
            rounded-lg
            text-slate-950
            font-bold
            transition
          "
        >
          {loading
            ? "Creating Account..."
            : "Create Account"}
        </button>

        {/* ==================================================
            LOGIN LINK
        ================================================== */}

        <p className="text-slate-400 mt-6 text-center">

          Already have an account?{" "}

          <Link
            to="/login"
            className="text-green-400 hover:text-green-300 font-semibold"
          >
            Login
          </Link>

        </p>

      </form>

    </div>
  );
}

export default Register;