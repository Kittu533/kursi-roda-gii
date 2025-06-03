<template>
  <DetailView 
    title="Maintenance - Detail"
    card-title="Data Maintenance"
    :breadcrumbs="breadcrumbs"
    :fields="fields"
    :data="maintenanceData"
    :loading="isLoading"
    :error="error"
    @back="router.push('/admin/maintenance')"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMaintenanceStore } from '~/store/maintenance';
import DetailView from '~/components/detail-view.vue';

// Router
const route = useRoute();
const router = useRouter();
const maintenanceId = computed(() => route.params.id as string);

// Store
const maintenanceStore = useMaintenanceStore();
const maintenanceData = computed(() => maintenanceStore.selectedMaintenance);
const wheelchairData = computed(() => maintenanceStore.wheelchairData); // Mengambil data kursi roda
const isLoading = computed(() => maintenanceStore.isLoading);
const error = computed(() => maintenanceStore.error);

// Breadcrumbs
const breadcrumbs = [
  { text: 'Maintenance', to: '/admin/maintenances' },
  { text: 'Detail' }
];

// Fields configuration (langsung akses key tanpa value)
const fields = [
  { key: 'id', label: 'ID Maintenance' }, // Mengakses ID Maintenance langsung
  { key: 'wheelchair.model_id', label: 'Model Kursi Roda' }, // Mengakses model kursi roda dari wheelchairData
  { key: 'wheelchair.serial_number', label: 'Nomor Seri' }, // Mengakses nomor seri kursi roda
  { key: 'picture', label: 'Foto' }, // Mengakses foto kursi roda
  { key: 'issue_description', label: 'Deskripsi' }, // Deskripsi perbaikan
  { key: 'start_date', label: 'Tanggal Pemeliharaan' }, // Tanggal pemeliharaan
  { key: 'end_date', label: 'Tanggal Selesai Pemeliharaan' }, // Tanggal selesai
  { key: 'maintenance_status.status', label: 'Status' }, // Status pemeliharaan
];

const loaded = ref(false);

onMounted(async () => {
  if (!loaded.value && maintenanceId.value) {
    loaded.value = true;
    try {
      await maintenanceStore.getMaintenanceDetail(maintenanceId.value);
    } catch (error) {
      console.error('Error loading maintenance details:', error);
    }
  }
});

// Debugging: Cek apakah data sudah tersedia
console.log('Selected Maintenance:', maintenanceData.value);
console.log('Wheelchair Data:', wheelchairData.value);
</script>
