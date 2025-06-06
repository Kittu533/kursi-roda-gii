<template>
  <div class="p-4 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center space-x-2 text-sm mb-4">
      <NuxtLink to="/" class="text-muted-foreground hover:text-foreground">Beranda</NuxtLink>
      <span>/</span>
      <NuxtLink to="/admin/model-wheelchair" class="text-muted-foreground hover:text-foreground">Model Kursi Roda
      </NuxtLink>
      <span>/</span>
      <span>Tambah Kursi Roda</span>
    </div>

    <h1 class="text-xl font-bold">Tambah Kursi Roda</h1>

    <form @submit.prevent="handleSubmit" class="bg-white p-6 rounded-md space-y-4">
      <!-- Nama Kursi Roda -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <label class="text-sm font-medium">Nama Kursi Roda</label>
        <input v-model="formData.name" type="text" class="form-input md:col-span-3" required />
      </div>

      <!-- ID Model (readonly) -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <label class="text-sm font-medium">ID Model</label>
        <input :value="modelId" type="text" class="form-input md:col-span-3 bg-gray-100" readonly />
      </div>

      <!-- Agen (dropdown) -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <label class="text-sm font-medium">Agen</label>
        <select v-model="formData.agent_id" class="form-input md:col-span-3" required>
          <option value="">Pilih Agen</option>
          <option v-for="agent in agents" :key="agent.id" :value="agent.id">
            {{ agent.full_name }} ({{ agent.location }})
          </option>
        </select>

      </div>

      <!-- Nomor Seri -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <label class="text-sm font-medium">Nomor Seri</label>
        <input v-model="formData.serial_number" type="text" class="form-input md:col-span-3" required />
      </div>

      <!-- Deskripsi -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
        <label class="text-sm font-medium">Deskripsi</label>
        <textarea v-model="formData.description" class="form-input md:col-span-3 h-24 resize-none" required></textarea>
      </div>

      <!-- Tombol Simpan -->
      <div class="flex justify-end pt-4">
        <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          :disabled="isLoading">
          {{ isLoading ? 'Menyimpan...' : 'Simpan' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useWheelchairStore } from '~/store/wheelchair'
import { useAgentStore } from '~/store/agent'
import { fetchModels } from '@/composables/consume-api/model.api'

const router = useRouter()
const route = useRoute()
const wheelchairStore = useWheelchairStore()
const agentStore = useAgentStore()
const isLoading = ref(false)

const modelId = computed(() => route.params.id as string)

// Data agent
const agents = computed(() => agentStore.agents.filter(a => a.status && a.status.status === 'ACT'))

const formData = ref({
  model_id: '',      // Diisi di bawah
  name: '',
  agent_id: '',
  serial_number: '',
  description: ''
})

onMounted(async () => {
  await agentStore.loadAgents()
  // ISI model_id dari URL saat mount!
  formData.value.model_id = modelId.value
})

const handleSubmit = async () => {
  try {
    isLoading.value = true
    // JAGA-JAGA, ISI model_id lagi saat submit
    formData.value.model_id = modelId.value
    await wheelchairStore.createNewWheelchair(formData.value)
    alert('Kursi roda berhasil ditambahkan!')
    router.push('/admin/model-wheelchair/' + modelId.value )
  } catch (error) {
    alert('Gagal menambahkan kursi roda.')
  } finally {
    isLoading.value = false
  }
}
</script>


<style scoped>
.form-input {
  @apply w-full border rounded-md px-3 py-2;
}
</style>
