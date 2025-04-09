<template>
  <div class="mb-4 border rounded-lg p-4 bg-white shadow-sm">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-medium">Filter Data</h3>
      <button class="p-1 rounded-full hover:bg-muted" @click="$emit('close')">
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
          class="lucide lucide-x"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
        <span class="sr-only">Close</span>
      </button>
    </div>

    <form @submit.prevent="applyFilter" class="w-full">
      <div class="flex justify-between gap-[30px] flex-wrap flex-1 mx-auto">
        <div class="space-y-2 flex-1">
          <label for="periode" class="text-sm font-medium"
            >Periode Tanggal</label
          >
          <input
            id="periode"
            type="date"
            placeholder="Tanggal"
            v-model="localFilter.date"
            class="w-full px-3 py-1 border rounded-md"
          />
        </div>

        <div class="space-y-2 flex-1">
          <label for="status" class="text-sm font-medium">Pilih Status</label>
          <select
            id="status"
            v-model="localFilter.status"
            class="w-full px-3 py-1 border rounded-md"
          >
            <option value="">Status</option>
            <option value="menunggu">Menunggu</option>
            <option value="aktif">Aktif</option>
            <option value="dibatalkan">Dibatalkan</option>
            <option value="nonaktif">Nonaktif</option>
          </select>
        </div>
        <div class="flex justify-end items-end gap-[30px]">
          <button
            class="bg-[#4072EE] w-[115px] h-[34px] text-white p-[5px 10px 5px 10px] font-normal rounded-[5px] hover:bg-[#3060DD]"
            type="submit"
          >
            Terapkan
          </button>
          <button
            class="border border-red-500 text-red-500 w-[95px] h-[34px] p-[5px 10px 5px 10px] font-normal rounded-[5px] hover:bg-red-50"
            type="button"
            @click="$emit('reset')"
          >
            Batal
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { ProductFilter } from "~/types/product";

// Props and emits
const props = defineProps<{
  filter: ProductFilter;
}>();

const emit = defineEmits<{
  (e: "apply", filter: Partial<ProductFilter>): void;
  (e: "reset"): void;
  (e: "close"): void;
}>();

// Local state
const localFilter = ref({
  status: props.filter.status || "",
  date: props.filter.date || "",
});

// Watch for prop changes
watch(
  () => props.filter,
  (newFilter) => {
    localFilter.value = {
      status: newFilter.status || "",
      date: newFilter.date || "",
    };
  },
  { deep: true }
);

// Methods
const applyFilter = () => {
  emit("apply", {
    status: localFilter.value.status,
    date: localFilter.value.date,
    page: 1, // Reset to first page when applying filter
  });
};
</script>
