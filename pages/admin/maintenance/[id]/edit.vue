<template>
  <div class="p-6 space-y-6 bg-white rounded-md shadow">
    <h1 class="text-2xl font-bold">Edit Maintenance</h1>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- ID Pemeliharaan -->
      <div>
        <label class="block text-sm font-medium">ID Pemeliharaan</label>
        <input v-model="formData.id" type="text" class="form-input" readonly />
      </div>

      <!-- Model Kursi Roda -->
      <div>
        <label class="block text-sm font-medium">Model Kursi Roda</label>
        <input v-model="formData.model" type="text" class="form-input" readonly />
      </div>

      <!-- Nomor Seri -->
      <div>
        <label class="block text-sm font-medium">Nomor Seri</label>
        <input v-model="formData.serialNumber" type="text" class="form-input" readonly />
      </div>

      <!-- Foto -->
      <div>
        <label class="block text-sm font-medium">URL Foto</label>
        <input v-model="formData.picture" type="url" class="form-input" required />
      </div>

      <!-- Deskripsi -->
      <div>
        <label class="block text-sm font-medium">Deskripsi</label>
        <textarea v-model="formData.description" class="form-input" required></textarea>
      </div>

      <!-- Tanggal Pemeliharaan -->
      <div>
        <label class="block text-sm font-medium">Tanggal Pemeliharaan</label>
        <input v-model="formData.startDate" type="date" class="form-input" required />
      </div>

      <!-- Tanggal Selesai -->
      <div>
        <label class="block text-sm font-medium">Tanggal Selesai Pemeliharaan</label>
        <input v-model="formData.endDate" type="date" class="form-input" readonly />
      </div>

      <!-- Status Pemeliharaan -->
      <div>
        <label class="block text-sm font-medium">Status</label>
        <select v-model="formData.status" class="form-input" required @change="updateEndDate">
          <option value="maintenances">Perbaikan</option>
          <option value="completed">Selesai</option>
        </select>
      </div>

      <div class="flex justify-end">
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" :disabled="isLoading">
          {{ isLoading ? 'Menyimpan...' : 'Simpan Perubahan' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMaintenanceStore } from '~/store/maintenance'

const route = useRoute()
const router = useRouter()
const maintenanceStore = useMaintenanceStore()
const maintenanceId = route.params.id as string

const isLoading = ref(false)
const formData = ref({
  id: '',
  model: '',
  serialNumber: '',
  picture: '',
  description: '',
  startDate: '',
  endDate: '',
  status: 'maintenances',
  maintenance_status_id: '' // Diperlukan untuk dikirim ke backend
});

onMounted(async () => {
  const maintenance = await maintenanceStore.getMaintenanceDetail(maintenanceId);
  if (maintenance) {
    formData.value = {
      id: maintenance.id,
      model: maintenance.wheelchair.model_id,
      serialNumber: maintenance.wheelchair.serial_number,
      picture: maintenance.picture,
      description: maintenance.issue_description,
      startDate: maintenance.start_date,
      endDate: maintenance.end_date || '',
      status: maintenance.maintenance_status.status,
      maintenance_status_id: maintenance.maintenance_status.id
    };
  }
});

const updateEndDate = () => {
  if (formData.value.status === 'completed' && !formData.value.endDate) {
    formData.value.endDate = new Date().toISOString().split('T')[0];
  }

  // update id status maintenance jika user ubah status
  formData.value.maintenance_status_id = formData.value.status === 'completed'
    ? 'b4fb7213-1f80-11f0-beb4-bceca0027c54' // ID untuk 'completed'
    : 'b4fb6e37-1f80-11f0-beb4-bceca0027c54'; // ID untuk 'maintenances'
};

const handleSubmit = async () => {
  try {
    isLoading.value = true;

    // Kirim hanya field yang boleh diubah
    const payload = {
      picture: formData.value.picture,
      issue_description: formData.value.description,
      maintenance_status_id: formData.value.maintenance_status_id,
      end_date: formData.value.status === 'completed' ? formData.value.endDate : null
    };

    await maintenanceStore.updateMaintenance(maintenanceId, payload);
    await maintenanceStore.loadMaintenance();
    alert('Data maintenance berhasil diperbarui!');
    router.push('/admin/maintenance');
  } catch (error) {
    console.error(error);
    alert('Gagal memperbarui data maintenance.');
  } finally {
    isLoading.value = false;
  }
};


</script>

<style scoped>
.form-input {
  @apply w-full border rounded-md px-3 py-2;
}
</style>
