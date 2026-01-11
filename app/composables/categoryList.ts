export interface CategoryListResponse {
  categoryId: number;
  categoryName: string;
  parentCategoryId?: number;
}

export interface FoodCategorySearchRequest {
  categoryName: string;
}

export interface FoodCategoryAddRequest {
  categoryName: string;
  parentCategoryId?: number;
}

export const categoryListApi = () => {
  const config = useRuntimeConfig();

  const categoryList = async () => {
    return await $fetch<CategoryListResponse[]>(
      `${config.public.apiBase}/food-categorys`,
      {
        method: "POST",
      }
    );
  };

  return { categoryList };
};
export const useCategoryList = () => {
  const useCategoryes = useState<any[]>("useCategoryes", () => []);

  const setUseCategoryes = (categoryList: any[]) => {
    useCategoryes.value = categoryList;
  };
  const useSelectedCategoryId = useState<number | null>("categoryId", () => null);

  const setSelectedCategoryId = (categoryId?: number) => {
    useSelectedCategoryId.value = categoryId ?? null;
  };
  return {
    useCategoryes,
    setUseCategoryes,
    useSelectedCategoryId,
    setSelectedCategoryId
  };
};

export const searchCategoryListApi = () => {
  const config = useRuntimeConfig();

  const searchCategoryList = async (payload: FoodCategorySearchRequest) => {
    return await $fetch<CategoryListResponse[]>(
      `${config.public.apiBase}/food-categorys/search`,
      {
        method: "POST",
        body: payload,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };

  return { searchCategoryList };
};

export const addCategoryApi = () => {
  const config = useRuntimeConfig();

  return async (payload: FoodCategoryAddRequest): Promise<void> => {
    await $fetch(
      `${config.public.apiBase}/food-categorys/add`,
      {
        method: "POST",
        body: payload,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };
};