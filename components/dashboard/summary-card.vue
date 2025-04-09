<template>
  <div
    class="rounded-lg border bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950"
  >
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
          {{ title }}
        </p>
        <h3 class="text-2xl font-bold">{{ value }}</h3>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          <span :class="trend === 'up' ? 'text-green-500' : 'text-red-500'">
            {{ trend === "up" ? "↑" : "↓" }} {{ percentage }}%
          </span>
          vs last month
        </p>
      </div>
      <div class="rounded-full p-2" :class="bgColor">
        <component :is="icon" class="h-5 w-5 text-white"/>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as icons from "../icon";

const props = defineProps<{
  title: string;
  value: string;
  trend?: 'up' | 'down';
  percentage?: string | number;
  icon?: string;
  bgColor?: string;
}>()


const resolveIcon = (iconName: string) => {
  return (icons as Record<string, any>)[iconName] || icons.HomeIcon
}

</script>
