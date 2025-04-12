<template>
    <div class="bg-white rounded-lg overflow-hidden shadow-sm mb-4">
      <div class="relative">
        <img :src="voucher.imageUrl" alt="Voucher" class="w-full h-32 object-cover" />
        <div class="absolute inset-0 bg-gradient-to-r from-orange-500/80 to-transparent p-4 flex flex-col justify-between">
          <div>
            <h3 class="font-bold text-white text-lg">VOUCHER DISKON</h3>
            <p class="text-white text-xs">{{ voucher.description }}</p>
          </div>
          <div class="text-white text-3xl font-bold">{{ voucher.discountPercentage }}%</div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import type { Voucher } from '~/types';
  
  defineProps<{
    voucher: Voucher;
  }>();
  </script>