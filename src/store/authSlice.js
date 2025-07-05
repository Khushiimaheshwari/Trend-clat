import { createSlice } from "@reduxjs/toolkit";
import apiService from "../connection_services/service.js"; 

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false, 
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    setCredentials: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;

export const loginUser = (credentials) => async (dispatch) => {
  dispatch(loginStart());
  try {
    const user = await apiService.login(credentials);
    dispatch(loginSuccess({user, token: null })); 
  } catch (error) {
    dispatch(loginFailure(error.message || "Login failed"));
  }
};


export const logoutUser = () => async (dispatch) => {
  try {
    await apiService.logout();
    console.log("Logout Successful!");

    localStorage.removeItem("token");
    dispatch(logout());
  } catch (error) {
    console.error("Logout failed:", error);
    dispatch(logout()); 
  }
};

export const fetchCurrentUser = () => async (dispatch) => {
  try {
    const res = await fetch('http://localhost:5000/userData', {
      method: 'GET',
      credentials: 'include', 
    });

    if (!res.ok) throw new Error('Unauthorized');

    const data = await res.json();
    dispatch(setCredentials(data));
    console.log(data);
    return data;

  } catch (err) {
    dispatch(logout()); 
    throw err;
  }
};
