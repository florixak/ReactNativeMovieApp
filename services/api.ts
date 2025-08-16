import { REFRESH_TOKEN_KEY, TOKEN_KEY } from "@/constants/storage";
import {
  LoginData,
  RegisterData,
  VerificationData,
} from "@/schemas/authSchemas";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

    let data: LoginResponse;
    try {
      data = await response.json();
    } catch {
      throw new Error(
        `Server error: ${response.status} ${response.statusText}`
      );
    }

    if (!response.ok) {
      throw new Error(
        data.message || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    if (!data.success) {
      throw new Error(data.message || "Login failed");
    }

    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const registerUser = async (
  userData: Omit<RegisterData, "confirmPassword">
): Promise<RegisterResponse> => {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userData.username,
        email: userData.email,
        password: userData.password,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to register.");
    }

    const data: RegisterResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error registering:", error);
    throw error;
  }
};

export const refreshUserToken = async (
  refreshToken: string
): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token.");
    }

    const data: LoginResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};

export const verifyUser = async (
  verificationData: VerificationData
): Promise<VerificationCodeResponse> => {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(verificationData),
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

export const fetchSavedMovies = async (
  token: string | null,
  query: string
): Promise<SavedMovieListResponse> => {
  const url = query
    ? `${BACKEND_URL}/saved-movies/search?query=${query}`
    : `${BACKEND_URL}/saved-movies`;
  try {
    if (!token) {
      throw new Error("No authentication token provided.");
    }
    const response = await fetchWithAuth(url, {
      method: "GET",
    });
    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error(
        `Server error: ${response.status} ${response.statusText}`
      );
    }

    return data;
  } catch (error) {
    console.error("Error fetching saved movies:", error);
    throw error;
  }
};

export const saveMovie = async (
  movie: SavedMovie,
  token: string | null
): Promise<void> => {
  try {
    if (!token) {
      throw new Error("No authentication token provided.");
    }

    const response = await fetchWithAuth(`${BACKEND_URL}/saved-movies`, {
      method: "POST",
      body: JSON.stringify({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        original_language: movie.original_language,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save movie.");
    }
  } catch (error) {
    console.error("Error saving movie:", error);
    throw error;
  }
};

export const unsaveMovie = async (
  id: string,
  token: string | null
): Promise<void> => {
  try {
    if (!token) {
      throw new Error("No authentication token provided.");
    }

    const response = await fetchWithAuth(`${BACKEND_URL}/saved-movies/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to unsave movie.");
    }
  } catch (error) {
    console.error("Error unsaving movie:", error);
    throw error;
  }
};

export const fetchSavedMovieById = async (
  id: string,
  token: string | null
): Promise<SavedMovieResponse> => {
  try {
    if (!token) {
      throw new Error("No authentication token provided.");
    }

    const response = await fetchWithAuth(`${BACKEND_URL}/saved-movies/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch saved movie.");
    }

    const data: SavedMovieResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching saved movie:", error);
    throw error;
  }
};

export const fetchWithAuth = async (
  input: RequestInfo,
  init: RequestInit,
  tryRefresh: boolean = true
): Promise<Response> => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);

    const headers = {
      ...(init.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    let response = await fetch(input, { ...init, headers });
    if (response.status === 401 && tryRefresh && refreshToken) {
      const refreshResult = await refreshUserToken(refreshToken);

      if (refreshResult.success && refreshResult.token) {
        await AsyncStorage.setItem(TOKEN_KEY, refreshResult.token);
        const retryHeaders = {
          ...headers,
          Authorization: `Bearer ${refreshResult.token}`,
        };
        response = await fetch(input, { ...init, headers: retryHeaders });
      } else {
        throw new Error("Token refresh failed.");
      }
    }

    return response;
  } catch (error) {
    console.error("Error fetching with auth:", error);
    throw error;
  }
};
