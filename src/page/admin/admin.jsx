import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/reducer/authSlice";
import { fetchDashboardStats, fetchRecentActivities } from "../../api/admin";
import { getAllProducts, deleteProduct } from "../../api/product";
import { message, Modal, Skeleton } from "antd";
import AddProductForm from "../../components/admin/forms/AddProductForm";
import ProductEditForm from "../../components/admin/forms/ProductEditForm";

const Admin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, token } = useSelector((state) => state.auth);

  const [dashboardStats, setDashboardStats] = useState({
    usersCount: "Yüklənir...",
    productsCount: "Yüklənir...",
    pendingOrdersCount: "Yüklənir...",
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [errorStats, setErrorStats] = useState(null);
  const [errorActivities, setErrorActivities] = useState(null);

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorProducts, setErrorProducts] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    if (!token || user?.role !== "admin") {
      console.warn(
        "Admin paneli: Yetərli icazə yoxdur və ya token yoxdur. Login səhifəsinə yönləndirilir."
      );
      navigate("/login");
      return;
    }

    fetchAdminData();
    fetchProducts();
  }, [token, user, navigate]);

  const fetchAdminData = async () => {
    setLoadingStats(true);
    setErrorStats(null);
    try {
      const statsData = await fetchDashboardStats(token);
      setDashboardStats(statsData);
    } catch (err) {
      console.error(
        "Dashboard statistika xətası:",
        err.response?.data || err.message
      );
      setErrorStats(err.response?.data?.message || "Statistikalar yüklənmədi.");
      setDashboardStats({
        usersCount: "Xəta",
        productsCount: "Xəta",
        pendingOrdersCount: "Xəta",
      });
    } finally {
      setLoadingStats(false);
    }

    setLoadingActivities(true);
    setErrorActivities(null);
    try {
      const activitiesData = await fetchRecentActivities(token);
      setRecentActivities(activitiesData);
    } catch (err) {
      console.error(
        "Son fəaliyyətlər xətası:",
        err.response?.data || err.message
      );
      setErrorActivities(
        err.response?.data?.message || "Fəaliyyətlər yüklənmədi."
      );
      setRecentActivities([]);
    } finally {
      setLoadingActivities(false);
    }
  };

  const fetchProducts = async () => {
    setLoadingProducts(true);
    setErrorProducts(null);
    try {
      const productsData = await getAllProducts(); // No .data needed here

      if (!Array.isArray(productsData)) {
        console.error("Backend did not return an array for products:", productsData);
        throw new Error("Məhsul məlumatları düzgün formatda deyil.");
      }

      const formattedProducts = productsData.map((item) => ({
        id: item._id || item.id, // Use _id or id based on your database
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        imageUrl: item.imageUrl || null,
      }));
      setProducts(formattedProducts);
    } catch (err) {
      console.error("Məhsulları yükləmək alınmadı:", err);
      message.error(err.message || "Məhsulları yükləmək alınmadı.");
      setErrorProducts(err.message || "Məhsulları yükləmək alınmadı.");
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleDelete = (productId) => {
    Modal.confirm({
      title: "Məhsulu silmək istəyirsiniz?",
      content: "Bu əməliyyat geri qaytarıla bilməz.",
      okText: "Bəli, Sil",
      okType: "danger",
      cancelText: "Ləğv Et",
      onOk: async () => {
        try {
          // Düzəliş burada: deleteProduct funksiyasına token göndərməyin.
          // Axios instance artıq tokeni avtomatik olaraq header-ə əlavə edir.
          await deleteProduct(productId);
          message.success("Məhsul uğurla silindi!");
          fetchProducts(); // Silindikdən sonra məhsul siyahısını yeniləyin
        } catch (err) {
          console.error("Məhsul silinərkən xəta:", err);
          message.error(err.message || "Silinərkən xəta baş verdi.");
        }
      },
    });
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setShowAddForm(false); // Hide add form when showing edit form
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  const handleEditSuccess = () => {
    setEditingProduct(null); // Close edit form
    fetchProducts(); // Refresh products list
    // Ant Design message.success is already called inside ProductEditForm
  };

  const handleAddSuccess = () => {
    setShowAddForm(false); // Close add form
    fetchProducts(); // Refresh products list
    // Ant Design message.success is already called inside AddProductForm (if implemented)
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const API_BASE_URL_FOR_IMAGES = import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace("/api", "")
    : "http://localhost:5000";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-gray-100 font-inter py-8">
      <nav className="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-lg shadow-lg p-6 flex items-center justify-between sticky top-0 z-50 rounded-b-3xl mb-8">
        <div className="flex items-center space-x-4">
          <svg
            className="w-10 h-10 text-purple-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
          </svg>
          <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-lg">
            Admin Paneli
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
        >
          Çıxış
        </button>
      </nav>

      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-white">Statistikalar</h2>
        {loadingStats ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, index) => (
              <Skeleton
                key={index}
                active
                paragraph={{ rows: 1 }}
                className="bg-gray-700 rounded-lg p-4"
              />
            ))}
          </div>
        ) : errorStats ? (
          <p className="text-red-400 bg-red-800 p-4 rounded-lg mb-8">
            {errorStats}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 bg-opacity-70 shadow-lg rounded-lg p-6 text-center border border-purple-700">
              <h3 className="text-lg font-semibold text-purple-300">
                İstifadəçi Sayı
              </h3>
              <p className="text-4xl font-extrabold mt-2">
                {dashboardStats.usersCount}
              </p>
            </div>
            <div className="bg-gray-800 bg-opacity-70 shadow-lg rounded-lg p-6 text-center border border-blue-700">
              <h3 className="text-lg font-semibold text-blue-300">
                Məhsul Sayı
              </h3>
              <p className="text-4xl font-extrabold mt-2">
                {dashboardStats.productsCount}
              </p>
            </div>
            <div className="bg-gray-800 bg-opacity-70 shadow-lg rounded-lg p-6 text-center border border-yellow-700">
              <h3 className="text-lg font-semibold text-yellow-300">
                Gözləyən Sifarişlər
              </h3>
              <p className="text-4xl font-extrabold mt-2">
                {dashboardStats.pendingOrdersCount}
              </p>
            </div>
          </div>
        )}

        <div className="mb-8 flex justify-start space-x-4">
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setEditingProduct(null); // Hide edit form when showing add form
            }}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            {showAddForm ? "Yeni Məhsulu Gizlət" : "Yeni Məhsul Əlavə Et"}
          </button>
        </div>

        {showAddForm && (
          <div className="my-8 max-w-2xl mx-auto bg-gray-800 bg-opacity-80 p-6 rounded-lg shadow-xl border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-4">
              Yeni Məhsul Əlavə Et
            </h3>
            <AddProductForm onAddSuccess={handleAddSuccess} token={token} />
          </div>
        )}

        {editingProduct && (
          <div className="my-8 max-w-2xl mx-auto bg-gray-800 bg-opacity-80 p-6 rounded-lg shadow-xl border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-4">
              Məhsulu Redaktə Et
            </h3>
            <ProductEditForm
              product={editingProduct}
              onEditSuccess={handleEditSuccess}
              onCancel={handleCancelEdit}
              token={token}
            />
          </div>
        )}

        <h2 className="text-3xl font-bold mb-6 text-white mt-12">Məhsullar</h2>
        {loadingProducts ? (
          <div className="bg-gray-800 bg-opacity-70 shadow-lg rounded-lg p-6">
            <Skeleton active avatar paragraph={{ rows: 5 }} />
          </div>
        ) : errorProducts ? (
          <p className="text-red-400 bg-red-800 p-4 rounded-lg">
            {errorProducts}
          </p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-400 text-lg py-10 bg-gray-800 bg-opacity-70 rounded-lg shadow-lg">
            Heç bir məhsul tapılmadı. Yeni məhsul əlavə edin.
          </p>
        ) : (
          <div className="bg-gray-800 bg-opacity-70 shadow-lg rounded-lg p-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Şəkil
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Ad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Qiymət
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Kateqoriya
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Əməliyyatlar
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {products.map((p) => (
                  <tr key={p.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {p.imageUrl ? (
                        <img
                          src={`${API_BASE_URL_FOR_IMAGES}${p.imageUrl}`}
                          alt={p.name}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://placehold.co/64x64?text=No+Image";
                          }}
                        />
                      ) : (
                        <img
                          src="https://placehold.co/64x64?text=No+Image"
                          alt="No Image"
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/product/${p.id}`}
                        className="text-blue-400 hover:text-blue-200"
                      >
                        {p.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      ₼{parseFloat(p.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {p.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEditClick(p)}
                        className="bg-blue-600 py-1 px-3 rounded hover:bg-blue-700 mr-2 transition duration-150 ease-in-out transform hover:scale-105"
                      >
                        Redaktə
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="bg-red-600 py-1 px-3 rounded hover:bg-red-700 transition duration-150 ease-in-out transform hover:scale-105"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <h2 className="text-3xl font-bold mb-6 text-white mt-12">
          Son Fəaliyyətlər
        </h2>
        {loadingActivities ? (
          <div className="bg-gray-800 bg-opacity-70 shadow-lg rounded-lg p-6">
            <Skeleton active paragraph={{ rows: 3 }} />
          </div>
        ) : errorActivities ? (
          <p className="text-red-400 bg-red-800 p-4 rounded-lg">
            {errorActivities}
          </p>
        ) : recentActivities.length === 0 ? (
          <p className="text-center text-gray-400 text-lg py-10 bg-gray-800 bg-opacity-70 rounded-lg shadow-lg">
            Heç bir fəaliyyət tapılmadı.
          </p>
        ) : (
          <ul className="bg-gray-800 bg-opacity-70 shadow-lg rounded-lg p-6 space-y-3">
            {recentActivities.map((activity, index) => (
              <li
                key={index}
                className="text-gray-200 border-b border-gray-700 pb-2 last:border-b-0"
              >
                {activity.type}: {activity.description} ({activity.date})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Admin;
