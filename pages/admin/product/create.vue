<template>
  <div class="p-4 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center space-x-2 text-sm mb-4">
      <NuxtLink to="/" class="text-muted-foreground hover:text-foreground">Beranda</NuxtLink>
      <span>/</span>
      <NuxtLink to="/admin/wheelchair" class="text-muted-foreground hover:text-foreground">Kursi Roda</NuxtLink>
      <span>/</span>
      <span>Tambah</span>
    </div>

    <h1 class="text-xl font-bold">Tambah Kursi Roda</h1>

    <form @submit.prevent="handleSubmit" class="bg-white p-6 rounded-md space-y-4">
      <!-- ID Model -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <label class="text-sm font-medium">ID Model</label>
        <input v-model="formData.model_id" type="text" class="form-input md:col-span-3" required />
      </div>

      <!-- ID Agen -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <label class="text-sm font-medium">ID Agen</label>
        <input v-model="formData.agent_id" type="text" class="form-input md:col-span-3" required />
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useWheelchairStore } from '~/store/wheelchair'

const router = useRouter()
const wheelchairStore = useWheelchairStore()
const isLoading = ref(false)

const formData = ref({
  model_id: '',
  agent_id: '',
  serial_number: '',
  description: ''
})

const handleSubmit = async () => {
  try {
    isLoading.value = true
    await wheelchairStore.createNewWheelchair(formData.value)
    alert('Kursi roda berhasil ditambahkan!')
    router.push('/admin/wheelchair')
  } catch (error) {
    console.error('Gagal menambahkan kursi roda:', error)
    alert('Gagal menambahkan kursi roda. Silakan cek kembali data.')
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
