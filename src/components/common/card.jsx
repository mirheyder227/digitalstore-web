import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { removeFromCart, clearCart, addToCart, updateQuantity } from "../../store/reducer/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.cartItems || []);

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleClear = () => {
    dispatch(clearCart());
  };

  const handleIncreaseQuantity = (item) => {
    dispatch(addToCart(item));
  };

  const handleDecreaseQuantity = (item) => {
    const newQuantity = (Number(item.quantity) || 0) - 1;
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id: item.id, quantity: newQuantity }));
    } else {
      dispatch(removeFromCart(item.id));
    }
  };

  const calculateTotalPrice = () => {
    if (!Array.isArray(cartItems)) return "0.00";
    const total = cartItems.reduce((acc, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return acc + price * quantity;
    }, 0);
    return total.toFixed(2);
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg mt-8 mb-8">
      <nav className="flex items-center text-sm text-gray-600 space-x-2 mb-4">
        <Link to="/" className="hover:underline">Home</Link>
        <span>›</span>
        <span className="font-semibold text-gray-800">Cart</span>
        <span>›</span>
        <Link to="/payment" className="hover:underline">Payment</Link>
      </nav>

      <h2 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
        Your Cart
      </h2>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-6">
            Your cart is currently empty.
          </p>
          <Link
            to="/productList"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cartItems.map((item) => {
              const itemPrice = Number(item.price) || 0;
              const itemQuantity = Number(item.quantity) || 0;
              const itemSubtotal = (itemPrice * itemQuantity).toFixed(2);

              return (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row items-center bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-lg transition"
                >
                  <img
                    src={item.imageUrl ? `http://localhost:5000${item.imageUrl}` : "https://via.placeholder.com/96x96?text=No+Image"}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-md mr-4 mb-4 md:mb-0"
                    onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/96x96?text=No+Image"; }}
                  />
                  <div className="flex-grow text-center md:text-left">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.name}
                    </h3>
                    <p className="text-gray-700 mt-1">${itemPrice.toFixed(2)}</p>
                    <div className="flex items-center justify-center md:justify-start mt-2">
                      <button
                        onClick={() => handleDecreaseQuantity(item)}
                        className="px-3 py-1 bg-gray-300 text-gray-800 rounded-l-md hover:bg-gray-400 transition"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 border-t border-b border-gray-300 text-gray-800">
                        {itemQuantity}
                      </span>
                      <button
                        onClick={() => handleIncreaseQuantity(item)}
                        className="px-3 py-1 bg-gray-300 text-gray-800 rounded-r-md hover:bg-gray-400 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-center md:items-end ml-auto">
                    <span className="text-lg font-bold text-gray-900 mb-2">${itemSubtotal}</span>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mt-8 pt-6 border-t-2 border-gray-200">
            <div className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
              Total Price:{" "}
              <span className="text-green-600">${calculateTotalPrice()}</span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleClear}
                className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition"
              >
                Empty Cart
              </button>
              <Link
                to="/payment"
                className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition flex items-center justify-center"
              >
                Complete Order
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
