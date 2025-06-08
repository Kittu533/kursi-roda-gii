<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">{{ title }}</h2>
      </div>
      <slot name="header-actions"></slot>
    </div>

    <!-- Breadcrumb Navigation -->
    <div class="flex items-center space-x-2 text-sm">
      <NuxtLink to="/" class="text-muted-foreground hover:text-foreground">
        <HomeIcon class="w-4 h-4" />
      </NuxtLink>
      <template v-for="(crumb, index) in breadcrumbs" :key="index">
        <ChevronRightIcon class="w-4 h-4 text-muted-foreground" />
        <template v-if="crumb.to">
          <NuxtLink :to="crumb.to" class="text-muted-foreground hover:text-foreground">
            {{ crumb.text }}
          </NuxtLink>
        </template>
        <template v-else>
          <span>{{ crumb.text }}</span>
        </template>
      </template>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-red-100 p-4 rounded-md text-red-800">
      {{ error }}
    </div>

    <!-- Data Card -->
    <div v-else-if="!loading && !error && data" class="bg-white border rounded-md overflow-hidden">
      <div class="p-4 border-b">
        <h3 class="text-lg font-medium">{{ cardTitle }}</h3>
      </div>
      <div class="p-4">
        <slot name="before-table"></slot>
        <div class="rounded-md border">
          <table class="w-full">
            <tbody>
              <tr v-for="(field, index) in fields" :key="index" class="border-b last:border-b-0">
                <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                  {{ field.label }}
                </td>
                <td class="w-2/3 px-4 py-3">
                  <slot :name="`field-${field.key}`" :field="field" :data="data">
                    <template v-if="field.format && getNestedValue(data, field.key) !== undefined">
                      {{ field.format(getNestedValue(data, field.key)) }}
                    </template>
                    <template v-else-if="field.type === 'status'">
                      <span class="px-2 py-1 rounded-md text-xs font-medium">
                        {{ formatStatus(getNestedValue(data, field.key)) }}
                      </span>
                    </template>
                    <template v-else-if="field.type === 'currency' && field.format">
                      {{ field.format(getNestedValue(data, field.key)) }}
                    </template>
                    <template v-else-if="field.type === 'currency'">
                      Rp{{ formatCurrency(getNestedValue(data, field.key)) }}
                    </template>
                    <template v-else>
                      {{ getNestedValue(data, field.key) }}
                    </template>
                  </slot>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <slot name="after-table"></slot>
      </div>
    </div>
    <div v-else-if="!loading && !error && !data" class="bg-white border rounded-md overflow-hidden p-4">
      <p class="text-center text-muted-foreground">No data available</p>
    </div>

    <!-- Action Buttons -->
    <div v-if="!loading && !error && data" class="flex justify-end mt-6 gap-2">
      <slot name="actions">
        <!-- filepath: d:\js\nuxt\kursi-roda-gii\components\detail-view.vue -->
        <button v-if="showBackButton" class="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
          @click="$emit('back')">
          {{ backButtonText }}
        </button>
        <!-- <button 
            v-if="showSaveButton"
            class="bg-[#4072EE] text-white px-4 py-2 rounded-md hover:bg-[#3060DD]"
            @click="$emit('save')"
          >
            {{ saveButtonText }}
          </button> -->
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HomeIcon, ChevronRightIcon } from 'lucide-vue-next'

interface Breadcrumb {
  text: string;
  to?: string;
}

type FieldType = 'text' | 'status' | 'date' | 'currency' | 'custom';
type FieldValue = string | number | boolean | null | undefined;

interface Field {
  key: string;
  label: string;
  formatter?: (value: FieldValue) => string;
  type?: FieldType;
}

// Generic type for data object
interface DataObject {
  [key: string]: FieldValue | DataObject;
}

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  cardTitle: {
    type: String,
    required: true
  },
  breadcrumbs: {
    type: Array as () => Breadcrumb[],
    default: () => []
  },
  fields: {
    type: Array as () => Field[],
    required: true
  },
  data: {
    type: Object as () => DataObject | null,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  showBackButton: {
    type: Boolean,
    default: true
  },
  backButtonText: {
    type: String,
    default: 'Kembali'
  },
  showSaveButton: {
    type: Boolean,
    default: true
  },
  saveButtonText: {
    type: String,
    default: 'Simpan'
  }
})

const emit = defineEmits(['save', 'back'])

// Helper function to get nested object values using dot notation
const getNestedValue = (obj: DataObject | null, path: string): FieldValue => {
  if (!obj) return '';

  return path.split('.').reduce((prev: any, curr: string) => {
    return prev && prev[curr] !== undefined ? prev[curr] : '';
  }, obj);
}

// Format status by capitalizing first letter
const formatStatus = (status: FieldValue): string => {
  if (typeof status !== 'string') return '';
  return status.charAt(0).toUpperCase() + status.slice(1);
}

// Format currency
const formatCurrency = (value: FieldValue): string => {
  if (typeof value !== 'number') return '0';
  return value.toLocaleString('id-ID');
}
</script>