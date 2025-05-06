<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">
          {{ isEditing ? "Edit Agen" : "Tambah Agen Baru" }}
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
        to="/admin/pengguna/agent"
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
        to="/admin/pengguna/agent"
        class="text-muted-foreground hover:text-foreground"
      >
        Agen
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
      @submit.prevent="handleSubmit"
      class="bg-white rounded-md p-4 space-y-4"
    >
      <!-- ID Agen -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <label class="text-sm font-medium">ID Agen</label>
        <input
          v-model="formData.idAgen"
          type="text"
          class="md:col-span-3 border rounded-md px-3 py-2 w-full"
        />
      </div>

      <!-- Nama Lengkap -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <label class="text-sm font-medium">Nama Lengkap</label>
        <input
          v-model="formData.namaLengkap"
          type="text"
          class="md:col-span-3 border rounded-md px-3 py-2 w-full"
        />
      </div>

      <!-- Foto Profil -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <label class="text-sm font-medium">Foto Profil</label>
        <input
          @change="handleFileUpload($event, 'fotoProfil')"
          type="file"
          accept="image/*"
          class="md:col-span-3 border rounded-md px-3 py-2 w-full"
        />
      </div>

      <!-- Nomor Telepon -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <label class="text-sm font-medium">Nomor Telepon</label>
        <input
          v-model="formData.nomorTelepon"
          type="tel"
          class="md:col-span-3 border rounded-md px-3 py-2 w-full"
        />
      </div>

      <!-- Email -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <label class="text-sm font-medium">Email</label>
        <input
          v-model="formData.email"
          type="email"
          class="md:col-span-3 border rounded-md px-3 py-2 w-full"
        />
      </div>

      <!-- Username -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <label class="text-sm font-medium">Username</label>
        <input
          v-model="formData.username"
          type="text"
          class="md:col-span-3 border rounded-md px-3 py-2 w-full"
        />
      </div>

      <!-- Lokasi -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <label class="text-sm font-medium">Lokasi</label>
        <input
          v-model="formData.lokasi"
          type="text"
          class="md:col-span-3 border rounded-md px-3 py-2 w-full"
        />
      </div>

      <!-- Jam Buka -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <label class="text-sm font-medium">Jam Buka</label>
        <input
          v-model="formData.jamBuka"
          type="time"
          class="md:col-span-3 border rounded-md px-3 py-2 w-full"
        />
      </div>

      <!-- Jam Tutup -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <label class="text-sm font-medium">Jam Tutup</label>
        <input
          v-model="formData.jamTutup"
          type="time"
          class="md:col-span-3 border rounded-md px-3 py-2 w-full"
        />
      </div>

      <!-- Status -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <label class="text-sm font-medium">Status</label>
        <select
          v-model="formData.status"
          class="md:col-span-3 border rounded-md px-3 py-2 w-full"
        >
          <option value="">Pilih Status</option>
          <option value="aktif">Aktif</option>
          <option value="nonaktif">Nonaktif</option>
        </select>
      </div>

     
    </form>
     <!-- Tombol Submit -->
     <div class="flex justify-end pt-4">
        <button
          type="submit"
          class="bg-green-600 hover:bg-green-600 text-white px-4 py-2 rounded-md"
        >
          Tambah
        </button>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAgentStore } from "~/store/agent";
import type { Agent } from "~/types/agent";

// Router
const route = useRoute();
const router = useRouter();
const agentId = computed(() => route.params.id as string);
const isEditing = computed(() => agentId.value && agentId.value !== "new");

// Store
const agentStore = useAgentStore();
const isLoading = computed(() => agentStore.isLoading);
const error = computed(() => agentStore.error);

// Form data
const formData = ref<Partial<Agent>>({
  name: "",
  email: "",
  phone: "",
  username: "",
  password: "",
  location: "",
  openHour: "",
  closeHour: "",
  latitude: "",
  longitude: "",
  status: "",
  photo: "/placeholder.svg?height=32&width=32",
});

// Lifecycle
onMounted(async () => {
  if (isEditing.value) {
    try {
      const agent = await agentStore.loadAgentDetails(agentId.value);
      if (agent) {
        formData.value = { ...agent };
      }
    } catch (error) {
      console.error("Error loading agent details:", error);
    }
  }
});
</script>
