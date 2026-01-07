export interface CartMeOrderRequest {
  foodId: number;
  quantity: number;
  price: number;
  cartItemId: number;
}

export interface OrderMeCreateRequest {
  userId: string;
  receiverName: string;
  addressDetail: string;
  phone: string;
  paymentMethod: string;
  paymentStatus: string;
  totalAmount: number;
  cartMeOrderList: CartMeOrderRequest[];
}

export const orderMeCreateApi = () => {
  const config = useRuntimeConfig();

  return async (params: OrderMeCreateRequest): Promise<void> => {
    await $fetch(`${config.public.apiBase}/order-me-create`, {
      method: "POST",
      body: params, // 🔥 gửi JSON
    });
  };
};

