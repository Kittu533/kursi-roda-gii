<template>
  <DetailView title="Kursi Roda - Detail" card-title="Data Produk" :breadcrumbs="breadcrumbs" :fields="fields"
    :data="formattedWheelchair" :loading="isLoading" :error="error" back-button-text="Kembali" save-button-text="Edit"
    @back="router.back()" @save="router.push(`/admin/model-wheelchair/${wheelchair?.id}/edit`)">
    <!-- Template Slot untuk Lihat Foto -->
    <template #field-photo="{ data }">
      <div v-if="data.photo">
        <a :href="data.photo" target="_blank"
          class="inline-flex items-center gap-1 px-2 py-1 border rounded text-sm hover:bg-gray-50">
          <Icon name="mdi:eye-outline" /> Lihat Foto
        </a>
      </div>
      <div v-else class="text-gray-500 text-sm">-</div>
    </template>

    <!-- Status Badge -->
    <template #field-status="{ data }">
      <span class="text-xs font-medium px-2 py-1 rounded-full" :class="data.status === 'Tersedia'
        ? 'bg-green-100 text-green-700'
        : 'bg-gray-200 text-gray-800'">
        {{ data.status || '-' }}
      </span>
    </template>
  </DetailView>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWheelchairStore } from '~/store/wheelchair'
import DetailView from '~/components/detail-view.vue'

const route = useRoute()
const router = useRouter()
const wheelchairStore = useWheelchairStore()

const wheelchairId = computed(() => route.params.id as string)
const wheelchair = computed(() => wheelchairStore.selectedWheelchair)
const isLoading = computed(() => wheelchairStore.isLoading)
const error = computed(() => wheelchairStore.error)

const breadcrumbs = [
  { text: 'Model', to: '/admin/model-wheelchair' },
  { text: wheelchair.value?.model?.model || 'Detail', to: `/admin/model-wheelchair/${route.params.id}` },
  { text: 'Detail Produk', to: `/admin/model-wheelchair/${route.params.id}/product/${wheelchair.value?.id || ''}` }
]

const fields = [
  { key: 'id', label: 'ID Produk' },
  { key: 'name', label: 'Nama Kursi Roda' },
  { key: 'serial_number', label: 'Nomor Seri' },
  { key: 'description', label: 'Deskripsi' },
  { key: 'status', label: 'Status', type: 'status' },
  { key: 'last_maintenance_date', label: 'Tanggal Pemeliharaan Terakhir' },
  { key: 'model_name', label: 'Model' },
  { key: 'max_weight', label: 'Maks. Berat (kg)' },
  { key: 'battery_capacity', label: 'Kapasitas Baterai (mAh)' },
  { key: 'price', label: 'Harga', type: 'currency' },
  { key: 'agent_name', label: 'Nama Agen' },
  { key: 'agent_email', label: 'Email Agen' },
  { key: 'agent_phone', label: 'Telepon Agen' },
  { key: 'agent_location', label: 'Lokasi Agen' },
]

const formattedWheelchair = computed(() => {
  if (!wheelchair.value) return {}

  return {
    id: wheelchair.value.id,
    name: wheelchair.value.name || '-',
    serial_number: wheelchair.value.serial_number || '-',
    description: wheelchair.value.description || '-',
    status: formatStatus(wheelchair.value.wheelchair_status?.status),
    last_maintenance_date: wheelchair.value.last_maintenance_date || '-',
    model_name: wheelchair.value.model?.model || '-',
    max_weight: wheelchair.value.model?.max_weight ?? '-',
    battery_capacity: wheelchair.value.model?.battery_capacity ?? '-',
    price: wheelchair.value.model?.price ?? '-',
    agent_name: wheelchair.value.agent?.full_name || '-',
    agent_email: wheelchair.value.agent?.email || '-',
    agent_phone: wheelchair.value.agent?.phone || '-',
    agent_location: wheelchair.value.agent?.location || '-',
  }
})

const formatStatus = (status: string | undefined): string => {
  if (!status) return '-'
  const map: Record<string, string> = {
    available: 'Tersedia',
    maintenance: 'Pemeliharaan',
    broken: 'Rusak',
    used: 'Digunakan'
  }
  return map[status] || status
}

const formatMaintenanceDate = (): string => {
  // Ganti dengan data asli jika tersedia dari backend
  return '01/01/2025'
}

onMounted(async () => {
  if (wheelchairId.value) {
    try {
      await wheelchairStore.getWheelchairDetail(wheelchairId.value)
    } catch (err) {
      console.error('Error loading wheelchair detail:', err)
    }
  }
})
</script>
