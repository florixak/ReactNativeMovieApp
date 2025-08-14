import Button from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";
import { loginSchema } from "@/schemas/authSchemas";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, View } from "react-native";
import { z } from "zod";

const LoginForm = () => {
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string) => {
    if (field === "usernameOrEmail") setUsernameOrEmail(value);
    if (field === "password") setPassword(value);

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

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
        error.issues.forEach((err: z.ZodIssue) => {
          fieldErrors[err.path[0] as string] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        Alert.alert("Login Failed", error.message || "Invalid credentials");
      }
    }
  };

  return (
    <View className="space-y-4">
      <View className="mb-4">
        <TextInput
          placeholder="Username or Email"
          value={usernameOrEmail}
          onChangeText={(text) => updateField("usernameOrEmail", text)}
          className="bg-dark-200 p-3 rounded-md text-white w-full h-12"
          placeholderTextColor="#888"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {errors.usernameOrEmail && (
          <Text className="text-red-500 text-sm mt-1">
            {errors.usernameOrEmail}
          </Text>
        )}
      </View>

      <View className="mb-6">
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(text) => updateField("password", text)}
          className="bg-dark-200 p-3 rounded-md text-white w-full h-12"
          placeholderTextColor="#888"
        />
        {errors.password && (
          <Text className="text-red-500 text-sm mt-1">{errors.password}</Text>
        )}
      </View>

      <Button
        title="Login"
        onPress={handleLogin}
        disabled={isLoading}
        loading={isLoading}
        className="!bg-accent"
      />
    </View>
  );
};

export default LoginForm;
