<template>
    <div class="flex items-center p-3 border-b border-gray-100">
      <div class="bg-orange-100 rounded-full p-2 mr-3">
        <Icon name="mdi:map-marker" class="text-orange-500 h-5 w-5" />
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