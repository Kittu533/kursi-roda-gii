<template>
  <div class="flex flex-col h-full bg-white">
    <!-- Header with back button and agent info -->
    <div class="p-4 flex items-center gap-3">
      <button class="p-1">
        <NuxtIcon name="ic:baseline-arrow-back-ios" class="w-5 h-5" />
      </button>
      <div class="flex items-center gap-2">
        <div
          class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center"
        >
          <NuxtIcon name="map-pin" class="w-4 h-4 text-orange-500" />
        </div>
        <div>
          <h1 class="font-medium text-base">Agen A</h1>
          <p class="text-xs text-gray-500">
            Jl. Ibrahim Al-Khalil No.12, Al-Haram, Makkah...
          </p>
        </div>
      </div>
    </div>

    <!-- Date selection -->
    <div class="px-4 py-2">
      <div class="flex justify-between items-center mb-2">
        <div class="text-sm">
          {{ store.selectedDates.startDate }}
        </div>
        <button
          class="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center"
        >
          <NuxtIcon
            name="ic:baseline-calendar-month"
            class="w-5 h-5 text-white"
          />
        </button>
      </div>
      <div class="flex justify-between items-center">
        <div class="text-sm">
          {{ store.selectedDates.endDate }}
        </div>
        <button
          class="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center"
        >
          <NuxtIcon
            name="ic:baseline-calendar-month"
            class="w-5 h-5 text-white"
          />
        </button>
      </div>
    </div>

    <!-- Product list -->
    <div class="px-4 py-3">
      <h2 class="font-medium text-base mb-3">Produk Tersedia</h2>

      <div v-if="store.isLoading" class="flex justify-center py-4">
        <div
          class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"
        ></div>
      </div>

      <div v-else-if="store.error" class="text-red-500 text-center py-4">
        {{ store.error }}
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="product in store.availableProducts"
          :key="product.id"
          class="flex gap-3"
        >
          <!-- Product image -->
          <div
            class="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center"
          >
            <img
              :src="`/placeholder.svg?height=96&width=96`"
              :alt="product.productName"
              class="w-20 h-20 object-contain"
            />
          </div>

          <!-- Product details -->
          <div class="flex-1">
            <div class="flex items-center gap-1 mb-1">
              <h3 class="font-medium">{{ product.productName }}</h3>
              <div class="flex items-center text-xs text-gray-500">
                <NuxtIcon
                  name="thumbs-up"
                  class="w-3 h-3 text-orange-500 mr-1"
                />
                <span>97%</span>
              </div>
            </div>

            <p class="text-sm font-medium mb-2">
              Rp {{ formatPrice(product.pricePerDay) }}/hari
            </p>

            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <input
                  type="checkbox"
                  :id="`guide-${product.id}`"
                  v-model="product.guideSelected"
                  class="rounded border-gray-300"
                />
                <label :for="`guide-${product.id}`" class="text-sm"
                  >Guide</label
                >
              </div>

              <div class="flex items-center gap-1">
                <button
                  @click="decrementQuantity(product.id)"
                  class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center"
                  :class="{ 'opacity-50': product.quantity === 0 }"
                >
                  <NuxtIcon name="ic:baseline-minus" class="w-3 h-3" />
                </button>

                <span class="w-6 text-center">{{ product.quantity }}</span>

                <button
                  @click="incrementQuantity(product.id)"
                  class="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center"
                >
                  <NuxtIcon
                    name="ic:baseline-plus"
                    class="w-3 h-3 text-white"
                  />
                </button>
              </div>
            </div>

            <NuxtLink 
              :to="{
                path: `/user/product/${product.id}`,
                query: $route.query,
              }"
              class="flex justify-end items-end text-xs text-gray-500"
            >
              Lihat detail
              <NuxtIcon name="ic:baseline-chevron-right" class=" w-3 h-3 ml-1" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Order button -->
    <div class="mt-auto p-4">
      <button
        @click="orderNow"
        class="w-full py-3 bg-orange-500 text-white font-medium rounded-lg"
      >
        Pesan Sekarang
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useProductsStore } from "@/store/product";

definePageMeta({
  title: "User Home",
  layout: "users",
});

export default defineComponent({
  setup() {
    const store = useProductsStore();
    // const router = useRouter();

    // Fetch products when component is created
    store.fetchProducts({ status: "tersedia" });

    const formatPrice = (price: number) => {
      return price.toLocaleString("id-ID");
    };

    // const navigateToProductDetail = (id: string) => {
    //   try {
    //     router.push(`/product/${id}`)
    //   } catch (error) {
    //     console.error("Navigation error:", error);
    //     // Anda bisa tambahkan notifikasi error di sini
    //   }
    // };

    return {
      store,
      formatPrice,
  
    };
  },

  methods: {
    incrementQuantity(productId: string) {
      this.store.incrementQuantity(productId);
    },

    decrementQuantity(productId: string) {
      this.store.decrementQuantity(productId);
    },

    orderNow() {
      const selectedProducts = this.store.selectedProducts;
      if (selectedProducts.length === 0) {
        alert("Silakan pilih minimal satu produk");
        return;
      }

      // Process order
      console.log("Pesan produk:", selectedProducts);
      console.log("Tanggal:", this.store.selectedDates);
    },
  },
});
</script>
