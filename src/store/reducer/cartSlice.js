import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [], // This is the state property holding your cart items
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // Check if the item already exists in the cart
      const existingItem = state.cartItems.find(item => item.id === action.payload.id);
      if (existingItem) {
        // If it exists, increment its quantity
        existingItem.quantity += 1;
      } else {
        // If not, add the new item with quantity 1
        state.cartItems.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload
      );
    },
    clearCart: (state) => {
      state.cartItems = [];
    },
    // Optional: Add a reducer to update quantity if needed
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.cartItems.find(item => item.id === id);
      if (existingItem) {
        existingItem.quantity = quantity;
        // Remove item if quantity drops to 0 or less
        if (existingItem.quantity <= 0) {
          state.cartItems = state.cartItems.filter(item => item.id !== id);
        }
      }
    },
  },
});

export const { addToCart, removeFromCart, clearCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;
