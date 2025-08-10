import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import useFetch from "@/hooks/useFetch";
import { fetchPopularMovies } from "@/services/api";
import { updateSearchCount } from "@/services/appwrite";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
    refetch: refetchMovies,
    reset: resetMovies,
  } = useFetch<Movie[]>(
    () => fetchPopularMovies({ query: searchQuery }),
    false
  );

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        await refetchMovies();
      } else {
        resetMovies();
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    if (movies && movies.length > 0 && movies[0])
      updateSearchCount(searchQuery, movies[0]);
  }, [movies]);

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
      />
      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        className="px-5"
        columnWrapperStyle={{
          justifyContent: "center",
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20 items-center">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>
            <View className="my-5">
              <SearchBar
                placeholder="Search for movies..."
                value={searchQuery}
                onChangeText={(text: string) => setSearchQuery(text)}
              />
            </View>
            {moviesLoading && (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="my-3"
              />
            )}
            {moviesError && (
              <Text className="text-red-500 px-5 my-3">
                Error: {moviesError.message}
              </Text>
            )}
            {!moviesLoading &&
              !moviesError &&
              searchQuery.trim() &&
              (movies?.length ?? 0) > 0 && (
                <Text className="text-xl text-white font-bold">
                  Search results for{" "}
                  <Text className="text-accent">{searchQuery}</Text>
                </Text>
              )}
          </>
        }
        ListEmptyComponent={
          !moviesLoading && !moviesError ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-500">
                {searchQuery.trim()
                  ? `No movies found for "${searchQuery}"`
                  : "Please search a movie"}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default Search;
