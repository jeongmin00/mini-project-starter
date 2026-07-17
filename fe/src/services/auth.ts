import { LoginRequest, SignupRequest } from "@/types/auth";
import { fetchWithAuth } from "./api";

export const signup = async (request: SignupRequest) => {
  const response = await fetchWithAuth("/auth/signup", {
    method: "POST",
    body: JSON.stringify(request),
  });
  return response.json();
};

export const login = async (request: LoginRequest) => {
  const response = await fetchWithAuth("/auth/login", {
    method: "POST",
    body: JSON.stringify(request),
  });
  return response.json();
};
