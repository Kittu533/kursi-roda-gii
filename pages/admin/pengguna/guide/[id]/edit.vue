<template>
  <div class="space-y-4">
    <!-- Breadcrumb Navigation -->
    <div class="flex items-center space-x-2 text-sm mb-4">
      <NuxtLink to="/" class="text-muted-foreground hover:text-foreground">
        <NuxtIcon name="material-symbols:home" class="w-5 h-5" />
      </NuxtLink>
      <NuxtIcon name="material-symbols:chevron-right" class="text-muted-foreground w-5 h-5" />
      <NuxtLink to="/admin/pengguna/guide" class="text-muted-foreground hover:text-foreground">
        Pengguna
      </NuxtLink>
      <NuxtIcon name="material-symbols:chevron-right" class="text-muted-foreground w-5 h-5" />
      <NuxtLink to="/admin/pengguna/guide" class="text-muted-foreground hover:text-foreground">
        Guide
      </NuxtLink>
    </div>

    <h1 class="text-xl font-bold mb-4">Edit Guide</h1>

    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-100 p-4 rounded-md text-red-800">
      {{ error }}
    </div>

    <!-- Form -->
    <form class="bg-white rounded-md p-4 space-y-4" @submit.prevent="saveGuide">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-center" v-for="(label, key) in fieldLabels" :key="key">
        <label class="text-sm font-medium">{{ label }}</label>

        <!-- File input for photo_profile & identity_document -->
        <div v-if="key === 'photo_profile' || key === 'identity_document'"
          class="md:col-span-3 flex items-center gap-3">
          <input type="file" accept="image/png, image/jpeg,application/pdf" @change="onFileChange($event, key)"
            class="border rounded-md px-3 py-2 w-full" />

        </div>

        <!-- Select status -->
        <select v-else-if="key === 'status'" v-model="formData.status"
          class="md:col-span-3 border rounded-md px-3 py-2 w-full">
          <option value="">Pilih Status</option>
          <option value="ACT">Aktif</option>
          <option value="INC">Nonaktif</option>
          <option value="DEL">Dihapus</option>
        </select>

        <!-- Input text/email -->
        <input v-else v-model="formData[key]" :type="key.includes('email') ? 'email' : 'text'"
          class="md:col-span-3 border rounded-md px-3 py-2 w-full" />
      </div>

      <div class="flex justify-end pt-4">
        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
          Simpan
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGuideStore } from '~/store/guide';
import { useFileServiceStore } from '~/store/file-service';

const route = useRoute();
const router = useRouter();
const guideStore = useGuideStore();
const fileService = useFileServiceStore();

const guideId = computed(() => route.params.id as string);
const isEditing = computed(() => guideId.value && guideId.value !== 'new');
const isLoading = computed(() => guideStore.isLoading);
const error = computed(() => guideStore.error);

// Pastikan pakai key "photo_profile"
const formData = ref({
  full_name: '',
  email: '',
  phone: '',
  emergency_phone_number: '',
  photo_profile: '',
  identity_document: '',
  bank_account_number: '',
  status: ''
});

const fieldLabels: Record<string, string> = {
  full_name: 'Nama Lengkap',
  email: 'Email',
  phone: 'Nomor Telepon',
  emergency_phone_number: 'No. Darurat',
  photo_profile: 'Foto Profil',
  identity_document: 'KTP',
  bank_account_number: 'Nomor Rekening',
  status: 'Status'
};

// File upload handler (mirip create)
async function onFileChange(event: Event, key: string) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;
  try {
    const url = await fileService.uploadFileBase64(file);
    formData.value[key] = url;
  } catch (e) {
    alert('Gagal upload file: ' + e);
  }
}

// Save Action
const saveGuide = async () => {
  if (!formData.value.photo_profile || !formData.value.identity_document) {
    alert('Foto profil dan KTP wajib di-upload!');
    return;
  }
  try {
    await guideStore.updateGuide(guideId.value, { ...formData.value });
    router.push('/admin/pengguna/guide');
  } catch (err) {
    console.error('Error saving guide:', err);
  }
};

// Load existing data
onMounted(async () => {
  if (isEditing.value) {
    try {
      const guide = await guideStore.getGuideDetail(guideId.value);
      if (guide) {
        formData.value = {
          full_name: guide.full_name,
          email: guide.email,
          phone: guide.phone,
          emergency_phone_number: guide.emergency_phone_number,
          photo_profile: guide.photo_profile,
          identity_document: guide.identity_document,
          bank_account_number: guide.bank_account_number,
          status: guide.status?.status || '' // sesuaikan sesuai struktur data backend
        };
      }
    } catch (err) {
      console.error('Error loading guide details:', err);
    }
  }
});
</script>
