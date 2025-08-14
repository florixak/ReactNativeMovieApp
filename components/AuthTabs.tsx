import { Text, TouchableOpacity, View } from "react-native";

interface AuthTabsProps {
  activeTab: "login" | "register";
  onTabChange: (tab: "login" | "register") => void;
}

const AuthTabs = ({ activeTab, onTabChange }: AuthTabsProps) => {
  return (
    <View className="flex-row bg-dark-100 rounded-lg p-1 mb-6">
      <TouchableOpacity
        className={`flex-1 py-3 rounded-md ${
          activeTab === "login" ? "bg-accent" : "bg-transparent"
        }`}
        onPress={() => onTabChange("login")}
      >
        <Text
          className={`text-center font-medium ${
            activeTab === "login" ? "text-white" : "text-gray-400"
          }`}
        >
          Login
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className={`flex-1 py-3 rounded-md ${
          activeTab === "register" ? "bg-accent" : "bg-transparent"
        }`}
        onPress={() => onTabChange("register")}
      >
        <Text
          className={`text-center font-medium ${
            activeTab === "register" ? "text-white" : "text-gray-400"
          }`}
        >
          Register
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthTabs;
