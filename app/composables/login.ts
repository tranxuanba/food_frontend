// apis/auth.api.ts
export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserLoginResponse {
  email: string;
  fullName: string;
  passwordHash: string;
  userId: number;
  phone: string;
  status: string;
  roleName: string;
  token: string;
}

export const authLoginApi = () => {
  const config = useRuntimeConfig();

  const loginBuyer = async (payload: LoginRequest) => {
    return await $fetch<UserLoginResponse>(
      `${config.public.apiBase}/auth/login`,
      {
        method: "POST",
        body: payload,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };

  return { loginBuyer };
};
