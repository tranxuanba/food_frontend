<template>
  <v-container>
    <v-card elevation="0">
      <v-row class="px-3 pb-6 pt-4">
        <v-text-field color="green" v-model="keyword" density="compact" label="Tìm kiếm theo tên loại sản phẩm"
          variant="outlined" style="max-width: 400px" append-inner-icon="mdi-magnify" hide-details single-line
          @click:append-inner="onSearch"></v-text-field>
      </v-row>
      <v-data-table :headers="headers" :items="categories" item-key="id" hide-default-footer>
        <template #no-data>
          <div class="text-center py-6 text-common">
            Danh sách loại sản phẩm đang trống
          </div>
        </template>
        <template #item.categoryName="{ item }">
          <a class="cursor-pointer" @click.prevent="selectCategory(item)">
            {{ item.categoryName }}
          </a>
        </template>
        <template #item.actions="{ item }">
          <v-btn icon variant="text" color="red-lighten-1" @click="removeCategory(item.categoryId)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <div class="items-right mt-6">
      <v-btn color="#029d16" class="ml-2 text-none" variant="flat" @click="addFoodCategory()">
        Thêm loại sản phẩm
      </v-btn>
    </div>
  </v-container>
  <v-dialog persistent v-model="categoryDialog" max-width="500">
    <v-card>
      <v-card-title class="modal-title-custom text-white d-flex align-center justify-space-between">
        {{ isUpdateCategory ? "Thay đổi danh mục" : "Thêm danh mục" }}
        <v-btn icon @click="categoryDialog = false" variant="text">
          <v-icon class="text-white">mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <!-- Form -->
      <v-form ref="formRef">
        <v-row class="pb-4" style="margin: 0px !important">
          <v-col cols="1"></v-col>
          <v-col cols="10">
            <v-row v-if="isUpdateCategory">
              <v-col>
                <label class="input-label text-common">Id loại sản phẩm</label>
                <v-text-field v-model="categoryId" variant="outlined" hide-details="auto" disabled></v-text-field>
              </v-col>
            </v-row>
            <v-row class="pb-6">
              <v-col>
                <label class="input-label text-common">Tên sản phẩm</label>
                <v-text-field v-model="categoryName" variant="outlined" :rules="categoryNameRules"
                  hide-details="auto"></v-text-field>
              </v-col>
            </v-row>
            <v-btn @click="addUpdateCategory()" block color="#029d16" size="large" class="text-none">
              {{ isUpdateCategory ? "Cập nhật sản phẩm" : "Thêm sản phẩm" }}
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
        <v-btn :class="isSuccess ? 'text-success' : 'text-error'" :text="isSuccess ? 'OK' : 'Trở về'"
          @click="handleOk" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { deleteCategoryApi, updateCategoryApi } from "../composables/categoryList";

const { searchCategoryList } = searchCategoryListApi();
// lấy danh sách category
const categories = ref<any[]>([]);
const getCategoryList = async () => {
  const loginParam = ref({
    categoryName: keyword.value,
  });
  try {
    categories.value = await searchCategoryList(loginParam.value);
  } catch (err) {
    console.error("Lỗi phía server đã xảy ra sự cố", err);
  }
};

const keyword = ref("");
const onSearch = () => {
  getCategoryList();
};

onMounted(async () => {
  getCategoryList();
});
const headers = [
  {
    title: "Id loại sản phẩm",
    key: "categoryId",
    headerProps: { class: "font-weight-bold text-common" },
  },
  {
    title: "Tên sản phẩm",
    key: "categoryName",
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

const categoryDialog = ref<boolean>(false);
const isUpdateCategory = ref<boolean>(false);
const categoryId = ref<number>();
const categoryName = ref<string>("");
const message = ref<string>("");
const messageDialog = ref<boolean>(false);
const isSuccess = ref<boolean>(false);

const addFoodCategory = async () => {
  categoryName.value = "";
  isUpdateCategory.value = false;
  categoryDialog.value = true;
};

const addFoodCategoryApi = async () => {
  const addParam: any = {
    categoryName: categoryName.value,
    parentCategoryId: null,
  };
  try {
    const addCategory = addCategoryApi();
    await addCategory(addParam);
    message.value = "Thêm danh mục thành công";
    isSuccess.value = true;
  } catch (err) {
    message.value = "Lỗi thêm danh mục phát sinh";
    isSuccess.value = false;
  }
};

const selectCategory = (item: any) => {
  categoryId.value = item.categoryId;
  categoryName.value = item.categoryName;
  isUpdateCategory.value = true;
  categoryDialog.value = true;
};

const updateFoodCategoryApi = async () => {
  const updateParam: any = {
    categoryId: categoryId.value,
    categoryName: categoryName.value,
    parentCategoryId: null,
  };
  try {
    const updateCategory = updateCategoryApi();
    await updateCategory(updateParam);
    message.value = "Cập nhật danh mục thành công";
    isSuccess.value = true;
  } catch (err) {
    message.value = "Lỗi cập nhật danh mục phát sinh";
    isSuccess.value = false;
  }
};

const addUpdateCategory = async () => {
  if (isUpdateCategory.value) {
    await updateFoodCategoryApi();
  } else {
    await addFoodCategoryApi();
  }
  categoryDialog.value = false;
  messageDialog.value = true;
  await getCategoryList();
};

const removeCategory = async (categoryId: number) => {
  await deleteFoodCategoryApi(categoryId);
  messageDialog.value = true;
  await getCategoryList();
};

const deleteFoodCategoryApi = async (categoryId: number) => {
  const deleteParam: any = {
    categoryId: categoryId,
  };
  try {
    const deleteCategory = deleteCategoryApi();
    await deleteCategory(deleteParam);
    message.value = "Xóa danh mục thành công";
    isSuccess.value = true;
  } catch (err) {
    message.value = "Lỗi xóa danh mục phát sinh";
    isSuccess.value = false;
  }
};
const handleOk = () => {
  messageDialog.value = false;
};

const categoryNameRules = [
  (v: any) => !!v || "Tên sản phẩm không được để trống",
  (v: string | any[]) =>
    (v && v.length <= 100) || "Tên sản phẩm không được quá 100 ký tự",
];
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
</style>
