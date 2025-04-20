<template>
  <DetailView
    title="Data Pengembalian"
    card-title="Data Pengembalian"
    :breadcrumbs="breadcrumbs"
    :fields="fields"
    :data="returnItem"
    :loading="isLoading"
    :error="error"
    @back="router.push('/admin/return')"
    @save="router.push(`/admin/return/${returnItem?.id}/edit`)"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useReturnStore } from "~/store/return";
import DetailView from "~/components/detail-view.vue";

// Router
const route = useRoute();
const router = useRouter();
const returnId = ref(route.params.id as string);

// Store
const returnStore = useReturnStore();
const returnItem = computed(() => returnStore.selectedReturn);
const isLoading = computed(() => returnStore.isLoading);
const error = computed(() => returnStore.error);

// Format currency
const formatCurrency = (value: number): string => {
  return value.toLocaleString("id-ID");
};

// Breadcrumbs
const breadcrumbs = [
  { text: "Pengembalian", to: "/admin/return" },
  { text: "Detail" },
];

// Fields configuration
const fields = [
  { key: "id", label: "ID Pengembalian" },
  { key: "transactionId", label: "ID Transaksi" },
  { key: "customerId", label: "ID Pelanggan" },
  { key: "amount", label: "Jumlah", type: "currency" },
  { key: "reason", label: "Alasan" },
  { key: "status", label: "Status", type: "status" },
  { key: "createdAt", label: "Tanggal Di buat" },
  { key: "updatedAt", label: "Terakhir Diperbaharui" },
];

// Lifecycle
onMounted(async () => {
  if (returnId.value) {
    try {
      await returnStore.loadReturnDetails(returnId.value);
    } catch (error) {
      console.error("Error loading return details:", error);
    }
  }
});
</script>
