<template>
  <div
    class="rounded-lg border bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950"
  >
    <div
      class="flex items-center justify-between border-b p-4 dark:border-gray-800"
    >
      <h3 class="font-semibold">{{ title }}</h3>
      <div class="flex items-center gap-2">
        <div class="relative">
          <SearchIcon
            class="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400"
          />
          <input
            type="search"
            placeholder="Search..."
            class="w-full rounded-md border border-gray-200 bg-gray-50 py-2 pl-8 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-50"
          />
        </div>
        <button
          @click="$emit('add')"
          class="rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          Add {{ itemName }}
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr
            class="border-b bg-gray-50 text-left text-sm font-medium text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400"
          >
            <th v-for="column in columns" :key="column" class="px-4 py-3">
              {{ column }}
            </th>
            <th class="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y dark:divide-gray-800">
          <tr
            v-for="(item, index) in data"
            :key="index"
            class="text-sm text-gray-700 dark:text-gray-300"
          >
            <td v-for="column in columns" :key="column" class="px-4 py-3">
              <div v-if="column === 'status'">
                <StatusBadge :status="item.status ?? ''" />
              </div>
              <div v-else>
                {{ item[column] }}
              </div>
            </td>

            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <button
                  @click="$emit('edit', item)"
                  class="rounded-md bg-gray-100 p-1.5 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  <Edit class="h-5 w-5 text-gray-500" />
                </button>
                <button
                  @click="$emit('delete', item)"
                  class="rounded-md bg-gray-100 p-1.5 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  <Trash class="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div
      class="flex items-center justify-between border-t p-4 dark:border-gray-800"
    >
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Showing <span class="font-medium">1</span> to
        <span class="font-medium">{{ Math.min(10, data.length) }}</span> of
        <span class="font-medium">{{ data.length }}</span> results
      </p>
      <div class="flex items-center gap-2">
        <button
          class="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400 dark:hover:bg-gray-900"
        >
          Previous
        </button>
        <button
          class="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400 dark:hover:bg-gray-900"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Edit, Trash } from "lucide-vue-next";
import StatusBadge from "../dashboard/status-badge.vue";

interface DataItem {
  [key: string]: string | number | boolean | undefined;
  status?: string;
}

// Define props dengan penggunaan eksplisit
const props = defineProps<{
  title: string;
  itemName: string;
  columns: string[]; // Sudah benar diubah jadi string[]
  data: DataItem[];
}>();

// Untuk sementara, supaya tidak muncul warning unused props:
console.log(props.title, props.itemName, props.columns, props.data);

// const emit = defineEmits<{
//   (e: "add"): void;
//   (e: "edit", item: DataItem): void;
//   (e: "delete", item: DataItem): void;
// }>();

// // Untuk sementara juga agar tidak warning unused emit:
// console.log(emit);
</script>
