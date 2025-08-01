import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../api/auth";
import { useDispatch } from "react-redux";
import { loginUser } from "../../store/reducer/authSlice";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeInput, setActiveInput] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Calculate password strength
    if (name === "password") {
      let strength = 0;
      if (value.length > 0) strength += 1;
      if (value.length >= 8) strength += 1;
      if (/[A-Z]/.test(value)) strength += 1;
      if (/[0-9]/.test(value)) strength += 1;
      if (/[^A-Za-z0-9]/.test(value)) strength += 1;
      setPasswordStrength(strength);
    }
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
      setError(err.message || "An unexpected error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  const inputVariants = {
    hover: { scale: 1.03 },
    focus: { scale: 1.05, boxShadow: "0 0 0 2px rgba(99, 102, 241, 0.5)" },
  };

  const getStrengthColor = (strength) => {
    switch(strength) {
      case 0: return 'bg-gray-600';
      case 1: return 'bg-red-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-blue-500';
      case 4: return 'bg-green-500';
      case 5: return 'bg-green-400';
      default: return 'bg-gray-600';
    }
  };

  const getStrengthText = (strength) => {
    switch(strength) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Moderate';
      case 3: return 'Good';
      case 4: return 'Strong';
      case 5: return 'Very Strong';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-900">
      {/* Animated Particles Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
            move: { enable: true, speed: 2, direction: "none", random: true, straight: false, out_mode: "out" }
          },
          interactivity: {
            events: {
              onhover: { enable: true, mode: "repulse" },
              onclick: { enable: true, mode: "push" }
            }
          }
        }}
      />

      {/* Floating Shapes */}
      <div className="absolute top-20 left-20 w-40 h-40 rounded-full bg-purple-500 opacity-10 animate-float"></div>
      <div className="absolute bottom-20 right-20 w-60 h-60 rounded-full bg-blue-500 opacity-10 animate-float animation-delay-2000"></div>
      <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full bg-pink-500 opacity-10 animate-float animation-delay-4000"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 p-10 rounded-2xl shadow-2xl max-w-md w-full
                   bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700
                   backdrop-blur-sm"
      >
        <div className="text-center mb-10">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-block mb-6"
          >
            <svg className="w-16 h-16 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-400">Join our community today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <motion.div
              whileHover="hover"
              animate={activeInput === 'email' ? "focus" : ""}
              variants={inputVariants}
            >
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="your@example.com"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setActiveInput('email')}
                onBlur={() => setActiveInput(null)}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white 
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500
                           transition duration-300"
                autoComplete="email"
              />
            </motion.div>
          </div>

          <div className="space-y-2">
            <motion.div
              whileHover="hover"
              animate={activeInput === 'username' ? "focus" : ""}
              variants={inputVariants}
            >
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                onFocus={() => setActiveInput('username')}
                onBlur={() => setActiveInput(null)}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white 
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500
                           transition duration-300"
                autoComplete="username"
              />
            </motion.div>
          </div>

          <div className="space-y-2">
            <motion.div
              whileHover="hover"
              animate={activeInput === 'password' ? "focus" : ""}
              variants={inputVariants}
            >
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setActiveInput('password')}
                onBlur={() => setActiveInput(null)}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white 
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500
                           transition duration-300"
                autoComplete="new-password"
              />
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">Password Strength:</span>
                  <span className={`text-xs font-medium ${getStrengthColor(passwordStrength).replace('bg', 'text')}`}>
                    {getStrengthText(passwordStrength)}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${getStrengthColor(passwordStrength)} transition-all duration-300`}
                    style={{ width: `${passwordStrength * 20}%` }}
                  ></div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="space-y-2">
            <motion.div
              whileHover="hover"
              animate={activeInput === 'confirmPassword' ? "focus" : ""}
              variants={inputVariants}
            >
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onFocus={() => setActiveInput('confirmPassword')}
                onBlur={() => setActiveInput(null)}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white 
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500
                           transition duration-300"
                autoComplete="new-password"
              />
            </motion.div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-900/50 text-red-200 rounded-lg text-sm border border-red-700"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm 
                       text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none 
                       focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors
                       ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Sign up'}
          </motion.button>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">Or sign up with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-700 rounded-lg shadow-sm bg-gray-800 text-sm font-medium text-white hover:bg-gray-700 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0110 4.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.14 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                </svg>
              </button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-700 rounded-lg shadow-sm bg-gray-800 text-sm font-medium text-white hover:bg-gray-700 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </button>
            </motion.div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;