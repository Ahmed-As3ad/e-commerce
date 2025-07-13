import { CounterSliceReducer } from "./counterSlice";
import { configureStore } from "@reduxjs/toolkit";
import { productsReducer } from "./productsSlice";
import { authReducer } from "./authSlice";
import { cartReducer } from "./cartSlice";
import { userAddressReducer } from "./userAddressSlice.js";


export let store = configureStore({
    reducer: {
        counter: CounterSliceReducer,
        products: productsReducer,
        auth: authReducer,
        cart: cartReducer,
        userAddress: userAddressReducer
    }
})