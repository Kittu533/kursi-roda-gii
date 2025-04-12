<template>
    <div class="pb-20">
      <!-- User Profile Section -->
      <div class="p-4 flex items-center">
        <div class="bg-white border border-[#FF9732] rounded-full h-[36px] w-[36px] flex items-center justify-center mr-3">
          <NuxtIcon name="mdi:map-marker" class="text-gray-500 h-5 w-5" />
        </div>
        <div class="flex-1">
          <h3 class="text-xs text-gray-500">Alamat</h3>
          <p class="text-sm font-medium line-clamp-1">{{ currentLocation.address }}</p>
        </div>  
      </div>
      
      <!-- User Greeting -->
      <div class="px-4 py-2 flex items-center">
        <img :src="user.avatarUrl" alt="User" class="w-10 h-10 rounded-full mr-3" />
        <div>
          <h2 class="font-medium">Hello, {{ user.name }}!</h2>
          <p class="text-xs text-gray-500">{{ user.status }}</p>
        </div>
      </div>
      
      <!-- Search Bar -->
      <div class="px-4 py-2">
        <SearchBar v-model="searchQuery" placeholder="Cari lokasi terdekat" />
      </div>
      
      <!-- Voucher Section -->
      <div class="px-4 py-2">
        <!-- <VoucherCard :voucher="voucher" /> -->
         <img src="/public/package-1.webp" alt="">
      </div>
      
      <!-- Packages Section -->
      <div class="px-4 py-2">
        <h2 class="font-medium mb-2">Paket Kami</h2>
        <div>
          <PackageCard 
            v-for="pkg in packages" 
            :key="pkg.id" 
            :packageItem="pkg" 
            @book="bookPackage"
          />
        </div>
      </div>
      
      <!-- Agents Section -->
      <div class="px-4 py-2">
        <h2 class="font-medium mb-2">Agen Kami</h2>
        <div class="bg-white rounded-lg overflow-hidden shadow-sm">
          <AgentCard 
            v-for="agent in agents" 
            :key="agent.id" 
            :agent="agent" 
            showActionButton 
            @action="viewAgent"
          />
        </div>
      </div>
      
      <!-- Bottom Navigation -->
      <BottomNavigation /> 
    </div>
  </template>
  
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import type { User, Location, Agent, Package, Voucher } from '~/types';
  import SearchBar from '~/components/user/search-bar.vue';
  import PackageCard from '~/components/user/package-card.vue';
  import AgentCard from '~/components/user/agent-card.vue';
  import BottomNavigation from '~/components/user/bottom-navigation.vue';
  definePageMeta({
    title: 'User Home',
    layout: 'users',
  });
  // Mock data
  const user = ref<User>({
    id: '1',
    name: 'Cahya',
    avatarUrl: '/avatar.webp',
    status: 'Selamat kali nada sesuai kebutuhanmu!'
  });
  
  const currentLocation = ref<Location>({
    id: '1',
    name: 'MAKKAH TOWER',
    address: 'MAKKAH TOWER, Al Haram, Makkah, Arab Saudi'
  });
  
  const searchQuery = ref('');
  
  const voucher = ref<Voucher>({
    id: '1',
    title: 'VOUCHER DISKON',
    description: 'POTONGAN HARGA UNTUK PENYEWAAN KURSI RODA HARIAN',
    discountPercentage: 50,
    imageUrl: '/package-1.webp',
    validUntil: new Date('2023-12-31')
  });
  
  const packages = ref<Package[]>([
    {
      id: '1',
      name: 'Paket Tawaf',
      timeRange: 'Waktu: 20.00 - 21.00',
      originalPrice: 300000,
      discountedPrice: 150000,
      imageUrl: '/voucher-1.webp'
    },
    {
      id: '2',
      name: 'Paket S+1',
      timeRange: 'Waktu: 20.00 - 21.00',
      originalPrice: 300000,
      discountedPrice: 150000,
      imageUrl: '/voucher-1.webp'
    }
  ]);
  
  const agents = ref<Agent[]>([
    {
      id: '1',
      name: 'Agen A',
      address: 'Jl. Ibrahim No. 12, Al-Haram, Makkah, Arab Saudi',
      distance: 1.0,
      distanceUnit: 'km',
      rating: 4.5,
      isAvailable: true
    },
    {
      id: '2',
      name: 'Agen B',
      address: 'Jl. Ibrahim No. 15, Al-Haram, Makkah, Arab Saudi',
      distance: 1.1,
      distanceUnit: 'km',
      rating: 4.2,
      isAvailable: true
    }
  ]);
  
  // Methods
  const bookPackage = (pkg: Package) => {
    console.log('Booking package:', pkg);
    // Implement booking logic
  };
  
  const viewAgent = (agent: Agent) => {
    console.log('Viewing agent:', agent);
    // Implement navigation to agent details
  };
  </script>