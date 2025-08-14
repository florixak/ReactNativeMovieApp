import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface ButtonProps {
  title: string;
  onPress?: (props: any) => any;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const Button = ({
  title,
  onPress,
  disabled,
  loading = false,
  className,
}: ButtonProps) => {
  return (
    <TouchableOpacity
      className={`p-2 rounded-md w-full h-12 flex items-center justify-center ${
        loading ? "opacity-75" : "bg-dark-200"
      } ${className}`}
      onPress={onPress}
      disabled={disabled || loading}
    >
      <Text className="text-white">{loading ? "Loading..." : title}</Text>
    </TouchableOpacity>
  );
};

export default Button;
