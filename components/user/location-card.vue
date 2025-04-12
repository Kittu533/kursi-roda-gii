<template>
    <div 
      class="flex items-center p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
      @click="$emit('select', location)"
    >
      <div class="bg-orange-100 rounded-full p-2 mr-3">
        <Icon name="mdi:map-marker" class="text-orange-500 h-5 w-5" />
      </div>
      <div class="flex-1">
        <h3 class="font-medium text-sm">{{ location.name }}</h3>
        <p class="text-xs text-gray-500 line-clamp-1">{{ location.address }}</p>
      </div>
      <div v-if="location.distance !== undefined" class="text-xs text-gray-400">
        {{ location.distance }} {{ location.distance === 1 ? 'KM' : 'KM' }}
      </div>
    </div>
  </template>
<script setup lang="ts">
import type { Location } from "~/types";

defineProps<{
  location: Location;
}>();

defineEmits<{
  (e: "select", location: Location): void;
}>();
</script>
