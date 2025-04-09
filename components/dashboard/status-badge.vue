<template>
  <span
    :class="[
      'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
      status === 'Active'
        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
        : status === 'Inactive'
        ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
        : status === 'Rented'
        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
        : status === 'Available'
        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
        : status === 'Maintenance'
        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
        : status === 'Expired'
        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
        : status === 'Returned'
        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    ]"
  >
    {{ status }}
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{
  status: string;
}>();
</script>
