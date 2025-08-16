import Button from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import AuthScreen from "../../components/AuthScreen";

const Profile = () => {
  const { user, logout, isLoading } = useAuth();

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
    <ScrollView className="flex-1 bg-primary">
      <View className="px-6 pt-12 pb-6">
        <Text className="text-white text-2xl font-bold mb-2">Profile</Text>
      </View>

      <View className="mx-6 mb-6 bg-dark-100 rounded-lg p-6">
        <View className="flex-row items-center">
          <View className="w-16 h-16 bg-accent rounded-full items-center justify-center mr-4">
            <Text className="text-white text-xl font-bold">
              {user.username?.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-white text-lg font-semibold">
              {user.username}
            </Text>
            <Text className="text-gray-400 text-sm">{user.email}</Text>
            <View className="flex-row items-center mt-1 gap-1">
              <Text className="text-gray-400 text-sm">Verified</Text>
              <View>
                {user.verified ? (
                  <MaterialIcons name="check-circle" size={16} color="green" />
                ) : (
                  <MaterialIcons name="cancel" size={16} color="red" />
                )}
              </View>
            </View>
          </View>
          <TouchableOpacity
            className="bg-dark-200 px-4 py-2 rounded-md"
            onPress={() => Alert.alert("Edit Profile", "Feature coming soon!")}
          >
            <Text className="text-white text-sm">Edit</Text>
          </TouchableOpacity>
        </View>

        {user.verified ? (
          <View className="mt-6 flex-col items-center justify-between gap-2">
            <Text className="text-light-100 text-sm">
              You need to verify your account to access all features.
            </Text>
            <Button
              title="Verify Account"
              onPress={() =>
                Alert.alert("Verify Account", "Feature coming soon!")
              }
            />
          </View>
        ) : (
          <View className="mt-6">
            <Button
              title="Change Password"
              onPress={() =>
                Alert.alert("Change Password", "Feature coming soon!")
              }
            />
          </View>
        )}
        <View className="mt-6">
          <TouchableOpacity
            onPress={handleLogout}
            disabled={isLoading}
            className="bg-red-600 p-4 rounded-lg flex-row items-center justify-center"
          >
            <MaterialIcons
              name="logout"
              size={20}
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
  );
};

export default Profile;
