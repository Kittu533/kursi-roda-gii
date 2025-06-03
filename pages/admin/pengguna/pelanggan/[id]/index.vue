<template>
  <DetailView
    title="Pelanggan - detail"
    card-title="Data Pelanggan"
    :breadcrumbs="breadcrumbs"
    :fields="fields"
    :data="customerData"
    :loading="isLoading"

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
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useCustomerStore } from "~/store/customer";
import { formatGender, formatStatus, getStatusClass } from "~/utils/formatters";
import type { Customer } from "~/types/customer";

const route = useRoute();

const customerId = computed(() => route.params.id as string);
const customerStore = useCustomerStore();
const customer = computed<Customer | null>(() => customerStore.selectedCustomer);

const customerData = computed(() => (customer.value ? { ...customer.value } : null));
const isLoading = computed(() => customerStore.isLoading);

const breadcrumbs = [
  { text: "Pelanggan", to: "/admin/pengguna/pelanggan" },
  { text: "Detail" }
];

const fields = [
  { key: "id", label: "ID Pelanggan" },
  { key: "full_name", label: "Nama Lengkap" },
  { key: "phone", label: "Nomor Telepon" },
  { key: "email", label: "Email" },
  {
    key: "gender",
    label: "Jenis Kelamin",
    formatter: (val: string) => formatGender(val),
  },
  {
    key: "status",
    label: "Status",
    formatter: (val: { status: string }) => formatStatus(val?.status),
  },
];

onMounted(async () => {
  if (customerId.value) {
    try {
      await customerStore.getCustomerDetail(customerId.value);
    } catch (err) {
      console.error("Gagal memuat detail pelanggan:", err);
    }
  }
});
</script>