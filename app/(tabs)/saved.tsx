import MovieCard from "@/components/MovieCard";
import NotLoggedIn from "@/components/NotLoggedIn";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useAuth } from "@/contexts/AuthContext";
import { fetchSavedMovies } from "@/services/api";
import { MaterialIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

const Saved = () => {
  const { user, token } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [isDebouncing, setIsDebouncing] = useState(false);

  const { data, isLoading, error, refetch } = useQuery<SavedMovieListResponse>({
    queryKey: ["savedMovies", debouncedQuery],
    queryFn: async () => await fetchSavedMovies(token, debouncedQuery),
    enabled: !!user && !!token,
  });

  const savedMovies = data?.savedMovies || [];

  useEffect(() => {
    setIsDebouncing(true);
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setIsDebouncing(false);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  if (!user) {
    return <NotLoggedIn />;
  }

  if (error) {
    return (
      <View className="flex-1 bg-primary px-10 items-center justify-center">
        <Text className="text-white text-lg">Error fetching saved movies</Text>
      </View>
    );
  }

  const noMovies =
    savedMovies &&
    savedMovies.length === 0 &&
    !isLoading &&
    !isDebouncing &&
    searchQuery === "";

  if (noMovies) {
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
      <Image source={images.bg} className="absolute w-full z-0" />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      >
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
        <View className="px-6 pb-4">
          <Text className="text-white text-3xl font-extrabold tracking-wide">
            Saved Movies
          </Text>

          <Text className="text-gray-400 text-sm mt-1">
            {searchQuery === ""
              ? `${savedMovies?.length} movie${
                  savedMovies?.length !== 1 ? "s" : ""
                } saved`
              : `${savedMovies.length} found`}
          </Text>
        </View>
        <View className="px-5">
          <SearchBar
            placeholder="Search for your saved movie"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        {isLoading && <ActivityIndicator size="large" color="#fff" />}
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
          className="mt-5 pb-32"
          scrollEnabled={false}
          contentContainerStyle={{
            paddingHorizontal: 10,
            paddingBottom: 20,
          }}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
        />
      </ScrollView>
    </View>
  );
};

export default Saved;
