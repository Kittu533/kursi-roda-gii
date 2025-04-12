<template>
  <div class="pb-20 bg-white h-screen">
    <!-- Header -->
    <div class="p-4 flex items-center">
      <button @click="goBack" class="mr-3">
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
      <h1 class="text-base font-medium">Lokasi</h1>
    </div>

    <!-- Search Bar -->
    <div class="px-4 pb-2">
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
          placeholder="Cari titik lokasi"
          class="block w-full pl-10 pr-3 py-2 border border-gray-200 bg-gray-100 rounded-md text-sm"
        />
      </div>
    </div>

    <!-- Map -->
    <div class="relative h-48 bg-gray-100">
      <!-- This would be replaced with an actual map component -->
      <iframe
        class="object-cover w-full"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15813.731526631533!2d110.3399848937988!3d-7.74382409894569!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a5893cad9576f%3A0xc1a837b495c90bd!2sRumah%20Sakit%20Akademik%20UGM%20Yogyakarta!5e0!3m2!1sen!2sid!4v1744479919478!5m2!1sen!2sid"
        style="border: 0"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>

      <!-- Map Instructions -->
      <div
        class="absolute top-4 left-4 right-4 bg-white p-3 rounded-md shadow-sm"
      >
        <div class="flex items-start">
          <!-- Info icon -->
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
            class="text-orange-500 mr-2 mt-0.5"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <p class="text-xs text-gray-600">
            Mohon pastikan titik anda sesuai dengan lokasi anda saat ini untuk
            memudahkan kurir anda
          </p>
        </div>
      </div>
    </div>

    <!-- Saved Locations -->
    <div class="p-4">
      <!-- Location Cards -->
      <div class="space-y-4">
        <div
          v-for="location in savedLocations"
          :key="location.id"
          class="flex items-start py-3"
          @click="selectLocation(location)"
        >
          <div class="bg-orange-100 rounded-full p-2 mr-3">
            <!-- Location marker icon -->
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
              class="text-orange-500"
            >
              <path
                d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"
              />
              <circle cx="12" cy="10" r="3" />
            </svg>
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

      <!-- Add New Location Button -->
      <div class="mt-4">
        <button
          @click="addNewLocation"
          class="w-full flex items-center justify-between py-3 px-3 border border-gray-200 rounded-md text-sm"
        >
          <div class="flex items-center">
            <!-- Plus icon -->
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
              class="mr-2"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Tambahkan Titik Alamat Baru</span>
          </div>
          <!-- Chevron right icon -->
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
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <div class="fixed bottom-0 left-0 right-0 flex justify-center z-10">
      <div
        class="bg-white border-t border-gray-200 flex justify-around items-center h-16 w-full max-w-[480px]"
      >
        <a
          href="/"
          class="flex flex-col items-center justify-center w-1/3 h-full text-orange-500"
        >
          <!-- Home icon -->
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
            class="mb-1"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span class="text-xs">Beranda</span>
        </a>

        <a
          href="/transaksi"
          class="flex flex-col items-center justify-center w-1/3 h-full text-gray-400"
        >
          <!-- Transaction icon -->
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
            class="mb-1"
          >
            <path
              d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
            ></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span class="text-xs">Transaksi</span>
        </a>

        <a
          href="/akun"
          class="flex flex-col items-center justify-center w-1/3 h-full text-gray-400"
        >
          <!-- Account icon -->
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
            class="mb-1"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span class="text-xs">Akun</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
definePageMeta({
  title: "User Home",
  layout: "users",
});
// Define the Location interface
interface Location {
  id: string;
  name: string;
  address: string;
  phoneNumber?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

const router = useRouter();
const searchQuery = ref("");

// Sample data for saved locations
const savedLocations = ref<Location[]>([
  {
    id: "1",
    name: "Universitas Teknologi Yogyakarta",
    address:
      "Jl. Ringroad Utara, Jombor, Mlati, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55285, Indonesia",
    coordinates: {
      lat: -7.747033,
      lng: 110.355398,
    },
  },
  {
    id: "2",
    name: "Rumah",
    address:
      "Dusun Tiga Trihanggo, RT. 8/ RW. 18, Trihanggo, Mlati, Kab. Sleman, DI Yogyakarta, ID 55284",
    phoneNumber: "Cahya (+62) 821-4680-4915",
    coordinates: {
      lat: -7.747033,
      lng: 110.355398,
    },
  },
  {
    id: "3",
    name: "Hotel",
    address:
      "Novotel Thalker Makkah Hotel, Dist. Al Andalus, Makkah 23437, Arab Saudi (Bernama dilobby hotel)",
    phoneNumber: "Iza Willy (+62) 821-4680-4915",
    coordinates: {
      lat: 21.543333,
      lng: 39.172779,
    },
  },
]);

const selectLocation = (location: Location) => {
  console.log("Selected location:", location);
  // Navigate back with the selected location
  router.push({
    name: 'user-product-product-selection', // Pastikan nama route ini sudah terdaftar di router Anda
    query: {
      locationId: location.id, // Asumsikan location memiliki properti id
      locationName: location.name // Asumsikan location memiliki properti name
    }
  });
};

const addNewLocation = () => {
  console.log("Adding new location");
  // Implement logic to add a new location
  // This could open a modal or navigate to a form
};

const goBack = () => {
  router.back();
};

onMounted(() => {
  // Initialize any map-related functionality here
  console.log("Location component mounted");
});
</script>
