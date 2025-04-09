<template>
  <!-- Outer container with fixed width and no horizontal overflow -->
  <div class="flex h-screen w-screen overflow-x-hidden bg-gray-50">
    <!-- Main container with max-width -->
    <div class="flex h-screen w-full max-w-screen mx-auto relative">
      <!-- Sidebar - Always visible on tablet and up -->
      <Sidebar 
        :is-open="isSidebarOpen" 
        :show-toggle="true"
        @toggle="toggleSidebar" 
      />

      <!-- Main Content - Constrained width to prevent overflow -->
      <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
        <!-- Header -->
        <Header 
          @toggle-sidebar="toggleSidebar" 
          :user="user" 
        />

        <!-- Page Content - Scrollable container with overflow control -->
        <main class="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 w-full">
          <div class="p-4 md:p-6">
            <slot />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

// Initialize with a default value for SSR
const isSidebarOpen = ref(true);

// User data
const user = ref({
  name: "Selamat Datang",
  role: "Administrator",
  avatar: "/avatar.webp",
});

// Update sidebar state based on screen size after component is mounted
onMounted(() => {
  // Set initial state based on screen size
  updateSidebarState();
  
  // Add event listener to handle resize
  const handleResize = () => {
    updateSidebarState();
  };
  
  function updateSidebarState() {
    // Always show sidebar on tablet and larger (768px+)
    // Only auto-close on mobile
    if (window.innerWidth < 768) {
      isSidebarOpen.value = false;
    } else {
      isSidebarOpen.value = true;
    }
  }
  
  // Add resize listener with debounce
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(handleResize, 100);
  });
});

// Toggle sidebar function
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
</script>

<style>
* {
  font-family: "Poppins", sans-serif;
}

/* Prevent scrolling on the body */
body {
  background-color: #f8fafc;
  margin: 0;
  padding: 0;
  overflow: hidden;
  height: 100vh;
  width: 100vw;
  max-width: 100vw;
}

html {
  overflow: hidden;
  max-width: 100vw;
}

/* Fix for mobile Safari height issues */
@supports (-webkit-touch-callout: none) {
  .h-screen {
    height: -webkit-fill-available;
  }
}
</style>