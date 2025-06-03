<template>
    <div class="p-6 space-y-6 bg-white rounded-md shadow">
        <h1 class="text-2xl font-bold">Edit Model Kursi Roda</h1>

        <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
                <label class="block text-sm font-medium">Nama Model</label>
                <input v-model="formData.name" type="text" class="form-input" required />
            </div>

            <div>
                <label class="block text-sm font-medium">Kode Model</label>
                <input v-model="formData.model" type="text" class="form-input" required />
            </div>

            <div>
                <label class="block text-sm font-medium">URL Gambar</label>
                <input v-model="formData.picture" type="url" class="form-input" required />
            </div>

            <div>
                <label class="block text-sm font-medium">Stok</label>
                <input v-model.number="formData.stock" type="number" class="form-input" min="0" required />
            </div>

            <div>
                <label class="block text-sm font-medium">Maks. Berat (kg)</label>
                <input v-model.number="formData.max_weight" type="number" class="form-input" min="0" required />
            </div>

            <div>
                <label class="block text-sm font-medium">Kompatibel Guide</label>
                <select v-model="formData.guide_compatible" class="form-input" required>
                    <option :value="true">Ya</option>
                    <option :value="false">Tidak</option>
                </select>
            </div>

            <div>
                <label class="block text-sm font-medium">Kapasitas Baterai (mAh)</label>
                <input v-model.number="formData.battery_capacity" type="number" class="form-input" min="0" required />
            </div>

            <div>
                <label class="block text-sm font-medium">Harga (Rp)</label>
                <input v-model.number="formData.price" type="number" class="form-input" min="0" required />
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

const route = useRoute()
const router = useRouter()
const modelStore = useModelStore()
const modelId = route.params.id as string

const isLoading = ref(false)
const formData = ref({
    name: '',
    model: '',
    picture: '',
    stock: 0,
    max_weight: 0,
    guide_compatible: false,
    battery_capacity: 0,
    price: 0
})

onMounted(async () => {
    const model = await modelStore.getModelDetail(modelId)
    if (model) {
        formData.value = {
            name: model.name,
            model: model.model,
            picture: model.picture,
            stock: model.stock,
            max_weight: model.max_weight,
            guide_compatible: model.guide_compatible,
            battery_capacity: model.battery_capacity,
            price: model.price
        }
    }
})

const handleSubmit = async () => {
    try {
        isLoading.value = true
        await modelStore.updateModel(modelId, formData.value)
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
