<template>
  <div
    class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 z-10"
  >
    <NuxtLink
      to="/"
      class="flex flex-col items-center justify-center w-1/3 h-full"
      :class="{ 'text-orange-500': currentRoute === '/' }"
    >
      <Icon name="mdi:home" class="h-5 w-5" />
      <span class="text-xs mt-1">Beranda</span>
    </NuxtLink>

    <NuxtLink
      to="/transactions"
      class="flex flex-col items-center justify-center w-1/3 h-full"
      :class="{ 'text-orange-500': currentRoute === '/transactions' }"
    >
      <Icon name="mdi:clipboard-list" class="h-5 w-5" />
      <span class="text-xs mt-1">Transaksi</span>
    </NuxtLink>

    <NuxtLink
      to="/account"
      class="flex flex-col items-center justify-center w-1/3 h-full"
      :class="{ 'text-orange-500': currentRoute === '/account' }"
    >
      <Icon name="mdi:account" class="h-5 w-5" />
      <span class="text-xs mt-1">Akun</span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const currentRoute = computed(() => {
  return route.path;
});
</script>
