<template>
  <DetailView title="Guide - Detail" card-title="Data Guide" :breadcrumbs="breadcrumbs" :fields="fields"
    :data="formattedGuide" :loading="isLoading" :error="error" back-button-text="Kembali" save-button-text="Edit"
    @back="router.push('/admin/pengguna/guide')" @save="router.push(`/admin/pengguna/guide/${guide?.id}/edit`)">
    <!-- FOTO PROFILE FIELD -->
    <template #field-photo_profile="{ data }">
      <div v-if="data.photo_profile">
        <button type="button" @click="openPreview(data.photo_profile)"
          class="inline-flex items-center gap-1 px-2 py-1 border rounded text-sm hover:bg-gray-50">
          <Icon name="mdi:eye-outline" /> Lihat Foto
        </button>
      </div>
      <div v-else class="text-gray-500 text-sm">-</div>
    </template>
    <!-- KTP FIELD -->
    <template #field-identity_document="{ data }">
      <button v-if="data.identity_document" type="button" @click="openPreview(data.identity_document)"
        class="text-blue-600 hover:underline text-sm">
        Lihat KTP
      </button>
      <span v-else class="text-gray-500 text-sm">-</span>
    </template>
    <!-- STATUS FIELD -->
    <template #field-status="{ data }">
      <span class="text-xs font-medium px-2 py-1 rounded-full" :class="data.status?.status === 'ACT'
        ? 'bg-green-100 text-green-700'
        : 'bg-[#585B58] text-white'">
        {{ formatStatus(data.status?.status) }}
      </span>
    </template>
  </DetailView>
  <!-- Modal Preview File -->
  <PreviewModal :show="showPreviewModal" :url="previewUrl" @close="closePreviewModal" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGuideStore } from '~/store/guide'
import DetailView from '~/components/detail-view.vue'
import PreviewModal from '~/components/preview-modal.vue'

const route = useRoute()
const router = useRouter()
const guideId = computed(() => route.params.id as string)

const guideStore = useGuideStore()
const guide = computed(() => guideStore.selectedGuide)
const isLoading = computed(() => guideStore.isLoading)
const error = computed(() => guideStore.error)

// Modal preview file
const showPreviewModal = ref(false)
const previewUrl = ref('')
function openPreview(url: string) {
  previewUrl.value = url
  showPreviewModal.value = true
}
function closePreviewModal() {
  showPreviewModal.value = false
  previewUrl.value = ''
}

const breadcrumbs = [
  { text: 'Pengguna', to: '/admin/pengguna' },
  { text: 'Guide', to: '/admin/pengguna/guide' },
  { text: 'Detail' }
]

const formatStatus = (statusCode: string | undefined): string => {
  switch (statusCode?.toUpperCase()) {
    case 'ACT':
      return 'Aktif'
    case 'INC':
    case 'NON':
      return 'Tidak Aktif'
    case 'DEL':
    case 'HAPUS':
      return 'Hapus'
    default:
      return '-'
  }
}

const fields = [
  { key: 'id', label: 'ID Guide' },
  { key: 'full_name', label: 'Nama Lengkap' },
  { key: 'photo_profile', label: 'Foto Profil' },
  { key: 'phone', label: 'Nomor Telepon' },
  { key: 'email', label: 'Email' },
  { key: 'identity_document', label: 'KTP' },
  { key: 'bank_account_number', label: 'Nomor Rekening' },
  { key: 'status', label: 'Status', type: 'status' }
]

const formattedGuide = computed(() => {
  if (!guide.value) return {}
  return {
    id: guide.value.id,
    full_name: guide.value.full_name || '-',
    photo_profile: guide.value.photo_profile,
    email: guide.value.email || '-',
    phone: guide.value.phone || '-',
    identity_document: guide.value.identity_document || '-',
    bank_account_number: guide.value.bank_account_number || '-',
    status: guide.value.status
  }
})

onMounted(async () => {
  if (guideId.value) {
    try {
      await guideStore.getGuideDetail(guideId.value)
    } catch (err) {
      console.error('Error loading guide detail:', err)
    }
  }
})
</script>
