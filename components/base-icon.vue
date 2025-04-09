<template>
    <Icon :name="name" class="w-12 h-12 text-current" />
  </template>
  
  <script setup lang="ts">
  defineProps<{
    name: string;
  }>();
  </script>
  