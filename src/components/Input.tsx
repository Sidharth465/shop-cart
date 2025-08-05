import { Ionicons } from "@expo/vector-icons";
import React, { forwardRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: any;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      onRightIconPress,
      containerStyle,
      style,
      secureTextEntry,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    const togglePasswordVisibility = () => {
      setIsPasswordVisible(!isPasswordVisible);
    };

    const getInputStyle = () => {
      const baseStyle: any[] = [styles.input];

      if (isFocused) {
        baseStyle.push(styles.inputFocused);
      }

      if (error) {
        baseStyle.push(styles.inputError);
      }

      if (leftIcon) {
        baseStyle.push(styles.inputWithLeftIcon);
      }

      if (rightIcon || secureTextEntry) {
        baseStyle.push(styles.inputWithRightIcon);
      }

      return baseStyle;
    };

    return (
      <View style={[styles.container, containerStyle]}>
        {label && <Text style={styles.label}>{label}</Text>}

        <View
          style={[
            styles.inputContainer,
            isFocused && styles.inputContainerFocused,
          ]}
        >
          {leftIcon && (
            <Ionicons
              name={leftIcon}
              size={20}
              color={isFocused ? "#007AFF" : "#8E8E93"}
              style={styles.leftIcon}
            />
          )}

          <TextInput
            ref={ref}
            style={[getInputStyle(), style]}
            onFocus={handleFocus}
            onBlur={handleBlur}
            secureTextEntry={secureTextEntry && !isPasswordVisible}
            placeholderTextColor="#8E8E93"
            {...props}
          />

          {secureTextEntry && (
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={styles.rightIconContainer}
            >
              <Ionicons
                name={isPasswordVisible ? "eye-off" : "eye"}
                size={20}
                color="#8E8E93"
              />
            </TouchableOpacity>
          )}

          {rightIcon && !secureTextEntry && (
            <TouchableOpacity
              onPress={onRightIconPress}
              style={styles.rightIconContainer}
            >
              <Ionicons name={rightIcon} size={20} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1C1C1E",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "transparent",
  },
  inputContainerFocused: {
    borderColor: "#007AFF",
    backgroundColor: "#FFFFFF",
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1C1C1E",
  },
  inputFocused: {
    backgroundColor: "transparent",
  },
  inputError: {
    borderColor: "#FF3B30",
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  leftIcon: {
    marginLeft: 16,
    marginRight: 8,
  },
  rightIconContainer: {
    padding: 8,
    marginRight: 8,
  },
  errorText: {
    fontSize: 12,
    color: "#FF3B30",
    marginTop: 4,
    marginLeft: 4,
  },
});
