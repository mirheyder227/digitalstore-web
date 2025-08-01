import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/reducer/authSlice";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [localError, setLocalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [hoverState, setHoverState] = useState({ email: false, password: false });
  const [activeInput, setActiveInput] = useState(null);

  const particlesInit = async (main) => {
    await loadFull(main);
  };

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
      setLocalError(resultAction.payload || "Login failed. Please check your credentials.");
    }
  };

  const inputVariants = {
    hover: { scale: 1.03 },
    focus: { scale: 1.05, boxShadow: "0 0 0 2px rgba(99, 102, 241, 0.5)" },
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <motion.div
              whileHover="hover"
              animate={activeInput === 'identifier' ? "focus" : ""}
              variants={inputVariants}
              onHoverStart={() => setHoverState({...hoverState, email: true})}
              onHoverEnd={() => setHoverState({...hoverState, email: false})}
            >
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-300 mb-1">
                Email or Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="identifier"
                  name="identifier"
                  placeholder="Enter your email or username"
                  value={formData.identifier}
                  onChange={handleChange}
                  onFocus={() => setActiveInput('identifier')}
                  onBlur={() => setActiveInput(null)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white 
                             placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500
                             transition duration-300"
                />
                {hoverState.email && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -bottom-6 left-0 text-xs text-indigo-400"
                  >
                    We'll never share your details
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          <div className="space-y-2">
            <motion.div
              whileHover="hover"
              animate={activeInput === 'password' ? "focus" : ""}
              variants={inputVariants}
              onHoverStart={() => setHoverState({...hoverState, password: true})}
              onHoverEnd={() => setHoverState({...hoverState, password: false})}
            >
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setActiveInput('password')}
                  onBlur={() => setActiveInput(null)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white 
                             placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500
                             transition duration-300"
                />
                {hoverState.password && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -bottom-6 left-0 text-xs text-indigo-400"
                  >
                    Must be at least 8 characters
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-700"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                Forgot password?
              </Link>
            </div>
          </div>

          {(localError || error) && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-900/50 text-red-200 rounded-lg text-sm border border-red-700"
            >
              {localError || error}
            </motion.div>
          )}

          {successMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-green-900/50 text-green-200 rounded-lg text-sm border border-green-700"
            >
              {successMessage}
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
            ) : 'Sign in'}
          </motion.button>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
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
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
            Sign up
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;