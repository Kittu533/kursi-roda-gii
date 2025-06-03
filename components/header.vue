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
      <div
        class="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white"
      >
        <img src="/logo-monitoring.webp" class="w-8 h-8" alt="Logo" />
      </div>
      <span class="font-semibold">Wheel Care</span>
    </div>

    <div class="ml-auto flex items-center gap-4">
      <!-- User profile section with dropdown -->
      <div class="relative">
        <button
          @click="isDropdownOpen = !isDropdownOpen"
          class="flex items-center gap-2 focus:outline-none"
          type="button"
        >
          <img
            :src="user.avatar"
            alt="User avatar"
            class="h-9 w-9 sm:w-10 sm:h-10 rounded-full border border-gray-200 object-cover"
          />
          <div class="hidden md:block">
            <p class="text-sm font-medium leading-none">{{ user.name }}</p>
            <p class="text-xs text-muted-foreground mt-1">{{ user.role }}</p>
          </div>
          <NuxtIcon name="material-symbols:keyboard-arrow-down" class="h-4 w-4 text-muted-foreground" />
        </button>

        <!-- Dropdown menu -->
        <div
          v-if="isDropdownOpen"
          class="absolute right-0 mt-2 w-56 rounded-md border bg-background shadow-md z-50"
        >
          <div class="p-2">
            <!-- User info in dropdown (visible on mobile) -->
            <div class="flex items-center gap-2 p-2 md:hidden">
              <p class="text-sm font-medium">{{ user.name }}</p>
              <p class="text-xs text-muted-foreground">{{ user.role }}</p>
            </div>

            <div class="flex flex-col space-y-1">
              <a
                href="#profile"
                class="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent"
              >
                <NuxtIcon name="material-symbols:person" class="h-4 w-4" />
                <span>Profile</span>
              </a>
              <a
                href="#settings"
                class="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent"
              >
                <NuxtIcon name="material-symbols:settings" class="h-4 w-4" />
                <span>Settings</span>
              </a>
            </div>

            <div class="my-1 h-px bg-border"></div>

            <button
              @click="handleLogout"
              class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-500 hover:bg-accent"
            >
              <NuxtIcon name="material-symbols:logout" class="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import {
  MenuIcon,
  ChevronDownIcon,
  UserIcon,
  SettingsIcon,
  LogOutIcon,
} from "lucide-vue-next";

interface User {
  avatar: string;
  name: string;
  role: string;
}

defineProps<{
  user: User;
}>();

const emit = defineEmits<{
  (e: "toggle-sidebar"): void;
  (e: "logout"): void;
}>();

// Dropdown state
const isDropdownOpen = ref(false);

// Close dropdown when clicking outside
function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (isDropdownOpen.value && !target.closest(".relative")) {
    isDropdownOpen.value = false;
  }
}

// Logout function
function handleLogout() {
  isDropdownOpen.value = false;
  emit("logout");
}

// Add and remove event listener
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
