// store/maintenance.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  getAllMaintenance,
  getMaintenanceById,
  getWheelchairById,  // Fungsi untuk mengambil wheelchair
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
} from '@/composables/consume-api/maintenance.api';
import type {
  MaintenanceRecord,
  MaintenancePagination,
  MaintenanceFilter,
  CreateMaintenancePayload
} from '~/types/maintenance';

interface MaintenanceStoreState {
  maintenanceRecords: MaintenanceRecord[];
  pagination: MaintenancePagination | null;
  filter: MaintenanceFilter;
  selectedMaintenance: MaintenanceRecord | null;
  wheelchairData: any | null;  // State untuk menyimpan data kursi roda
  isLoading: boolean;
  error: string | null;
}

export const useMaintenanceStore = defineStore('maintenance', {
  state: (): MaintenanceStoreState => ({
    maintenanceRecords: [],
    pagination: null,
    filter: {
      startDate: '',
      endDate: '',
      status: '',
      page: 1,
      itemsPerPage: 5,
    },
    selectedMaintenance: null,
    wheelchairData: null,  // Menyimpan data kursi roda
    isLoading: false,
    error: null,
  }),

  actions: {
    // Mengambil semua data maintenance
    async loadMaintenance(): Promise<void> {
      try {
        this.isLoading = true;
        this.error = null;
        const res = await getAllMaintenance(this.filter);
        this.maintenanceRecords = res.response.records;
        this.pagination = {
          currentPage: res.response.page.batch_number,
          total: res.response.page.total_record_count,
          totalPages: Math.ceil(res.response.page.total_record_count / res.response.page.batch_size),
          itemsPerPage: res.response.page.batch_size,
        };
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to load maintenance records';
        console.error('Error loading maintenance records:', error);
      } finally {
        this.isLoading = false;
      }
    },

    // Mendapatkan detail maintenance berdasarkan ID
    async getMaintenanceDetail(id: string): Promise<MaintenanceRecord | null> {
      try {
        this.isLoading = true;
        this.error = null;
        const res = await getMaintenanceById(id);
        this.selectedMaintenance = res.response;

        // Mengambil data kursi roda berdasarkan wheelchair_id
        if (this.selectedMaintenance?.wheelchair_id) {
          await this.getWheelchairById(this.selectedMaintenance.wheelchair_id); // Ambil data kursi roda
        }

        return this.selectedMaintenance;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to get maintenance detail';
        console.error('Error getting maintenance detail:', error);
        return null;
      } finally {
        this.isLoading = false;
      }
    },

    // Mengambil data wheelchair berdasarkan ID
    async getWheelchairById(id: string): Promise<void> {
      try {
        const res = await getWheelchairById(id);
        this.wheelchairData = res.response; // Menyimpan data kursi roda
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to load wheelchair data';
        console.error('Error loading wheelchair data:', error);
      }
    },

    // Menyaring maintenance berdasarkan filter
    setFilter(filter: Partial<MaintenanceFilter>): void {
      this.filter = { ...this.filter, ...filter };
      this.loadMaintenance();
    },

    // Reset filter
    resetFilter(): void {
      this.filter = {
        startDate: '',
        endDate: '',
        status: '',
        page: 1,
        itemsPerPage: 5,
      };
      this.loadMaintenance();
    },

    // Menambahkan data maintenance baru
    async createNewMaintenance(data: CreateMaintenancePayload): Promise<unknown> {
      try {
        this.isLoading = true;
        this.error = null;
        const result = await createMaintenance(data);
        await this.loadMaintenance();
        return result;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create maintenance';
        console.error('Error creating maintenance:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // Memperbarui data maintenance// Mengupdate data maintenance di store setelah berhasil edit
async updateMaintenance(id: string, data: Partial<CreateMaintenancePayload>): Promise<unknown> {
    try {
        this.isLoading = true;
        this.error = null;
        const result = await updateMaintenance(id, data);
        // Memastikan bahwa state di store juga diperbarui
        const updatedMaintenance = await getMaintenanceById(id); // Dapatkan data terbaru
        this.selectedMaintenance = updatedMaintenance.response; // Perbarui selectedMaintenance
        await this.loadMaintenance(); // Pastikan semua data terload ulang
        return result;
    } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update maintenance';
        console.error('Error updating maintenance:', error);
        throw error;
    } finally {
        this.isLoading = false;
    }
},
    

    // Menghapus data maintenance
    async deleteMaintenance(id: string): Promise<void> {
      try {
        this.isLoading = true;
        this.error = null;
        await deleteMaintenance(id);
        this.maintenanceRecords = this.maintenanceRecords.filter((record) => record.id !== id);
        if (this.selectedMaintenance?.id === id) this.clearSelectedMaintenance();
        await this.loadMaintenance();
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to delete maintenance';
        console.error('Error deleting maintenance:', error);
      } finally {
        this.isLoading = false;
      }
    },

    // Clear selected maintenance
    clearSelectedMaintenance(): void {
      this.selectedMaintenance = null;
    },
  },
});
