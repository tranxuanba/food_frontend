export interface FoodSearchRequest {
  categoryId?: number;
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
      }
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
  return {
    useFoods,
    setFoods,
    useSearchFoodName,
    setSearchFoodName,
    usePagination,
    setPagination,
  };
};
