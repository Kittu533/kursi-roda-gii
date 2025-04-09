<!-- components/dashboard/AdminHeader.vue -->
<template>
  <header
    class="flex h-14 items-center gap-4 border-b bg-white px-4 dark:border-gray-800 dark:bg-gray-950"
  >
    <div class="relative ml-auto">
      <search-icon
        class="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400"
      />
      <input
        type="search"
        placeholder="Search..."
        class="w-full rounded-md border border-gray-200 bg-gray-50 py-2 pl-8 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-50"
      />
    </div>
    <div class="flex items-center gap-2">
      <button
        class="rounded-full bg-gray-100 p-1.5 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
      >
        <bell-icon class="h-5 w-5" />
      </button>
      <button
        class="rounded-full bg-gray-100 p-1.5 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
      >
        <user-icon class="h-5 w-5" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
const bellIcon = {
  /* ... */
};
const userIcon = {
  /* ... */
};
const searchIcon = {
  /* ... */
};

// Tidak ada state, murni UI
</script>
