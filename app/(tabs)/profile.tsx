import { icons } from "@/constants/icons";
import { useAuth } from "@/contexts/AuthContext";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import AuthScreen from "../../components/AuthScreen";

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <View className="flex-1 bg-primary px-10">
      <View className="flex items-center justify-center flex-1 flex-col gap-5">
        <Image source={icons.person} className="size-10" tintColor="#Fff" />
        <Text className="text-gray-500 text-base">Profile</Text>
        <TouchableOpacity
          onPress={logout}
          className="bg-dark-200 p-2 rounded-md w-full h-12 flex items-center justify-center"
        >
          <Text className="text-white">Log out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;
