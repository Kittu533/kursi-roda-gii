<template>
  <div class="bg-gray-50 min-h-screen pb-8">
    <!-- Back button -->
    <div class="p-4">
      <button @click="goBack" class="flex items-center text-sm text-gray-600">
        <NuxtIcon name="ic:baseline-arrow-back-ios" class="w-5 h-5 mr-1" />
        Kembali
      </button>
    </div>
    
    <!-- Product detail card -->
    <div class="bg-white rounded-lg shadow-sm mx-auto max-w-lg overflow-hidden">
      <!-- Main product image -->
      <div class="relative bg-white p-4">
        <img 
          :src="currentImage" 
          :alt="product.productName" 
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
          <img :src="image" :alt="`${product.productName} view ${index + 1}`" class="w-full h-full object-cover" />
        </button>
      </div>
      
      <!-- Product info -->
      <div class="px-4 py-3">
        <div class="flex items-center justify-between mb-2">
          <h1 class="text-lg font-medium">{{ product.productName }}</h1>
          <div class="flex items-center text-sm">
            <NuxtIcon name="thumbs-up" class="w-4 h-4 text-orange-500 mr-1" />
            <span class="text-orange-500 font-medium">97%</span>
          </div>
        </div>
        
        <p class="text-sm text-gray-700 mb-4">
          {{ product.description || 'Kursi Roda Breezy BasiX® adalah kursi roda ringan yang dirancang untuk kenyamanan dan mobilitas optimal...' }}
        </p>
        
        <!-- Quantity control -->
        <div class="flex items-center justify-end gap-2 mt-4">
          <button 
            @click="decrementQuantity"
            class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
            :class="{ 'opacity-50': quantity === 0 }"
          >
            <NuxtIcon name="ic:baseline-minus" class="w-4 h-4" />
          </button>
          
          <span class="w-8 text-center">{{ quantity }}</span>
          
          <button 
            @click="incrementQuantity"
            class="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center"
          >
            <NuxtIcon name="ic:baseline-plus" class="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
    
    <!-- Product specifications -->
    <ProductSpecifications v-if="product.id" :product="product" />
    
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProductApi } from '~/composables/consume-api/product.api'
import type { Product } from '~/types/product'

definePageMeta({
  title: "User Home",
  layout: "users",
});

const route = useRoute()
const router = useRouter()

const product = ref<Product>({} as Product)
const quantity = ref(0)
const currentImageIndex = ref(0)
const productId = route.params.id
const locationId = route.query.locationId
const locationName = route.query.locationName

console.log('Detail Produk:', {
  productId,
  locationId,
  locationName
})


const productImages = ref([
  '/placeholder.svg?height=300&width=300',
  '/placeholder.svg?height=300&width=300',
  '/placeholder.svg?height=300&width=300',
  '/placeholder.svg?height=300&width=300',
  '/placeholder.svg?height=300&width=300'
])

const currentImage = computed(() => productImages.value[currentImageIndex.value])

onMounted(async () => {
  const productId = route.params.id as string

  try {
    const productApi = useProductApi()
    const fetchedProduct = await productApi.getProductById(productId)
    
    if (fetchedProduct) {
      product.value = fetchedProduct
      // If API returns images, replace the placeholder URLs
      // productImages.value = fetchedProduct.images || productImages.value
    } else {
      router.push('user-product-product-selection')
    }
  } catch (error) {
    console.error('Failed to fetch product:', error)
    // Handle error appropriately
  }
})

const incrementQuantity = () => {
  if (product.value.stock && quantity.value < product.value.stock) {
    quantity.value++
  }
}

const decrementQuantity = () => {
  if (quantity.value > 0) {
    quantity.value--
  }
}

const selectImage = (index: number) => {
  currentImageIndex.value = index
}

const addToCart = () => {
  if (quantity.value > 0) {
    console.log(`Added ${quantity.value} of ${product.value.productName} to cart`)
    // Implement actual add to cart logic
  }
}

const goBack = () => {
  router.go(-1) // Or use navigateTo('/products') if you prefer
}
</script>