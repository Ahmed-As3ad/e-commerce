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
        const { data } = await axios.post(`https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=https://markit-gules.vercel.app`,
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

export const productsUser = createAsyncThunk('cart/productsUser', async (_, thunkAPI) => {
    const { rejectedWithValue } = thunkAPI 
    const token = localStorage.getItem('userToken');
    if (!token) {
        return rejectedWithValue('No authentication token found') 
    }
    const decoded = jwtDecode(token)

    try {
        const { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/orders/user/${decoded.id}`)
        return data
    } catch (error) {
        return rejectedWithValue(error.message); 
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
                state.numOfCartItems = action.payload.numOfCartItems || 0;
                state.totalCartPrice = action.payload.data?.totalCartPrice || 0;
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
                state.totalCartPrice = action.payload.data?.totalCartPrice || 0;
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
                state.productsCart = action.payload;
                state.numOfCartItems = action.payload.numOfCartItems || 0;
                state.totalCartPrice = action.payload.data?.totalCartPrice || 0;
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
                state.productsCart = action.payload;
                state.numOfCartItems = action.payload.numOfCartItems || 0;
                state.totalCartPrice = action.payload.data?.totalCartPrice || 0;
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
            .addCase(productsUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(productsUser.fulfilled, (state, action) => {
                state.userProducts = action.payload.data || action.payload;
                state.isLoading = false;
                state.error = null;
            })
            .addCase(productsUser.rejected, (state, action) => {
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