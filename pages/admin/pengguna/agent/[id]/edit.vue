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
    <form class="bg-white rounded-md p-4 space-y-4" @submit.prevent="saveAgent">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-center" v-for="(label, key) in fieldLabels" :key="key">
        <label class="text-sm font-medium">{{ label }}</label>
        <input
          v-if="key !== 'status'"
          v-model="formData[key]"
          :type="key.includes('time') ? 'time' : key === 'email' ? 'email' : key === 'password' ? 'password' : 'text'"
          class="md:col-span-3 border rounded-md px-3 py-2 w-full"
        />
        <select
          v-else
          v-model="formData.status"
          class="md:col-span-3 border rounded-md px-3 py-2 w-full"
        >
          <option value="">Pilih Status</option>
          <option value="ACT">Aktif</option>
          <option value="INC">Nonaktif</option>
          <option value="DEL">Dihapus</option>
        </select>
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
import { useAgentStore } from '~/store/agent';

const route = useRoute();
const router = useRouter();
const agentStore = useAgentStore();

const agentId = computed(() => route.params.id as string);
const isEditing = computed(() => agentId.value && agentId.value !== 'new');
const isLoading = computed(() => agentStore.isLoading);
const error = computed(() => agentStore.error);

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

const saveAgent = async () => {
  try {
    await agentStore.updateAgent(agentId.value, { ...formData.value });
    router.push('/admin/pengguna/agent');
  } catch (error) {
    console.error('Error saving agent:', error);
  }
};

onMounted(async () => {
  if (isEditing.value) {
    try {
      const agent = await agentStore.getAgentDetail(agentId.value);
      if (agent) {
        formData.value = {
          full_name: agent.full_name,
          email: agent.email,
          username: agent.username,
          phone_code: agent.phone_code,
          phone: agent.phone,
          password: '',
          location: agent.location,
          open_time: agent.open_time,
          close_time: agent.close_time,
          latitude: agent.latitude,
          longitude: agent.longitude,
          status: agent.status?.status || ''
        };
      }
    } catch (error) {
      console.error('Error loading agent details:', error);
    }
  }
});
</script>
