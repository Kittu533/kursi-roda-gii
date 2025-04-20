<template>
  <div class="bg-white p-4 rounded-md border mb-6">
    <div class="flex flex-col md:flex-row gap-4">
      <!-- Status Filter -->
      <div class="w-full md:w-1/3">
        <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          v-model="localFilter.status"
          class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
          @change="applyFilter"
        >
          <option value="">Semua</option>
          <option value="aktif">Aktif</option>
          <option value="nonaktif">Nonaktif</option>
          <option value="menunggu">Menunggu</option>
          <option value="dibatalkan">Dibatalkan</option>
        </select>
      </div>

      <!-- Date Filter -->
      <div class="w-full md:w-1/3">
        <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
        <input
          v-model="localFilter.date"
          type="date"
          class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
          @change="applyFilter"
        />
      </div>

      <!-- Reset Button -->
      <div class="w-full md:w-1/3 flex items-end">
        <button
          @click="resetFilter"
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          Reset Filter
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import type { CustomerFilter } from "~/types/customer"

const props = defineProps<{
  filter: CustomerFilter
}>()

const emit = defineEmits<{
  (e: "update:filter", filter: CustomerFilter): void
  (e: "reset"): void
}>()

// Create a local copy of the filter
const localFilter = ref<CustomerFilter>({ ...props.filter })

// Watch for external filter changes
watch(
  () => props.filter,
  (newFilter) => {
    localFilter.value = { ...newFilter }
  },
  { deep: true },
)

// Apply filter changes
const applyFilter = () => {
  emit("update:filter", { ...localFilter.value })
}

// Reset filter
const resetFilter = () => {
  emit("reset")
}

</script>