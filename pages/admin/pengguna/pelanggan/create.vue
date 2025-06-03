<template>
  <div class="p-4">
    <!-- Breadcrumb Navigation -->
    <div class="flex items-center space-x-2 text-sm mb-4">
      <NuxtLink to="/" class="text-muted-foreground hover:text-foreground">
        <NuxtIcon name="material-symbols:home" class="text-muted-foreground w-5 h-5" />
      </NuxtLink>
      <NuxtIcon name="material-symbols:chevron-right" class="text-muted-foreground w-5 h-5" />
      <NuxtLink to="/admin/pengguna/agent" class="text-muted-foreground hover:text-foreground">
        Pengguna
      </NuxtLink>
      <NuxtIcon name="material-symbols:chevron-right" class="text-muted-foreground w-5 h-5" />
      <NuxtLink to="/admin/pengguna/agent" class="text-muted-foreground hover:text-foreground">
        Agen
      </NuxtLink>
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
            <input v-model="formData.full_name" type="text" class="w-full border rounded-md px-3 py-2" required />

          </div>
        </div>

        <!-- Email -->
        <div class="flex items-center">
          <div class="w-1/4">
            <label class="text-sm">Email <span class="text-red-500">*</span></label>
          </div>
          <div class="w-3/4 flex">
            <input v-model="formData.email" type="email" class="w-full border rounded-md px-3 py-2" required />
          </div>
        </div>

        <!-- Kode Telepon -->
        <div class="flex items-center">
          <div class="w-1/4">
            <label class="text-sm">Kode Telepon <span class="text-red-500">*</span></label>
          </div>
          <div class="w-3/4 flex">
            <input v-model="formData.phone_code" type="text"
              class="w-full border rounded-md px-3 py-2 bg-gray-100 text-gray-600" readonly />

          </div>
        </div>

        <!-- Nomor Telepon -->
        <div class="flex items-center">
          <div class="w-1/4">
            <label class="text-sm">Nomor Telepon <span class="text-red-500">*</span></label>
          </div>
          <div class="w-3/4 flex">
            <input v-model="formData.phone" type="tel" class="w-full border rounded-md px-3 py-2"
              placeholder="89696741231" required />
          </div>
        </div>

        <!-- Jenis Kelamin -->
        <div class="flex items-center">
          <div class="w-1/4">
            <label class="text-sm">Jenis Kelamin <span class="text-red-500">*</span></label>
          </div>
          <div class="w-3/4 flex">
            <select v-model="formData.gender" class="w-full border rounded-md px-3 py-2" required>
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
      <pre class="text-xs overflow-auto">{{
        JSON.stringify(formData, null, 2)
      }}</pre>
      <button @click="showDebug = false" class="text-xs text-blue-500 mt-2">
        Hide Debug
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
      {{ errorMessage }}
      <button @click="showDebug = true" class="text-xs text-blue-500 ml-2">
        Show Debug Info
      </button>
    </div>

    <!-- Save Button -->
    <div class="flex justify-end mt-4">
      <button @click="handleSubmit" class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        :disabled="isLoading">
        {{ isLoading ? "Menyimpan..." : "Simpan" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useCustomerStore } from "~/store/customer";
import { useRouter } from "vue-router";

const customerStore = useCustomerStore();
const router = useRouter();

const isLoading = ref(false);
const errorMessage = ref("");
const showDebug = ref(false);

// Form sesuai format API
const formData = ref({
  full_name: "",
  email: "",
  phone_code: "+62",
  phone: "",
  gender: "",
  status: "ACT",
});

const validateForm = () => {
  if (!formData.value.full_name)
    return (errorMessage.value = "Nama lengkap harus diisi"), false;
  if (!formData.value.email)
    return (errorMessage.value = "Email harus diisi"), false;
  if (!formData.value.phone)
    return (errorMessage.value = "Nomor telepon harus diisi"), false;
  if (!formData.value.gender)
    return (errorMessage.value = "Jenis kelamin harus dipilih"), false;
  if (!formData.value.status)
    return (errorMessage.value = "Status harus dipilih"), false;
  return true;
};

const handleSubmit = async () => {
  errorMessage.value = "";

  if (!validateForm()) return;

  try {
    isLoading.value = true;

    await customerStore.createCustomerRaw({ ...formData.value });

    alert("Pelanggan berhasil ditambahkan!");
    router.push("/admin/pengguna/pelanggan");
  } catch (error: any) {
    console.error("Error creating customer:", error);
    errorMessage.value =
      error?.data?.metaData?.message ||
      error?.message ||
      "Gagal menambahkan pelanggan. Pastikan data sudah benar.";
    showDebug.value = true;
  } finally {
    isLoading.value = false;
  }
};
</script>
