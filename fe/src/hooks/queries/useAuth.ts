import { QUERY_KEYS } from "@/constants/queryKeys";
import { useAuth } from "@/contexts/AuthContext";
import { login as loginRequest, signup } from "@/services/auth";
import { AuthResponse, LoginRequest, SignupRequest } from "@/types/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useSignup = () => {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, Error, SignupRequest>({
    mutationFn: signup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.me() });
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { login } = useAuth();

  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      if (data.user) {
        login(data.accessToken, data.user, data.refreshToken);
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.me() });
    },
  });
};
