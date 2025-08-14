import AuthTabs from "@/components/AuthTabs";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import { icons } from "@/constants/icons";
import { useState } from "react";
import { Image, Text, View } from "react-native";

const AuthScreen = () => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  return (
    <View className="flex-1 bg-primary justify-center items-center px-5 pb-32">
      <Image source={icons.logo} className="w-16 h-14 mb-8" />
      <Text className="text-white text-2xl font-semibold mb-2">
        {activeTab === "login" ? "Welcome Back" : "Create Account"}
      </Text>
      <Text className="text-gray-300 text-center mb-10">
        {activeTab === "login"
          ? "Sign in to continue to MovieApp"
          : "Join MovieApp to discover amazing movies"}
      </Text>

      <View className="w-full max-w-sm">
        <AuthTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "login" ? <LoginForm /> : <RegisterForm />}
      </View>
    </View>
  );
};

export default AuthScreen;
