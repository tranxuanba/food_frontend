import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
  const token = useCookie<string | null>("auth_token", {
    sameSite: "lax",
  });

  const isLoggedIn = computed(() => !!token.value);

  const setToken = (jwt: string) => {
    token.value = jwt;
  };

  const clear = () => {
    token.value = null;
  };

  return {
    token,
    isLoggedIn,
    setToken,
    clear,
  };
});
