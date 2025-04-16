<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">Product</h2>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="bg-white border px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-50"
          @click="router.push('/admin/product/create')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-plus"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          <span>Tambah Wheelchair</span>
        </button>
        <!-- Komponen ExportDropdown -->
        <ExportDropdown
          :data="exportData"
          :columns="exportColumns"
          title="Data Produk"
          filename="Product"
        />
        <button
          class="bg-white border px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-50"
          @click="showFilter = !showFilter"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-filter"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          <span>Filter</span>
        </button>
      </div>
    </div>

    <!-- Filter Panel -->
    <ProductFilter
      v-if="showFilter"
      :filter="filter"
      @apply="applyFilter"
      @reset="resetFilter"
      @close="showFilter = false"
    />

    <!-- Data Table -->
    <div class="border rounded-lg overflow-hidden bg-white shadow-sm">
      <div class="p-4 border-b">
        <h3 class="text-lg font-medium">Data Produk</h3>
      </div>
      <div class="p-4">
        <UiTable
          :data="products"
          :columns="columns"
          :loading="isLoading"
          @action="handleAction"
        />

        <UiPagination
          v-if="pagination"
          :current-page="pagination.currentPage"
          :total-pages="pagination.totalPages"
          :total="pagination.total"
          :items-per-page="pagination.itemsPerPage"
          @page-change="handlePageChange"
        />
      </div>
    </div>
    
    <!-- Confirmation Modals -->
    <ConfirmationModal
      v-model:isOpen="isDeleteModalOpen"
      type="delete"
      :message="`Apakah anda yakin ingin menghapus ${selectedProduct?.productName || ''}?`"
      @confirm="confirmDelete"
      @cancel="isDeleteModalOpen = false"
    />
    
    <ConfirmationModal
      v-model:isOpen="isSuccessModalOpen"
      type="success"
      message="Data produk berhasil dihapus"
      :showButtons="false"
      @cancel="isSuccessModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useProductStore } from "~/store/product";
import { useNotification } from "~/composables/use-notification";
import type { Product } from "~/types/product";
import ProductFilter from "~/components/product/product-filter.vue";
import UiTable from "~/components/ui-table.vue";
import UiPagination from "~/components/ui-pagination.vue";
import ConfirmationModal from "~/components/ui/modals/confirmation-modal.vue";
import ExportDropdown from "~/components/export-to.vue";

// Router and stores
const router = useRouter();
const productStore = useProductStore();
const notification = useNotification();

// State
const showFilter = ref(false);
const isDeleteModalOpen = ref(false);
const isSuccessModalOpen = ref(false);
const selectedProduct = ref<Product | null>(null);

// Computed
const products = computed(() => productStore.products);
const pagination = computed(() => productStore.pagination);
const filter = computed(() => productStore.filter);
const isLoading = computed(() => productStore.isLoading);

// Table columns configuration
// Table columns configuration
const columns = [
  { key: "id", label: "ID Produk" },
  { key: "agentId", label: "ID Agent" },
  { 
    key: "photo", 
    label: "Foto Produk",
    render: (value: string) => ({
      component: "img",
      src: value,
      class: "w-10 h-10 object-cover rounded"
    })
  },
  { key: "serialNumber", label: "Nomor Seri" },
  { key: "productName", label: "Nama Produk" },
  { key: "model", label: "Model Produk" },
  { key: "maxWeight", label: "Max Berat" },
  { key: "batteryLife", label: "Daya Baterai" },
  { key: "stock", label: "Stok Barang" },
  {
    key: "status",
    label: "Status Produk",
    render: (value: string) => {
      const statusClasses: Record<string, string> = {
        tersedia: "bg-green-100 text-green-800",
        rusak: "bg-red-100 text-red-800",
        disewa: "bg-blue-100 text-blue-800",
        perbaikan: "bg-yellow-100 text-yellow-800",
        tersewa: "bg-purple-100 text-purple-800"
      };
      return {
        component: "span",
        class: `px-2 py-1 rounded-md text-xs font-medium ${
          statusClasses[value.toLowerCase()] || ""
        }`,
        text: value.charAt(0).toUpperCase() + value.slice(1),
      };
    },
  },
  { key: "actions", label: "Aksi" }
];

// Export columns
// Export columns
const exportColumns = computed(() => {
  return [
    { key: "id", header: "ID Produk" },
    { key: "agentId", header: "ID Agent" },
    { key: "photo", header: "Foto Produk" },
    { key: "serialNumber", header: "Nomor Seri" },
    { key: "productName", header: "Nama Produk" },
    { key: "model", header: "Model Produk" },
    { key: "maxWeight", header: "Max Berat" },
    { key: "batteryLife", header: "Daya Baterai" },
    { key: "stock", header: "Stok Barang" },
    { key: "status", header: "Status Produk" }
  ];
});
// Export data
const exportData = computed(() => {
  return products.value.map(product => {
    const exportProduct = { ...product };
    if (exportProduct.status) {
      exportProduct.status = exportProduct.status.charAt(0).toUpperCase() + exportProduct.status.slice(1);
    }
    return exportProduct;
  });
});

// Methods
const applyFilter = (newFilter: Partial<ProductFilter>) => {
  productStore.setFilter(newFilter);
};

const resetFilter = () => {
  productStore.resetFilter();
  showFilter.value = false;
};

const handlePageChange = (page: number) => {
  productStore.setFilter({ page });
};

const handleAction = async ({ type, row }: { type: string; row: Product }) => {
  const product = row;

  switch (type) {
    case "view":
      await router.push(`/admin/product/${product.id}`);
      break;
    case "edit":
      await router.push(`/admin/product/${product.id}/edit`);
      break;
    case "delete":
      selectedProduct.value = product;
      isDeleteModalOpen.value = true;
      break;
  }
};

// Confirm delete handler
const confirmDelete = async () => {
  if (selectedProduct.value) {
    try {
      await productStore.deleteProduct(selectedProduct.value.id);
      isDeleteModalOpen.value = false;
      isSuccessModalOpen.value = true;
      setTimeout(() => {
        isSuccessModalOpen.value = false;
      }, 2000);
    } catch (error) {
      console.error("Error deleting product:", error);
      isDeleteModalOpen.value = false;
    }
  }
};

// Lifecycle
onMounted(async () => {
  try {
    await productStore.loadProducts();
  } catch (error) {
    console.error("Error loading products:", error);
  }
});
</script>