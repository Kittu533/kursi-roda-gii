<template>
  <div class="space-y-1">
    <h3
      v-if="resolvedTitle && isOpen"
      class="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider transition-opacity"
      :class="{ 'opacity-0': !isOpen }"
    >
      {{ resolvedTitle }}
    </h3>
    <div class="space-y-1">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Define props
const props = defineProps<{
  title?: string;
  isOpen?: boolean;
}>();

// Handle default values
const resolvedTitle = computed(() => props.title || '');
const isOpen = computed(() => props.isOpen ?? true);
</script>