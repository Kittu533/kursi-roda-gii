<template>
  <div class="p-4">
    <!-- Breadcrumb -->
    <div class="flex items-center space-x-2 text-sm mb-4">
      <NuxtLink to="/" class="text-muted-foreground hover:text-foreground">Beranda</NuxtLink>
      <span>/</span>
      <NuxtLink to="/admin/pengguna/guide" class="text-muted-foreground hover:text-foreground">Guide</NuxtLink>
      <span>/</span>
      <span class="font-medium">Tambah</span>
    </div>

    <h1 class="text-xl font-bold mb-4">Tambah Data Guide</h1>

    <form @submit.prevent="handleSubmit" class="bg-white rounded-md p-4 space-y-4">
      <div v-for="(label, key) in fieldLabels" :key="key" class="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <label class="text-sm font-medium">{{ label }}</label>

        <!-- Select status -->
        <select
          v-if="key === 'status'"
          v-model="formData.status"
          class="md:col-span-3 border rounded-md px-3 py-2 w-full"
        >
          <option value="">Pilih Status</option>
          <option value="ACT">Aktif</option>
          <option value="INC">Nonaktif</option>
          <option value="DEL">Dihapus</option>
        </select>

        <!-- Input -->
        <input
          v-else
          v-model="formData[key]"
          :type="key.includes('email') ? 'email' : 'text'"
          class="md:col-span-3 border rounded-md px-3 py-2 w-full"
        />
      </div>

      <div class="flex justify-end pt-4">
        <button type="submit" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">
          Simpan
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGuideStore } from '~/store/guide';

const router = useRouter();
const guideStore = useGuideStore();

const formData = ref({
  name: '',
  email: '',
  phone: '',
  phone_code: '62',
  emergency_phone_number: '',
  profile_photo: '',
  identity_document: '',
  bank_account_number: '',
  status: ''
});

const fieldLabels: Record<string, string> = {
  name: 'Nama Lengkap',
  email: 'Email',
  phone: 'Nomor Telepon',
  phone_code: 'Kode Telepon',
  emergency_phone_number: 'No. Darurat',
  profile_photo: 'Foto Profil (URL)',
  identity_document: 'KTP (URL)',
  bank_account_number: 'Nomor Rekening',
  status: 'Status'
};

const handleSubmit = async () => {
  try {
    await guideStore.createNewGuide(formData.value);
    router.push('/admin/pengguna/guide');
  } catch (error) {
    console.error('Gagal menyimpan guide:', error);
    alert('Gagal menyimpan data. Periksa kembali form!');
  }
};
</script>
