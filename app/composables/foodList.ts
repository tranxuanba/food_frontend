export interface FoodSearchRequest {
  categoryId?: number;
  foodName?: string;
}
export interface FoodListResponse {
  foodId: number;
  foodName: string;
  price: number;
  imageUrl: string;
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
  return {
    useFoods,
    setFoods,
  };
};


