<template>
  <div class="flex items-center p-3 border-b border-gray-100">
    <div class="bg-[#FF5F00] rounded-full h-[50px] w-[50px] flex items-center justify-center mr-3">
      <NuxtIcon name="mdi:map-marker" class="text-white" style="width: 30px; height: 30px;" />
    </div>
    <div class="flex-1">
      <h3 class="font-medium text-sm">{{ agent.name }}</h3>
      <p class="text-xs text-gray-500 line-clamp-1">{{ agent.address }}</p>
    </div>
    <div class="text-xs text-gray-400">
      {{ agent.distance }} {{ agent.distanceUnit }}
    </div>
    <button 
      v-if="showActionButton" 
      class="ml-2 px-3 py-1 text-xs bg-orange-500 text-white rounded-full"
      @click="$emit('action', agent)"
    >
      {{ actionLabel }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Agent } from '~/types';

interface Props {
  agent: Agent;
  showActionButton?: boolean;
  actionLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  showActionButton: false,
  actionLabel: 'Lihat'
});

defineEmits<{
  (e: 'action', agent: Agent): void;
}>();
</script>