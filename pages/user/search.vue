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
          class="bg-orange-100 rounded-full p-2 mr-3 inline-flex items-center justify-center"
        >
          <!-- Location marker icon -->
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
            class="text-orange-500"
          >
            <path
              d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"
            />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <span class="text-sm font-medium">{{ selectedLocation.name }}</span>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="py-[16px] px-[20px]">
      <div class="relative">
        <div
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          <!-- Search icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-gray-400"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
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
            <div class="text-xs text-center mr-3 text-gray-400">{{ location.distance }} km</div>
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
  // You can navigate to a different page or update the UI as needed
  router.push("/");
};

const router = useRouter();

onMounted(() => {
  definePageMeta({
    title: "Search Location",
    layout: "users",
  });
});
</script>
