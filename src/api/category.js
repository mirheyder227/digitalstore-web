// frontend/src/api/category.js
import { instance } from "./index"; // Axios instance-ınızın olduğu fayl

export const getAllCategories = async () => {
  try {
    // BURADAN ?populate=* hissəsini sildik
    const response = await instance.get("/categories"); // <-- DƏYİŞİKLİK BURADADIR
    if (!response.data) {
      throw new Error("Serverdən kateqoriya məlumatları alınmadı.");
    }
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data?.message || `Server xətası: ${error.response.status}`;
    } else if (error.request) {
      throw new Error("Kateqoriyalar üçün serverə qoşulmaq mümkün olmadı. Şəbəkə xətası.");
    } else {
      throw new Error(error.message);
    }
  }
};