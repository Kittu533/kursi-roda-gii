<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">Guide - Detail</h2>
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
        to="/admin/pengguna"
        class="text-muted-foreground hover:text-foreground"
      >
        Pengguna
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
        to="/admin/pengguna/guide"
        class="text-muted-foreground hover:text-foreground"
      >
        Guide
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
      <span>Detail</span>
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

    <!-- Guide Data Card -->
    <div v-else-if="guide" class="bg-white border rounded-md overflow-hidden">
      <div class="p-4 border-b">
        <h3 class="text-lg font-medium">Data Guide</h3>
      </div>
      <div class="p-4">
        <div class="flex items-center gap-4 mb-6">
          <img
            :src="guide.photo"
            alt="Profile"
            class="w-20 h-20 rounded-full object-cover border"
          />
          <div>
            <h3 class="text-xl font-medium">{{ guide.name }}</h3>
            <p class="text-gray-500">{{ guide.id }}</p>
          </div>
        </div>

        <div class="rounded-md border">
          <table class="w-full">
            <tbody>
              <!-- ID Guide -->
              <tr class="border-b">
                <td
                  class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50"
                >
                  ID Guide
                </td>
                <td class="w-2/3 px-4 py-3">
                  {{ guide.id }}
                </td>
              </tr>

              <!-- Nama Lengkap -->
              <tr class="border-b">
                <td
                  class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50"
                >
                  Nama Lengkap
                </td>
                <td class="w-2/3 px-4 py-3">
                  {{ guide.name }}
                </td>
              </tr>

              <!-- Nomor Telepon -->
              <tr class="border-b">
                <td
                  class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50"
                >
                  Nomor Telepon
                </td>
                <td class="w-2/3 px-4 py-3">
                  {{ guide.phone }}
                </td>
              </tr>

              <!-- KTP -->
              <tr class="border-b">
                <td
                  class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50"
                >
                  KTP
                </td>
                <td class="w-2/3 px-4 py-3">
                  {{ guide.ktp }}
                </td>
              </tr>

              <!-- Nomor Rekening -->
              <tr class="border-b">
                <td
                  class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50"
                >
                  Nomor Rekening
                </td>
                <td class="w-2/3 px-4 py-3">
                  {{ guide.accountNumber }}
                </td>
              </tr>

              <!-- Akun Dibuat -->
              <tr class="border-b">
                <td
                  class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50"
                >
                  Akun dibuat
                </td>
                <td class="w-2/3 px-4 py-3">
                  {{ guide.createdAt }}
                </td>
              </tr>

              <!-- Status -->
              <tr>
                <td
                  class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50"
                >
                  Status
                </td>
                <td class="w-2/3 px-4 py-3">
                  <span
                    class="px-2 py-1 rounded-md text-xs font-medium"
                    :class="getStatusClass(guide.status)"
                  >
                    {{ formatStatus(guide.status) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div v-if="guide" class="flex justify-end mt-6 gap-2">
      <!-- <button 
        class="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
        @click="router.push('/admin/pengguna/guide')"
      >
        Kembali
      </button> -->
      <button
        class="bg-[#4072EE] text-white px-4 py-2 rounded-[5px] w-[110px] h-[35px] hover:bg-[#3060DD]"
      >
        Simpan
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useGuideStore } from "~/store/guide";

// Router
const route = useRoute();
const router = useRouter();
const guideId = computed(() => route.params.id as string);

// Store
const guideStore = useGuideStore();
const guide = computed(() => guideStore.selectedGuide);
const isLoading = computed(() => guideStore.isLoading);
const error = computed(() => guideStore.error);

// Methods
const formatStatus = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const getStatusClass = (status: string): string => {
  const statusClasses: Record<string, string> = {
    menunggu: "bg-yellow-100 text-yellow-800",
    aktif: "bg-green-100 text-green-800",
    dibatalkan: "bg-red-100 text-red-800",
    nonaktif: "bg-gray-100 text-gray-800",
  };

  return statusClasses[status] || "";
};

// Lifecycle
onMounted(async () => {
  if (guideId.value) {
    try {
      await guideStore.loadGuideDetails(guideId.value);
    } catch (error) {
      console.error("Error loading guide details:", error);
    }
  }
});
</script>
