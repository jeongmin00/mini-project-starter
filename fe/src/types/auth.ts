export type SignupRequest = {
  email: string;
  password: string;
  name: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type User = {
  id: number;
  email: string;
  name: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user?: User; // signup 응답엔 없을 수 있어서 optional
};
