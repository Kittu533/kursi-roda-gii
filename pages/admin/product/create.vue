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
      <NuxtLink
        to="/admin/model-wheelchair"
        class="flex  items-center justify-between text-muted-foreground hover:text-foreground"
      >
        <span>Model</span>
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
      </NuxtLink>
      <span>Produk</span>
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
    <h1 class="text-xl font-bold mb-4">Data Produk Baru</h1>
    <!-- Form Produk -->
    <form
      @submit.prevent="handleSubmit"
      class="bg-white rounded-md p-4 space-y-4"
    >
      <!-- Nama Produk -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <label class="text-sm font-medium">Nama Produk</label>
        <input
          v-model="formData.nama"
          type="text"
          class="md:col-span-3 border rounded-md px-3 py-2 w-full"
        />
      </div>

      <!-- ID Produk -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <label class="text-sm font-medium">ID Produk</label>
        <input
          v-model="formData.idProduk"
          type="text"
          class="md:col-span-3 border rounded-md px-3 py-2 w-full"
        />
      </div>

      <!-- ID Agen -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <label class="text-sm font-medium">ID Agen</label>
        <input
          v-model="formData.idAgen"
          type="text"
          class="md:col-span-3 border rounded-md px-3 py-2 w-full"
        />
      </div>

      <!-- Foto Produk -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <label class="text-sm font-medium">Foto Produk</label>
        <input
          @change="handleFileUpload($event, 'fotoProduk')"
          type="file"
          accept="image/*"
          class="md:col-span-3 border rounded-md px-3 py-2 w-full"
        />
      </div>

      <!-- Nomor Seri -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <label class="text-sm font-medium">Nomor Seri</label>
        <input
          v-model="formData.nomorSeri"
          type="text"
          class="md:col-span-3 border rounded-md px-3 py-2 w-full"
        />
      </div>

      <!-- Model -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <label class="text-sm font-medium">Model</label>
        <input
          v-model="formData.model"
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
    </form>

    <!-- Tombol Simpan -->
    <div class="flex justify-end">
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

interface ProductForm {
  nama: string;
  idProduk: string;
  idAgen: string;
  fotoProduk: File | null;
  nomorSeri: string;
  model: string;
  kapasitasBerat: string;
  kapasitasBaterai: string;
  status: "aktif" | "nonaktif" | "";
  terakhirPerbaikan: string;
  tanggalDibuat: string;
  terakhirDiperbarui: string;
}

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

const saveProduct = async (): Promise<void> => {
  try {
    // Logic to save product
    console.log("Saving product:", formData.value);
  } catch (error) {
    console.error("Error saving product:", error);
  }
};
</script>
