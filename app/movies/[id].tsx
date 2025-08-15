import { icons } from "@/constants/icons";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchMovieDetails,
  fetchSavedMovieById,
  saveMovie,
  unsaveMovie,
} from "@/services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface MovieInfoProps {
  label: string;
  value: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => {
  return (
    <View className="flex-col items-start justify-center mt-5">
      <Text className="text-light-200 font-normal text-sm">{label}</Text>
      <Text className="text-light-100 font-bold text-sm mt-2">
        {value || "N/A"}
      </Text>
    </View>
  );
};

const MovieDetails = () => {
  const { user, token } = useAuth();
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const {
    data: movie,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => fetchMovieDetails(id as string),
  });

  const {
    data: savedMovie,
    isLoading: isLoadingSavedMovie,
    error: savedMovieError,
  } = useQuery<SavedMovieResponse>({
    queryKey: ["savedMovie", id, token],
    queryFn: () => fetchSavedMovieById(id as string, token),
    enabled: !!token && !!id,
  });
  const isMovieSaved = savedMovie?.savedMovie !== null;

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!isMovieSaved) {
        if (movie && token) {
          await saveMovie(
            {
              id: movie.id,
              title: movie.title,
              poster_path:
                movie.poster_path ||
                "https://placehold.co/600x400/1a1a1a/ffffff.png",
              overview: movie.overview || "",
              release_date: movie.release_date || "",
              original_language: movie.original_language || "",
              vote_average: movie.vote_average || 0,
            },
            token
          );
        }
      } else {
        if (savedMovie?.savedMovie) {
          await unsaveMovie(savedMovie?.savedMovie?.id?.toString(), token);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedMovies"] });
      queryClient.invalidateQueries({ queryKey: ["savedMovie", id, token] });
    },
  });

  const handleSaveMovie = () => {
    mutate();
  };

  return (
    <View className="flex-1 bg-primary">
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          className="mt-10 self-center"
        />
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
          <View>
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
              }}
              className="w-full h-[550px]"
              resizeMode="stretch"
            />
          </View>
          <View className="flex-col items-start justify-center mt-5 px-5">
            <Text className="text-white font-bold text-xl">{movie?.title}</Text>
            <View className="flex-row items-center gap-x-1 mt-2">
              <Text className="text-light-200 text-sm">
                {movie?.release_date?.split("-")[0]}
              </Text>
              <Text className="text-light-200 text-sm">{movie?.runtime}m</Text>
            </View>
            <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
              <Image source={icons.star} className="size-4" />
              <Text className="text-light-200 text-sm">
                {Math.round(movie?.vote_average ?? 0)}/10
              </Text>
              <Text className="text-light-200 text-sm">
                ({movie?.vote_count} votes)
              </Text>
            </View>
            <MovieInfo label="Overview" value={movie?.overview || "N/A"} />
            <MovieInfo
              label="Genres"
              value={
                movie?.genres?.map((genre) => genre.name).join(" • ") || "N/A"
              }
            />
            <View className="flex flex-row justify-between w-1/2">
              <MovieInfo
                label="Budget"
                value={
                  movie?.budget ? `$${movie?.budget / 1_000_000 || 0}M` : "N/A"
                }
              />
              <MovieInfo
                label="Revenue"
                value={
                  movie?.revenue
                    ? `$${movie?.revenue / 1_000_000 || 0}M`
                    : "N/A"
                }
              />
            </View>
            <MovieInfo
              label="Production Companies"
              value={
                movie?.production_companies
                  ?.map((company) => company.name)
                  .join(" • ") || "N/A"
              }
            />
          </View>
        </ScrollView>
      )}
      <View className="w-full absolute bottom-5 left-0 right-0 flex-row items-center justify-center gap-4 px-5 py-3">
        <TouchableOpacity
          onPress={router.back}
          className="flex-1 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
        >
          <Image
            source={icons.arrow}
            className="size-5 mr-1 mt-0.5 rotate-180"
            tintColor="#fff"
          />
          <Text className="text-white font-semibold text-base">Go Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSaveMovie}
          className="flex-1 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
          disabled={isPending}
        >
          <Image
            source={icons.save}
            className="size-5 mr-1 mt-0.5"
            tintColor="#fff"
          />
          <Text className="text-white font-semibold text-base">
            {isPending || isLoadingSavedMovie
              ? "Loading..."
              : error
              ? error.message
              : user
              ? isMovieSaved
                ? "Unsave Movie"
                : "Save Movie"
              : "Log in to save"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MovieDetails;
