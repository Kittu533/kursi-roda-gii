<template>
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon name="mdi:magnify" class="h-4 w-4 text-gray-400" />
      </div>
      <input
        type="text"
        :placeholder="placeholder"
        class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        v-model="searchQuery"
        @input="onInput"
      />
      <button 
        v-if="searchQuery" 
        @click="clearSearch"
        class="absolute inset-y-0 right-0 pr-3 flex items-center"
      >
        <Icon name="mdi:close" class="h-4 w-4 text-gray-400" />
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue';
  
  const props = defineProps<{
    modelValue: string;
    placeholder?: string;
  }>();
  
  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
  }>();
  
  const searchQuery = ref(props.modelValue);
  
  watch(() => props.modelValue, (newValue) => {
    searchQuery.value = newValue;
  });
  
  const onInput = () => {
    emit('update:modelValue', searchQuery.value);
  };
  
  const clearSearch = () => {
    searchQuery.value = '';
    emit('update:modelValue', '');
  };
  </script>