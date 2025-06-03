<!-- <template>
    <DetailView 
      title="Komplain - Detail"
      card-title="Data Komplain"
      :breadcrumbs="breadcrumbs"
      :fields="fields"
      :data="complaint"
      :loading="isLoading"
      :error="error"
      @back="router.push('/admin/complaint')"
    />
  </template>
  
  <script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useComplaintStore } from '~/store/complaint'
  import DetailView from '~/components/detail-view.vue'
  
  // Router
  const route = useRoute()
  const router = useRouter()
  const complaintId = computed(() => route.params.id as string)
  
  // Store
  const complaintStore = useComplaintStore()
  const complaint = computed(() => complaintStore.selectedComplaint)
  const isLoading = computed(() => complaintStore.isLoading)
  const error = computed(() => complaintStore.error)
  
  // Breadcrumbs
  const breadcrumbs = [
    { text: 'Komplain', to: '/admin/complaint' },
    { text: 'Detail' }
  ]
  
  // Fields configuration
  const fields = [
    { key: 'complaintId', label: 'ID Komplain' },
    { key: 'customerId', label: 'ID Pelanggan' },
    { key: 'transactionId', label: 'ID Transaksi' },
    { key: 'type', label: 'Jenis' },
    { key: 'description', label: 'Deskripsi' },
    { key: 'startDate', label: 'Tanggal Dibuat' },
    { key: 'completionDate', label: 'Tanggal Diperbarui' },
    { key: 'status', label: 'Status', type: 'status' },
  ]
  
  // Lifecycle
  const loaded = ref(false)
  
  onMounted(async () => {
    if (!loaded.value && complaintId.value) {
      loaded.value = true
      try {
        await complaintStore.loadComplaintDetails(complaintId.value)
      } catch (error) {
        console.error('Error loading complaint details:', error)
      }
    }
  })
  </script> -->

  <template>
    <div>sadsa</div>
  </template>