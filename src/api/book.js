
// api/book.js
import { instance } from "./index";

export const searchBooks = async (query) => {
  try {
    const response = await instance.get(
      `/books/search?q=${encodeURIComponent(query)}`
    );

    if (!response.data) {
      throw new Error("Serverdən axtarış nəticəsi alınmadı.");
    }
    return response.data;
  } catch (error) {
    if (error.response) {
      throw (
        error.response.data?.message ||
        `Server xətası: ${error.response.status}`
      );
    } else if (error.request) {
      throw new Error("Serverə qoşulmaq mümkün olmadı. Şəbəkə xətası.");
    } else {
      throw new Error(error.message);
    }
  }
};