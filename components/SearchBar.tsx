import { icons } from "@/constants/icons";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Image, TextInput, View } from "react-native";

interface SearchBarProps {
  placeholder: string;
  onPress?: () => void;
  value?: string;
  onChangeText?: (text: string) => void;
  disableEdit?: boolean;
}

const SearchBar = ({
  onPress,
  placeholder,
  value = "",
  onChangeText = () => {},
  disableEdit = false,
}: SearchBarProps) => {
  const handleClear = () => {
    if (onChangeText) {
      onChangeText("");
    }
  };
  return (
    <View className="flex-row items-center bg-dark-200 rounded-full px-5 py-4">
      <Image
        source={icons.search}
        className="size-5"
        resizeMode="contain"
        tintColor="#ab8bff"
      />
      <TextInput
        onPress={onPress}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#a8b5db"
        className="flex-1 ml-2 text-white"
        editable={!disableEdit}
      />
      {value !== "" && (
        <MaterialIcons
          name="cancel"
          size={18}
          color="#ab8bff"
          onPress={handleClear}
        />
      )}
    </View>
  );
};

export default SearchBar;
