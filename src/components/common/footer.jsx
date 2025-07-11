import React from "react";
import { Link } from "react-router-dom";
import instagram from "../../assets/image/footer/instagram.png";
import facebook from "../../assets/image/footer/fb-icon.png";
import x from "../../assets/image/footer/x-icon.webp";
const Footer = () => {
  return (
    <footer className=" text-zinc-200 flex flex-col md:flex-row flex-wrap justify-around items-start p-6 bg-emerald-700">
      {/* Categories bölməsi */}
      <div className="flex flex-col mb-4 md:mb-0">
        <h3 className="font-bold mb-2 text-zinc-200">Categories</h3>
        <Link
          to="/productList?category=Phone"
          className="mb-1 hover:text-red-500 text-zinc-200"
        >
          Smartphones
        </Link>
        <Link
          to="/productList?category=Computer"
          className="mb-1 hover:text-red-500 text-zinc-200"
        >
          Computer
        </Link>
        <Link
          to="/productList?category=Smart Watch"
          className="mb-1 hover:text-red-500 text-zinc-200"
        >
          Smart Watch
        </Link>
        <Link
          to="/productList?category=Charger"
          className="mb-1 hover:text-red-500 text-zinc-200"
        >
          Chargers & Cables
        </Link>
        <Link
          to="/productList?category=Earphone"
          className="mb-1 hover:text-red-500 text-zinc-200"
        >
          Earphone
        </Link>
      </div>

      {/* Menu bölməsi */}
      <div className="flex flex-col mb-4 md:mb-0">
        <h3 className="font-bold mb-2 text-zinc-200">Menu</h3>
        <Link
          to="/productList?category=Phone"
          className="mb-1 hover:text-red-500 text-zinc-200"
        >
          New Arrivals
        </Link>
        <Link to="/" className="mb-1 hover:text-red-500 text-zinc-200">
          Best Sellers
        </Link>
        <Link to="#" className="mb-1 hover:text-red-500 text-zinc-200">
          Recently Viewed
        </Link>
        <Link to="#" className="mb-1 hover:text-red-500 text-zinc-200">
          Deals & Discounts
        </Link>
        <Link
          to="/productList"
          className="mb-1 hover:text-red-500 text-zinc-200"
        >
          All Products
        </Link>
      </div>

      {/* Our Company bölməsi */}
      <div className="flex flex-col mb-4 md:mb-0">
        <h3 className="font-bold mb-2 text-zinc-200">Our Company</h3>
        <Link to="/aboutUs" className="mb-1 hover:text-red-500 text-zinc-200">
          About Us
        </Link>
        <Link to="/contactUs" className="mb-1 hover:text-red-500 text-zinc-200">
          Contact Us
        </Link>
        <Link to="#" className="mb-1 hover:text-red-500 text-zinc-200">
          Warranty & Returns
        </Link>
        <Link to="#" className="mb-1 hover:text-red-500 text-zinc-200">
          Privacy Policy
        </Link>
      </div>

      {/* Mailing list bölməsi */}
      <div className="flex flex-col">
        <h3 className="font-bold mb-2">Join our mailing list</h3>
        <div className="flex flex-col md:flex-row flex-wrap">
          <input
            type="email"
            placeholder="your e-mail"
            className="w-48 border border-neutral-50 text-zinc-950 focus:border-neutral-50 rounded placeholder-gray-400 p-2 mb-2 md:mb-0 md:mr-2"
          />
          <button className="cursor-pointer p-2 bg-blue-600 hover:bg-green-800 border border-blue-600 text-white font-bold py-2 px-4 rounded">
            Sign up
          </button>
        </div>
      </div>

    <div className="w-full flex flex-col md:flex-row justify-between items-center mt-6 border-t border-zinc-400 pt-4">
    <p className="text-sm mb-2 md:mb-0">© 2025 Mirheyder Avion LTD</p>
    <div className="flex flex-row items-center gap-4">
      <a
        href="https://www.instagram.com/444heyder/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={instagram}
          alt="Instagram"
          className="w-10 h-10 hover:scale-110 transition duration-300"
        />
      </a>

      <a
        href="https://www.facebook.com/profile.php?id=100070608830764"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={facebook}
          alt="Facebook"
          className="w-10 h-10 hover:scale-110 transition duration-300"
        />
      </a>

      <a
        href="https://x.com/Hedar81946693"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={x}
          alt="Twitter"
          className="w-10 h-10 hover:scale-110 transition duration-300"
        />
      </a>
    </div>
  </div>

    </footer>
    
  );
};

export default Footer;
