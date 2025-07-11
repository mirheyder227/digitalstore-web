import React, { useState } from "react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "", // Corrected 'adress' to 'address' for consistency
    company: "",
    country: "",
    message: "",
    saveInfo: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send formData to an API
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We'll be in touch soon.");
    // Optionally reset form
    setFormData({
      email: "",
      firstName: "",
      lastName: "",
      address: "",
      company: "",
      country: "",
      message: "",
      saveInfo: false,
    });
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white py-16 px-4 font-sans relative overflow-hidden">
      {/* Background Gradient & Blobs for visual interest */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 w-full max-w-2xl bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-700">
        <div className="text-center mb-10">
          <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">
            Connect with Our <span className="text-blue-400">Sales Team</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-prose mx-auto leading-relaxed">
            Our dedicated team is ready to answer your sales inquiries. Please fill out the form
            below, and we'll get back to you as quickly as possible.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block mb-2 text-gray-200 text-lg font-medium">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              placeholder="John"
              className="w-full p-4 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200 ease-in-out text-lg"
            />
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block mb-2 text-gray-200 text-lg font-medium">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              placeholder="Doe"
              className="w-full p-4 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200 ease-in-out text-lg"
            />
          </div>

          {/* Email */}
          <div className="md:col-span-2">
            <label htmlFor="email" className="block mb-2 text-gray-200 text-lg font-medium">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="you@example.com"
              className="w-full p-4 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200 ease-in-out text-lg"
            />
          </div>

          {/* Company (Optional) */}
          <div className="md:col-span-2">
            <label htmlFor="company" className="block mb-2 text-gray-200 text-lg font-medium">
              Company (Optional)
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              placeholder="Your Company Name"
              className="w-full p-4 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200 ease-in-out text-lg"
            />
          </div>

          {/* Country */}
          <div className="md:col-span-2">
            <label htmlFor="country" className="block mb-2 text-gray-200 text-lg font-medium">
              Country
            </label>
            <select
              name="country"
              id="country"
              value={formData.country}
              onChange={handleInputChange}
              required
              className="w-full p-4 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none pr-8 cursor-pointer text-lg"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23d1d5db' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 8l3 3 3-3'%3e%3c/path%3e%3c/svg%3e")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 1rem center",
                backgroundSize: "1em",
              }}
            >
              <option value="" disabled hidden>Select your country</option>
              <option value="Azerbaijan">Azerbaijan</option>
              <option value="Turkey">Turkey</option>
              <option value="USA">USA</option>
              <option value="Germany">Germany</option>
              <option value="Canada">Canada</option>
              <option value="UK">United Kingdom</option>
              <option value="France">France</option>
              <option value="Japan">Japan</option>
              {/* Add more countries as needed */}
            </select>
          </div>

          {/* Message */}
          <div className="md:col-span-2">
            <label htmlFor="message" className="block mb-2 text-gray-200 text-lg font-medium">
              How can we help?
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows="6"
              placeholder="Tell us about your needs or questions..."
              className="w-full p-4 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200 ease-in-out text-lg resize-y"
            />
          </div>

          {/* Checkbox */}
          <div className="md:col-span-2 flex items-center mb-4">
            <input
              type="checkbox"
              id="saveInfo"
              name="saveInfo"
              checked={formData.saveInfo}
              onChange={handleInputChange}
              className="h-5 w-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="saveInfo" className="ml-3 text-gray-300 text-base cursor-pointer">
              Save my name, email, and website in this browser for the next time I comment.
            </label>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-800 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 flex items-center justify-center gap-3 text-xl tracking-wide uppercase"
            >
              Send Message
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactUs;