export interface FoodSearchRequest {
  categoryIds?: number[];
  foodName?: string;
}
export interface FoodListResponse {
  foodId: number;
  foodName: string;
  categoryId: number;
  description: string;
  quantity: number;
  status: string;
  price: number;
  discountPrice: number;
  imageUrl: string;
  totalCount: number;
}
export interface Pagination {
  page: number;
  limit: number;
  offset?: number;
}

export const foodListApi = () => {
  const config = useRuntimeConfig();
  const foodList = async (params: FoodSearchRequest) => {
    // @ModelAttribute → dùng URLSearchParams
    const form = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        form.append(key, String(value));
      }
    });
    return await $fetch<FoodListResponse[]>(
      `${config.public.apiBase}/food-search`,
      {
        method: "POST",
        body: form,
      },
    );
  };

  return { foodList };
};
export const useFoodList = () => {
  const useFoods = useState<any[]>("foods", () => []);

  const setFoods = (foodList: any[]) => {
    useFoods.value = foodList;
  };
  const useSearchFoodName = useState<string>("foodName", () => "");

  const setSearchFoodName = (foodName?: string) => {
    useSearchFoodName.value = foodName ?? "";
  };
  const usePagination = useState<Pagination>("pagination", () => ({
    page: 1,
    limit: 10,
    offset: 0,
  }));

  const setPagination = (pagination?: any) => {
    usePagination.value = pagination ?? {
      page: 1,
      limit: 10,
      offset: 0,
    };
  };
  const useFoodsLoading = useState<boolean>("foodsLoading", () => true);

  const setFoodsLoading = (loading: boolean) => {
    useFoodsLoading.value = loading;
  };

  return {
    useFoods,
    setFoods,
    useSearchFoodName,
    setSearchFoodName,
    usePagination,
    setPagination,
    useFoodsLoading,
    setFoodsLoading,
  };
};

export interface FoodInsertRequest {
  categoryId: number;
  foodName: string;
  description: string;
  price: number;
  discountPrice: number;
  quantity: number;
  status: string;
  foodImage: File;
}

export const addFoodApi = () => {
  const config = useRuntimeConfig();
  return async (params: FoodInsertRequest): Promise<void> => {
    const form = new FormData();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (value instanceof File) {
          form.append(key, value);
        } else {
          form.append(key, String(value));
        }
      }
    });
    await $fetch(`${config.public.apiBase}/insert-food`, {
      method: "POST",
      body: form,
    });
  };
};

export interface FoodUpdateRequest {
  foodId: number;
  categoryId: number;
  foodName: string;
  description: string;
  price: number;
  discountPrice: number;
  quantity: number;
  status: string;
  foodImage: File;
}

export const updateFoodApi = () => {
  const config = useRuntimeConfig();
  return async (params: FoodUpdateRequest): Promise<void> => {
    const form = new FormData();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (value instanceof File) {
          form.append(key, value);
        } else {
          form.append(key, String(value));
        }
      }
    });
    await $fetch(`${config.public.apiBase}/update-food`, {
      method: "POST",
      body: form,
    });
  };
};

export interface FoodDeleteRequest {
  foodId: number;
}

export const deleteFoodApi = () => {
  const config = useRuntimeConfig();
  return async (params: FoodDeleteRequest): Promise<void> => {
    const form = new FormData();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (value instanceof File) {
          form.append(key, value);
        } else {
          form.append(key, String(value));
        }
      }
    });
    await $fetch(`${config.public.apiBase}/delete-food`, {
      method: "POST",
      body: form,
    });
  };
};
