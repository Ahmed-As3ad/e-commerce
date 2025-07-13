import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";


const getUserProfile = createAsyncThunk('auth/getUserProfile', async (_, thunkAPI) => {
    const { rejectedWithValue } = thunkAPI;
    
    try {
        const token = localStorage.getItem('userToken');
        
        if (!token) {
            toast.error('You must login first');
            return rejectedWithValue('No token found');
        }

        // فحص انتهاء صلاحية الـ token
        if (isTokenExpired(token)) {
            toast.error('Session expired, please login again');
            localStorage.removeItem('userToken');
            return rejectedWithValue('Token expired');
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
        
        if (!userId) {
            toast.error('Invalid token');
            return rejectedWithValue('Invalid token');
        }

        const { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/users/${userId}`);
        
        return data.data;
        
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to get user profile';
        toast.error(errorMessage);
        return rejectedWithValue(errorMessage);
    }
});
const updatePassword = createAsyncThunk('auth/updatePassword', async (passwordData, thunkAPI) => {
    const { rejectedWithValue } = thunkAPI;
    
    try {
        const token = localStorage.getItem('userToken');
        
        if (!token) {
            toast.error('You must login first');
            return rejectedWithValue('No token found');
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
        return rejectedWithValue(errorMessage);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isLogin: false,
        user: null,
        isLoading: false,
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
            // إزالة الـ token من localStorage عند تسجيل الخروج
            localStorage.removeItem('userToken');
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(getUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(updatePassword.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updatePassword.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(updatePassword.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export const authReducer = authSlice.reducer;
export const { setLogin, setLogout } = authSlice.actions;

// Selectors
export const UserData = state => state.auth.user;
export const selectAuthLoading = state => state.auth.isLoading;
export const selectAuthError = state => state.auth.error;
export const selectIsLogin = state => state.auth.isLogin;

export { getUserProfile, updatePassword };