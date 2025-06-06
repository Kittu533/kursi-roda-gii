<template>
  <DetailView
    title="Wheelchair - Detail"
    card-title="Data Produk"
    :breadcrumbs="breadcrumbs"
    :fields="fields"
    :data="formattedWheelchair"
    :loading="isLoading"
    :error="error"
    back-button-text="Kembali"
    save-button-text="Edit"
    @back="router.push('/admin/model-wheelchair')"
    @save="router.push(`/admin/model-wheelchair/${wheelchair?.id}/edit`)"
  >
    <!-- Template Slot untuk Lihat Foto -->
    <template #field-photo="{ data }">
      <div v-if="data.photo">
        <a
          :href="data.photo"
          target="_blank"
          class="inline-flex items-center gap-1 px-2 py-1 border rounded text-sm hover:bg-gray-50"
        >
          <Icon name="mdi:eye-outline" /> Lihat Foto
        </a>
      </div>
      <div v-else class="text-gray-500 text-sm">-</div>
    </template>

    <!-- Status Badge -->
    <template #field-status="{ data }">
      <span
        class="text-xs font-medium px-2 py-1 rounded-full"
        :class="data.status === 'Tersedia'
          ? 'bg-green-100 text-green-700'
          : 'bg-gray-200 text-gray-800'"
      >
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
  { text: 'Produk', to: '/admin/model-wheelchair' },
  { text: 'Detail' }
]

const fields = [
  { key: 'id', label: 'ID Produk' },
  { key: 'agent_id', label: 'ID Agen' },
  { key: 'photo', label: 'Foto Produk' },
  { key: 'serial_number', label: 'Nomor Seri' },
  { key: 'product_name', label: 'Nama' },
  { key: 'model_name', label: 'Model' },
  { key: 'status', label: 'Status', type: 'status' },
  { key: 'maintenance_date', label: 'Tanggal Pemeliharaan' }
]

const formattedWheelchair = computed(() => {
  if (!wheelchair.value) return {}

  return {
    id: wheelchair.value.id,
    agent_id: wheelchair.value.agent?.id || '-',
    photo: wheelchair.value.model?.picture || null,
    serial_number: wheelchair.value.serial_number || '-',
    product_name: wheelchair.value.model?.name || '-',
    model_name: wheelchair.value.model?.model || '-',
    status: formatStatus(wheelchair.value.wheelchair_status?.status),
    maintenance_date: formatMaintenanceDate()
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
