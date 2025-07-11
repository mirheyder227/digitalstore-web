 import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login } from "../../api/auth";  

 export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await login(credentials);
      const { token, user } = response; // Backend cavabı token və user obyektini qaytarmalıdır.

      if (!token) throw new Error("Token serverdən gəlmədi.");

      // localStorage-də saxlamaq
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return { token, user };
    } catch (error) {
      // Axios və ya fetch xətası üçün cavabı əldə et
      // Əgər backend səhv mesajını `error.response.data.message` ilə qaytarırsa
      return rejectWithValue(error || "Bilinməyən xəta"); // Pass the error directly for better handling
    }
  }
);

// Slice yaradılması
const initialState = {
  token: localStorage.getItem("token") || null,
  user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
  loading: false,
  error: null,
  // isAuthenticated dəyəri tokenin mövcudluğuna əsasən təyin edilməlidir.
  isAuthenticated: !!localStorage.getItem("token"), // token varsa true, yoxsa false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Logout əməliyyatı
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.loading = false;
      state.error = null;
      state.isAuthenticated = false; // Çıxış zamanı isAuthenticated false olmalıdır
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      // loginUser pending (yüklənir)
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null; // Yeni cəhddən əvvəl əvvəlki xətanı təmizlə
      })
      // loginUser fulfilled (uğurlu)
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true; // Uğurlu daxil olma zamanı true olmalıdır
        state.error = null;
      })
      // loginUser rejected (xəta)
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Daxil olma uğursuz oldu"; // action.payload olaraq gələn xəta mesajını istifadə et
        state.isAuthenticated = false; // Xəta zamanı false olmalıdır
        state.token = null;
        state.user = null;
      });
  },
});

export const { logout } = authSlice.actions; // logout action-ı export edilir
export default authSlice.reducer; // reducer export edilir