<template>
  <router-link
    :to="item.href"
    class="group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors"
    :class="[
      active
        ? 'bg-accent text-accent-foreground font-semibold'
        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
      isSidebarOpen ? '' : 'justify-center'
    ]"
  >
    <component
      :is="item.icon"
      class="h-4 w-4 flex-shrink-0"
      :class="{ 'mr-2': isSidebarOpen }"
      v-if="item.icon"
    />
    <span 
      v-if="isSidebarOpen" 
      class="truncate transition-opacity"
    >
      {{ item.name }}
    </span>
    <span v-else class="sr-only">{{ item.name }}</span>
  </router-link>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import type { LucideIcon } from 'lucide-vue-next';

interface NavigationItem {
  name: string;
  href: string;
  icon?: Component | LucideIcon;
}

const props = withDefaults(defineProps<{
  item: NavigationItem;
  active?: boolean;
  isSidebarOpen?: boolean;
}>(), {
  active: false,
  isSidebarOpen: true
});
</script>