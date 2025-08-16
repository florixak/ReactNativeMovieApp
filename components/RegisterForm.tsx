import { useAuth } from "@/contexts/AuthContext";
import { RegisterData, registerSchema } from "@/schemas/authSchemas";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, View } from "react-native";
import { z } from "zod";
import Button from "./Button";

const RegisterForm = () => {
  const { register, verify, isLoading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterData>({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [verificationCode, setVerificationCode] = useState("");
  const [canVerify, setCanVerify] = useState(false);

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleRegister = async () => {
    setErrors({});

    try {
      const validData = registerSchema.parse(formData);
      await register(validData);

      Alert.alert(
        "Registration Successful!",
        "Please check your email for a verification code.",
        [
          {
            text: "Verify Now",
            onPress: () => {
              setCanVerify(true);
            },
          },
        ]
      );
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          fieldErrors[err.path[0] as string] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        Alert.alert(
          "Registration Error",
          error.message || "An error occurred."
        );
      }
    }
  };

  const handleVerification = async () => {
    if (!verificationCode) {
      Alert.alert("Error", "Please enter the verification code.");
      return;
    }

    try {
      await verify({
        email: formData.email,
        verificationCode,
      });
      Alert.alert("Success", "Your account has been verified!");
      router.push("/(tabs)/profile");
    } catch {
      Alert.alert("Error", "Failed to verify account.");
    } finally {
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
    setCanVerify(false);
    setVerificationCode("");
  };

  if (canVerify) {
    return (
      <View className="mb-4">
        <View className="mb-4">
          <TextInput
            placeholder="Verification Code"
            value={verificationCode}
            onChangeText={setVerificationCode}
            className="bg-dark-200 p-3 rounded-md text-white w-full h-12"
            placeholderTextColor="#888"
            keyboardType="numeric"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {errors.verificationCode && (
            <Text className="text-red-500 text-sm mt-1">
              {errors.verificationCode}
            </Text>
          )}
        </View>
        <Text className="text-light-100 mb-4 text-center">
          Please enter the verification code sent to your email.
        </Text>
        <Button
          title="Verify Account"
          onPress={handleVerification}
          disabled={isLoading || Object.keys(errors).length > 0}
          loading={isLoading}
          className="!bg-accent"
        />
      </View>
    );
  }

  return (
    <View className="space-y-4">
      <View className="mb-4">
        <TextInput
          placeholder="Email"
          value={formData.email}
          onChangeText={(text) => updateField("email", text)}
          className="bg-dark-200 p-3 rounded-md text-white w-full h-12"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {errors.email && (
          <Text className="text-red-500 text-sm mt-1">{errors.email}</Text>
        )}
      </View>

      <View className="mb-4">
        <TextInput
          placeholder="Username"
          value={formData.username}
          onChangeText={(text) => updateField("username", text)}
          className="bg-dark-200 p-3 rounded-md text-white w-full h-12"
          placeholderTextColor="#888"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {errors.username && (
          <Text className="text-red-500 text-sm mt-1">{errors.username}</Text>
        )}
      </View>

      <View className="mb-4">
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={formData.password}
          onChangeText={(text) => updateField("password", text)}
          className="bg-dark-200 p-3 rounded-md text-white w-full h-12"
          placeholderTextColor="#888"
        />
        {errors.password && (
          <Text className="text-red-500 text-sm mt-1">{errors.password}</Text>
        )}
      </View>

      <View className="mb-6">
        <TextInput
          placeholder="Confirm Password"
          secureTextEntry
          value={formData.confirmPassword}
          onChangeText={(text) => updateField("confirmPassword", text)}
          className="bg-dark-200 p-3 rounded-md text-white w-full h-12"
          placeholderTextColor="#888"
        />
        {errors.confirmPassword && (
          <Text className="text-red-500 text-sm mt-1">
            {errors.confirmPassword}
          </Text>
        )}
      </View>

      <Button
        title="Create Account"
        onPress={handleRegister}
        disabled={isLoading || Object.keys(errors).length > 0}
        loading={isLoading}
        className="!bg-accent"
      />
    </View>
  );
};

export default RegisterForm;
