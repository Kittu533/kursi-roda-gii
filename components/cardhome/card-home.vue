<!-- components/CardHome.vue -->
<template>
  <div
    :class="
      horizontal
        ? 'flex items-start space-x-4'
        : 'flex flex-col items-center flex-wrap'
    "
  >
    <component :is="iconComponent" class="w-6 h-6 text-blue-600" />
    <div :class="textContainerClass">
      <h3 class="font-semibold text-[18px] mb-1">{{ title }}</h3>
      <p class="text-sm text-gray-500">{{ description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">


const props = defineProps<{
  icon: string;
  title: string;
  description: string;
  horizontal?: boolean;
  iconComponent: Object;
}>();

const iconContainerClass = computed(() =>
  props.horizontal
    ? "bg-blue-100 text-blue-600 p-4 rounded-xl"
    : "text-blue-500 bg-blue-200 p-8 rounded-xl mb-4"
);

const textContainerClass = computed(() =>
  props.horizontal ? "flex flex-col justify-center" : "text-center"
);
</script>
