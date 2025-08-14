import Button from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";
import { loginSchema } from "@/schemas/authSchemas";
import { useState } from "react";
import { Alert, Text, TextInput, View } from "react-native";
import { z } from "zod";

const LoginScreen = () => {
  const { login, isLoading } = useAuth();

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLogin = async () => {
    setErrors({});

    try {
      const validData = loginSchema.parse({
        usernameOrEmail,
        password,
      });

      await login(validData);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        (error.issues as z.ZodIssue[]).forEach((err: z.ZodIssue) => {
          fieldErrors[err.path[0] as string] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        Alert.alert("Login Failed", "Invalid username/email or password");
      }
    }
  };

  return (
    <View className="bg-primary flex-1 justify-center items-center">
      <Text className="text-white text-2xl font-semibold mb-10">Login</Text>
      <View className="bg-dark-100 p-5 rounded-lg shadow-lg items-center justify-center w-[20rem]">
        <View className="mb-4 w-full">
          <TextInput
            placeholder="Username or Email"
            value={usernameOrEmail}
            onChangeText={(text) => {
              setUsernameOrEmail(text);
              if (errors.usernameOrEmail) {
                setErrors((prev) => ({ ...prev, usernameOrEmail: "" }));
              }
            }}
            className="bg-dark-200 p-2 rounded-md text-white w-full h-12"
          />
          {errors.usernameOrEmail && (
            <Text className="text-red-500 text-sm">
              {errors.usernameOrEmail}
            </Text>
          )}
        </View>
        <View className="mb-4 w-full">
          <TextInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) {
                setErrors((prev) => ({ ...prev, password: "" }));
              }
            }}
            className="bg-dark-200 p-2 rounded-md text-white w-full h-12"
          />
          {errors.password && (
            <Text className="text-red-500 text-sm">{errors.password}</Text>
          )}
        </View>
        <Button
          title="Login"
          onPress={handleLogin}
          disabled={isLoading}
          loading={isLoading}
        />
      </View>
    </View>
  );
};

export default LoginScreen;
