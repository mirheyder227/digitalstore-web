import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/reducer/authSlice"; // Make sure this path is correct

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [localError, setLocalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setSuccessMessage("");

    const credentials = {
      password: formData.password,
    };

    if (formData.identifier.includes("@")) {
      credentials.email = formData.identifier;
    } else {
      credentials.username = formData.identifier;
    }

    const resultAction = await dispatch(loginUser(credentials));

    if (loginUser.fulfilled.match(resultAction)) {
      setSuccessMessage("Login successful! Redirecting...");
    } else if (loginUser.rejected.match(resultAction)) {
      setLocalError(resultAction.payload || "Login failed. Please check your credentials."); // More specific message
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative p-4
                 bg-gradient-to-br from-dark-purple to-light-purple
                 bg-[length:200%_200%] animate-gradient-bg overflow-hidden"
    >
      {/* Decorative background elements (optional, but adds flair) */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-accent-blue rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute bottom-1/3 right-1/3 w-40 h-40 bg-accent-pink rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-accent-blue rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 p-8 rounded-3xl shadow-2xl text-center max-w-sm w-full
                      bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl border border-white/20
                      transform transition-all duration-500 ease-in-out hover:scale-[1.02] animate-fade-in-pop">
        <h2 className="text-4xl font-extrabold text-white mb-8 drop-shadow-md tracking-wide">
          Welcome Back!
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              name="identifier"
              placeholder="Email or Username"
              value={formData.identifier}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 rounded-xl border border-transparent
                         bg-white/20 text-white placeholder-white/60 focus:outline-none
                         focus:border-accent-blue focus:ring-2 focus:ring-accent-blue
                         transition duration-300 ease-in-out hover:bg-white/30"
              autoComplete="username email"
            />
          </div>

          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 rounded-xl border border-transparent
                         bg-white/20 text-white placeholder-white/60 focus:outline-none
                         focus:border-accent-blue focus:ring-2 focus:ring-accent-blue
                         transition duration-300 ease-in-out hover:bg-white/30"
              autoComplete="current-password"
            />
          </div>

          {localError && <p className="text-red-300 text-sm font-semibold mt-3 animate-pulse">{localError}</p>}
          {!localError && error && <p className="text-red-300 text-sm font-semibold mt-3 animate-pulse">{error}</p>}
          {successMessage && (
            <p className="text-green-300 text-sm font-semibold mt-3 animate-pulse">{successMessage}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-white text-xl
                       bg-gradient-to-r from-accent-blue to-accent-pink
                       shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]
                       transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed
                       relative overflow-hidden group"
          >
            <span className="relative z-10">
              {loading ? "Logging In..." : "Log In"}
            </span>
            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
          </button>
        </form>

        <div className="mt-8 flex justify-between text-sm text-white/80">
          <Link to="/forgot-password" className="text-accent-blue hover:underline hover:text-accent-pink transition duration-300">
            Forgot Password?
          </Link>
          <Link to="/signup" className="text-accent-blue hover:underline hover:text-accent-pink transition duration-300">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
