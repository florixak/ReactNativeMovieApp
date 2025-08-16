import { images } from "@/constants/images";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

const NotLoggedIn = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-primary items-center justify-center px-8">
      <Image
        source={images.bg}
        className="absolute w-full h-full"
        resizeMode="cover"
        style={{ opacity: 0.15 }}
      />
      <View className="items-center">
        <MaterialIcons name="lock" size={64} color="#AB8BFF" className="mb-6" />
        <Text className="text-white text-2xl font-bold mb-2 text-center">
          Sign in to save movies
        </Text>
        <Text className="text-gray-400 text-base mb-8 text-center">
          Log in or create an account to build your watchlist and access your
          saved movies anywhere.
        </Text>
        <TouchableOpacity
          className="bg-accent px-8 py-3 rounded-lg mb-4"
          onPress={() => router.push("/profile")}
        >
          <Text className="text-white text-base font-semibold">Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NotLoggedIn;
