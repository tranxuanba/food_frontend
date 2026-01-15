export interface CartMeRequest {
  userId: string;
}
export interface CartMeResponse {
  cartItemId: number;
  foodId: number;
  foodName: string;
  imageUrl: string;
  price: number;
  quantity: number;
  totalPrice: number;
  totalCount: number;
}
export interface CartMeLocalStorage {
  foodId: number;
  foodName: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

export interface CartMeUpdateRequest {
  userId: string;
  foodId: number;
  quantity: number;
}

export interface CartMeDeleteRequest {
  cartItemId: number;
}


export const cartItemMeListApi = () => {
  const config = useRuntimeConfig();
  const cartItemMeList = async (params: CartMeRequest) => {
    // @ModelAttribute → dùng URLSearchParams
    const form = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        form.append(key, String(value));
      }
    });
    return await $fetch<CartMeResponse[]>(
      `${config.public.apiBase}/cart-me`,
      {
        method: "POST",
        body: form,
      }
    );
  };

  return { cartItemMeList };
};
export const useCartItemMeList = () => {
  const totalCount = useState<number>("totalCount", () => 0);

  const setTotalCount = (count?: number) => {
    totalCount.value = count ?? 0;
  };
  const useCartItemMes = useState<any[]>("useCartItemMes", () => []);

  const setCartItemMes = (cartList: any[]) => {
    useCartItemMes.value = cartList;
  };

  return {
    totalCount,
    setTotalCount,
    useCartItemMes,
    setCartItemMes,
  };
};


export const cartItemMeUpdateApi = () => {
  const config = useRuntimeConfig();

  return async (params: CartMeUpdateRequest): Promise<void> => {
    const form = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        form.append(key, String(value));
      }
    });

    await $fetch(
      `${config.public.apiBase}/cart-me-update`,
      {
        method: "POST",
        body: form,
      }
    );
  };
};

export const cartItemMeDeleteApi = () => {
  const config = useRuntimeConfig();

  return async (params: CartMeDeleteRequest): Promise<void> => {
    const form = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        form.append(key, String(value));
      }
    });

    await $fetch(
      `${config.public.apiBase}/cart-me-delete`,
      {
        method: "POST",
        body: form,
      }
    );
  };
};

export const useCartIcon = () => {
  const cartIcon = useState<HTMLElement | null>(
    'cart-icon',
    () => null
  );

  return {
    cartIcon
  };
};

