<template>
  <DetailView
    title="Pelanggan - detail"
    card-title="Data Pelanggan"
    :breadcrumbs="breadcrumbs"
    :fields="fields"
    :data="customerData"
    :loading="isLoading"
    :error="error"
    @save="saveCustomer"
  >
    <template v-if="customerData" #field-status="{ data }">
      <span
        :class="`px-2 py-1 rounded-md text-xs font-medium ${getStatusClass(data.status.status)}`"
      >
        {{ formatStatus(data.status.status) }}
      </span>
    </template>
  </DetailView>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCustomerStore } from "~/store/customer";
import { formatGender, formatStatus, getStatusClass } from "~/utils/formatters";
import type { Customer } from "~/composables/consume-api/customer.api";

// Router
const route = useRoute();
const router = useRouter();
const customerId = computed(() => route.params.id as string);

// Store
const customerStore = useCustomerStore();
const customer = computed<Customer | null>(
  () => customerStore.selectedCustomer
);
const customerData = computed(() =>
  customer.value ? { ...customer.value } : null
);
const isLoading = computed(() => customerStore.isLoading);
const error = computed(() => customerStore.error);

// Breadcrumbs
const breadcrumbs = [
  { text: "Pengguna", to: "/admin/pengguna" },
  { text: "Pelanggan", to: "/admin/pengguna/pelanggan" },
];

// Fields configuration
const fields = [
  { key: "id", label: "ID Pelanggan" },
  { key: "full_name", label: "Nama Lengkap" },
  { key: "phone", label: "Nomor Telepon" },
  { key: "email", label: "Email" },
  {
    key: "gender",
    label: "Gender",
    formatter: formatGender,
  },
  { key: "created_at", label: "Akun dibuat" },
  { key: "updated_at", label: "Akun diperbarui" },
  {
    key: "status",
    label: "Status",
    type: "status" as const,
    formatter: (status: { status: string }) => formatStatus(status.status),
    getStatusClass: (status: { status: string }) =>
      getStatusClass(status.status),
  },
];

// Save method
const saveCustomer = async () => {
  if (customer.value) {
    try {
      // Note: updateCustomer method needs to be added to the store
      // For now this is a placeholder
      console.log("Would update customer:", customer.value);
      await router.push("/admin/pengguna/pelanggan");
    } catch (error) {
      console.error("Error saving customer:", error);
    }
  }
};

// Lifecycle
onMounted(async () => {
  if (customerId.value) {
    try {
      await customerStore.getCustomerDetail(customerId.value);
    } catch (error) {
      console.error("Error loading customer details:", error);
    }
  }
});
</script>
