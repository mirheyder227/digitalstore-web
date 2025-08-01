import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import instagram from "../../assets/image/footer/instagram.png";
import facebook from "../../assets/image/footer/fb-icon.png";
import x from "../../assets/image/footer/x-icon.webp";
// import newsletterIcon from "../../assets/image/footer/newsletter.png";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const footerLinks = [
    {
      title: "Categories",
      links: [
        { name: "Smartphones", to: "/productList?category=Phone" },
        { name: "Computer", to: "/productList?category=Computer" },
        { name: "Smart Watch", to: "/productList?category=Smart Watch" },
        { name: "Chargers & Cables", to: "/productList?category=Charger" },
        { name: "Earphone", to: "/productList?category=Earphone" },
      ],
    },
    {
      title: "Menu",
      links: [
        { name: "New Arrivals", to: "/productList?category=Phone" },
        { name: "Best Sellers", to: "/" },
        { name: "Recently Viewed", to: "#" },
        { name: "Deals & Discounts", to: "#" },
        { name: "All Products", to: "/productList" },
      ],
    },
    {
      title: "Our Company",
      links: [
        { name: "About Us", to: "/aboutUs" },
        { name: "Contact Us", to: "/contactUs" },
        { name: "Warranty & Returns", to: "#" },
        { name: "Privacy Policy", to: "#" },
      ],
    },
  ];

  const socialLinks = [
    { icon: instagram, alt: "Instagram", href: "https://www.instagram.com/444heyder/" },
    { icon: facebook, alt: "Facebook", href: "https://www.facebook.com/profile.php?id=100070608830764" },
    { icon: x, alt: "Twitter", href: "https://x.com/Hedar81946693" },
  ];

  const itemVariants = {
    hover: { 
      scale: 1.05,
      color: "#ef4444", // red-500
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  return (
    <footer className="relative bg-gradient-to-b from-emerald-700 to-emerald-800 text-zinc-200 pt-12 pb-6 px-6 overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-emerald-600 rounded-full opacity-10"></div>
      <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-emerald-600 rounded-full opacity-10"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Footer links sections */}
          {footerLinks.map((section, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col"
            >
              <h3 className="font-bold text-lg mb-4 text-white border-b border-emerald-500 pb-2">
                {section.title}
              </h3>
              <div className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <motion.div
                    key={linkIndex}
                    whileHover="hover"
                    whileTap="tap"
                    variants={itemVariants}
                    onHoverStart={() => setHoveredItem(`${index}-${linkIndex}`)}
                    onHoverEnd={() => setHoveredItem(null)}
                  >
                    <Link
                      to={link.to}
                      className={`block transition-colors ${hoveredItem === `${index}-${linkIndex}` ? 'text-red-500' : 'text-zinc-200'}`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Newsletter section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col"
          >
            <div className="flex items-center mb-4">
              {/* <img src={newsletterIcon} alt="Newsletter" className="w-8 h-8 mr-2" /> */}
              <h3 className="font-bold text-lg text-white">Join our mailing list</h3>
            </div>
            
            <p className="text-zinc-300 mb-4">
              Subscribe to get updates on new arrivals, special offers and other discount information.
            </p>
            
            <form onSubmit={handleSubscribe} className="flex flex-col space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-emerald-800 border border-emerald-600 text-white 
                             placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-white
                             transition duration-300"
                  required
                />
              </div>
              
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 
                           text-white font-medium shadow-lg hover:shadow-xl transition-all"
              >
                {isSubscribed ? "Thank You!" : "Subscribe"}
              </motion.button>
            </form>
            
            {isSubscribed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-green-300"
              >
                You've been subscribed to our newsletter!
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Bottom section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-emerald-600"
        >
          <p className="text-sm text-zinc-300 mb-4 md:mb-0">
            © {new Date().getFullYear()} Heyder Avion LTD. All rights reserved.
          </p>
          
          <div className="flex space-x-6">
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.9 }}
                className="bg-emerald-800 p-2 rounded-full hover:bg-emerald-900 transition-colors"
              >
                <img
                  src={social.icon}
                  alt={social.alt}
                  className="w-6 h-6 object-contain"
                />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;