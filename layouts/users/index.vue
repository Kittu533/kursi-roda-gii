<template>
  <div class="min-h-screen bg-gray-50 font-poppins">
    <div class="max-w-md mx-auto bg-white min-h-screen relative">
      <!-- Status Bar -->
      <div
        class="bg-white p-2 flex justify-between items-center text-xs text-gray-500"
      >
        <div class="flex items-center space-x-1">
          <Icon name="lucide:signal" class="h-3 w-3" />
          <Icon name="lucide:wifi" class="h-3 w-3" />
          <Icon name="lucide:battery-full" class="h-3 w-3" />
        </div>
      </div>

      <!-- Main Content -->
      <slot />
      
    </div>
   
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

const currentTime = ref("9:41");

const updateTime = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  currentTime.value = `${hours}:${minutes.toString().padStart(2, "0")}`;
};

let timeInterval: number | null = null;

onMounted(() => {
  updateTime();
  timeInterval = window.setInterval(updateTime, 60000);
});

onBeforeUnmount(() => {
  if (timeInterval !== null) {
    clearInterval(timeInterval);
  }
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.font-poppins {
  font-family: 'Poppins', sans-serif;
}


</style>

