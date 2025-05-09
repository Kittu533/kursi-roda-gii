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
      <span>Pelanggan</span>
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
    <h1 class="text-xl font-bold mb-4">Data Pelanggan Baru</h1>

    <div class="bg-white rounded-md p-4">
      <div class="space-y-4">
        <!-- Nama Lengkap -->
        <div class="flex items-center">
          <div class="w-1/4">
            <label class="text-sm">Nama Lengkap <span class="text-red-500">*</span></label>
          </div>
          <div class="w-3/4 flex">
            <input
              v-model="formData.name"
              type="text"
              class="w-full border rounded-md px-3 py-2"
              required
            />
          </div>
        </div>

        <!-- Email -->
        <div class="flex items-center">
          <div class="w-1/4">
            <label class="text-sm">Email <span class="text-red-500">*</span></label>
          </div>
          <div class="w-3/4 flex">
            <input
              v-model="formData.email"
              type="email"
              class="w-full border rounded-md px-3 py-2"
              required
            />
          </div>
        </div>

        <!-- Kode Telepon -->
        <div class="flex items-center">
          <div class="w-1/4">
            <label class="text-sm">Kode Telepon <span class="text-red-500">*</span></label>
          </div>
          <div class="w-3/4 flex">
            <input
              v-model="formData.phone_code"
              type="text"
              class="w-full border rounded-md px-3 py-2"
              placeholder="+62"
              required
            />
          </div>
        </div>

        <!-- Nomor Telepon -->
        <div class="flex items-center">
          <div class="w-1/4">
            <label class="text-sm">Nomor Telepon <span class="text-red-500">*</span></label>
          </div>
          <div class="w-3/4 flex">
            <input
              v-model="formData.phone"
              type="tel"
              class="w-full border rounded-md px-3 py-2"
              placeholder="89696741231"
              required
            />
          </div>
        </div>

        <!-- Jenis Kelamin -->
        <div class="flex items-center">
          <div class="w-1/4">
            <label class="text-sm">Jenis Kelamin <span class="text-red-500">*</span></label>
          </div>
          <div class="w-3/4 flex">
            <select
              v-model="formData.gender"
              class="w-full border rounded-md px-3 py-2"
              required
            >
              <option value="">Pilih Jenis Kelamin</option>
              <option value="male">Laki-laki</option>
              <option value="female">Perempuan</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Debug Info -->
    <div v-if="showDebug" class="mt-4 p-3 bg-gray-100 text-gray-700 rounded-md">
      <pre class="text-xs overflow-auto">{{ JSON.stringify(formData, null, 2) }}</pre>
      <button @click="showDebug = false" class="text-xs text-blue-500 mt-2">Hide Debug</button>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
      {{ errorMessage }}
      <button @click="showDebug = true" class="text-xs text-blue-500 ml-2">Show Debug Info</button>
    </div>

    <!-- Save Button -->
    <div class="flex justify-end mt-4">
      <button
        @click="handleSubmit"
        class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        :disabled="isLoading"
      >
        {{ isLoading ? 'Menyimpan...' : 'Simpan' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useCustomerStore } from "~/store/customer";
import { useRouter } from "vue-router";

const customerStore = useCustomerStore();
const router = useRouter();
const isLoading = ref(false);
const errorMessage = ref("");
const showDebug = ref(false);

// Adjusted to match the API payload format in the example
const formData = ref({
  name: "",         // Using 'name' instead of 'full_name'
  email: "",
  phone_code: "+62", // Added phone_code field
  phone: "",
  gender: ""
});

// Validate form before submission
const validateForm = () => {
  if (!formData.value.name) {
    errorMessage.value = "Nama lengkap harus diisi";
    return false;
  }
  if (!formData.value.email) {
    errorMessage.value = "Email harus diisi";
    return false;
  }
  if (!formData.value.phone_code) {
    errorMessage.value = "Kode telepon harus diisi";
    return false;
  }
  if (!formData.value.phone) {
    errorMessage.value = "Nomor telepon harus diisi";
    return false;
  }
  if (!formData.value.gender) {
    errorMessage.value = "Jenis kelamin harus dipilih";
    return false;
  }
  return true;
};

const handleSubmit = async () => {
  errorMessage.value = "";
  
  if (!validateForm()) {
    return;
  }
  
  try {
    isLoading.value = true;
    
    // No transformation needed - send formData directly as it now matches API requirements
    await customerStore.createCustomerRaw(formData.value);
    
    alert("Pelanggan berhasil ditambahkan!");
    router.push("/admin/pengguna/pelanggan");
  } catch (error: any) {
    console.error("Error creating customer:", error);
    errorMessage.value = 
      error?.data?.metaData?.message || 
      error?.message || 
      "Gagal menambahkan pelanggan. Pastikan semua data terisi dengan benar.";
    showDebug.value = true;
  } finally {
    isLoading.value = false;
  }
};
</script>