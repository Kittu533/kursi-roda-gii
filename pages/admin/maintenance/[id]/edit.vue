<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">
          {{ isNewMaintenance ? "Tambah Maintenance" : "Edit Maintenance" }}
        </h2>
      </div>
      <div>
        <button
          class="bg-white border px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-50"
          @click="router.push('/admin/maintenances')"
        >
          <span>Kembali</span>
        </button>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg border shadow-sm">
      <form @submit.prevent="saveMaintenance" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Maintenance ID -->
          <div class="space-y-2">
            <label
              for="maintenanceId"
              class="block text-sm font-medium text-gray-700"
              >ID Maintenance</label
            >
            <input
              id="maintenanceId"
              v-model="form.maintenanceId"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              :disabled="!isNewMaintenance"
            />
          </div>

          <!-- Product ID -->
          <div class="space-y-2">
            <label
              for="productId"
              class="block text-sm font-medium text-gray-700"
              >ID Produk</label
            >
            <input
              id="productId"
              v-model="form.productId"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <!-- Date -->
          <div class="space-y-2">
            <label for="date" class="block text-sm font-medium text-gray-700"
              >Tanggal</label
            >
            <input
              id="date"
              v-model="form.date"
              type="date"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <!-- Status -->
          <div class="space-y-2">
            <label for="status" class="block text-sm font-medium text-gray-700"
              >Status</label
            >
            <select
              id="status"
              v-model="form.status"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            >
              <option value="Maintenance">Maintenance</option>
              <option value="Repaired">Repaired</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <!-- Description -->
        <div class="space-y-2">
          <label
            for="description"
            class="block text-sm font-medium text-gray-700"
            >Deskripsi</label
          >
          <textarea
            id="description"
            v-model="form.description"
            rows="4"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          ></textarea>
        </div>

        <!-- Photo Upload -->
        <div class="space-y-2">
          <label for="photo" class="block text-sm font-medium text-gray-700"
            >Foto</label
          >
          <input
            id="photo"
            type="file"
            accept="image/*"
            @change="handleFileUpload"
            class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          <div v-if="form.photoUrl || previewUrl" class="mt-2">
            <img
              :src="previewUrl || form.photoUrl"
              alt="Preview"
              class="h-40 w-auto object-cover rounded-md"
            />
          </div>
        </div>

        <div class="flex justify-end space-x-3">
          <button
            type="button"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            @click="router.push('/admin/maintenances')"
          >
            Batal
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            :disabled="isLoading"
          >
            {{ isLoading ? "Menyimpan..." : "Simpan" }}
          </button>
        </div>
      </form>
    </div>

    <!-- Success Modal -->
    <ConfirmationModal
      v-model:isOpen="isSuccessModalOpen"
      type="success"
      :message="successMessage"
      :showButtons="false"
      @cancel="handleSuccessModalClose"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMaintenanceStore } from "~/store/maintenance";
import type { Maintenance } from "~/types/maintenance";
import ConfirmationModal from "~/components/ui/modals/confirmation-modal.vue";

// Router
const route = useRoute();
const router = useRouter();
const maintenanceId = computed(() => route.params.id as string);
const isNewMaintenance = computed(() => route.path.includes("/create"));

// Store
const maintenanceStore = useMaintenanceStore();
const isLoading = computed(() => maintenanceStore.isLoading);

// Form state
const form = ref<Partial<Maintenance>>({
  maintenanceId: "",
  productId: "",
  date: "",
  description: "",
  photoUrl: "",
  status: "Maintenance",
});

// UI state
const previewUrl = ref<string | null>(null);
const isSuccessModalOpen = ref(false);
const successMessage = ref("");

// Methods
const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];

    // Create a preview URL for the selected file
    previewUrl.value = URL.createObjectURL(file);

    // Here you would typically upload the file to your server and get a URL back
    // For now, we'll just store the file name as a placeholder
    form.value.photoUrl = file.name;

    // In a real application, you would upload the file here
    // const formData = new FormData();
    // formData.append('file', file);
    // Call your upload API and update form.value.photoUrl with the returned URL
  }
};

const saveMaintenance = async () => {
  try {
    if (isNewMaintenance.value) {
      await maintenanceStore.createMaintenance(
        form.value as Omit<Maintenance, "id">
      );
      successMessage.value = "Maintenance berhasil ditambahkan";
    } else {
      await maintenanceStore.updateMaintenance(maintenanceId.value, form.value);
      successMessage.value = "Maintenance berhasil diperbarui";
    }
    isSuccessModalOpen.value = true;
  } catch (error) {
    console.error("Error saving maintenance:", error);
  }
};

const handleSuccessModalClose = () => {
  isSuccessModalOpen.value = false;
  router.push("/admin/maintenances");
};

// Lifecycle
onMounted(async () => {
  if (!isNewMaintenance.value && maintenanceId.value) {
    try {
      const maintenance = await maintenanceStore.loadMaintenanceDetails(
        maintenanceId.value
      );
      if (maintenance) {
        // Fill the form with maintenance data
        form.value = { ...maintenance };
      }
    } catch (error) {
      console.error("Error loading maintenance details:", error);
    }
  }
});
</script>
