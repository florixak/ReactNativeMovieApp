import Button from "@/components/Button";
import VerifyAccountModal from "@/components/VerifyAccountModal";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useAuth } from "@/contexts/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AuthScreen from "../../components/AuthScreen";

const Profile = () => {
  const { user, logout, isLoading, verify } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);

  if (!user) {
    return <AuthScreen />;
  }

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 0, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
        <View className="px-6 pt-14 pb-8 flex-row items-center justify-between">
          <Text className="text-white text-3xl font-extrabold tracking-wide">
            Profile
          </Text>
        </View>

        <View className="mx-6 mb-6 bg-dark-100 rounded-2xl p-6 shadow-lg">
          <View className="flex-row items-center mb-4">
            <View className="w-20 h-20 bg-accent rounded-full items-center justify-center mr-5 shadow-md">
              <Text className="text-white text-3xl font-extrabold">
                {user.username?.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-white text-xl font-bold">
                {user.username}
              </Text>
              <Text className="text-gray-400 text-base">{user.email}</Text>
              <View className="flex-row items-center mt-2 gap-1">
                <Text className="text-gray-400 text-sm">
                  {user.verified ? "Verified" : "Not Verified"}
                </Text>
                {user.verified ? (
                  <MaterialIcons
                    name="check-circle"
                    size={18}
                    color="#22c55e"
                  />
                ) : (
                  <MaterialIcons name="cancel" size={18} color="#ef4444" />
                )}
              </View>
            </View>
            <TouchableOpacity
              className="bg-dark-200 px-4 py-2 rounded-md"
              onPress={() =>
                Alert.alert("Edit Profile", "Feature coming soon!")
              }
            >
              <Text className="text-white text-sm">Edit</Text>
            </TouchableOpacity>
          </View>

          <VerifyAccountModal
            isVisible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            onVerify={async (code) => {
              setIsModalVisible(false);
              await verify({ email: user.email, verificationCode: code });
            }}
          />

          {!user.verified ? (
            <View className="mt-6 flex-col items-center gap-2">
              <Text className="text-light-100 text-sm mb-2 text-center">
                Verify your account to access all features.
              </Text>
              <Button
                title="Verify Account"
                onPress={() => setIsModalVisible(true)}
                className="w-full"
              />
            </View>
          ) : (
            <View className="mt-6">
              <Button
                title="Change Password"
                onPress={() =>
                  Alert.alert("Change Password", "Feature coming soon!")
                }
                className="w-full"
              />
            </View>
          )}

          <View className="mt-8">
            <TouchableOpacity
              onPress={handleLogout}
              disabled={isLoading}
              className="bg-red-600 p-4 rounded-lg flex-row items-center justify-center"
              style={{ opacity: isLoading ? 0.7 : 1 }}
            >
              <MaterialIcons
                name="logout"
                size={22}
                color="white"
                style={{ marginRight: 8 }}
              />
              <Text className="text-white text-base font-semibold">
                {isLoading ? "Logging out..." : "Logout"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;
