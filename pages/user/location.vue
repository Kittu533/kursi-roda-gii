<template>
    <div class="pb-20">
      <!-- Header -->
      <div class="p-4 flex items-center">
        <button @click="goBack" class="mr-3">
          <Icon name="mdi:chevron-left" class="h-5 w-5" />
        </button>
        <h1 class="text-lg font-medium">Lokasi</h1>
      </div>
      
      <!-- Search Bar -->
      <div class="px-4 py-2">
        <SearchBar v-model="searchQuery" placeholder="Cari titik lokasi" />
      </div>
      
      <!-- Map -->
      <div class="relative h-80 bg-gray-100">
        <!-- This would be replaced with an actual map component -->
        <div class="absolute inset-0 flex items-center justify-center">
          <p class="text-gray-500">Map would be displayed here</p>
        </div>
        
        <!-- Map Instructions -->
        <div class="absolute top-4 left-4 right-4 bg-white p-3 rounded-md shadow-md">
          <div class="flex items-start">
            <Icon name="mdi:information-outline" class="h-5 w-5 text-orange-500 mr-2 mt-0.5" />
            <p class="text-xs text-gray-600">
              Mohon pastikan titik anda sesuai dengan lokasi anda saat ini untuk memudahkan kurir anda
            </p>
          </div>
        </div>
      </div>
      
      <!-- Saved Locations -->
      <div class="p-4">
        <h2 class="font-medium mb-2">Lokasi Tersimpan</h2>
        
        <div class="space-y-4">
          <div 
            v-for="location in savedLocations" 
            :key="location.id"
            class="bg-white rounded-md shadow-sm p-3"
            @click="selectLocation(location)"
          >
            <div class="flex items-start">
              <div class="bg-orange-100 rounded-full p-2 mr-3 mt-1">
                <Icon name="mdi:map-marker" class="text-orange-500 h-5 w-5" />
              </div>
              <div class="flex-1">
                <h3 class="font-medium text-sm">{{ location.name }}</h3>
                <p class="text-xs text-gray-500 mb-1">{{ location.address }}</p>
                <p v-if="location.phoneNumber" class="text-xs text-gray-500">
                  {{ location.phoneNumber }}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Add New Location Button -->
        <div class="mt-4">
          <button 
            @click="addNewLocation"
            class="w-full flex items-center justify-center py-3 border border-gray-300 rounded-md text-sm"
          >
            <Icon name="mdi:plus" class="h-4 w-4 mr-2" />
            Tambahkan Titik Alamat Baru
          </button>
        </div>
      </div>
      
      <!-- Bottom Navigation -->
      <BottomNavigation />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import type { Location } from '~/types';
  
  const router = useRouter();
  const searchQuery = ref('');
  definePageMeta({
    title: 'User Home',
    layout: 'users',
  });
  const savedLocations = ref<Location[]>([
    {
      id: '1',
      name: 'Universitas Teknologi Yogyakarta',
      address: 'Jl Ringroad Utara, Jombor, Sleman, Daerah Istimewa Yogyakarta 55285, Indonesia',
      coordinates: {
        lat: -7.747033,
        lng: 110.355398
      }
    },
    {
      id: '2',
      name: 'Rumah',
      address: 'Dusun Tiga Trihanggo, RT. 8/ RW. 18, Trihanggo, Mlati, Kab. Sleman, DI Yogyakarta, ID 55284',
      phoneNumber: 'Cahya (+62) 821-4680-4915',
      coordinates: {
        lat: -7.747033,
        lng: 110.355398
      }
    },
    {
      id: '3',
      name: 'Hotel',
      address: 'Pondok Tinggal Melati III Hotel, Dist. Al Andalus, Jeddah 23437, Arab Saudi (Alamat sloogan hotel)',
      phoneNumber: 'Iza Willy (+62) 821-4680-4915',
      coordinates: {
        lat: 21.543333,
        lng: 39.172779
      }
    }
  ]);
  
  const selectLocation = (location: Location) => {
    console.log('Selected location:', location);
    // Navigate back with the selected location
    router.push('/');
  };
  
  const addNewLocation = () => {
    console.log('Adding new location');
    // Implement logic to add a new location
    // This could open a modal or navigate to a form
  };
  
  const goBack = () => {
    router.back();
  };
  </script>