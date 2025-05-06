<template>
  <div class="bg-white p-4 rounded-md border mb-6">
    <div class="flex flex-col md:flex-row gap-4">
      <template v-for="field in fields" :key="field.key">
        <div class="w-full md:w-1/3">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ field.label }}
          </label>

          <!-- Input tipe SELECT -->
          <select
            v-if="field.type === 'select'"
            v-model="localFilter[field.key]"
            class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
            @change="apply"
          >
            <option value="">Semua</option>
            <option v-for="opt in field.options" :key="opt" :value="opt">
              {{ capitalize(opt) }}
            </option>
          </select>

          <!-- Input tipe TEXT -->
          <input
            v-else-if="field.type === 'text'"
            v-model="localFilter[field.key]"
            type="text"
            class="w-full border rounded-md px-3 py-2"
            @input="apply"
          />

          <!-- Input tipe DATE -->
          <input
            v-else-if="field.type === 'date'"
            v-model="localFilter[field.key]"
            type="date"
            class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
            @change="apply"
          />

          <!-- Default fallback (optional) -->
          <input
            v-else
            v-model="localFilter[field.key]"
            type="text"
            class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
        </div>
      </template>

      <!-- Tombol Reset -->
      <div class="w-full md:w-1/3 flex items-end">
        <button
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          @click="reset"
        >
          Reset Filter
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

interface FilterField {
  key: string;
  label: string;
  type: "text" | "select" | "date";
  options?: string[]; // untuk select
}

const props = defineProps<{
  filter: Record<string, any>;
  fields: FilterField[];
}>();

const emit = defineEmits<{
  (e: "apply", value: Record<string, any>): void;
  (e: "reset"): void;
}>();

const localFilter = ref({ ...props.filter });

watch(
  () => props.filter,
  (newVal) => {
    localFilter.value = { ...newVal };
  },
  { deep: true }
);

const apply = () => {
  emit("apply", { ...localFilter.value });
};

const reset = () => {
  emit("reset");
};

const capitalize = (val: string) => val.charAt(0).toUpperCase() + val.slice(1);
</script>
