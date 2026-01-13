<template>
  <v-container>
    <v-card elevation="0">
      <v-row>
        <v-col cols="3">
          <v-text-field
            color="green"
            v-model="keyword"
            density="compact"
            label="Tìm kiếm theo tên loại sản phẩm"
            variant="outlined"
            hide-details
            single-line
          ></v-text-field>
        </v-col>
        <v-col cols="3"
          ><v-select
            color="green"
            :items="categories"
            item-title="categoryName"
            item-value="categoryId"
            variant="outlined"
            density="compact"
            v-model="selectCategoryId"
            single-line
            label="Tìm theo loại sản phẩm"
          ></v-select
        ></v-col>
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
        :items="foods"
        item-key="id"
        hide-default-footer
      >
        <template #no-data>
          <div class="text-center py-6 text-common">
            Danh sách sản phẩm đang trống
          </div>
        </template>
        <template #item.imageUrl="{ item }">
          <v-img :src="item.imageUrl" width="80" height="80" cover />
        </template>
        <template #item.foodName="{ item }">
          <a class="cursor-pointer" @click.prevent="selectFood(item)">
            {{ item.foodName }}
          </a>
        </template>
        <template #item.price="{ item }">
          <span class="price">
            {{ formatPrice(item.price) }}
          </span>
        </template>
        <template #item.status="{ item }">
          <span class="price">
            {{ item.status == "0" ? "còn hàng" : "hết hàng" }}
          </span>
        </template>
        <template #item.actions="{ item }">
          <v-btn
            icon
            variant="text"
            color="red-lighten-1"
            @click="removeFood(item.foodId)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
      <Pagination
        v-model:pagination="pagination"
        :totalItems="foods[0]?.totalCount"
        @update:pagination="handlePaginationUpdate"
      />
    </v-card>

    <div class="items-right mt-6">
      <v-btn
        color="#029d16"
        class="ml-2 text-none"
        variant="flat"
        @click="addFood()"
      >
        Thêm loại sản phẩm
      </v-btn>
    </div>
  </v-container>
  <v-dialog persistent v-model="foodDialog" max-width="700">
    <v-card>
      <v-card-title
        class="modal-title-custom text-white d-flex align-center justify-space-between"
      >
        {{ isUpdateFood ? "Thay đổi sản phẩm" : "Thêm sản phẩm" }}
        <v-btn icon @click="foodDialog = false" variant="text">
          <v-icon class="text-white">mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <!-- Form -->
      <v-form ref="formRef">
        <v-row class="pb-4" style="margin: 0px !important">
          <v-col cols="1"></v-col>
          <v-col cols="10">
            <v-row v-if="isUpdateFood">
              <v-col>
                <label class="input-label text-common">Id sản phẩm</label>
                <v-text-field
                  density="compact"
                  v-model="foodId"
                  variant="outlined"
                  hide-details="auto"
                  disabled
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <label class="input-label text-common">Tên sản phẩm</label>
                <v-text-field
                  density="compact"
                  v-model="foodName"
                  variant="outlined"
                  :rules="foodNameRules"
                  hide-details="auto"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <label class="input-label text-common">Hình minh họa</label>
                <v-file-input
                  density="compact"
                  v-model="foodImage"
                  label="Chọn ảnh upload"
                  accept="image/*"
                  prepend-icon="mdi-camera"
                  variant="outlined"
                  hide-details="auto"
                  single-line
                  :rules="[(v) => !!v || 'Vui lòng chọn ảnh']"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <label class="input-label text-common">Tên sản phẩm</label>
                <v-select
                  :items="categories"
                  item-title="categoryName"
                  item-value="categoryId"
                  variant="outlined"
                  density="compact"
                  v-model="categoryId"
                  single-line
                  label="Chọn loại sản phẩm"
                  :rules="[(v) => !!v || 'Vui lòng chọn loại sản phẩm']"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <label class="input-label text-common">Giá</label>
                <v-text-field
                  density="compact"
                  v-model="price"
                  variant="outlined"
                  hide-details="auto"
                  type="number"
                  :rules="[
                    (v) => (v !== null && v !== '') || 'Vui lòng nhập giá',
                    (v) => !isNaN(v) || 'Giá phải là số',
                  ]"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <label class="input-label text-common">Số lượng</label>
                <v-text-field
                  density="compact"
                  v-model="quantity"
                  variant="outlined"
                  hide-details="auto"
                  type="number"
                  :rules="[
                    (v) => (v !== null && v !== '') || 'Vui lòng số lượng',
                    (v) => !isNaN(v) || 'Số lượng phải là số',
                  ]"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <label class="input-label text-common">Mô tả</label>
                <v-textarea
                  density="compact"
                  v-model="description"
                  variant="outlined"
                  hide-details="auto"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <label class="input-label text-common">Tên sản phẩm</label>
                <v-radio-group inline v-model="status">
                  <v-radio label="Còn hàng" value="0"></v-radio>
                  <v-radio label="Hết hàng" value="1"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
            <v-btn
              @click="addUpdateCategory()"
              block
              color="#029d16"
              size="large"
              class="text-none"
            >
              {{ isUpdateFood ? "Cập nhật sản phẩm" : "Thêm sản phẩm" }}
            </v-btn>
          </v-col>
          <v-col cols="1"></v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-dialog>
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

const { searchCategoryList } = searchCategoryListApi();

// lấy danh sách category
const categories = ref<any[]>([]);
const getCategoryList = async () => {
  const categoryParam = ref({
    categoryName: "",
  });
  try {
    categories.value = await searchCategoryList(categoryParam.value);
  } catch (err) {
    console.error("Lỗi phía server đã xảy ra sự cố", err);
  }
};

const foods = ref<any[]>([]);
const getFoodList = async (pagination: any) => {
  const searchForm: any = {
    categoryId: selectCategoryId.value ?? null,
    foodName: keyword.value,
    limit: pagination.limit ?? 10,
    offset: pagination.offset ?? 0,
  };
  try {
    const { foodList } = foodListApi();
    foods.value = await foodList(searchForm);
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
  getFoodList(pagination);
};

const keyword = ref("");
const selectCategoryId = ref<number>();
const onSearch = () => {
  getFoodList(pagination.value);
};

onMounted(async () => {
  getCategoryList();
  getFoodList(pagination.value);
});
const headers = [
  {
    title: "",
    key: "imageUrl",
  },
  {
    title: "Id",
    key: "foodId",
    headerProps: { class: "font-weight-bold text-common" },
  },
  {
    title: "Tên",
    key: "foodName",
    headerProps: { class: "font-weight-bold text-common" },
  },
  {
    title: "Tên loại",
    key: "categoryName",
    headerProps: { class: "font-weight-bold text-common" },
  },
  {
    title: "Số lượng",
    key: "quantity",
    headerProps: { class: "font-weight-bold text-common" },
  },
  {
    title: "Giá",
    key: "price",
    headerProps: { class: "font-weight-bold text-common" },
  },
  {
    title: "Trạng thái",
    key: "status",
    headerProps: { class: "font-weight-bold text-common" },
  },
  {
    title: "Mô tả",
    key: "description",
    headerProps: { class: "font-weight-bold text-common" },
  },
  {
    title: "Xóa",
    key: "actions",
    headerProps: { class: "font-weight-bold text-common" },
    cellProps: {
      class: "last-column",
    },
  },
];

const foodDialog = ref<boolean>(false);
const isUpdateFood = ref<boolean>(false);
const foodId = ref<number>();
const categoryId = ref<number | null>();
const foodName = ref<string>("");
const description = ref<string>("");
const price = ref<number | null>();
const quantity = ref<number | null>();
const status = ref<string>("0");
const foodImage = ref<File | null>();

const message = ref<string>("");
const messageDialog = ref<boolean>(false);
const isSuccess = ref<boolean>(false);

const addFood = async () => {
  foodName.value = "";
  categoryId.value = null;
  description.value = "";
  price.value = null;
  quantity.value = null;
  foodImage.value = null;
  status.value = "0";
  isUpdateFood.value = false;
  foodDialog.value = true;
};

const insertFoodApi = async () => {
  const addParam: any = {
    categoryId: categoryId.value,
    foodName: foodName.value,
    description: description.value,
    price: price.value,
    quantity: quantity.value,
    status: status.value,
    foodImage: foodImage.value,
  };
  try {
    const addFood = addFoodApi();
    await addFood(addParam);
    message.value = "Thêm sản phẩm thành công";
    isSuccess.value = true;
  } catch (err) {
    message.value = "Lỗi thêm sản phẩm phát sinh";
    isSuccess.value = false;
  }
};

const selectFood = (item: any) => {
  foodId.value = item.foodId;
  categoryId.value = item.categoryId;
  foodName.value = item.foodName;
  description.value = item.description;
  price.value = item.price;
  quantity.value = item.quantity;
  status.value = item.status;
  foodImage.value = item.foodImage;
  isUpdateFood.value = true;
  foodDialog.value = true;
};

const updateFoodInfoApi = async () => {
  const updateParam: any = {
    foodId: foodId.value,
    categoryId: categoryId.value,
    foodName: foodName.value,
    description: description.value,
    price: price.value,
    quantity: quantity.value,
    status: status.value,
    foodImage: foodImage.value,
  };
  try {
    const updateFood = updateFoodApi();
    await updateFood(updateParam);
    message.value = "Cập nhật sản phẩm thành công";
    isSuccess.value = true;
  } catch (err) {
    message.value = "Lỗi cập nhật sản phẩm phát sinh";
    isSuccess.value = false;
  }
};

const addUpdateCategory = async () => {
  if (isUpdateFood.value) {
    await updateFoodInfoApi();
  } else {
    await insertFoodApi();
  }
  foodDialog.value = false;
  messageDialog.value = true;
  resetPagination();
  await getFoodList(pagination.value);
};

const removeFood = async (foodId: number) => {
  await deleteFoodInfoApi(foodId);
  messageDialog.value = true;
  resetPagination();
  await getFoodList(pagination.value);
};

const deleteFoodInfoApi = async (foodId: number) => {
  const deleteParam: any = {
    foodId: foodId,
  };
  try {
    const deleteFood = deleteFoodApi();
    await deleteFood(deleteParam);
    message.value = "Xóa sản phẩm thành công";
    isSuccess.value = true;
  } catch (err) {
    message.value = "Lỗi xóa sản phẩm phát sinh";
    isSuccess.value = false;
  }
};
const handleOk = () => {
  messageDialog.value = false;
};

const foodNameRules = [
  (v: any) => !!v || "Tên sản phẩm không được để trống",
  (v: string | any[]) =>
    (v && v.length <= 100) || "Tên sản phẩm không được quá 100 ký tự",
];
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
