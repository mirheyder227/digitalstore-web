import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../api/auth"; // Make sure this path is correct
import { useDispatch } from "react-redux";
import { loginUser } from "../../store/reducer/authSlice"; // Make sure this path is correct

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await register({
        email: formData.email,
        username: formData.username,
        password: formData.password,
      });

      const resultAction = await dispatch(
        loginUser({
          email: formData.email,
          password: formData.password,
        })
      );

      if (loginUser.fulfilled.match(resultAction)) {
        navigate("/");
      } else if (loginUser.rejected.match(resultAction)) {
        setError(
          resultAction.payload || "Registration successful, but login failed."
        );
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred during registration."); // Better error handling
    } finally {
      setLoading(false);
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

      <div className="relative z-10 p-8 rounded-3xl shadow-2xl text-center max-w-md w-full
                      bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl border border-white/20
                      transform transition-all duration-500 ease-in-out hover:scale-[1.02] animate-fade-in-pop">
        <h2 className="text-4xl font-extrabold text-white mb-8 drop-shadow-md tracking-wide">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-white text-left mb-2 text-lg font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@example.com"
              className="w-full px-5 py-3 rounded-xl border border-transparent
                         bg-white/20 text-white placeholder-white/60 focus:outline-none
                         focus:border-accent-blue focus:ring-2 focus:ring-accent-blue
                         transition duration-300 ease-in-out hover:bg-white/30"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-white text-left mb-2 text-lg font-medium">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Choose a username"
              className="w-full px-5 py-3 rounded-xl border border-transparent
                         bg-white/20 text-white placeholder-white/60 focus:outline-none
                         focus:border-accent-blue focus:ring-2 focus:ring-accent-blue
                         transition duration-300 ease-in-out hover:bg-white/30"
              autoComplete="username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-white text-left mb-2 text-lg font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Minimum 8 characters"
              className="w-full px-5 py-3 rounded-xl border border-transparent
                         bg-white/20 text-white placeholder-white/60 focus:outline-none
                         focus:border-accent-blue focus:ring-2 focus:ring-accent-blue
                         transition duration-300 ease-in-out hover:bg-white/30"
              autoComplete="new-password"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-white text-left mb-2 text-lg font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Re-enter your password"
              className="w-full px-5 py-3 rounded-xl border border-transparent
                         bg-white/20 text-white placeholder-white/60 focus:outline-none
                         focus:border-accent-blue focus:ring-2 focus:ring-accent-blue
                         transition duration-300 ease-in-out hover:bg-white/30"
              autoComplete="new-password"
            />
          </div>

          {error && <p className="text-red-300 text-sm font-semibold mt-3 animate-pulse">{error}</p>}

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
              {loading ? "Registering..." : "Sign Up"}
            </span>
            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
          </button>
        </form>

        <p className="mt-8 text-center text-white/80">
          Already have an account?{" "}
          <Link to="/login" className="text-accent-blue font-bold hover:underline hover:text-accent-pink transition duration-300">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;