import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import logo from "../../assets/image/header/logo.png";
import { searchProducts } from "../../api/product"; // Import searchProducts
import { logout as apiLogout } from "../../store/reducer/authSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    try {
      const data = await searchProducts(value);
      setSearchResults(data);
      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const userName = user ? user.name || user.firstName || "User" : "";
  const cartItemCount = cartItems.length;

  const handleLogout = () => {
    dispatch(apiLogout());
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  return (
    <header className="bg-emerald-700 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center h-16">
        <div className="hidden md:flex items-center">
          <Link to="/" className="flex items-center">
            <img className="w-35 h-20 rounded-full mr-2" src={logo} alt="" />
            <span className="text-2xl font-extrabold text-zinc-200">
              Mirheyder's Site
            </span>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-6 flex-grow justify-center">
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link
                  to="/"
                  className="text-lg font-medium hover:text-red-600 transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/productList"
                  className="text-lg font-medium hover:text-red-600 transition"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/aboutUs"
                  className="text-lg font-medium hover:text-red-600 transition"
                >
                  About us
                </Link>
              </li>

              <li>
                <Link
                  to="/contactUs"
                  className="text-lg font-medium hover:red-600 transition"
                >
                  ContactUs
                </Link>
              </li>
            </ul>
          </nav>
          <div className="relative ml-8">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => {
                if (searchResults.length > 0) setShowResults(true);
              }}
              onBlur={() => {
                setTimeout(() => setShowResults(false), 200);
              }}
              placeholder="Search..."
              className="px-4 py-2 pl-10 rounded-full bg-zinc-200 border border-zinc-200 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-zinc-200 w-64"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {showResults && searchResults.length > 0 && (
              <div className="absolute z-10 mt-1 w-full max-w-full overflow-x-hidden bg-white border border-gray-300 rounded-lg shadow-lg">
                <ul>
                  {searchResults.map((item) => (
                    <li
                      key={item.id || item._id} // Use item.id or item._id based on your product data structure
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
                      onClick={() => {
                        navigate(`/product/${item.id || item._id}`); // Navigate to individual product page
                        setSearchQuery("");
                        setShowResults(false);
                      }}
                    >
                      {item.name} {/* Display product name */}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="flex items-center hover:text-red-600 transition"
              >
                <img
                  src="https://via.placeholder.com/32"
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full border-2 border-indigo-500"
                />
                <span className="ml-2 text-sm font-semibold">
                  Hi,{userName}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg text-sm transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-amber-300 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-lg text-sm transition"
              >
                Sign in
              </Link>
              <Link
                to="/signUp"
                className="bg-red-400 hover:bg-green-700 text-white font-bold py-2 px-3 rounded-lg text-sm transition"
              >
                Sign up
              </Link>
            </>
          )}

          <Link
            to="/cart"
            className="relative p-2 rounded-full hover:bg-gray-800 transition"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center -mt-1 -mr-1">
              {cartItemCount}
            </span>
          </Link>
        </div>

        {/* --- Mobile menu section --- */}
        <div className="md:hidden flex items-center justify-between w-full p-0">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-full hover:bg-gray-800 transition flex items-center"
          >
            {isMobileMenuOpen ? (
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            )}
            <img
              className="w-10 h-10 rounded-full ml-2"
              src={logo}
              alt="Logo"
            />
          </button>

          <div className="relative flex-1 mx-2 min-w-0">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => {
                if (searchResults.length > 0) setShowResults(true);
              }}
              onBlur={() => {
                setTimeout(() => setShowResults(false), 200);
              }}
              placeholder="Search..."
              className="px-4 py-2 pl-10 rounded-full bg-zinc-200 border border-zinc-200 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-zinc-200 w-full text-sm"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {showResults && searchResults.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                <ul>
                  {searchResults.map((item) => (
                    <li
                      key={item.id || item._id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
                      onClick={() => {
                        navigate(`/product/${item.id || item._id}`); // Navigate to individual product page
                        setSearchQuery("");
                        setShowResults(false);
                      }}
                    >
                      {item.name} {/* Display product name */}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <Link
            to="/cart"
            className="relative p-2 rounded-full hover:bg-gray-800 transition ml-2"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center -mt-1 -mr-1">
              {cartItemCount}
            </span>
          </Link>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900 py-4 px-6 mt-2 rounded-lg shadow-xl">
          <nav>
            <ul className="flex flex-col space-y-4">
              <li>
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-lg font-medium hover:text-red-600 py-2 transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/productList"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-lg font-medium hover:text-red-600 py-2 transition"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-lg font-medium hover:text-red-600 py-2 transition"
                >
                  About us
                </Link>
              </li>

              {isAuthenticated ? (
                <>
                  <li>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-lg font-medium hover:text-purple-300 py-2 transition"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center text-lg font-medium hover:text-red-600 py-2 transition"
                    >
                      <img
                        src="https://via.placeholder.com/32"
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full border-2 border-indigo-500 mr-2"
                      />
                      <span className="ml-2">{userName}</span>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg text-sm transition"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full block text-left bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-lg text-sm transition"
                    >
                      Sign in
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/signUp"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full block text-left bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded-lg text-sm mt-2 transition"
                    >
                      Sign up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
