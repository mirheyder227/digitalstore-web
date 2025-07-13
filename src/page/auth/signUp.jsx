
 
 import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../api/auth";
import { useDispatch } from "react-redux";
import { loginUser } from "../../store/reducer/authSlice";

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Şifrələr uyğun gəlmir.");
      return;
    }

    setLoading(true);
    try {
      await register({
        email: formData.email,
        password: formData.password,
      });

      const resultAction = await dispatch(
        loginUser({
          email: formData.email,
          password: formData.password,
        })
      );

      if (loginUser.fulfilled.match(resultAction)) {
        navigate("/");
      } else if (loginUser.rejected.match(resultAction)) {
        setError(resultAction.payload || "Qeydiyyatdan sonra daxil olma uğursuz oldu.");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err?.message || "Qeydiyyat zamanı xəta baş verdi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: `url('https://avatars.mds.yandex.net/i?id=8044cf0ce5d3d556974445d2602c2fc724875a5f-6472467-images-thumbs&n=13')`,
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60 z-0"></div>

      <div className="relative z-10 p-8 rounded-lg shadow-xl text-center max-w-md w-full bg-white bg-opacity-10 backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-white mb-8">
          Yeni Hesab Yarat
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* UserName sahəsi çıxarıldı */}
          <div>
            <label htmlFor="email" className="block text-white text-left mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="email@example.com"
              className="pl-4 pr-4 py-3 w-full rounded-md border-0 focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white/20 placeholder-gray-500"
              autoComplete="email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-white text-left mb-1"
            >
              Şifrə
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Şifrənizi daxil edin"
              className="pl-4 pr-4 py-3 w-full rounded-md border-0 focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white/20 placeholder-gray-500"
              autoComplete="new-password"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-white text-left mb-1"
            >
              Şifrəni Təsdiqlə
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Şifrənizi yenidən daxil edin"
              className="pl-4 pr-4 py-3 w-full rounded-md border-0 focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white/20 placeholder-gray-500"
              autoComplete="new-password"
            />
          </div>

          {error && <p className="text-red-400 text-center text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-md w-full transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50"
          >
            {loading ? "Qeydiyyatdan Keçilir..." : "Qeydiyyatdan Keç"}
          </button>
        </form>

        <p className="mt-6 text-center text-white/80">
          Artıq hesabınız var?{" "}
          <Link
            to="/login"
            className="text-white font-semibold hover:underline"
          >
            Daxil Ol
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
