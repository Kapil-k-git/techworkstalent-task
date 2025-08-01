
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import apiUrls from "../services/urls/apiurl";
interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
  message:string|null;
}

const initialState: AuthState = {
  token: null,
  loading: false,
  error: null,
  message:null
};


export const signIn = createAsyncThunk(
  "auth/signIn",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrls.signIn}`, {
        email: credentials.email,
        password: credentials.password,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Sign-in failed. Please try again.");
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.message=action.payload.message
        state.token = action.payload.token ;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default authSlice.reducer;
