import { useState } from "react";
import { Modal, Text, TextInput, View } from "react-native";
import Button from "./Button";

interface VerifyAccountModalProps {
  isVisible: boolean;
  onClose: () => void;
  onVerify: (code: string) => void;
}

const VerifyAccountModal = ({
  isVisible,
  onClose,
  onVerify,
}: VerifyAccountModalProps) => {
  const [code, setCode] = useState("");

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/60">
        <View className="rounded-lg bg-dark-100 justify-center items-center w-11/12 p-6">
          <Text className="text-white text-lg font-bold mb-2">
            Verify Account
          </Text>
          <Text className="text-light-200 mb-6">
            Enter the verification code sent to your email.
          </Text>
          <TextInput
            className="bg-dark-200 text-white rounded-md p-4 mb-4"
            placeholder="Enter verification code"
            placeholderTextColor="#aaa"
            value={code}
            onChangeText={setCode}
          />
          <View className="flex-row gap-2">
            <Button className="flex-1" title="Cancel" onPress={onClose} />
            <Button
              className="flex-1"
              title="Verify"
              onPress={() => onVerify(code)}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default VerifyAccountModal;
