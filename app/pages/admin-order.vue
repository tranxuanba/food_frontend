<template>
  <v-container>
    <v-card elevation="0">
      <v-row class="d-flex align-center pb-2">
        <v-col cols="3">
          <v-text-field
            color="green"
            v-model="transactionCodeKey"
            density="compact"
            label="Tìm theo mã đơn hàng"
            variant="outlined"
            hide-details
            single-line
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-row>
            <v-col>
              <v-checkbox
                hide-details
                v-model="paymentStatusKey"
                label="Chưa thanh toán"
                value="0"
              />
            </v-col>
            <v-col>
              <v-checkbox
                hide-details
                v-model="paymentStatusKey"
                label="Đã thanh toán"
                value="1"
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="1"
          ><v-btn
            color="#029d16"
            class="ml-2 text-none"
            variant="flat"
            @click="onSearch()"
          >
            Tìm kiếm
          </v-btn></v-col
        >
      </v-row>
      <v-data-table
        :headers="headers"
        :items="orderList"
        item-key="id"
        hide-default-footer
      >
        <template #no-data>
          <div class="text-center py-6 text-common">
            Danh sách đơn hàng đang trống
          </div>
        </template>
        <template #item.paymentStatus="{ item }">
          <v-radio-group
            hide-details
            inline
            v-model="item.paymentStatus"
            @update:modelValue="(val) => updatePaymentStatus(item.orderId, val)"
          >
            <v-radio label="Chưa thanh toán" value="0"></v-radio>
            <v-radio label="Đã thanh toán" value="1"></v-radio>
          </v-radio-group>
        </template>
        <template #item.totalAmount="{ item }">
          <span class="price">
            {{ formatPrice(item.totalAmount) }}
          </span>
        </template>
      </v-data-table>
      <Pagination
        v-model:pagination="pagination"
        :totalItems="orderList[0]?.totalCount"
        @update:pagination="handlePaginationUpdate"
      />
    </v-card>
  </v-container>
  <v-dialog v-model="messageDialog" max-width="500" persistent>
    <v-card>
      <v-card-text class="text-common">
        {{ message }}
      </v-card-text>
      <v-card-actions class="my-2 d-flex justify-center">
        <v-btn
          :class="isSuccess ? 'text-success' : 'text-error'"
          :text="isSuccess ? 'OK' : 'Trở về'"
          @click="handleOk"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const orderList = ref<any[]>([]);
const getOrderList = async (pagination: any) => {
  const searchForm: any = {
    transactionCode: transactionCodeKey.value,
    paymentStatus: paymentStatusKey.value ? paymentStatusKey.value : null,
    limit: pagination.limit ?? 10,
    offset: pagination.offset ?? 0,
  };
  try {
    const { searchOrderList } = searchOrderListApi();
    orderList.value = await searchOrderList(searchForm);
  } catch (err) {
    console.error("Fetch food error", err);
  }
};
const pagination = ref<any>({
  page: 1,
  limit: 10,
  offset: 0,
});
const handlePaginationUpdate = async (pagination: any) => {
  getOrderList(pagination);
};

const transactionCodeKey = ref<string>("");
const paymentStatusKey = ref<string | null>();
const onSearch = () => {
  getOrderList(pagination.value);
};

onMounted(async () => {
  getOrderList(pagination.value);
});
const headers = [
  {
    title: "Id",
    key: "orderId",
    headerProps: { class: "font-weight-bold text-common" },
  },
  {
    title: "Mã đơn",
    key: "transactionCode",
    headerProps: { class: "font-weight-bold text-common" },
  },
  {
    title: "Thời gian đặt",
    key: "createdAt",
    headerProps: { class: "font-weight-bold text-common" },
  },
  {
    title: "Đơn hàng",
    key: "orderFoodName",
    headerProps: { class: "font-weight-bold text-common" },
  },
  {
    title: "Phương thức thanh toán",
    key: "paymentMethod",
    headerProps: { class: "font-weight-bold text-common" },
  },
  {
    title: "Trạng thái thanh toán",
    key: "paymentStatus",
    headerProps: { class: "font-weight-bold text-common" },
  },
  {
    title: "Người nhận",
    key: "receiverName",
    headerProps: { class: "font-weight-bold text-common" },
  },
  {
    title: "Số điện thoại",
    key: "phone",
    headerProps: { class: "font-weight-bold text-common" },
  },
  {
    title: "Địa chỉ",
    key: "addressDetail",
    headerProps: { class: "font-weight-bold text-common" },
  },
  {
    title: "Số tiền",
    key: "totalAmount",
    headerProps: { class: "font-weight-bold text-common" },
    cellProps: {
      class: "last-column",
    },
  },
];

const message = ref<string>("");
const messageDialog = ref<boolean>(false);
const isSuccess = ref<boolean>(false);

const updatePaymentStatus = async (orderId: number, paymentStatus: string) => {
  const updateParam: any = {
    orderId: orderId,
    paymentStatus: paymentStatus,
  };
  try {
    const updateOrder = orderPaymenStatusUpdateApi();
    await updateOrder(updateParam);
    message.value = "Cập nhật trạng thái thành công";
    isSuccess.value = true;
  } catch (err) {
    message.value = "Lỗi cập nhật trạng thái phát sinh";
    isSuccess.value = false;
  }
  messageDialog.value = true;
  resetPagination();
  getOrderList(pagination.value);
};

const handleOk = () => {
  messageDialog.value = false;
};

const formatPrice = (v: number) => v.toLocaleString("vi-VN") + "đ";
const resetPagination = () => {
  pagination.value.limit = 10;
  pagination.value.offset = 0;
  pagination.value.page = 1;
};
</script>

<style scoped>
::v-deep(.v-data-table th),
::v-deep(.v-data-table td) {
  border-left: 1px solid #eee;
}

::v-deep(.v-data-table th) {
  border-top: 1px solid #eee;
}

::v-deep(.v-data-table td) {
  border-bottom: 1px solid #eee;
  padding-top: 10px !important;
  padding-bottom: 10px !important;
}

::v-deep(.v-data-table thead tr th:last-child),
::v-deep(.last-column) {
  border-right: 1px solid #eee !important;
}

::v-deep(.v-data-table-rows-no-data td) {
  border-right: 1px solid #eee !important;
}

.cursor-pointer {
  cursor: pointer;
  color: #029d16;
}
.price {
  color: #f57c00;
}
</style>
