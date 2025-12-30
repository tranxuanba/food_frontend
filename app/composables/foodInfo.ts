export interface FoodDetailRequest {
  foodId: number;
}
export interface FoodDetailResponse {
  foodId: number;
  foodName: string;
  status: string;
  price: number;
  description: string;
  categoryName: string;
  quantity: number;
  imageUrl: string;
}

export const foodInfoApi = () => {
  const config = useRuntimeConfig();
  const foodInfo = async (params: FoodDetailRequest) => {
    // @ModelAttribute → dùng URLSearchParams
    const form = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        form.append(key, String(value));
      }
    });
    return await $fetch<FoodDetailResponse>(
      `${config.public.apiBase}/food-detail`,
      {
        method: "POST",
        body: form,
      }
    );
  };
  return { foodInfo };
};
