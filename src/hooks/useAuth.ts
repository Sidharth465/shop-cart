import { router } from "expo-router";
import { useEffect } from "react";
import { useAppStore } from "../store";

export const useAuth = () => {
  const { isAuthenticated, user } = useAppStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/(tabs)");
    } else {
      router.replace("/login");
    }
  }, [isAuthenticated]);

  return {
    isAuthenticated,
    user,
  };
};
