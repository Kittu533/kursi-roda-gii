<template>
  <div class="p-4">
    <!-- Breadcrumb Navigation -->
    <div class="flex items-center space-x-2 text-sm mb-4">
      <NuxtLink
        to="/admin/product"
        class="text-muted-foreground hover:text-foreground"
      >
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
    <NuxtLink to="/admin/pengguna/guide" >
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
      <span>Tambah</span>
    </div>

    <!-- Form Container -->
    <h1 class="text-xl font-bold mb-4">Data Guide Baru</h1>

    <form
      @submit.prevent="handleSubmit"
      class="bg-white rounded-md p-4 space-y-4"
    >
      <!-- ID Guide -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <label class="text-sm font-medium">ID Guide</label>
        <input
          v-model="formData.idGuide"
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

      <!-- KTP -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <label class="text-sm font-medium">Nomor KTP</label>
        <input
          v-model="formData.nomoKTP"
          type="text"
          class="md:col-span-3 border rounded-md px-3 py-2 w-full"
        />
      </div>


      <!-- Nomor Rekening -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <label class="text-sm font-medium">Nomor Rekening</label>
        <input
          v-model="formData.nomorRekening"
          type="text"
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

      <!-- Tombol Submit -->
    </form>

    <!-- Save Button -->
    <div class="flex justify-end mt-4">
      <button
      type="submit"
        class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
      >
        Simpan
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const formData = ref<ProductForm>({
  nama: "",
  idProduk: "",
  idAgen: "",
  fotoProduk: null,
  nomorSeri: "",
  model: "",
  kapasitasBerat: "",
  kapasitasBaterai: "",
  status: "",
  terakhirPerbaikan: "",
  tanggalDibuat: "",
  terakhirDiperbarui: "",
});
</script>
