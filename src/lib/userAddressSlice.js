import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const addAddress = createAsyncThunk('userAddress/addAddress', async (addressData, thunkAPI) => {
    const { rejectedWithValue } = thunkAPI;
    
    try {
        const token = localStorage.getItem('userToken');
        
        if (!token) {
            toast.error('You must login first');
            return rejectedWithValue('No token found');
        }

        const { data } = await axios.post(`https://ecommerce.routemisr.com/api/v1/addresses`, addressData, {
            headers: { token }
        });
        
        toast.success('Address added successfully');
        return data.data;
        
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to add address';
        toast.error(errorMessage);
        return rejectedWithValue(errorMessage);
    }
});

const getAddress = createAsyncThunk('userAddress/getAddress', async (_, thunkAPI) => {
    const { rejectedWithValue } = thunkAPI;
    
    try {
        const token = localStorage.getItem('userToken');
        
        if (!token) {
            return rejectedWithValue('No token found');
        }

        const { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/addresses`, {
            headers: { token }
        });
        
        return data.data;
        
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to get addresses';
        return rejectedWithValue(errorMessage);
    }
});

const deleteAddress = createAsyncThunk('userAddress/deleteAddress', async (addressId, thunkAPI) => {
    const { rejectedWithValue } = thunkAPI;
    
    try {
        const token = localStorage.getItem('userToken');
        
        if (!token) {
            toast.error('You must login first');
            return rejectedWithValue('No token found');
        }

        const { data } = await axios.delete(`https://ecommerce.routemisr.com/api/v1/addresses/${addressId}`, {
            headers: { token }
        });
        
        toast.success('Address deleted successfully');
        return addressId;
        
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to delete address';
        toast.error(errorMessage);
        return rejectedWithValue(errorMessage);
    }
});

const userAddressSlice = createSlice({
    name: 'userAddress',
    initialState: {
        addresses: [],
        isLoading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addAddress.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addAddress.fulfilled, (state, action) => {
                state.isLoading = false;
                state.addresses.push(action.payload);
                state.error = null;
            })
            .addCase(addAddress.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(getAddress.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getAddress.fulfilled, (state, action) => {
                state.isLoading = false;
                state.addresses = action.payload;
                state.error = null;
            })
            .addCase(getAddress.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(deleteAddress.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.isLoading = false;
                state.addresses = state.addresses.filter(addr => addr._id !== action.payload);
                state.error = null;
            })
            .addCase(deleteAddress.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export const selectAddressLoading = (state) => state.userAddress?.isLoading || false;
export const selectAddressError = (state) => state.userAddress?.error || null;
export const selectUserAddresses = (state) => state.userAddress?.addresses || [];

export const userAddressReducer = userAddressSlice.reducer;
export { addAddress, getAddress, deleteAddress };