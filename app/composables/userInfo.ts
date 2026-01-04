export interface UserProfileResponse {
  userId: number;
  email: string;
  username: string;
  phone: string;
  roleName: string;
  status: string;
}

import type { FetchOptions } from "ofetch";

type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS"
  | "TRACE"
  | "CONNECT";

export const useApiFetch = <T>(
  url: string,
  options: Omit<FetchOptions<"json">, "method"> & {
    method?: HttpMethod;
  } = {}
) => {
  const config = useRuntimeConfig();
  const token = useCookie<string | null>("auth_token");
  console.log(token.value);

  return $fetch<T>(`${config.public.apiBase}${url}`, {
    method: options.method ?? "POST",
    body: options.body,
    params: options.params,
    headers: {
      ...((options.headers as Record<string, string>) || {}),
      ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
    },
  });
};

export const userApi = () => {
  const getMe = async (token: string) => {
    return await useApiFetch<UserProfileResponse>("/users/me", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  return {
    getMe,
  };
};
