<template>
  <div class="p-6 space-y-6 bg-white rounded-md shadow">
    <h1 class="text-2xl font-bold mb-4">
      {{ isEditing ? 'Edit Kursi Roda' : 'Tambah Kursi Roda Baru' }}
    </h1>

    <!-- Breadcrumb -->
    <div class="flex items-center space-x-2 text-sm text-muted-foreground">
      <NuxtLink to="/">Beranda</NuxtLink>
      <span>/</span>
      <NuxtLink to="/admin/wheelchair">Kursi Roda</NuxtLink>
      <span>/</span>
      <span>{{ isEditing ? 'Edit' : 'Tambah' }}</span>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-100 text-red-700 p-4 rounded-md">
      {{ error }}
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">ID Model</label>
          <input v-model="form.model_id" type="text" class="form-input" required />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">ID Agen</label>
          <input v-model="form.agent_id" type="text" class="form-input" required />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Nomor Seri</label>
        <input v-model="form.serial_number" type="text" class="form-input" required />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Deskripsi</label>
        <textarea v-model="form.description" class="form-input h-24 resize-none" required></textarea>
      </div>

      <div class="flex justify-end gap-2 pt-4">
        <button type="button" @click="router.push('/admin/wheelchair')"
          class="border px-4 py-2 rounded-md hover:bg-gray-50">
          Batal
        </button>
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Simpan
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWheelchairStore } from '~/store/wheelchair'

const route = useRoute()
const router = useRouter()
const wheelchairStore = useWheelchairStore()

const id = computed(() => route.params.id as string)
const isEditing = computed(() => id.value !== 'new')

const isLoading = ref(false)
const error = ref('')
const form = ref({
  model_id: '',
  agent_id: '',
  serial_number: '',
  description: ''
})

const handleSubmit = async () => {
  try {
    isLoading.value = true
    error.value = ''
    if (isEditing.value) {
      await wheelchairStore.updateWheelchair(id.value, form.value)
    } else {
      await wheelchairStore.createNewWheelchair(form.value)
    }
    router.push('/admin/wheelchair')
  } catch (err) {
    error.value = 'Gagal menyimpan data. Periksa kembali inputan.'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  if (isEditing.value) {
    isLoading.value = true
    try {
      const data = await wheelchairStore.getWheelchairDetail(id.value)
      if (data) {
        form.value = {
          model_id: data.model_id,
          agent_id: data.agent_id,
          serial_number: data.serial_number,
          description: data.description
        }
      }
    } catch (err) {
      error.value = 'Gagal memuat data kursi roda.'
    } finally {
      isLoading.value = false
    }
  }
})
</script>

<style scoped>
.form-input {
  @apply w-full border rounded-md px-3 py-2;
}
</style>
