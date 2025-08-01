const getBaseURL = () => {
  if (process.env.NODE_ENV === 'production') {
    return '/api';
  } else {
    return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080/api';
  }
};

const BASE_URL = getBaseURL();

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