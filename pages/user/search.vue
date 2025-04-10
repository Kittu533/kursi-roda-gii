<template>
    <div class="pb-20">
      <!-- Header -->
      <div class="p-4 flex items-center">
        <button @click="$router.back()" class="mr-3">
          <Icon name="lucide:chevron-left" class="h-5 w-5" />
        </button>
        <div class="flex-1">
          <div class="bg-orange-100 rounded-full p-2 mr-3 inline-flex items-center">
            <Icon name="lucide:map-pin" class="text-orange-500 h-5 w-5" />
          </div>
          <span class="text-sm font-medium">{{ selectedLocation.name }}</span>
        </div>
      </div>
      
      <!-- Search Bar -->
      <div class="px-4 py-2">
        <SearchBar v-model="searchQuery" placeholder="Cari lokasi terdekat" />
      </div>
      
      <!-- Search Results -->
      <div class="mt-2">
        <div v-if="filteredLocations.length > 0">
          <LocationCard 
            v-for="location in filteredLocations" 
            :key="location.id" 
            :location="location"
            @select="selectLocation"
          />
        </div>
        <div v-else class="p-4 text-center text-gray-500">
          No locations found
        </div>
      </div>
      
      <!-- Bottom Navigation -->
      <BottomNavigation />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import type { Location } from '~/types';
  definePageMeta({
    title: 'Search Location',
    layout: 'users',

  });
  const router = useRouter();
  
  const searchQuery = ref('');
  
  const selectedLocation = ref<Location>({
    id: '1',
    name: 'Agen A',
    address: 'Jl. Ibrahim Al-Khalil No. 12, Al-Haram, Makkah, Arab Saudi'
  });
  
  const locations = ref<Location[]>([
    {
      id: '1',
      name: 'Agen A',
      address: 'Jl. Ibrahim No. 12, Al-Haram, Makkah, Arab Saudi',
      distance: 10
    },
    {
      id: '2',
      name: 'Agen A',
      address: 'Jl. Ibrahim No. 12, Al-Haram, Makkah, Arab Saudi',
      distance: 10
    },
    {
      id: '3',
      name: 'Agen A',
      address: 'Jl. Ibrahim No. 12, Al-Haram, Makkah, Arab Saudi',
      distance: 10
    },
    {
      id: '4',
      name: 'Agen A',
      address: 'Jl. Ibrahim No. 12, Al-Haram, Makkah, Arab Saudi',
      distance: 10
    },
    {
      id: '5',
      name: 'Agen A',
      address: 'Jl. Ibrahim No. 12, Al-Haram, Makkah, Arab Saudi',
      distance: 10
    },
    {
      id: '6',
      name: 'Agen A',
      address: 'Jl. Ibrahim No. 12, Al-Haram, Makkah, Arab Saudi',
      distance: 10
    }
  ]);
  
  const filteredLocations = computed(() => {
    if (!searchQuery.value) return locations.value;
    
    const query = searchQuery.value.toLowerCase();
    return locations.value.filter(location => 
      location.name.toLowerCase().includes(query) || 
      location.address.toLowerCase().includes(query)
    );
  });
  
  const selectLocation = (location: Location) => {
    console.log('Selected location:', location);
    selectedLocation.value = location;
    // You can navigate to a different page or update the UI as needed
    router.push('/');
  };
  </script>