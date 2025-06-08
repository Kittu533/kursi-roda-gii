<template>
  <div class="p-4">
    <!-- Breadcrumb -->
    <div class="flex items-center space-x-2 text-sm mb-4">
      <NuxtLink to="/" class="text-muted-foreground hover:text-foreground">
        <NuxtIcon name="material-symbols:home" class="w-5 h-5" />
      </NuxtLink>
      <NuxtIcon name="material-symbols:chevron-right" class="w-5 h-5" />
      <NuxtLink to="/admin/packages" class="text-muted-foreground hover:text-foreground">
        Paket
      </NuxtLink>
      <NuxtIcon name="material-symbols:chevron-right" class="w-5 h-5" />
      <span>Edit Paket</span>
    </div>

    <h1 class="text-xl font-bold mb-4">Edit Paket Kursi Roda</h1>

    <div class="bg-white rounded-md p-4 space-y-4">
      <div>
        <label class="text-sm block mb-1">Nama Paket <span class="text-red-500">*</span></label>
        <input v-model="formData.name" type="text" class="form-input" required />
      </div>
      <div>
        <label class="text-sm block mb-1">Gambar <span class="text-red-500">*</span></label>
        <input type="file" accept="image/png, image/jpeg" @change="onFileChange" class="form-input" />
        <div v-if="formData.picture" class="mt-2">
          <img :src="formData.picture" alt="Foto Paket" class="max-h-32 rounded" />
        </div>
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
        <label class="text-sm block mb-1">Wheelchairs <span class="text-red-500">*</span></label>
        <div v-for="(item, idx) in formData.wheelchairs" :key="idx" class="flex items-center gap-2 mb-2">
          <select v-model="formData.wheelchairs[idx].wheelchair_id" class="form-input w-52" required>
            <option value="">Pilih Kursi Roda</option>
            <option v-for="wh in wheelchairList" :value="wh.id" :key="wh.id">
              {{ wh.name }}
            </option>
          </select>
          <select v-model="formData.wheelchairs[idx].guide_include" class="form-input w-28" required>
            <option :value="true">Guide: Ya</option>
            <option :value="false">Guide: Tidak</option>
          </select>
          <button type="button" class="text-red-500" @click="removeWheelchair(idx)">Hapus</button>
        </div>
        <button type="button" @click="addWheelchair" class="text-blue-600">+ Tambah Kursi Roda</button>
      </div>
    </div>

    <div v-if="errorMessage" class="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
      {{ errorMessage }}
    </div>

    <div class="flex justify-end mt-4">
      <button @click="handleSubmit" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
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
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFileServiceStore } from '~/store/file-service'
import { useWheelchairStore } from '~/store/wheelchair'
import { usePackageStore } from '~/store/package'
import ConfirmationModal from '@/components/ui/modals/confirmation-modal.vue'

const route = useRoute()
const router = useRouter()
const fileService = useFileServiceStore()
const wheelchairStore = useWheelchairStore()
const packageStore = usePackageStore()

const isLoading = ref(false)
const errorMessage = ref('')

// Modal state
const isSuccessModalOpen = ref(false)
const successMessage = ref('Paket berhasil diperbarui!')

const packageId = computed(() => route.params.id as string)

const formData = ref({
  name: '',
  picture: '',
  description: '',
  price: 0,
  wheelchairs: []
})

const wheelchairList = computed(() => wheelchairStore.wheelchairs)

// Prefill form saat edit
onMounted(async () => {
  await wheelchairStore.loadWheelchairs()
  await loadPackageDetail()
})

async function loadPackageDetail() {
  isLoading.value = true
  try {
    const pkg = await packageStore.getPackageDetail(packageId.value)
    if (pkg) {
      formData.value = {
        name: pkg.name,
        picture: pkg.picture,
        description: pkg.description,
        price: Number(pkg.price),
        wheelchairs: (pkg.items || []).map(item => ({
          wheelchair_id: item.wheelchair_id,
          guide_include: !!item.guide_include
        }))
      }
    }
  } catch (e) {
    errorMessage.value = 'Gagal mengambil detail paket'
  } finally {
    isLoading.value = false
  }
}

// Upload file gambar
async function onFileChange(event) {
  const file = event.target.files?.[0]
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

function addWheelchair() {
  formData.value.wheelchairs.push({ wheelchair_id: '', guide_include: true })
}
function removeWheelchair(idx) {
  formData.value.wheelchairs.splice(idx, 1)
}

const validateForm = () => {
  if (
    !formData.value.name ||
    !formData.value.picture ||
    !formData.value.description ||
    !formData.value.price ||
    !formData.value.wheelchairs.length ||
    formData.value.wheelchairs.some(w => !w.wheelchair_id)
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
    // --- Ensure price is a number, NOT string ---
    const payload = {
      name: formData.value.name,
      picture: formData.value.picture,
      description: formData.value.description,
      price: Number(formData.value.price),
      wheelchairs: formData.value.wheelchairs.map(w => ({
        wheelchair_id: w.wheelchair_id,
        guide_include: Boolean(w.guide_include)
      }))
    }
    await packageStore.updatePackage(packageId.value, payload)
    isSuccessModalOpen.value = true
  } catch (error) {
    errorMessage.value =
      error?.data?.metaData?.message || error?.message || 'Gagal memperbarui paket.'
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
