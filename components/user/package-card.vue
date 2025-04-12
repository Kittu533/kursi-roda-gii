<template>
    <div class="bg-white rounded-lg overflow-hidden shadow-sm mb-4">
      <div class="flex">
        <div class="w-24 h-24 flex-shrink-0">
          <img :src="packageItem.imageUrl" alt="Package" class="w-full h-full object-cover" />
        </div>
        <div class="p-3 flex-1">
          <h3 class="font-medium text-sm">{{ packageItem.name }}</h3>
          <p class="text-xs text-gray-500">{{ packageItem.timeRange }}</p>
          <div class="mt-1">
            <span class="text-xs line-through text-gray-400">Rp.{{ formatPrice(packageItem.originalPrice) }}</span>
            <div class="font-bold text-sm text-orange-500">Rp.{{ formatPrice(packageItem.discountedPrice) }}</div>
          </div>
        </div>
        <div class="p-3 flex items-end">
          <button 
            class="px-4 py-1 bg-orange-500 text-white text-xs rounded-full"
            @click="$emit('book', packageItem)"
          >
            Pesan
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import type { Package } from '~/types';
  
  defineProps<{
    packageItem: Package;
  }>();
  
  defineEmits<{
    (e: 'book', packageItem: Package): void;
  }>();
  
  const formatPrice = (price: number): string => {
    return price.toLocaleString('id-ID');
  };
  </script>