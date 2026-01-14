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
  note: string;
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

export interface OrderSearchRequest {
  transactionCode: string;
  paymentStatus: string;
  limit: number;
  offset: number;
}

export interface OrderSearchResponse {
  orderId: number;
  totalAmount: number;
  createdAt: string;
  paymentMethod: string;
  paymentStatus: string;
  transactionCode: string;
  orderFoodName: string;
  receiverName: string;
  phone: string;
  addressDetail: string;
  note: string;
  totalCount: number;
}

export const searchOrderListApi = () => {
  const config = useRuntimeConfig();

  const searchOrderList = async (payload: OrderSearchRequest) => {
    return await $fetch<OrderSearchResponse[]>(
      `${config.public.apiBase}/order-list`,
      {
        method: "POST",
        body: payload,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };

  return { searchOrderList };
};

export interface OrderUpdatePaymentStatusRequest {
  orderId: number;
  paymentStatus: string;
}

export const orderPaymenStatusUpdateApi = () => {
  const config = useRuntimeConfig();

  return async (params: OrderUpdatePaymentStatusRequest): Promise<void> => {
    await $fetch(`${config.public.apiBase}/order-payment-status-update`, {
      method: "POST",
      body: params, // 🔥 gửi JSON
    });
  };
};
