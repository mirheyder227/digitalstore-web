import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import logo from "../../assets/image/header/red.png";
import { logout as apiLogout } from "../../store/reducer/authSlice";
import SearchProducts from "./search"; // SearchProduct əvəzinə SearchProducts import edirik

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef(null);

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
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white p-4 shadow-xl">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Logo və Şirkət Adı */}
        <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
          <img src={logo} alt="TechMaze Logo" className="w-14 h-14 rounded-full border-2 border-white transform hover:scale-105 transition-transform duration-300" />
          <span className="text-2xl font-extrabold tracking-wide whitespace-nowrap">TechMaze</span>
        </Link>

        {/* Desktop Naviqasiya Menyu */}
        <nav className="hidden md:flex space-x-7 text-lg font-medium flex-shrink-0">
          <Link to="/" className="hover:text-amber-300 transition-colors duration-200">Home</Link>
          <Link to="/productList" className="hover:text-amber-300 transition-colors duration-200">Products</Link>
          <Link to="/aboutUs" className="hover:text-amber-300 transition-colors duration-200">About Us</Link>
          <Link to="/contactUs" className="hover:text-amber-300 transition-colors duration-200">Contact Us</Link>
        </nav>

        {/* Axtarış Çubuğu - Desktopda daha geniş, mobildə tam en */}
        <div className="w-full md:w-auto flex-grow md:max-w-sm order-3 md:order-none mt-4 md:mt-0">
          {/* SearchProduct əvəzinə SearchProducts komponentini istifadə edirik */}
          <SearchProducts onProductSelect={(productId) => { // onBookSelect əvəzinə onProductSelect
            navigate(`/product/${productId}`); // /book/ əvəzinə /product/
            setMenuOpen(false);
          }} />
        </div>

        {/* İstifadəçi və Səbət İkonları - Desktopda sağda */}
        <div className="hidden md:flex items-center space-x-6 flex-shrink-0">
          {isAuthenticated ? (
            <>
              <span className="text-gray-200 text-lg font-medium whitespace-nowrap">Hi, {userName}</span>
              <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-full shadow-md transition-all duration-300 transform hover:scale-105 whitespace-nowrap">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full shadow-md transition-all duration-300 transform hover:scale-105 whitespace-nowrap">Sign In</Link>
              <Link to="/signUp" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-full shadow-md transition-all duration-300 transform hover:scale-105 whitespace-nowrap">Sign Up</Link>
            </>
          )}

          <Link to="/cart" className="relative text-white hover:text-amber-300 transition-colors duration-200">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3c-.63.63-.18 1.7.7 1.7H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
            </svg>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-emerald-800">
              {cartItems.length}
            </span>
          </Link>
        </div>

        {/* Mobil Menyu Düyəsi */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden ml-auto text-white hover:text-amber-300 transition-colors duration-200 flex-shrink-0">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobil Menyu Açılan Pəncərə */}
      {menuOpen && (
        <div ref={menuRef} className="mt-4 bg-emerald-800 p-5 rounded-lg shadow-2xl space-y-4 md:hidden animate-fade-in-down">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block text-white hover:text-amber-300 transition-colors duration-200 text-lg font-medium py-2">Home</Link>
          <Link to="/productList" onClick={() => setMenuOpen(false)} className="block text-white hover:text-amber-300 transition-colors duration-200 text-lg font-medium py-2">Products</Link>
          <Link to="/aboutUs" onClick={() => setMenuOpen(false)} className="block text-white hover:text-amber-300 transition-colors duration-200 text-lg font-medium py-2">About Us</Link>
          <Link to="/contactUs" onClick={() => setMenuOpen(false)} className="block text-white hover:text-amber-300 transition-colors duration-200 text-lg font-medium py-2">Contact Us</Link>

          <div className="py-2">
            {/* SearchProduct əvəzinə SearchProducts komponentini istifadə edirik */}
            <SearchProducts onProductSelect={(productId) => { // onBookSelect əvəzinə onProductSelect
              navigate(`/product/${productId}`); // /book/ əvəzinə /product/
              setMenuOpen(false);
            }} />
          </div>

          {isAuthenticated ? (
            <>
              <span className="block text-gray-200 text-lg font-medium py-2">Hi, {userName}</span>
              <button onClick={handleLogout} className="block w-full text-left bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-full shadow-md transition-all duration-300">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full shadow-md transition-all duration-300">Sign In</Link>
              <Link to="/signUp" onClick={() => setMenuOpen(false)} className="block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-full shadow-md transition-all duration-300">Sign Up</Link>
            </>
          )}
            <Link to="/cart" className="relative block text-white hover:text-amber-300 transition-colors duration-200 py-2">
            <div className="flex items-center space-x-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3c-.63.63-.18 1.7.7 1.7H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
            </svg>
            <span className="text-lg">Cart</span>
            <span className="bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-emerald-800">
              {cartItems.length}
            </span>
            </div>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
