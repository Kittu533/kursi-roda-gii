<template>
  <DetailView
    title="Paket - Detail"
    card-title="Data Paket"
    :breadcrumbs="breadcrumbs"
    :fields="fields"
    :data="formattedPackage"
    :loading="isLoading"
    :error="error"
    @back="router.push('/admin/packages')"
  >
    <!-- PICTURE field -->
    <template #field-picture="{ data }">
      <img
        v-if="data.picture"
        :src="data.picture"
        alt="Foto Paket"
        class="max-w-xs max-h-40 rounded border"
      />
      <span v-else class="text-gray-500">-</span>
    </template>
    <!-- HARGA -->
    <template #field-price="{ data }">
      <span>{{ formatRupiah(data.price) }}</span>
    </template>
    <!-- TANGGAL -->
    <template #field-created_at="{ data }">
      <span>{{ formatDate(data.created_at) }}</span>
    </template>
    <template #field-updated_at="{ data }">
      <span>{{ formatDate(data.updated_at) }}</span>
    </template>
    <!-- WHEELCHAIR -->
    <template #field-wheelchair1="{ data }">
      <div v-if="data.wheelchair1">
        <div class="mb-1">ID Kursi Roda: <span class="text-gray-600">{{ data.wheelchair1.id }}</span></div>
        <div>
          Guide Include:
          <span :class="data.wheelchair1.guide_include ? 'text-green-700' : 'text-gray-700'">
            {{ data.wheelchair1.guide_include ? 'Ya' : 'Tidak' }}
          </span>
        </div>
      </div>
      <span v-else>-</span>
    </template>
  </DetailView>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePackageStore } from '~/store/package'
import DetailView from '~/components/detail-view.vue'

const route = useRoute()
const router = useRouter()
const packageId = computed(() => route.params.id as string)
const packageStore = usePackageStore()
const packageData = computed(() => packageStore.selectedPackage)
const isLoading = computed(() => packageStore.isLoading)
const error = computed(() => packageStore.error)

const breadcrumbs = [
  { text: 'Paket', to: '/admin/packages' },
  { text: 'Detail' }
]

const fields = [
  { key: 'name', label: 'Nama Paket' },
  { key: 'picture', label: 'Foto Paket' },
  { key: 'description', label: 'Deskripsi' },
  { key: 'price', label: 'Harga' },
  { key: 'created_at', label: 'Tanggal Dibuat' },
  { key: 'updated_at', label: 'Tanggal Diperbarui' },
  { key: 'wheelchair1', label: 'Kursi Roda (Guide Include)' }
]

// Format data untuk DetailView
const formattedPackage = computed(() => {
  if (!packageData.value) return {}
  return {
    name: packageData.value.name ?? '-',
    picture: packageData.value.picture ?? '',
    description: packageData.value.description ?? '-',
    price: packageData.value.price ?? '-',
    created_at: packageData.value.created_at ?? '-',
    updated_at: packageData.value.updated_at ?? '-',
    wheelchair1: packageData.value.wheelchair1 ?? null
  }
})

// Helper: format Rupiah
function formatRupiah(angka: string | number) {
  if (!angka) return '-'
  return 'Rp ' + Number(angka).toLocaleString('id-ID')
}
// Helper: format tanggal
function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
}

onMounted(async () => {
  if (packageId.value) {
    await packageStore.getPackageDetail(packageId.value)
  }
})
</script>
