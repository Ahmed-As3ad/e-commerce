import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

const getUserProfile = createAsyncThunk('auth/getUserProfile', async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    
    try {
        const token = localStorage.getItem('userToken');
        
        if (!token) {
            toast.error('You must login first');
            return rejectWithValue('No token found');
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
        
        if (!userId) {
            toast.error('Invalid token');
            return rejectWithValue('Invalid token');
        }

        const { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/users/${userId}`);
        console.log(data.data);
        
        return data.data;
        
    } catch (error) {
        toast.error(error);
        return rejectWithValue(error);
    }
});
const updatePassword = createAsyncThunk('auth/updatePassword', async (passwordData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    
    try {
        const token = localStorage.getItem('userToken');
        
        if (!token) {
            toast.error('You must login first');
            return rejectWithValue('No token found');
        }

        const { data } = await axios.put(`https://ecommerce.routemisr.com/api/v1/users/changeMyPassword`, passwordData, {
            headers: {
                token: token
            }
        });
        
        toast.success('Password updated successfully!');
        return data.data;
        
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to update password';
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isLogin: false,
        user: null,
        loading: false,
        error: null
    },
    reducers: {
        setLogin: (state) => {
            state.isLogin = true;
        },
        setLogout: (state) => {
            state.isLogin = false;
            state.user = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(getUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updatePassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePassword.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(updatePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const authReducer = authSlice.reducer;
export const { setLogin, setLogout } = authSlice.actions;
export const UserData = state => state.auth.user;
export { getUserProfile, updatePassword };