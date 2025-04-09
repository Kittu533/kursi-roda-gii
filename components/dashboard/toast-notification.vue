<template>
    <div
      class="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-lg bg-white p-4 shadow-lg dark:bg-gray-950"
      :class="{
        'border-l-4 border-green-500': type === 'success',
        'border-l-4 border-red-500': type === 'error',
        'border-l-4 border-blue-500': type === 'info',
        'border-l-4 border-yellow-500': type === 'warning'
      }"
    >
      <CheckCircleIcon v-if="type === 'success'" class="h-5 w-5 text-green-500" />
      <AlertCircleIcon v-if="type === 'error'" class="h-5 w-5 text-red-500" />
      <AlertCircleIcon v-if="type === 'info'" class="h-5 w-5 text-blue-500" />
      <AlertCircleIcon v-if="type === 'warning'" class="h-5 w-5 text-yellow-500" />
      <div>
        <h4 class="font-medium">{{ title }}</h4>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ message }}</p>
      </div>
      <button
        @click="$emit('close')"
        class="ml-auto text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
      >
        <XIcon class="h-5 w-5" />
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { CheckCircleIcon, AlertCircleIcon, XIcon } from "../icon";
  
  const props = defineProps<{
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
  }>();
  
  const emit = defineEmits<{
    (e: 'close'): void;
  }>();
  </script>