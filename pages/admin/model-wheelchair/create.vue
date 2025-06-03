<template>
    <div class="p-4">
        <!-- Breadcrumb -->
        <div class="flex items-center space-x-2 text-sm mb-4">
            <NuxtLink to="/" class="text-muted-foreground hover:text-foreground">
                <NuxtIcon name="material-symbols:home" class="w-5 h-5" />
            </NuxtLink>
            <NuxtIcon name="material-symbols:chevron-right" class="w-5 h-5" />
            <NuxtLink to="/admin/model" class="text-muted-foreground hover:text-foreground">
                Model
            </NuxtLink>
        </div>

        <!-- Judul -->
        <h1 class="text-xl font-bold mb-4">Tambah Model Kursi Roda</h1>

        <!-- Form -->
        <div class="bg-white rounded-md p-4 space-y-4">
            <div>
                <label class="text-sm block mb-1">Nama Model <span class="text-red-500">*</span></label>
                <input v-model="formData.name" type="text" class="form-input" required />
            </div>

            <div>
                <label class="text-sm block mb-1">Model <span class="text-red-500">*</span></label>
                <input v-model="formData.model" type="text" class="form-input" required />
            </div>

            <div>
                <label class="text-sm block mb-1">Gambar <span class="text-red-500">*</span></label>
                <input v-model="formData.picture" type="url" class="form-input" required />
            </div>

            <div>
                <label class="text-sm block mb-1">Stok <span class="text-red-500">*</span></label>
                <input v-model.number="formData.stock" type="number" class="form-input" min="0" required />
            </div>

            <div>
                <label class="text-sm block mb-1">Maks. Berat (kg) <span class="text-red-500">*</span></label>
                <input v-model.number="formData.max_weight" type="number" class="form-input" min="0" required />
            </div>

            <div>
                <label class="text-sm block mb-1">Kompatibel Guide <span class="text-red-500">*</span></label>
                <select v-model="formData.guide_compatible" class="form-input" required>
                    <option value="">Pilih</option>
                    <option :value="true">Ya</option>
                    <option :value="false">Tidak</option>
                </select>
            </div>

            <div>
                <label class="text-sm block mb-1">Kapasitas Baterai (mAh) <span class="text-red-500">*</span></label>
                <input v-model.number="formData.battery_capacity" type="number" class="form-input" min="0" required />
            </div>

            <div>
                <label class="text-sm block mb-1">Harga (Rp) <span class="text-red-500">*</span></label>
                <input v-model.number="formData.price" type="number" class="form-input" min="0" required />
            </div>
        </div>

        <!-- Error -->
        <div v-if="errorMessage" class="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {{ errorMessage }}
        </div>

        <!-- Tombol Simpan -->
        <div class="flex justify-end mt-4">
            <button @click="handleSubmit" class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                :disabled="isLoading">
                {{ isLoading ? "Menyimpan..." : "Simpan" }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useModelStore } from '~/store/model'

const router = useRouter()
const modelStore = useModelStore()

const isLoading = ref(false)
const errorMessage = ref('')

const formData = ref({
    name: '',
    model: '',
    picture: '',
    stock: 0,
    max_weight: 0,
    guide_compatible: '',
    battery_capacity: 0,
    price: 0
})

const validateForm = () => {
    const f = formData.value
    if (!f.name || !f.model || !f.picture || f.guide_compatible === '')
        return (errorMessage.value = 'Semua kolom wajib diisi'), false
    return true
}

const handleSubmit = async () => {
    errorMessage.value = ''
    if (!validateForm()) return

    try {
        isLoading.value = true
        await modelStore.createNewModel({
            name: formData.value.name,
            model: formData.value.model,
            picture: formData.value.picture,
            stock: formData.value.stock,
            max_weight: formData.value.max_weight,
            guide_compatible:
                formData.value.guide_compatible === 'true' || formData.value.guide_compatible === true,
            battery_capacity: formData.value.battery_capacity,
            price: formData.value.price
        })
        alert('Model berhasil ditambahkan!')
        router.push('/admin/model-wheelchair')
    } catch (error: any) {
        console.error('Error creating model:', error)
        errorMessage.value =
            error?.data?.metaData?.message || error?.message || 'Gagal menambahkan model.'
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
