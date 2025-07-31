const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const apiUrls = {
  signIn: `${BASE_URL}/signin`,
  signUp: `${BASE_URL}/signup`, 
  fetchMovies: `${BASE_URL}/movies`,
  fetchMovieById: (id: string) => `${BASE_URL}/movies/${id}`,
  createMovie: `${BASE_URL}/movies`,
  updateMovie: (id: string) => `${BASE_URL}/movies/${id}`,
  deleteMovie: (id: string) => `${BASE_URL}/movies/${id}`,
};

export default apiUrls;
