<template>
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-950">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold">{{ title }}</h3>
          <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <XIcon class="h-5 w-5" />
          </button>
        </div>
        <div class="grid gap-4">
          <div v-for="field in fields" :key="field.name">
            <label :for="field.name" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ field.label }}
            </label>
            <input
              v-if="field.type === 'text' || field.type === 'email' || field.type === 'number'"
              :type="field.type"
              :id="field.name"
              :name="field.name"
              v-model="formData[field.name]"
              class="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
            />
            <select
              v-else-if="field.type === 'select'"
              :id="field.name"
              :name="field.name"
              v-model="formData[field.name]"
              class="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
            >
              <option v-for="option in field.options" :key="option" :value="option">{{ option }}</option>
            </select>
          </div>
        </div>
        <div class="mt-6 flex justify-end gap-2">
          <button
            @click="$emit('close')"
            class="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 dark:hover:bg-gray-900"
          >
            Cancel
          </button>
          <button
            @click="$emit('save', formData)"
            class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { watch } from 'vue';
  import type { Ref } from 'vue';
  import { XIcon } from '../icon';
  
  interface Field {
    name: string;
    label: string;
    type: string;
    options?: string[];
  }
  
  const props = defineProps<{
    show: boolean;
    title: string;
    fields: Field[];
    initialData: Record<string, any>;
  }>();
  
  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'save', formData: Record<string, any>): void;
  }>();
  
  const formData = ref({ ...props.initialData });
  
  // Update form data when initialData changes
  watch(
    () => props.initialData,
    (newValue) => {
      formData.value = { ...newValue };
    },
    { deep: true }
  );
  
  // Reset form when modal is closed
  watch(
    () => props.show,
    (newValue) => {
      if (!newValue) {
        formData.value = { ...props.initialData };
      }
    }
  );
  </script>