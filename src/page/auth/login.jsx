// src/page/js/Login.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/reducer/authSlice"; // Async thunk action

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [successMessage, setSuccessMessage] = useState("");

  // Əgər istifadəçi artıq daxil olubsa, əsas səhifəyə yönləndir
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]); // isAuthenticated və navigate dəyişdikdə işə düşür

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(""); // Yeni cəhddən əvvəl əvvəlki mesajları təmizlə

    // loginUser thunk-ı işə sal
    const resultAction = await dispatch(loginUser(formData));

    // `unwrapResult` istifadə etmək daha təhlükəsizdir, ancaq `fulfilled.match` da işləyir.
    if (loginUser.fulfilled.match(resultAction)) {
      setSuccessMessage("Daxil olma uğurludur! Yönləndirilirsiniz...");
      setTimeout(() => {
        navigate("/"); // Uğurlu daxil olandan sonra əsas səhifəyə yönləndir
      }, 1000);
    }
    // `loginUser.rejected.match(resultAction)` halında, xəta avtomatik olaraq Redux state-ə yazıldığı üçün
    // error mesajı `error && <p>` şərtinə görə göstəriləcək.
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: `url('https://avatars.mds.yandex.net/i?id=8044cf0ce5d3d556974445d2602c2fc724875a5f-6472467-images-thumbs&n=13')`,
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60 z-0"></div>

      <div className="relative z-10 p-8 rounded-lg shadow-xl text-center max-w-sm w-full bg-white bg-opacity-10 backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-white mb-8">Daxil Ol</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="pl-4 pr-4 py-3 w-full rounded-md border-0 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
              autoComplete="email"
            />
          </div>

          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Şifrə"
              value={formData.password}
              onChange={handleChange}
              required
              className="pl-4 pr-4 py-3 w-full rounded-md border-0 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
              autoComplete="current-password"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {successMessage && <p className="text-green-400 text-sm">{successMessage}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-md w-full transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Daxil Olunur..." : "Daxil Ol"}
          </button>
        </form>

        <div className="mt-6 flex justify-between text-sm text-white/80">
          <Link to="/forgot-password" className="hover:underline">
            Şifrəni unutmusunuz?
          </Link>
          <Link to="/signup" className="hover:underline">
            Qeydiyyatdan Keç
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;