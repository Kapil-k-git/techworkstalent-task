import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import apiUrls from "../services/urls/apiurl";
interface IMovie {
  _id: string;
  title: string;
  year: string;
  poster: string;
}
interface ICreateMovie{
  title: string;
  year: string;
  poster: File|null;
}

interface MovieState {
  movies: IMovie[];
  loading: boolean;
  error: string | null;
  totalPages:number
}

const initialState: MovieState = {
  movies: [],
  totalPages:0,
  loading: false,
  error: null,
};

const token = localStorage.getItem("token") || sessionStorage.getItem("token");

export const fetchMovies = createAsyncThunk(
  "movies/fetchMovies",
  async ({ page, perPage }: { page: number; perPage: number }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrls.fetchMovies}`, {
        params: {
          page,
          perPage,
        },
      });
      console.log("response", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


export const fetchMovieById = createAsyncThunk(
  "movies/fetchMovieById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(apiUrls.fetchMovieById(id));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);



export const createMovie = createAsyncThunk(
  "movies/createMovie",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrls.createMovie}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


export const updateMovie = createAsyncThunk(
  "movies/updateMovie",
  async ({ id, formData }: any, { rejectWithValue }) => { 
    try {
      console.log(formData, "formData in thunk");
      const response = await axios.put(apiUrls.updateMovie(id), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response,"response")
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


export const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload.movies;
        state.totalPages=action.payload.totalPages
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMovieById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovieById.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload.movie;
      })
      .addCase(fetchMovieById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMovie.fulfilled, (state, action) => {
        state.loading = false;
        state.movies.push(action.payload);
      })
      .addCase(createMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMovie.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default movieSlice.reducer;
