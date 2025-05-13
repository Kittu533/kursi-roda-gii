<template>
  <div class="space-y-4">
    <!-- Breadcrumb Navigation -->
    <div class="flex items-center space-x-2 text-sm mb-4">
      <NuxtLink to="/" class="text-muted-foreground hover:text-foreground">
        <NuxtIcon
          name="material-symbols:home"
          class="text-muted-foreground w-5 h-5"
        />
      </NuxtLink>
      <NuxtIcon
        name="material-symbols:chevron-right"
        class="text-muted-foreground w-5 h-5"
      />
      <NuxtLink
        to="/admin/pengguna/agent"
        class="text-muted-foreground hover:text-foreground"
      >
        Pengguna
      </NuxtLink>
      <NuxtIcon
        name="material-symbols:chevron-right"
        class="text-muted-foreground w-5 h-5"
      />
      <NuxtLink
        to="/admin/pengguna/agent"
        class="text-muted-foreground hover:text-foreground"
      >
        Agen
      </NuxtLink>
    </div>
    <h1 class="text-xl font-bold mb-4">Edit Agen</h1>

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
      class="bg-white rounded-md p-4 space-y-4"
      @submit.prevent="handleSubmit"
    >
      <div
        class="grid grid-cols-1 md:grid-cols-4 gap-4 items-center"
        v-for="(label, key) in fieldLabels"
        :key="key"
      >
        <label class="text-sm font-medium">{{ label }}</label>
        <input
          v-if="key !== 'status'"
          v-model="formData[key]"
          :type="
            key.includes('time')
              ? 'time'
              : key === 'email'
                ? 'email'
                : key === 'password'
                  ? 'password'
                  : 'text'
          "
          class="md:col-span-3 border rounded-md px-3 py-2 w-full"
        />
        <select
          v-else
          v-model="formData.status"
          class="md:col-span-3 border rounded-md px-3 py-2 w-full"
        >
          <option value="">Pilih Status</option>
          <option value="ACT">Aktif</option>
          <option value="NON">Nonaktif</option>
          <option value="INC">Menunggu</option>
          <option value="DEL">Dihapus</option>
        </select>
      </div>
      <div class="flex justify-end pt-4">
        <button
          type="submit"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Simpan
        </button>
      </div>
      <div v-if="errorMessage" class="text-red-600 text-sm mt-2">
        {{ errorMessage }}
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAgentStore } from '~/store/agent';

const router = useRouter();
const agentStore = useAgentStore();

const formData = ref({
  full_name: '',
  email: '',
  username: '',
  phone_code: '+62',
  phone: '',
  password: '',
  location: '',
  open_time: '',
  close_time: '',
  latitude: '',
  longitude: '',
  status: ''
});

const fieldLabels: Record<string, string> = {
  full_name: 'Nama Lengkap',
  email: 'Email',
  username: 'Username',
  phone_code: 'Kode Telepon',
  phone: 'Nomor Telepon',
  password: 'Password',
  location: 'Lokasi',
  open_time: 'Jam Buka',
  close_time: 'Jam Tutup',
  latitude: 'Latitude',
  longitude: 'Longitude',
  status: 'Status'
};

const errorMessage = ref('');

function validateForm(): boolean {
  for (const [key, value] of Object.entries(formData.value)) {
    if (!value) {
      errorMessage.value = `Field "${fieldLabels[key] || key}" tidak boleh kosong.`;
      return false;
    }
  }
  errorMessage.value = '';
  return true;
}

async function handleSubmit() {
  if (!validateForm()) return;

  try {
    await agentStore.createNewAgent({ ...formData.value });
    router.push('/admin/pengguna/agent');
  } catch (err) {
    errorMessage.value = 'Gagal menyimpan data agen.';
    console.error('Submit error:', err);
  }
}
</script>


<style scoped>
label {
  display: inline-block;
  min-width: 100px;
}
</style>
