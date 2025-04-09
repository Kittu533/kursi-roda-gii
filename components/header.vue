<template>
  <header
    class="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6"
  >
    <!-- Add sidebar toggle button for mobile -->
    <button 
      @click="$emit('toggle-sidebar')" 
      class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-9 w-9 p-0 md:hidden"
      type="button"
    >
      <MenuIcon class="h-5 w-5" />
      <span class="sr-only">Toggle sidebar</span>
    </button>
    
    <!-- Logo for mobile -->
    <div class="flex items-center gap-2 md:hidden">
      <div class="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white">
        <img src="/logo-monitoring.webp" class="w-8 h-8" alt="Logo" />
      </div>
      <span class="font-semibold">Wheel Care</span>
    </div>

    <div class="ml-auto flex items-center gap-4">
      <!-- User profile section -->
      <div class="flex items-center gap-2">
        <img
          :src="user.avatar"
          alt="User avatar"
          class="h-9 w-9 sm:w-10 sm:h-10 rounded-full border border-gray-200 object-cover"
        />
        <div class="hidden md:block">
          <p class="text-sm font-medium leading-none">{{ user.name }}</p>
          <p class="text-xs text-muted-foreground mt-1">{{ user.role }}</p>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { MenuIcon } from "lucide-vue-next";

interface User {
  avatar: string;
  name: string;
  role: string;
}

defineProps<{
  user: User;
}>();

defineEmits<{
  (e: "toggle-sidebar"): void;
}>();
</script>