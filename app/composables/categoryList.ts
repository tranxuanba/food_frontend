export interface CategoryListResponse {
  categoryId: number;
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