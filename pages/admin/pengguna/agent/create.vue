<template>
  <div class="space-y-4">
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
    <h1 class="text-xl font-bold mb-4">Edit Agen</h1>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-red-100 p-4 rounded-md text-red-800">
      {{ error }}
    </div>

    <!-- Form -->
    <form class="bg-white rounded-md p-4 space-y-4" @submit.prevent="handleSubmit">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-center" v-for="(label, key) in fieldLabels" :key="key">
        <label class="text-sm font-medium">{{ label }}</label>

        <!-- File input untuk photo_profile -->
        <div v-if="key === 'photo_profile'" class="md:col-span-3 flex items-center gap-3">
          <input type="file" accept="image/png,image/jpeg" @change="onFileChange($event, key)"
            class="border rounded-md px-3 py-2 w-full" />
          <template v-if="formData.photo_profile">
            <a :href="formData.photo_profile" target="_blank"
              class="inline-flex items-center gap-1 px-2 py-1 border rounded text-xs hover:bg-gray-50">
              <Icon name="mdi:eye-outline" /> Lihat
            </a>
          </template>
        </div>

        <!-- Select status -->
        <select v-else-if="key === 'status'" v-model="formData.status"
          class="md:col-span-3 border rounded-md px-3 py-2 w-full">
          <option value="">Pilih Status</option>
          <option value="ACT">Aktif</option>
          <option value="NON">Nonaktif</option>
          <option value="INC">Menunggu</option>
          <option value="DEL">Dihapus</option>
        </select>

        <!-- Map Picker untuk latitude/longitude -->
        <div v-else-if="key === 'latitude'" class="md:col-span-3 flex items-center gap-2">
          <input v-model="formData.latitude" type="text" readonly placeholder="Latitude"
            class="w-36 border rounded-md px-3 py-2" />
          <input v-model="formData.longitude" type="text" readonly placeholder="Longitude"
            class="w-36 border rounded-md px-3 py-2" />
          <button type="button" class="bg-blue-500 text-white px-3 py-1 rounded" @click="() => {
            console.log('Opening map modal');
            try {
              openMapModal();
              console.log('Map modal opened successfully');
            } catch (err) {
              console.error('Error opening map modal:', err);
            }
          }">
            Pilih di Peta
          </button>
        </div>

        <!-- Input biasa -->
        <input v-else v-model="formData[key]" :type="key.includes('time')
          ? 'time'
          : key === 'email'
            ? 'email'
            : key === 'password'
              ? 'password'
              : 'text'
          " class="md:col-span-3 border rounded-md px-3 py-2 w-full" />
      </div>

      <div class="flex justify-end pt-4">
        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
          Simpan
        </button>
      </div>
      <div v-if="errorMessage" class="text-red-600 text-sm mt-2">
        {{ errorMessage }}
      </div>
    </form>
    <!-- Modal Picker Map -->
    <MapPickerModal v-if="showMapModal" :show="showMapModal"
      :initLat="formData.latitude ? Number(formData.latitude) : undefined"
      :initLng="formData.longitude ? Number(formData.longitude) : undefined" @selected="onLocationSelected"
      @close="showMapModal = false" />



  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAgentStore } from '~/store/agent';
import { useFileServiceStore } from '~/store/file-service';
// Import modal map
import MapPickerModal from '@/components/map-picker-modal.vue';

const router = useRouter();
const route = useRoute();
const agentStore = useAgentStore();
const fileService = useFileServiceStore();

const agentId = computed(() => route.params.id as string);
const isLoading = computed(() => agentStore.isLoading);
const error = computed(() => agentStore.error);

const showMapModal = ref(false);

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
  status: '',
  photo_profile: ''
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
  status: 'Status',
  photo_profile: 'Foto Profil'
};

const errorMessage = ref('');

// Upload file service
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

// Buka map modal
function openMapModal() {
  showMapModal.value = true;
}

// Callback setelah pilih lokasi di peta
function onLocationSelected({ lat, lng, address }) {
  formData.value.latitude = lat
  formData.value.longitude = lng
  formData.value.location = address
}




// Validasi dan submit
function validateForm() {
  if (!formData.value.photo_profile) {
    errorMessage.value = 'Foto profil wajib di-upload.';
    return false;
  }
  for (const [key, value] of Object.entries(formData.value)) {
    if (key !== 'password' && !value) {
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

// Load existing data if edit
onMounted(async () => {
  if (agentId.value) {
    try {
      const agent = await agentStore.getAgentById(agentId.value);
      if (agent) {
        formData.value = {
          full_name: agent.full_name || '',
          email: agent.email || '',
          username: agent.username || '',
          phone_code: agent.phone_code || '+62',
          phone: agent.phone || '',
          password: '',
          location: agent.location || '',
          open_time: agent.open_time || '',
          close_time: agent.close_time || '',
          latitude: agent.latitude || '',
          longitude: agent.longitude || '',
          status: agent.status || '',
          photo_profile: agent.photo_profile || ''
        };
      }
    } catch (err) {
      errorMessage.value = 'Gagal memuat data agen.';
      console.error('Load error:', err);
    }
  }
});
</script>

<style scoped>
label {
  display: inline-block;
  min-width: 100px;
}
</style>
