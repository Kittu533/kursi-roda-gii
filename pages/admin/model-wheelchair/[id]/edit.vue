<template>
    <div class="p-6 space-y-6 bg-white rounded-md shadow">
        <h1 class="text-2xl font-bold">Edit Model Kursi Roda</h1>
        <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
                <label class="block text-sm font-medium">Nama Model</label>
                <!-- v-model="formData.name" -->
                <input v-model="formData.name" type="text" class="form-input" required />
            </div>
            <!-- Upload gambar -->
            <div>
                <label class="text-sm block mb-1">Gambar <span class="text-red-500">*</span></label>
                <input type="file" accept="image/png, image/jpeg" @change="onFileChange" class="form-input" />
            </div>
            <div>
                <label class="block text-sm font-medium">Stok</label>
                <input v-model.number="formData.stock" type="number" class="form-input" min="0" />
            </div>
            <div>
                <label class="block text-sm font-medium">Maks. Berat (kg)</label>
                <input v-model.number="formData.max_weight" type="number" class="form-input" min="0" />
            </div>
            <div>
                <label class="block text-sm font-medium">Kompatibel Guide</label>
                <select v-model="formData.guide_compatible" class="form-input">
                    <option :value="true">Ya</option>
                    <option :value="false">Tidak</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium">Kapasitas Baterai (mAh)</label>
                <input v-model.number="formData.battery_capacity" type="number" class="form-input" min="0" />
            </div>
            <div>
                <label class="block text-sm font-medium">Harga (Rp)</label>
                <input v-model.number="formData.price" type="number" class="form-input" min="0" />
            </div>
            <div class="flex justify-end">
                <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    :disabled="isLoading">
                    {{ isLoading ? 'Menyimpan...' : 'Simpan Perubahan' }}
                </button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useModelStore } from '~/store/model'
import { useFileServiceStore } from '~/store/file-service'

const route = useRoute()
const router = useRouter()
const modelStore = useModelStore()
const fileService = useFileServiceStore()
const modelId = route.params.id as string

const isLoading = ref(false)

interface FormModel {
  model: string
  picture: string
  stock: number | null
  max_weight: number | null
  guide_compatible: boolean | null
  battery_capacity: number | null
  price: number | null
}

const formData = ref({
    model: '', // <- field API yang benar (BUKAN 'model')
    picture: '',
    stock: undefined,
    max_weight: undefined,
    guide_compatible: undefined,
    battery_capacity: undefined,
    price: undefined
})

const errorMessage = ref('')

// Handler upload file gambar
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

onMounted(async () => {
  const model = await modelStore.getModelDetail(modelId)
  if (model) {
    formData.value = {
      name: model.model ?? '',
      picture: model.picture ?? '',
      stock: typeof model.stock === 'number' ? model.stock : null,
      max_weight: typeof model.max_weight === 'number' ? model.max_weight : null,
      guide_compatible: typeof model.guide_compatible === 'boolean' ? model.guide_compatible : null,
      battery_capacity: typeof model.battery_capacity === 'number' ? model.battery_capacity : null,
      price: typeof model.price === 'number' ? model.price : null
    }
  }
})

// Utility: ambil hanya field yg terisi (tidak undefined/null/'')
function getPatchPayload(obj: Record<string, any>) {
    const patch: Record<string, any> = {}
    for (const k in obj) {
        // gunakan !== '' jika ingin field kosong tetap TIDAK dikirim
        if (
            obj[k] !== undefined &&
            obj[k] !== null &&
            obj[k] !== ''
        ) {
            patch[k] = obj[k]
        }
    }
    return patch
}

const handleSubmit = async () => {
    try {
        isLoading.value = true
        // Only send filled fields (skip yang kosong/undefined)
        const payload = getPatchPayload(formData.value)
        await modelStore.updateModel(modelId, payload)
        alert('Model berhasil diperbarui!')
        router.push('/admin/model-wheelchair')
    } catch (error) {
        console.error(error)
        alert('Gagal memperbarui model.')
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
