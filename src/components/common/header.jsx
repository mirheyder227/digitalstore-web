import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import logo from "../../assets/image/header/red.png";
import { logout as apiLogout } from "../../store/reducer/authSlice";
import SearchProducts from "./search";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const menuRef = useRef(null);
  const cartRef = useRef(null);

  const handleLogout = () => {
    dispatch(apiLogout());
    navigate("/login");
  };

  const userName = user ? user.name || user.firstName || "User" : "";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(e.target)) {
        setShowCartPreview(false);
      }
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-gradient-to-r from-emerald-700 to-emerald-900 shadow-2xl py-2" : "bg-gradient-to-r from-emerald-600 to-emerald-800 shadow-xl py-4"}`}>
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4">
        {/* Logo with animation */}
        <Link
          to="/"
          className="flex items-center space-x-3 flex-shrink-0 group"
        >
          <motion.img
            src={logo}
            alt="TechMaze Logo"
            className="w-12 h-12 rounded-full border-2 border-white transition-all duration-300 group-hover:rotate-12 group-hover:border-amber-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          />
          <motion.span
            className="text-2xl font-extrabold tracking-wide whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-white"
            whileHover={{ scale: 1.05 }}
          >
            TechMaze
          </motion.span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-7 text-lg font-medium flex-shrink-0">
          {/* Burada "productList" yerine "Products" yazdıq, amma yolu /productList saxladıq */}
          {["Home", "Products", "About Us", "Contact Us"].map((item) => {
            let path;
            if (item === "Home") {
              path = "/";
            } else if (item === "Products") { // "Products" üçün xüsusi yol
              path = "/productList";
            } else {
              path = `/${item.toLowerCase().replace(" ", "")}`;
            }

            return (
              <motion.div
                key={item}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={path}
                  className="relative text-white hover:text-amber-300 transition-colors duration-200 group"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-300 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Search Bar */}
        <div className="w-full md:w-auto flex-grow md:max-w-sm order-3 md:order-none mt-4 md:mt-0">
          <SearchProducts onProductSelect={(productId) => {
            navigate(`/product/${productId}`);
            setMenuOpen(false);
          }} />
        </div>

        {/* Desktop Auth & Cart */}
        <div className="hidden md:flex items-center space-x-6 flex-shrink-0">
          {isAuthenticated ? (
            <>
              <motion.div
                className="relative group"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-gray-200 text-lg font-medium whitespace-nowrap cursor-default">
                  Hi, {userName}
                </span>
                <div className="absolute left-0 mt-1 w-full h-0.5 bg-amber-300 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              </motion.div>

              <motion.button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-full shadow-md transition-all duration-300 whitespace-nowrap"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Logout
              </motion.button>
            </>
          ) : (
            <>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full shadow-md transition-all duration-300 whitespace-nowrap"
                >
                  Sign In
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/signUp"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-full shadow-md transition-all duration-300 whitespace-nowrap"
                >
                  Sign Up
                </Link>
              </motion.div>
            </>
          )}

          {/* Cart with preview */}
          <div
            className="relative"
            ref={cartRef}
            onMouseEnter={() => setShowCartPreview(true)}
            onMouseLeave={() => setShowCartPreview(false)}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/cart"
                className="relative text-white hover:text-amber-300 transition-colors duration-200"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3c-.63.63-.18 1.7.7 1.7H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
                </svg>
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-emerald-800">
                  {cartItems.length}
                </span>
              </Link>
            </motion.div>

            {/* Cart Preview */}
            <AnimatePresence>
              {showCartPreview && cartItems.length > 0 && (
                <motion.div
                  className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-4 max-h-80 overflow-y-auto">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2">Your Cart</h3>
                    {cartItems.map(item => (
                      <div key={item.id} className="flex items-center py-3 border-b border-gray-100 dark:border-gray-700">
                        <img
                          src={item.imageUrl || "https://placehold.co/100x100"}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-md mr-3"
                        />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-800 dark:text-white truncate">{item.name}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                          ${(item.quantity * item.price).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-gray-800 dark:text-white">Total:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        ${cartTotal.toFixed(2)}
                      </span>
                    </div>
                    <Link
                      to="/cart"
                      className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white text-center font-semibold py-2 px-4 rounded-md transition-colors duration-200"
                      onClick={() => setShowCartPreview(false)}
                    >
                      View Cart
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden ml-auto text-white hover:text-amber-300 transition-colors duration-200 flex-shrink-0"
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            className="md:hidden bg-emerald-800 shadow-2xl"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 py-3 space-y-4">
              {/* Burada da "productList" yerine "Products" yazdıq, amma yolu /productList saxladıq */}
              {["Home", "Products", "About Us", "Contact Us"].map((item) => {
                let path;
                if (item === "Home") {
                  path = "/";
                } else if (item === "Products") { // "Products" üçün xüsusi yol
                  path = "/productList";
                } else {
                  path = `/${item.toLowerCase().replace(" ", "")}`;
                }
                return (
                  <motion.div
                    key={item}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to={path}
                      onClick={() => setMenuOpen(false)}
                      className="block text-white hover:text-amber-300 transition-colors duration-200 text-lg font-medium py-2"
                    >
                      {item}
                    </Link>
                  </motion.div>
                );
              })}

              <div className="py-2">
                <SearchProducts onProductSelect={(productId) => {
                  navigate(`/product/${productId}`);
                  setMenuOpen(false);
                }} />
              </div>

              {isAuthenticated ? (
                <>
                  <span className="block text-gray-200 text-lg font-medium py-2">Hi, {userName}</span>
                  <motion.button
                    onClick={handleLogout}
                    className="block w-full text-left bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-full shadow-md transition-all duration-300"
                    whileTap={{ scale: 0.95 }}
                  >
                    Logout
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full shadow-md transition-all duration-300 mb-3"
                    >
                      Sign In
                    </Link>
                  </motion.div>

                  <motion.div
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/signUp"
                      onClick={() => setMenuOpen(false)}
                      className="block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-full shadow-md transition-all duration-300"
                    >
                      Sign Up
                    </Link>
                  </motion.div>
                </>
              )}

              <motion.div
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/cart"
                  onClick={() => setMenuOpen(false)}
                  className="relative flex items-center space-x-2 text-white hover:text-amber-300 transition-colors duration-200 py-2 mt-3"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3c-.63.63-.18 1.7.7 1.7H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
                  </svg>
                  <span className="text-lg">Cart</span>
                  <span className="bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-emerald-800">
                    {cartItems.length}
                  </span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;