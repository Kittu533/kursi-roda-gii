<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">
          {{ isEditing ? "Edit Pelanggan" : "Tambah Pelanggan Baru" }}
        </h2>
      </div>
    </div>

    <!-- Breadcrumb Navigation -->
    <div class="flex items-center space-x-2 text-sm">
      <NuxtLink to="/" class="text-muted-foreground hover:text-foreground">
        <Icon name="lucide:home" class="w-4 h-4" />
      </NuxtLink>
      <Icon name="lucide:chevron-right" class="text-muted-foreground w-4 h-4" />
      <NuxtLink to="/admin/pengguna/pelanggan" class="text-muted-foreground hover:text-foreground">
        Pelanggan
      </NuxtLink>
      <Icon name="lucide:chevron-right" class="text-muted-foreground w-4 h-4" />
      <span>{{ isEditing ? "Edit" : "Tambah" }}</span>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-100 p-4 rounded-md text-red-800">
      {{ error }}
    </div>

    <!-- Form -->
    <form @submit.prevent="saveCustomer" class="bg-white border rounded-md overflow-hidden">
      <div class="p-4 border-b">
        <h3 class="text-lg font-medium">{{ isEditing ? "Data Pelanggan" : "Data Pelanggan Baru" }}</h3>
      </div>
      <div class="p-4 space-y-4">
        <div class="space-y-2">
          <label for="id" class="text-sm font-medium">ID Pelanggan</label>
          <input id="id" type="text" v-model="formData.id" class="w-full px-3 py-2 border rounded-md" readonly disabled />
        </div>
        <div class="space-y-2">
          <label for="fullName" class="text-sm font-medium">Nama Lengkap</label>
          <input id="fullName" type="text" v-model="formData.full_name" class="w-full px-3 py-2 border rounded-md" required />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label for="phone" class="text-sm font-medium">Nomor Telepon</label>
            <input id="phone" type="tel" v-model="formData.phone" class="w-full px-3 py-2 border rounded-md" required />
          </div>
          <div class="space-y-2">
            <label for="email" class="text-sm font-medium">Email</label>
            <input id="email" type="email" v-model="formData.email" class="w-full px-3 py-2 border rounded-md" required />
          </div>
        </div>
        <div class="space-y-2">
          <label for="gender" class="text-sm font-medium">Jenis Kelamin</label>
          <select id="gender" v-model="formData.gender" class="w-full px-3 py-2 border rounded-md" required>
            <option value="">Pilih Jenis Kelamin</option>
            <option value="male">Laki-laki</option>
            <option value="female">Perempuan</option>
          </select>
        </div>
        <div class="space-y-2">
          <label for="status" class="text-sm font-medium">Status</label>
          <select id="status" v-model="formData.status" class="w-full px-3 py-2 border rounded-md" required>
            <option value="">Pilih Status</option>
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Non Aktif</option>
          </select>
        </div>
      </div>
      <div class="p-4 border-t flex justify-end gap-2">
        <button type="button" class="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50" @click="router.push('/admin/pengguna/pelanggan')">Batal</button>
        <button type="submit" class="bg-[#4072EE] text-white px-4 py-2 rounded-md hover:bg-[#3060DD]">Simpan</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCustomerStore } from '@/store/customer'

const router = useRouter()
const route = useRoute()
const customerStore = useCustomerStore()

const customerId = computed(() => route.params.id as string)
const isEditing = computed(() => !!customerId.value)

const isLoading = ref(false)
const error = ref<string | null>(null)

const formData = ref({
  id: '',
  full_name: '',
  email: '',
  phone: '',
  gender: '',
  status: ''
})

const loadCustomer = async () => {
  isLoading.value = true
  try {
    const data = await customerStore.getCustomerDetail(customerId.value)
    if (data) {
      formData.value = {
        id: data.id,
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        status: data.status?.status || ''
      }
    }
  } catch (err: any) {
    error.value = err.message || 'Gagal memuat data pelanggan'
  } finally {
    isLoading.value = false
  }
}

const saveCustomer = async () => {
  try {
    isLoading.value = true
    error.value = null

    await customerStore.updateCustomer(customerId.value, formData.value)
    router.push('/admin/pengguna/pelanggan')
  } catch (err: any) {
    error.value = err.message || 'Gagal menyimpan perubahan'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (isEditing.value) {
    loadCustomer()
  }
})
</script>
