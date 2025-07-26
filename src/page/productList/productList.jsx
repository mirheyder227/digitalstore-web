import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProducts } from "../../api/product";
import { Skeleton } from "antd"; // Using Ant Design Skeleton for loading states
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/reducer/cartSlice";
import { ShoppingCartOutlined } from "@ant-design/icons";

// Reusable Custom Message Component (consider moving to a common folder like src/components/common)
const CustomMessage = ({ message, type, onClose }) => {
  const bgColor = {
    success: "bg-green-500",
    info: "bg-blue-500",
    error: "bg-red-500",
  }[type] || "bg-gray-700";
  const textColor = "text-white";

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Message disappears after 3 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center justify-between animate-fade-in-down ${bgColor} ${textColor}`}
      role="alert"
    >
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white font-bold text-xl leading-none">&times;</button>
    </div>
  );
};

const ProductList = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for custom message box
  const [showCustomMessage, setShowCustomMessage] = useState(false);
  const [customMessageText, setCustomMessageText] = useState("");
  const [customMessageType, setCustomMessageType] = useState("success");

  // Helper function to show custom message
  const showMessage = (msg, type = "success") => {
    setCustomMessageText(msg);
    setCustomMessageType(type);
    setShowCustomMessage(true);
  };

  // Helper function to close custom message
  const closeMessage = () => {
    setShowCustomMessage(false);
    setCustomMessageText("");
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Məhsullar yüklənərkən xəta baş verdi. Zəhmət olmasa, daha sonra yenidən cəhd edin.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, quantity: 1 })); // Add 1 quantity by default
    showMessage(`${product.name} səbətə əlavə edildi!`, "success");
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8 animate-pulse">
        <Skeleton active paragraph={{ rows: 10 }} />
        <Skeleton active paragraph={{ rows: 5 }} className="mt-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center text-red-600 text-2xl font-semibold p-8 bg-white rounded-lg shadow-lg animate-fade-in">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
      {/* Custom Message Box */}
      {showCustomMessage && (
        <CustomMessage message={customMessageText} type={customMessageType} onClose={closeMessage} />
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-10 text-center">
          Our Products
        </h2>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-6">
              Hal-hazırda heç bir məhsul mövcud deyil.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product._id || product.id} // Use _id for MongoDB, id for SQLite/mock
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col group border border-gray-200"
              >
                <Link to={`/product/${product._id || product.id}`} className="block relative w-full h-56 overflow-hidden bg-gray-100">
                  <img
                    src={product.imageUrl || "https://placehold.co/600x450?text=No+Image"}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x450?text=Image+Error"; }}
                  />
                </Link>
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <Link to={`/product/${product._id || product.id}`} className="block">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                      {product.description || "No description provided."}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <p className="text-indigo-600 text-3xl font-extrabold">
                      ${parseFloat(product.price).toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-indigo-500 text-white p-3 rounded-full shadow-md hover:bg-indigo-600 transition duration-300 transform hover:scale-110"
                      aria-label={`Add ${product.name} to cart`}
                    >
                      <ShoppingCartOutlined className="text-xl" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
