export interface CreateRequest {
  fullName: string;
  email: string;
  password: string;
}
export interface UserCreateResponse {
  userId: number;
  fullName: string;
  email: string;
  roleName: number;
}

export const authRegisterApi = () => {
  const config = useRuntimeConfig();

  const registerBuyer = async (payload: CreateRequest) => {
    return await $fetch<UserCreateResponse>(
      `${config.public.apiBase}/auth/register`,
      {
        method: "POST",
        body: payload, // ✅ gửi JSON đúng @RequestBody
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };

  return {
    registerBuyer,
  };
};
