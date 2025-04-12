<template>
  <div class="pb-20">
    <!-- Header -->
    <div class="py-[16px] px-[20px] flex items-center">
      <button @click="$router.back()" class="mr-3">
        <!-- Back icon -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <div class="flex-1 flex items-center">
        <div
          class="bg-white border border-[#FF9732] rounded-full h-[36px] w-[36px] flex items-center justify-center mr-3"
        >
          <NuxtIcon name="mdi:map-marker" class="text-gray-500 h-5 w-5" />
        </div>
        <div>
          <p class="text-[14px] font-[400px]">{{ selectedLocation.name }}</p>
          <p class="text-[12px] font-[400px] text-[#FF5F00]">
            {{ selectedLocation.address }}
          </p>
        </div>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="py-[16px] px-[20px]">
      <div class="relative">
        <div
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          <!-- Search icon -->
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <NuxtIcon name="ic:twotone-search" class="text-gray-500 h-5 w-5" />
          </div>
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari lokasi terdekat"
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-[10px] text-sm"
        />
      </div>
    </div>

    <!-- Search Results -->
    <div class="mt-2 py-[16px] px-[20px]">
      <div
        class="border border-gray-200 rounded-[10px]"
        v-if="filteredLocations.length > 0"
      >
        <div
          v-for="location in filteredLocations"
          :key="location.id"
          class="flex items-center p-3 border-b border-gray-100"
          @click="selectLocation(location)"
        >
          <div class="flex flex-col items-center justify-center mr-3">
            <div
              class="bg-[#FF5F00] rounded-full h-[40px] w-[40px] flex items-center justify-center mr-3"
            >
              <NuxtIcon
                name="mdi:map-marker"
                class="text-white"
                style="width: 20px; height: 20px"
              />
            </div>
            <div class="text-xs text-center mr-3 text-gray-400">
              {{ location.distance }} km
            </div>
          </div>
          <div class="flex-1">
            <h3 class="font-medium text-sm">{{ location.name }}</h3>
            <p class="text-xs text-gray-500 line-clamp-1">
              {{ location.address }}
            </p>
          </div>
        </div>
      </div>
      <div v-else class="p-4 text-center text-gray-500">No locations found</div>
    </div>

    <!-- Bottom Navigation -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

const searchQuery = ref("");

const selectedLocation = ref({
  id: "1",
  name: "Agen A",
  address: "Jl. Ibrahim Al-Khalil No. 12, Al-Haram, Makkah, Arab Saudi",
});

const locations = ref([
  {
    id: "1",
    name: "Agen A",
    address: "Jl. Ibrahim No. 12, Al-Haram, Makkah, Arab Saudi",
    distance: 10,
  },
  {
    id: "2",
    name: "Agen A",
    address: "Jl. Ibrahim No. 12, Al-Haram, Makkah, Arab Saudi",
    distance: 10,
  },
  {
    id: "3",
    name: "Agen A",
    address: "Jl. Ibrahim No. 12, Al-Haram, Makkah, Arab Saudi",
    distance: 10,
  },
  {
    id: "4",
    name: "Agen A",
    address: "Jl. Ibrahim No. 12, Al-Haram, Makkah, Arab Saudi",
    distance: 10,
  },
  {
    id: "5",
    name: "Agen A",
    address: "Jl. Ibrahim No. 12, Al-Haram, Makkah, Arab Saudi",
    distance: 10,
  },
  {
    id: "6",
    name: "Agen A",
    address: "Jl. Ibrahim No. 12, Al-Haram, Makkah, Arab Saudi",
    distance: 10,
  },
]);

const filteredLocations = computed(() => {
  if (!searchQuery.value) return locations.value;

  const query = searchQuery.value.toLowerCase();
  return locations.value.filter(
    (location) =>
      location.name.toLowerCase().includes(query) ||
      location.address.toLowerCase().includes(query)
  );
});

const selectLocation = (location) => {
  console.log("Selected location:", location);
  selectedLocation.value = location;

  // Best practice routing dengan route name dan params
  router.push({
    name: "user-date-selection", // Menggunakan named route
    params: {
      // Jika perlu menyimpan di path params
    },
    query: {
      locationId: location.id,
      locationName: encodeURIComponent(location.name),
      from: "search", // Untuk tracking sumber navigasi
    },
  });
};

const router = useRouter();

onMounted(() => {
  definePageMeta({
    title: "Search Location",
    layout: "users",
  });
});
</script>
