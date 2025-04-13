<template>
    <div class="flex flex-col min-h-screen bg-white">
      <!-- Header -->
      <div class="p-4 flex items-center border-b border-gray-100">
        <button @click="goBack()" class="mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <h1 class="text-base font-medium">Konfirmasi Pesanan</h1>
      </div>
      
      <!-- Content -->
      <div class="flex-1 pb-24">
        <!-- Address -->
        <div class="p-4 flex items-start border-b border-gray-100">
          <div class="bg-orange-100 rounded-full p-2 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-500">
              <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div>
            <h3 class="text-sm font-medium">Alamat</h3>
            <p class="text-xs text-orange-500">MAKKAH TOWER, Al Haram, Makkah, Arab Saudi...</p>
          </div>
        </div>
        
        <!-- Shipping Options -->
        <div class="p-4 flex items-start border-b border-gray-100">
          <div class="bg-orange-100 rounded-full p-2 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-500">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div class="flex-1">
            <div class="flex justify-between items-center">
              <h3 class="text-sm font-medium">Opsi Pengiriman</h3>
              <span class="text-xs text-gray-500">Jarak 10 km</span>
            </div>
            
            <div class="mt-2 flex justify-between items-center">
              <span class="text-xs">Pesan - Antar • 20 menit</span>
              <span class="text-xs">Rp13.000</span>
            </div>
            
            <div class="mt-2 border border-orange-500 rounded-md p-2 flex justify-between items-center">
              <span class="text-xs text-orange-500">Pesan - Ambil</span>
              <span class="text-xs text-orange-500">Gratis</span>
            </div>
          </div>
        </div>
        
        <!-- Agent -->
        <div class="p-4 flex items-start justify-between border-b border-gray-100">
          <div class="flex items-center">
            <div class="bg-orange-100 rounded-full p-2 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-500">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h3 class="text-sm font-medium">Agen A</h3>
          </div>
          <button class="text-xs text-orange-500">Tambah Pesanan</button>
        </div>
        
        <!-- Products -->
        <div class="px-4 py-2">
          <!-- Product 1 -->
          <div class="py-3 border-b border-gray-100">
            <div class="flex items-start">
              <img src="/kursi-roda.webp" alt="Kursi Roda" class="w-20 h-20 object-cover rounded-md mr-3" />
              <div class="flex-1">
                <div class="flex justify-between">
                  <h3 class="text-sm font-medium">Kursi Roda Breezy BasiX</h3>
                  <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="text-orange-500 mr-1">
                      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm3.33 14.77A5 5 0 0 1 8.77 10a1 1 0 0 1 2 0 3 3 0 0 0 4.44 2.63 1 1 0 0 1 .79 1.84z"/>
                    </svg>
                    <span class="text-xs">97%</span>
                  </div>
                </div>
                <p class="text-xs text-gray-500 mt-1">Rp 130.000/hari</p>
                
                <div class="flex justify-between items-center mt-2">
                  <div class="flex items-center">
                    <input type="checkbox" id="guide1" class="mr-2 h-4 w-4" v-model="guideOptions.product1" />
                    <label for="guide1" class="text-xs">Guide</label>
                  </div>
                  
                  <div class="flex items-center">
                    <div class="flex items-center bg-gray-100 rounded-md">
                      <button class="px-2 py-1 text-white bg-orange-500 rounded-l-md" @click="decrement('product1')">-</button>
                      <span class="px-3 text-sm">{{ quantities.product1 }}</span>
                      <button class="px-2 py-1 text-white bg-orange-500 rounded-r-md" @click="increment('product1')">+</button>
                    </div>
                    <button class="ml-2 text-xs text-orange-500 flex items-center">
                      Tambah Data
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-1">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Product 2 -->
          <div class="py-3 border-b border-gray-100">
            <div class="flex items-start">
              <img src="/kursi-roda.webp" alt="Kursi Roda" class="w-20 h-20 object-cover rounded-md mr-3" />
              <div class="flex-1">
                <div class="flex justify-between">
                  <h3 class="text-sm font-medium">Kursi Roda Quickie Q7</h3>
                  <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="text-orange-500 mr-1">
                      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm3.33 14.77A5 5 0 0 1 8.77 10a1 1 0 0 1 2 0 3 3 0 0 0 4.44 2.63 1 1 0 0 1 .79 1.84z"/>
                    </svg>
                    <span class="text-xs">97%</span>
                  </div>
                </div>
                <p class="text-xs text-gray-500 mt-1">Rp 130.000/hari</p>
                
                <div class="flex justify-between items-center mt-2">
                  <div class="flex items-center">
                    <input type="checkbox" id="guide2" class="mr-2 h-4 w-4" v-model="guideOptions.product2" />
                    <label for="guide2" class="text-xs">Guide</label>
                  </div>
                  
                  <div class="flex items-center">
                    <div class="flex items-center bg-gray-100 rounded-md">
                      <button class="px-2 py-1 text-white bg-orange-500 rounded-l-md" @click="decrement('product2')">-</button>
                      <span class="px-3 text-sm">{{ quantities.product2 }}</span>
                      <button class="px-2 py-1 text-white bg-orange-500 rounded-r-md" @click="increment('product2')">+</button>
                    </div>
                    <button class="ml-2 text-xs text-orange-500 flex items-center">
                      Tambah Data
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-1">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Product 3 -->
          <div class="py-3 border-b border-gray-100">
            <div class="flex items-start">
              <img src="/kursi-roda.webp" alt="Kursi Roda" class="w-20 h-20 object-cover rounded-md mr-3" />
              <div class="flex-1">
                <div class="flex justify-between">
                  <h3 class="text-sm font-medium">Kursi Roda Lightweight</h3>
                  <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="text-orange-500 mr-1">
                      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm3.33 14.77A5 5 0 0 1 8.77 10a1 1 0 0 1 2 0 3 3 0 0 0 4.44 2.63 1 1 0 0 1 .79 1.84z"/>
                    </svg>
                    <span class="text-xs">97%</span>
                  </div>
                </div>
                <p class="text-xs text-gray-500 mt-1">Rp 130.000/hari</p>
                
                <div class="flex justify-between items-center mt-2">
                  <div class="flex items-center">
                    <input type="checkbox" id="guide3" class="mr-2 h-4 w-4" v-model="guideOptions.product3" />
                    <label for="guide3" class="text-xs">Guide</label>
                  </div>
                  
                  <div class="flex items-center">
                    <div class="flex items-center bg-gray-100 rounded-md">
                      <button class="px-2 py-1 text-white bg-orange-500 rounded-l-md" @click="decrement('product3')">-</button>
                      <span class="px-3 text-sm">{{ quantities.product3 }}</span>
                      <button class="px-2 py-1 text-white bg-orange-500 rounded-r-md" @click="increment('product3')">+</button>
                    </div>
                    <button class="ml-2 text-xs text-orange-500 flex items-center">
                      Tambah Data
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-1">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Voucher -->
        <div class="p-4 flex items-center justify-between border-b border-gray-100">
          <div class="flex items-center">
            <div class="bg-orange-100 rounded-full p-2 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-500">
                <path d="M22 12v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3"/>
                <rect x="9" y="9" width="13" height="6" rx="2"/>
              </svg>
            </div>
            <h3 class="text-sm font-medium">Voucher</h3>
          </div>
          <button class="text-xs text-gray-500 flex items-center">
            2 voucher Tersedia
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-1">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
        
        <!-- Payment Method -->
        <div class="p-4 flex items-center justify-between border-b border-gray-100">
          <div class="flex items-center">
            <div class="bg-orange-100 rounded-full p-2 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-500">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <h3 class="text-sm font-medium">Metode Pembayaran</h3>
          </div>
          <button class="text-xs text-gray-500 flex items-center">
            Pilihan
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-1">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Footer with Total and Pay Button -->
      <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div class="space-y-1 mb-3">
          <div class="flex justify-between text-sm">
            <span>Total Pesanan</span>
            <span>Rp390.000</span>
          </div>
          <div class="flex justify-between text-sm">
            <span>Total Biaya Pengiriman</span>
            <span class="text-gray-500">Gratis</span>
          </div>
          <div class="flex justify-between text-sm">
            <span>Biaya Layanan</span>
            <span>Rp1.000</span>
          </div>
        </div>
        
        <div class="flex justify-between items-center">
          <div>
            <div class="flex items-end">
              <span class="text-sm font-medium">Total</span>
              <span class="text-lg font-bold text-orange-500 ml-2">Rp391.000</span>
            </div>
            <p class="text-xs text-gray-500">Sudah termasuk pajak</p>
          </div>
          
          <button class="bg-orange-500 text-white px-6 py-2 rounded-md">
            Bayar
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();

  definePageMeta({
    layout: 'users',
    title: 'Detail Transaksi - Reguler',
    meta: {
      auth: true,
      title: 'Detail Transaksi - Reguler'
    }
  });
  // Product quantities
  const quantities = ref({
    product1: 0,
    product2: 0,
    product3: 0
  });
  
  // Guide options
  const guideOptions = ref({
    product1: false,
    product2: false,
    product3: false
  });
  
  // Increment quantity
  const increment = (product) => {
    quantities.value[product]++;
  };
  
  // Decrement quantity
  const decrement = (product) => {
    if (quantities.value[product] > 0) {
      quantities.value[product]--;
    }
  };
  
  // Navigate back
  const goBack = () => {
    router.back();
  };
  
  // Page metadata
  onMounted(() => {
    document.title = 'Detail Transaksi - Reguler';
  });
  </script>