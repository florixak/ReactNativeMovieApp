const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: process.env.EXPO_PUBLIC_MOVIE_KEY,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_KEY}`,
  },
};

/*const url = 'https://api.themoviedb.org/3/authentication';*/

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
    const response = await fetch(
      "http://192.168.0.46:8080/api/trending-movies",
      {
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
      }
    );

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
    const response = await fetch(
      "http://192.168.0.46:8080/api/trending-movies/top10",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response);

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
