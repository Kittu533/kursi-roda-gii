<template>
  <div class="flex flex-col h-full bg-white relative">
    <!-- Header with back button and agent info -->
    <div class="p-4 flex items-center gap-3">
      <button class="p-1">
        <NuxtIcon name="ic:baseline-arrow-back-ios" class="w-5 h-5" />
      </button>
      <div class="flex items-center gap-2">
        <div
          class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center"
        >
          <NuxtIcon name="mdi:map-marker" class="w-4 h-4 text-orange-500" />
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
              src="/kursi-roda.webp"
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

            <div
              @click="openProductDetail(product)"
              class="flex justify-end items-end text-xs text-gray-500 cursor-pointer"
            >
              Lihat detail
              <NuxtIcon name="ic:baseline-chevron-right" class="w-3 h-3 ml-1" />
            </div>
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

    <!-- Sliding product detail panel -->
    <Transition name="slide-up">
      <div
        v-if="activeProduct"
        class="product-detail-panel"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      >
        <div class="handle-bar">
          <div class="handle"></div>
        </div>

        <div
          class="bg-white rounded-lg shadow-sm mx-auto max-w-lg overflow-hidden"
        >
          <!-- Main product image -->
          <div class="relative bg-white p-4">
            <img
              :src="currentImage"
              :alt="activeProduct ? activeProduct.productName : ''"
              class="w-full h-64 object-contain mx-auto"
            />
          </div>

          <!-- Thumbnails -->
          <div class="flex justify-center gap-2 px-4 pb-4">
            <button
              v-for="(image, index) in productImages"
              :key="index"
              @click="selectImage(index)"
              class="w-12 h-12 border rounded-md overflow-hidden"
              :class="{ 'border-orange-500': currentImageIndex === index }"
            >
              <img
                :src="image"
                :alt="`${activeProduct ? activeProduct.productName : ''} view ${index + 1}`"
                class="w-full h-full object-cover"
              />
            </button>
          </div>

          <!-- Product info -->
          <div class="px-4 py-3">
            <div class="flex items-center justify-between mb-2">
              <h1 class="text-lg font-medium">
                {{ activeProduct ? activeProduct.productName : "" }}
              </h1>
              <div class="flex items-center text-sm">
                <NuxtIcon
                  name="thumbs-up"
                  class="w-4 h-4 text-orange-500 mr-1"
                />
                <span class="text-orange-500 font-medium">97%</span>
              </div>
            </div>

            <p class="text-sm text-gray-700 mb-4">
              {{
                activeProduct && activeProduct.description
                  ? activeProduct.description
                  : "Kursi Roda Breezy BasiX® adalah kursi roda ringan yang dirancang untuk kenyamanan dan mobilitas optimal..."
              }}
            </p>

            <!-- Quantity control -->
            <div class="flex items-center justify-end gap-2 mt-4">
              <button
                @click="
                  decrementDetailQuantity(activeProduct ? activeProduct.id : '')
                "
                class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                :class="{
                  'opacity-50': activeProduct && activeProduct.quantity === 0,
                }"
              >
                <NuxtIcon name="ic:baseline-minus" class="w-4 h-4" />
              </button>

              <span class="w-8 text-center">{{
                activeProduct ? activeProduct.quantity : 0
              }}</span>

              <button
                @click="
                  incrementDetailQuantity(activeProduct ? activeProduct.id : '')
                "
                class="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center"
              >
                <NuxtIcon name="ic:baseline-plus" class="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        <!-- Product specifications -->
        <ProductSpecifications
          v-if="activeProduct && activeProduct.id"
          :product="activeProduct"
          class="mt-4"
        />
      </div>
    </Transition>

    <!-- Overlay backdrop -->
    <Transition name="fade">
      <div
        v-if="activeProduct"
        class="backdrop"
        @click="closeProductDetail"
      ></div>
    </Transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useProductsStore } from "@/store/product";
import { definePageMeta, navigateTo } from "#imports";

// Define a Product interface to use throughout the component
interface Product {
  id: string;
  productName: string;
  pricePerDay: number;
  quantity: number;
  guideSelected?: boolean;
  description?: string;
}

definePageMeta({
  title: "User Home",
  layout: "users",
  meta: {
    auth: true,
  },
});

export default defineComponent({
  setup() {
    const store = useProductsStore();

    // Active product for detail view
    const activeProduct = ref<Product | null>(null);

    // Touch handling variables
    const touchStartY = ref(0);
    const touchMoveY = ref(0);
    const minSwipeDistance = 100;

    // Current image index for the product detail gallery
    const currentImageIndex = ref(0);

    // Product images (placeholder)
    const productImages = ref([
      "/kursi-roda.webp",
      "/kursi-roda.webp",
      "/kursi-roda.webp",
      "/kursi-roda.webp",
      "/kursi-roda.webp",
    ]);

    // Computed property for current image
    const currentImage = computed(() => {
      return productImages.value[currentImageIndex.value] || "/kursi-roda.webp";
    });

    // Select image in the gallery
    const selectImage = (index: number): void => {
      currentImageIndex.value = index;
    };

    // Fetch products when component is created
    store.fetchProducts({ status: "tersedia" });

    const formatPrice = (price: number): string => {
      return price.toLocaleString("id-ID");
    };

    // Open product detail with slide-up animation
    const openProductDetail = (product: Product): void => {
      if (product) {
        activeProduct.value = product;
        currentImageIndex.value = 0; // Reset image index
      }
    };

    // Close product detail
    const closeProductDetail = (): void => {
      activeProduct.value = null;
    };

    // Touch handlers for swipe to close
    const handleTouchStart = (event: TouchEvent): void => {
      touchStartY.value = event.touches[0].clientY;
    };

    const handleTouchMove = (event: TouchEvent): void => {
      touchMoveY.value = event.touches[0].clientY;

      // Calculate the distance moved
      const distance = touchMoveY.value - touchStartY.value;

      // Only allow downward swipes
      if (distance > 0) {
        event.preventDefault();

        // Apply transform to follow finger (limited to prevent excessive movement)
        const panel = event.currentTarget as HTMLElement;
        panel.style.transform = `translateY(${Math.min(distance, 300)}px)`;
      }
    };

    const handleTouchEnd = (event: TouchEvent): void => {
      const distance = touchMoveY.value - touchStartY.value;

      // If swiped down enough, close the panel
      if (distance > minSwipeDistance) {
        closeProductDetail();
      } else {
        // Reset position if not swiped enough
        const panel = event.currentTarget as HTMLElement;
        panel.style.transform = "translateY(0)";
      }

      // Reset values
      touchStartY.value = 0;
      touchMoveY.value = 0;
    };

    // Increment quantity in detail view
    const incrementDetailQuantity = (productId: string): void => {
      if (productId) {
        store.incrementQuantity(productId);
      }
    };

    // Decrement quantity in detail view
    const decrementDetailQuantity = (productId: string): void => {
      if (productId) {
        store.decrementQuantity(productId);
      }
    };

    return {
      store,
      formatPrice,
      activeProduct,
      openProductDetail,
      closeProductDetail,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
      currentImageIndex,
      productImages,
      currentImage,
      selectImage,
      incrementDetailQuantity,
      decrementDetailQuantity,
    };
  },

  methods: {
    incrementQuantity(productId: string): void {
      this.store.incrementQuantity(productId);
    },

    decrementQuantity(productId: string): void {
      this.store.decrementQuantity(productId);
    },

    orderNow(): void {
      const selectedProducts = this.store.selectedProducts;
      if (selectedProducts.length === 0) {
        alert("Silakan pilih minimal satu produk");
        return;
      } else {
        // Navigate to transaction detail page
        navigateTo("/user/transaction/detail-transaction-reguler");
      }
    },
  },
});
</script>

<style scoped>
/* Slide-up panel styles */
.product-detail-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 90vh;
  background-color: white;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.1);
  z-index: 50;
  overflow-y: auto;
  touch-action: pan-y;
}

.handle-bar {
  display: flex;
  justify-content: center;
  padding: 0.75rem 0;
}

.handle {
  width: 4rem;
  height: 0.25rem;
  background-color: #cbd5e0;
  border-radius: 1rem;
}

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 40;
}

/* Slide up animation */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

/* Fade animation for backdrop */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>