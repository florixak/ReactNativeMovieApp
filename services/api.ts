import { LoginData, RegisterData } from "@/schemas/authSchemas";

const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: process.env.EXPO_PUBLIC_MOVIE_KEY,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_KEY}`,
  },
};

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export const fetchPopularMovies = async ({
  query,
}: {
  query: string;
}): Promise<Movie[]> => {
  try {
    const endpoint = query
      ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${decodeURIComponent(
          query
        )}`
      : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;

    const response = await fetch(endpoint, {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch movies.");
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch movies.");
  }
};

export const fetchMovieDetails = async (id: string): Promise<MovieDetails> => {
  try {
    const endpoint = `${TMDB_CONFIG.BASE_URL}/movie/${id}?api_key=${TMDB_CONFIG.API_KEY}`;

    const response = await fetch(endpoint, {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch movie details.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch movie details.");
  }
};

export const updateSearchCount = async (
  query: string,
  movie: Movie | null
): Promise<void> => {
  try {
    const response = await fetch(`${BACKEND_URL}/trending-movies`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        searchTerm: query,
        movieId: movie?.id,
        title: movie?.title,
        posterUrl: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update search count.");
    }
  } catch (error) {
    console.error("Error updating search count:", error);
    throw error;
  }
};

export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const response = await fetch(`${BACKEND_URL}/trending-movies/top10`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch trending movies.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    throw error;
  }
};

export const loginUser = async (
  loginData: LoginData
): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usernameOrEmail: loginData.usernameOrEmail,
        password: loginData.password,
      }),
    });

    console.log("Login response:", response);

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data: LoginResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const registerUser = async (
  userData: RegisterData
): Promise<RegisterData> => {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Failed to register.");
    }

    const data: RegisterData = await response.json();
    return data;
  } catch (error) {
    console.error("Error registering:", error);
    throw error;
  }
};

export const verifyUser = async (
  verificationCode: string
): Promise<VerificationCodeResponse> => {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ verificationCode }),
    });

    if (!response.ok) {
      throw new Error("Failed to verify.");
    }

    const data: VerificationCodeResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error verifying:", error);
    throw error;
  }
};
