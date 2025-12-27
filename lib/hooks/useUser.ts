import { useAuthStore } from "../store/authStore";

export const useUser = () => {
  const { user, isAuthenticated } = useAuthStore();

  return {
    user,
    isAuthorized: isAuthenticated,
  };
};
