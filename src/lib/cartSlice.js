import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const addToCart = createAsyncThunk('cart/addToCart', async (productId, thunkAPI) => {
    const { rejectedWithValue } = thunkAPI;
    const token = localStorage.getItem('userToken');
    if (!token)
        return rejectedWithValue('No authentication token found');
    try {
        const { data } = await axios.post(`https://ecommerce.routemisr.com/api/v1/cart`, { productId },
            {
                headers: {
                    'token': token
                }
            }
        )
        return data
    } catch (error) {
        return rejectedWithValue(error.message);
    }
})

export const getUserCart = createAsyncThunk('cart/getUserCart', async (_, thunkAPI) => {
    const { rejectedWithValue } = thunkAPI;
    const token = localStorage.getItem('userToken');
    if (!token)
        return rejectedWithValue('No authentication token found');
    try {
        const { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/cart`,
            {
                headers: {
                    'token': token
                }
            }
        )
        return data
    } catch (error) {
        return rejectedWithValue(error.message);
    }
})

export const updateCartItemQuantity = createAsyncThunk('cart/updateCartItemQuantity', async ({ productId, count }, thunkAPI) => {
    const { rejectedWithValue } = thunkAPI
    const token = localStorage.getItem('userToken');
    if (!token)
        return rejectedWithValue('No authentication token found');
    try {
        const { data } = await axios.put(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`, { count },
            {
                headers: {
                    'token': token
                }
            }
        )
        return data
    } catch (error) {
        return rejectedWithValue(error.message);
    }
})

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (productId, thunkAPI) => {
    const { rejectedWithValue } = thunkAPI;
    const token = localStorage.getItem('userToken');
    if (!token)
        return rejectedWithValue('No authentication token found');
    try {
        const { data } = await axios.delete(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`,
            {
                headers: {
                    'token': token
                }
            }
        )
        return data
    } catch (error) {
        return rejectedWithValue(error.message);
    }
})

export const clearCart = createAsyncThunk('cart/clearCart', async (_, thunkAPI) => {
    const { rejectedWithValue } = thunkAPI;
    const token = localStorage.getItem('userToken');
    if (!token)
        return rejectedWithValue('No authentication token found');
    try {
        const { data } = await axios.delete(`https://ecommerce.routemisr.com/api/v1/cart`,
            {
                headers: {
                    'token': token
                }
            }
        )
        return data
    } catch (error) {
        return rejectedWithValue(error.message);
    }
})

export const strip = createAsyncThunk('cart/strip', async ({ selectedAddress, cartId }, thunkAPI) => {
    const { rejectedWithValue } = thunkAPI
    const token = localStorage.getItem('userToken');
    if (!token) {
        return rejectedWithValue('No authentication token found')
    }
    try {
        const { data } = await axios.post(`https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=http://localhost:5173/`,
            {
                shippingAddress: {
                    details: selectedAddress.details,
                    phone: selectedAddress.phone,
                    city: selectedAddress.city
                }
            },
            {
                headers: {
                    token
                }
            }
        )

        if (data.status === 'success') {
            window.location.href = data.session.url;
        }
        return data;

    } catch (error) {
        return rejectedWithValue(error.message);
    }

})

export const prdouctsUser = createAsyncThunk('cart/prdouctsUser', async (_, thunkAPI) => {
    const { rejectedWithValue } = thunkAPI // Fix this line
    const token = localStorage.getItem('userToken');
    if (!token) {
        return rejectedWithValue('No authentication token found') // Fix this line
    }
    const decoded = jwtDecode(token)
    console.log(decoded.id);

    try {
        const { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/orders/user/${decoded.id}`) // Add .id
        console.log(data);
        return data
    } catch (error) {
        return rejectedWithValue(error.message); // Fix this line
    }
})

export const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        productsCart: [],
        userProducts: [],
        numOfCartItems: 0,
        count: 0,
        totalCartPrice: 0,
        isLoading: false,
        error: null
    },
    extraReducers: (builder) => {
        builder
            .addCase(addToCart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            }).addCase(addToCart.fulfilled, (state, action) => {
                state.productsCart = action.payload;
                state.isLoading = false;
                state.error = null;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(getUserCart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            }).addCase(getUserCart.fulfilled, (state, action) => {
                state.productsCart = action.payload;
                state.numOfCartItems = action.payload.numOfCartItems || 0;
                state.totalCartPrice = action.payload.data.totalCartPrice || 0;
                state.isLoading = false;
                state.error = null;
            }).addCase(getUserCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(updateCartItemQuantity.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            }).addCase(updateCartItemQuantity.fulfilled, (state, action) => {
                const cartData = action.payload.data || action.payload;
                state.productsCart = action.payload;
                state.numOfCartItems = action.payload.numOfCartItems || 0;
                state.totalCartPrice = cartData.totalCartPrice || 0;
                state.isLoading = false;
                state.error = null;
            })
            .addCase(updateCartItemQuantity.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(removeFromCart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            }).addCase(removeFromCart.fulfilled, (state, action) => {
                const cartData = action.payload.data || action.payload;
                state.productsCart = action.payload;
                state.numOfCartItems = cartData.numOfCartItems || 0;
                state.totalCartPrice = cartData.totalCartPrice || 0;
                state.isLoading = false;
                state.error = null;
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(clearCart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(clearCart.fulfilled, (state) => {
                state.productsCart = [];
                state.numOfCartItems = 0;
                state.totalCartPrice = 0;
                state.isLoading = false;
                state.error = null;
            })
            .addCase(clearCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(strip.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(strip.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(strip.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(prdouctsUser.pending, (state) => {
                state.isLoading = true;
                state.error = false;
            })
            .addCase(prdouctsUser.fulfilled, (state, action) => {
                 state.userProducts = action.payload.data || action.payload;
                state.isLoading = false;
                state.error = false;
            })
            .addCase(prdouctsUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
    }
})

export const cartReducer = cartSlice.reducer;

export const selectCartProducts = state => state.cart.productsCart;
export const selectCartLoading = state => state.cart.isLoading;
export const selectCartError = state => state.cart.error;
export const selectNumOfCartItems = state => state.cart.numOfCartItems;
export const selectTotalCartPrice = state => state.cart.totalCartPrice;
export const selectUserProducts = state => state.cart.userProducts