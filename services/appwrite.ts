export const updateSearchCount = async (
  query: string,
  movie: Movie | null
): Promise<void> => {
  try {
  } catch (error) {
    console.error("Error updating search count:", error);
    throw error;
  }
};

export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    return [];
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    throw error;
  }
};
