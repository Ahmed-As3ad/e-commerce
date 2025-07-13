import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const token = localStorage.getItem('userToken');

export const getAllProducts = createAsyncThunk('products/getAllProducts', async () => {
    const { data } = await axios.get('https://ecommerce.routemisr.com/api/v1/products');
    return data.data
})

export const getProductDetails = createAsyncThunk('products/getProductDetails', async (id) => {
    const { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/products/${id}`);
    return data.data
})

export const getRelatedProducts = createAsyncThunk('products/getRelatedProducts', async (category) => {
    const { data } = await axios.get('https://ecommerce.routemisr.com/api/v1/products');
    const allProducts = data.data;
    const relatedProducts = allProducts.filter((prod) => prod.category.name === category);
    return relatedProducts.slice(0, 8);
}
);

export const addToWishList = createAsyncThunk('products/addToWishList', async (productId) => {
    const { data } = await axios.post(`https://ecommerce.routemisr.com/api/v1/wishlist`,
        { productId },
        {
            headers: {
                'token': token
            }
        }
    );
    return data.data
})

export const getUserWishList = createAsyncThunk('products/getUserWishList', async () => {
    const { data } = await axios.get('https://ecommerce.routemisr.com/api/v1/wishlist',
        {
            headers: {
                'token': token
            }
        }
    );
    console.log(data.data);
    
    return data.data;
})

export const deleteFromWishList = createAsyncThunk('products/deleteFromWishList', async (productId) => {
    await axios.delete(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
        {
            headers: {
                'token': token
            }
        }
    );
    return productId;
})

const productsSlice = createSlice({
    name: 'products',
    initialState: {
        products: [],
        wishList: [],
        isLoading: false,
        error: null,
        productDetails: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllProducts.fulfilled, (state, action) => {
                state.products = action.payload;
                state.isLoading = false;
                state.error = null;
            })
            .addCase(getAllProducts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getAllProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })

            .addCase(getProductDetails.fulfilled, (state, action) => {
                state.productDetails = action.payload;
                state.isLoading = false;
                state.error = null;
            })
            .addCase(getProductDetails.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getProductDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })

            .addCase(getRelatedProducts.fulfilled, (state, action) => {
                state.relatedProducts = action.payload;
                state.isLoading = false;
                state.error = null;
            })
            .addCase(getRelatedProducts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getRelatedProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(addToWishList.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(addToWishList.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addToWishList.rejected, (state, action) => {
                state.error = action.error.message;
            })
            .addCase(getUserWishList.fulfilled, (state, action) => {
                state.wishList = action.payload;
                state.isLoading = false;
                state.error = null;
            })
            .addCase(getUserWishList.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            }).addCase(getUserWishList.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(deleteFromWishList.fulfilled, (state, action) => {
                state.wishList = state.wishList.filter(prod => prod._id !== action.payload)
                state.isLoading = false;
                state.error = null;
            })
            .addCase(deleteFromWishList.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteFromWishList.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    }
})

export const productsReducer = productsSlice.reducer;
export const selectProducts = state => state.products.products;
export const selectProductDetails = state => state.products.productDetails;
export const selectProductsLoading = state => state.products.isLoading;
export const selectError = state => state.products.error;
export const selectRelatedProducts = state => state.products.relatedProducts;
export const selectWishList = state => state.products.wishList;