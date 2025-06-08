<template>
  <div class="p-4">
    <!-- Breadcrumb -->
    <div class="flex items-center space-x-2 text-sm mb-4">
      <NuxtLink to="/" class="text-muted-foreground hover:text-foreground">
        <NuxtIcon name="material-symbols:home" class="w-5 h-5" />
      </NuxtLink>
      <NuxtIcon name="material-symbols:chevron-right" class="w-5 h-5" />
      <NuxtLink to="/admin/paket" class="text-muted-foreground hover:text-foreground">
        Paket
      </NuxtLink>
    </div>

    <h1 class="text-xl font-bold mb-4">Tambah Paket Kursi Roda</h1>

    <div class="bg-white rounded-md p-4 space-y-4">
      <div>
        <label class="text-sm block mb-1">Nama Paket <span class="text-red-500">*</span></label>
        <input v-model="formData.name" type="text" class="form-input" required />
      </div>
      <div>
        <label class="text-sm block mb-1">Gambar <span class="text-red-500">*</span></label>
        <input type="file" accept="image/png, image/jpeg" @change="onFileChange" class="form-input" required />
      </div>
      <div>
        <label class="text-sm block mb-1">Deskripsi <span class="text-red-500">*</span></label>
        <textarea v-model="formData.description" class="form-input" required />
      </div>
      <div>
        <label class="text-sm block mb-1">Harga (Rp) <span class="text-red-500">*</span></label>
        <input v-model.number="formData.price" type="number" min="0" class="form-input" required />
      </div>
      <div>
        <label class="text-sm block mb-1">Wheelchair <span class="text-red-500">*</span></label>
        <select v-model="selectedWheelchair" class="form-input" required>
          <option value="">Pilih Kursi Roda</option>
          <option v-for="wh in wheelchairList" :value="wh.id" :key="wh.id">
            {{ wh.name }}
          </option>
        </select>
      </div>
      <div>
        <label class="text-sm block mb-1">Guide Include <span class="text-red-500">*</span></label>
        <select v-model="guideInclude" class="form-input" required>
          <option :value="true">Ya</option>
          <option :value="false">Tidak</option>
        </select>
      </div>
    </div>

    <div v-if="errorMessage" class="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
      {{ errorMessage }}
    </div>

    <div class="flex justify-end mt-4">
      <button @click="handleSubmit" class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        :disabled="isLoading">
        {{ isLoading ? "Menyimpan..." : "Simpan" }}
      </button>
    </div>
    <ConfirmationModal v-model:isOpen="isSuccessModalOpen" type="success" :message="successMessage"
      :show-buttons="false" :show-close-button="true"
      @update:isOpen="val => { isSuccessModalOpen = val; if (!val) router.push('/admin/packages') }" />


  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFileServiceStore } from '~/store/file-service'
import { useWheelchairStore } from '~/store/wheelchair'
import { usePackageStore } from '~/store/package'
import ConfirmationModal from '@/components/ui/modals/confirmation-modal.vue'

const router = useRouter()
const fileService = useFileServiceStore()
const wheelchairStore = useWheelchairStore()
const packageStore = usePackageStore()

const isLoading = ref(false)
const errorMessage = ref('')

// Modal state
const isSuccessModalOpen = ref(false)
const successMessage = ref('Paket berhasil ditambahkan!')

const formData = ref({
  name: '',
  picture: '',
  description: '',
  price: 0
})

const wheelchairList = ref<any[]>([])
const selectedWheelchair = ref('')
const guideInclude = ref(true) // default true

onMounted(async () => {
  await loadWheelchairList()
})
const loadWheelchairList = async () => {
  try {
    isLoading.value = true
    await wheelchairStore.loadWheelchairs()
    wheelchairList.value = wheelchairStore.wheelchairs
  } catch (e) {
    errorMessage.value = 'Gagal mengambil data kursi roda'
  } finally {
    isLoading.value = false
  }
}

// Upload file gambar
async function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  try {
    isLoading.value = true
    const url = await fileService.uploadFileBase64(file)
    formData.value.picture = url
  } catch (e) {
    errorMessage.value = 'Gagal upload gambar: ' + e
  } finally {
    isLoading.value = false
  }
}

const validateForm = () => {
  if (
    !formData.value.name ||
    !formData.value.picture ||
    !formData.value.description ||
    !formData.value.price ||
    !selectedWheelchair.value
  ) {
    errorMessage.value = 'Semua kolom wajib diisi'
    return false
  }
  return true
}

const handleSubmit = async () => {
  errorMessage.value = ''
  if (!validateForm()) return

  try {
    isLoading.value = true
    await packageStore.createNewPackage({
      name: formData.value.name,  
      picture: formData.value.picture,
      description: formData.value.description,
      price: formData.value.price,
      wheelchairs: [
        {
          wheelchair_id: selectedWheelchair.value,
          guide_include: guideInclude.value
        }
      ]
    })
    // Tampilkan modal sukses
    isSuccessModalOpen.value = true
    // router.push('/admin/packages')
  } catch (error: any) {
    errorMessage.value =
      error?.data?.metaData?.message || error?.message || 'Gagal menambahkan paket.'
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
