import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { IProduct } from "../components/general.types";

export interface IAuthState {
  product: IProduct[];
}

const initialState: IAuthState = {
  product: [],
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<IProduct>) => {
      state.product = [...state.product, action.payload];
    },
    editProduct: (state, action: PayloadAction<IProduct>) => {
      const indexProduct = state.product.findIndex((x) => x.id === action.payload.id)

      if (indexProduct !== -1) {
        state.product[indexProduct] = action.payload
      }
    },
    deleteProduct: (state, action: PayloadAction<IProduct>) => {
      const indexProduct = state.product.findIndex((x) => x.id === action.payload.id)

      if (indexProduct !== -1) {
        state.product.splice(indexProduct, 1)
      }
    },
  },
});

export const { addProduct, editProduct, deleteProduct } = productSlice.actions;
export const productReducer = productSlice.reducer;