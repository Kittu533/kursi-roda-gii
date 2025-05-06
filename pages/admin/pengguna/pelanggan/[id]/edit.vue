<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">
          {{ isEditing ? "Edit Pelanggan" : "Tambah Pelanggan Baru" }}
        </h2>
      </div>
    </div>

    <!-- Breadcrumb Navigation -->
    <div class="flex items-center space-x-2 text-sm">
      <NuxtLink to="/" class="text-muted-foreground hover:text-foreground">
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
          class="lucide lucide-home"
        >
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </NuxtLink>
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
        class="lucide lucide-chevron-right text-muted-foreground"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
      <NuxtLink
        to="/admin/pengguna/pelanggan"
        class="text-muted-foreground hover:text-foreground"
      >
        Pelanggan
      </NuxtLink>
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
        class="lucide lucide-chevron-right text-muted-foreground"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
      <span>{{ isEditing ? "Edit" : "Tambah" }}</span>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center py-8">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"
      ></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-red-100 p-4 rounded-md text-red-800">
      {{ error }}
    </div>

    <!-- Form -->
    <form
      @submit.prevent="saveCustomer"
      class="bg-white border rounded-md overflow-hidden"
    >
      <div class="p-4 border-b">
        <h3 class="text-lg font-medium">
          {{ isEditing ? "Data Pelanggan" : "Data Pelanggan Baru" }}
        </h3>
      </div>
      <div class="p-4 space-y-4">
        <!-- ID Pelanggan -->
        <div class="space-y-2">
          <label for="id" class="text-sm font-medium">ID Pelanggan</label>
          <input
            id="id"
            type="text"
            v-model="formData.id"
            class="w-full px-3 py-2 border rounded-md"
            :disabled="isEditing"
            placeholder="ID akan dibuat otomatis"
            readonly
          />
        </div>

        <!-- Nama Lengkap -->
        <div class="space-y-2">
          <label for="fullName" class="text-sm font-medium">Nama Lengkap</label>
          <input
            id="fullName"
            type="text"
            v-model="formData.fullName"
            class="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <!-- Nomor Telepon dan Email -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label for="phoneNumber" class="text-sm font-medium"
              >Nomor Telepon</label
            >
            <input
              id="phoneNumber"
              type="tel"
              v-model="formData.phoneNumber"
              class="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div class="space-y-2">
            <label for="email" class="text-sm font-medium">Email</label>
            <input
              id="email"
              type="email"
              v-model="formData.email"
              class="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
        </div>

        <!-- Jenis Kelamin -->
        <div class="space-y-2">
          <label for="gender" class="text-sm font-medium">Jenis Kelamin</label>
          <select
            id="gender"
            v-model="formData.gender"
            class="w-full px-3 py-2 border rounded-md"
            required
          >
            <option value="">Pilih Jenis Kelamin</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
        </div>

        <!-- Status -->
        <div class="space-y-2">
          <label for="status" class="text-sm font-medium">Status</label>
          <select
            id="status"
            v-model="formData.status"
            class="w-full px-3 py-2 border rounded-md"
            required
          >
            <option value="">Pilih Status</option>
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Non Aktif</option>
          </select>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="p-4 border-t flex justify-end gap-2">
        <button
          type="button"
          class="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
          @click="router.push('/admin/pengguna/pelanggan')"
        >
          Batal
        </button>
        <button
          type="submit"
          class="bg-[#4072EE] text-white px-4 py-2 rounded-md hover:bg-[#3060DD]"
        >
          Simpan
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProductStore } from "~/store/product";
import type { Product } from "~/types/product";

// Router
const route = useRoute();
const router = useRouter();
const productId = computed(() => route.params.id as string);
const isEditing = computed(() => productId.value && productId.value !== "new");

// Store
const productStore = useProductStore();
const isLoading = computed(() => productStore.isLoading);
const error = computed(() => productStore.error);

// Form data
const formData = ref<Partial<Product>>({
  id: "",
  agentId: "",
  photo: "",
  serialNumber: "",
  productName: "",
  model: "",
  batteryLife: "",
  stock: 0,
  status: "",
});
</script>
