import MovieCard from "@/components/MovieCard";
import { useAuth } from "@/contexts/AuthContext";
import { fetchSavedMovies } from "@/services/api";
import { MaterialIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";

const Saved = () => {
  const { token } = useAuth();

  const {
    data: savedMovies,
    isLoading,
    error,
    refetch,
  } = useQuery<SavedMovie[]>({
    queryKey: ["savedMovies"],
    queryFn: async () => await fetchSavedMovies(token),
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <View className="flex-1 bg-primary items-center justify-center">
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-primary px-10 items-center justify-center">
        <Text className="text-white text-lg">Error fetching saved movies</Text>
      </View>
    );
  }

  if (savedMovies && savedMovies.length === 0 && !isLoading) {
    return (
      <View className="flex-1 bg-primary px-10">
        <View className="flex items-center justify-center flex-1 flex-col gap-5">
          <MaterialIcons name="bookmark-border" size={64} color="#666" />
          <Text className="text-gray-500 text-lg font-medium">
            No saved movies yet
          </Text>
          <Text className="text-gray-600 text-center">
            Start exploring movies and add them to your watchlist
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary">
      <View className="px-6 pt-12 pb-4">
        <Text className="text-white text-2xl font-bold">Saved Movies</Text>
        <Text className="text-gray-400 text-sm mt-1">
          {savedMovies?.length} movie{savedMovies?.length !== 1 ? "s" : ""}{" "}
          saved
        </Text>
      </View>

      <FlatList
        data={savedMovies}
        renderItem={({ item }) => <MovieCard movie={item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 20,
          paddingRight: 5,
          marginBottom: 10,
        }}
        className="mt-2 pb-32"
        scrollEnabled={false}
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingBottom: 20,
        }}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      />
    </View>
  );
};

export default Saved;
