<template>
  <DetailView
    title="Guide - Detail"
    card-title="Data Guide"
    :breadcrumbs="breadcrumbs"
    :fields="fields"
    :data="guide"
    :loading="isLoading"
    :error="error"
    :show-back-button="true"
  >
    <template #before-table v-if="guide">
      <div class="flex items-center gap-4 mb-6">
        <img
          :src="guide.photo"
          alt="Profile"
          class="w-20 h-20 rounded-full object-cover border"
        />
        <div>
          <h3 class="text-xl font-medium">{{ guide.name }}</h3>
          <p class="text-gray-500">{{ guide.id }}</p>
        </div>
      </div>
    </template>
  </DetailView>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGuideStore } from '~/store/guide'
import DetailView from '~/components/detail-view.vue'

// Router
const route = useRoute()
const router = useRouter()
const guideId = computed(() => route.params.id as string)

// Store
const guideStore = useGuideStore()
const guide = computed(() => guideStore.selectedGuide)
const isLoading = computed(() => guideStore.isLoading)
const error = computed(() => guideStore.error)

// Breadcrumbs
const breadcrumbs = [
  { text: 'Pengguna', to: '/admin/pengguna' },
  { text: 'Guide', to: '/admin/pengguna/guide' },
  { text: 'Detail' }
]

// Fields configuration
const fields = [
  { key: 'id', label: 'ID Guide' },
  { key: 'name', label: 'Nama Lengkap' },
  { key: 'phone', label: 'Nomor Telepon' },
  { key: 'ktp', label: 'KTP' },
  { key: 'accountNumber', label: 'Nomor Rekening' },
  { key: 'createdAt', label: 'Akun dibuat' },
  { key: 'status', label: 'Status', type: 'status' }
]

// Lifecycle
onMounted(async () => {
  if (guideId.value) {
    try {
      await guideStore.loadGuideDetails(guideId.value)
    } catch (error) {
      console.error('Error loading guide details:', error)
    }
  }
})
</script>