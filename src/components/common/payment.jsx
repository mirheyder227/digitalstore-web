import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import GPay from "../../assets/image/payment/g-pay.webp";
import PayPal from "../../assets/image/payment/paypal.webp";
import ApplePay from "../../assets/image/payment/apple-pay.webp";

const Payment = () => {
  const cartItems = useSelector((state) => state.cart.cartItems || []);

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    country: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zipCode: "",
    paymentMethod: "credit_card",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCVC: "",
    company: "",
    saveInfo: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const calculateTotalPrice = () => {
    if (!Array.isArray(cartItems)) return 0;
    return cartItems.reduce((acc, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return acc + price * quantity;
    }, 0);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Order Data Submitted:", formData);
    console.log("Total Price:", calculateTotalPrice().toFixed(2));
    alert("Order Placed Successfully! (Simulated)");
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <nav className="flex items-center text-sm text-gray-600 space-x-2 mb-4">
        <Link to="/" className="hover:underline">Home</Link>
        <span>›</span>
        <Link to="/cart" className="hover:underline">Cart</Link>
        <span>›</span>
        <span className="font-semibold text-gray-800">Payment</span>
      </nav>

      <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-900">Checkout</h2>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 bg-white shadow-lg rounded-lg p-6">
          <form onSubmit={handleFormSubmit}>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Express Checkout</h3>
            <div className="flex flex-wrap items-center justify-center gap-6 p-4 border border-gray-200 rounded-lg mb-6">
              {[ApplePay, GPay, PayPal].map((logo, idx) => (
                <img
                  key={idx}
                  src={logo}
                  alt={`Digital Wallet ${idx === 0 ? "Apple Pay" : idx === 1 ? "Google Pay" : "PayPal"}`}
                  className="w-32 md:w-48 h-auto object-contain transform hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
                />
              ))}
            </div>

            <div className="flex items-center my-6">
              <hr className="flex-grow border-gray-300" />
              <span className="mx-4 text-gray-500 font-medium">or</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Contact Information</h3>
                <p className="text-sm text-gray-700">
                  Already have an account?{" "}
                  <Link to="/login" className="text-blue-600 hover:underline font-medium">
                    Log in
                  </Link>
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone (Optional)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="saveInfo"
                    id="saveInfo"
                    checked={formData.saveInfo}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="saveInfo" className="ml-2 text-gray-700 cursor-pointer">Save this information for next time</label>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Shipping Address</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="country" className="block mb-1 text-gray-700">Country/Region</label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Country</option>
                    <option value="Azerbaijan">Azerbaijan</option>
                    <option value="Turkey">Turkey</option>
                    <option value="USA">USA</option>
                    <option value="Germany">Germany</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block mb-1 text-gray-700">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="First Name"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block mb-1 text-gray-700">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Last Name"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="company" className="block mb-1 text-gray-700">Company (Optional)</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Company"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block mb-1 text-gray-700">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Street address, building, apartment"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block mb-1 text-gray-700">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="zipCode" className="block mb-1 text-gray-700">ZIP Code</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder="AZXXXX"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h3>
              <div className="space-y-3">
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit_card"
                    checked={formData.paymentMethod === "credit_card"}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-gray-800 font-medium">Credit Card</span>
                </label>
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={formData.paymentMethod === "paypal"}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-gray-800 font-medium">PayPal</span>
                </label>
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="apple_pay"
                    checked={formData.paymentMethod === "apple_pay"}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-gray-800 font-medium">Apple Pay</span>
                </label>
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="google_pay"
                    checked={formData.paymentMethod === "google_pay"}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-gray-800 font-medium">Google Pay</span>
                </label>
              </div>
            </div>

            {formData.paymentMethod === "credit_card" && (
              <div className="mb-6 space-y-4 p-4 border border-blue-200 bg-blue-50 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800">Card Details</h4>
                <div>
                  <label htmlFor="cardNumber" className="block mb-1 text-gray-700">Card Number</label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="XXXX XXXX XXXX XXXX"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    pattern="[0-9]{13,16}"
                    title="Card number should be 13 to 16 digits"
                  />
                </div>
                <div>
                  <label htmlFor="cardName" className="block mb-1 text-gray-700">Name on Card</label>
                  <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    placeholder="Full Name as on Card"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cardExpiry" className="block mb-1 text-gray-700">Expiry Date (MM/YY)</label>
                    <input
                      type="text"
                      id="cardExpiry"
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      pattern="(0[1-9]|1[0-2])\/\d{2}"
                      title="Please enter expiry date in MM/YY format"
                    />
                  </div>
                  <div>
                    <label htmlFor="cardCVC" className="block mb-1 text-gray-700">CVC</label>
                    <input
                      type="text"
                      id="cardCVC"
                      name="cardCVC"
                      value={formData.cardCVC}
                      onChange={handleInputChange}
                      placeholder="CVC"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      pattern="\d{3,4}"
                      title="Please enter 3 or 4 digit CVC"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out text-lg mt-8"
            >
              Place Order - ${calculateTotalPrice().toFixed(2)}
            </button>
          </form>
        </div>

        <div className="lg:w-1/3 bg-white shadow-lg rounded-lg p-6 h-fit sticky top-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h3>
          {Array.isArray(cartItems) && cartItems.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {cartItems.map((item) => {
                const itemPrice = Number(item.price) || 0;
                const itemQuantity = Number(item.quantity) || 0;
                const itemSubtotal = (itemPrice * itemQuantity).toFixed(2);

                return (
                  <li key={item.id} className="flex items-center py-3">
                    <img
                      src={
                        item.imageUrl
                          ? `http://localhost:5000${item.imageUrl}`
                          : "https://via.placeholder.com/60?text=No+Img"
                      }
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded mr-4"
                    />
                    <div className="flex-grow">
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Quantity: {itemQuantity}
                      </p>
                    </div>
                    <span className="font-semibold text-gray-900">
                      ${itemSubtotal}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-600 text-center py-4">Your cart is empty.</p>
          )}

          <div className="border-t border-gray-200 mt-4 pt-4 text-lg font-bold flex justify-between">
            <span>Total:</span>
            <span>${calculateTotalPrice().toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;