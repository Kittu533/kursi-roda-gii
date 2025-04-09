<template>
    <div>
      <h2 class="mb-4 text-2xl font-bold">Wheelchair Management</h2>
      
      <DataTable
        title="Wheelchairs Inventory"
        item-name="Wheelchair"
        :columns="['id', 'model', 'type', 'status', 'condition', 'location']"
        :data="wheelchairs"
        @add="openAddModal"
        @edit="openEditModal"
        @delete="deleteWheelchair"
      />
      
      <FormModal
        :show="isModalOpen"
        :title="editingWheelchair ? 'Edit Wheelchair' : 'Add New Wheelchair'"
        :fields="wheelchairFormFields"
        :initial-data="formData"
        @close="isModalOpen = false"
        @save="saveWheelchair"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import DataTable from '../dashboard/data-table.vue';
  import FormModal from '../dashboard/form-modal.vue';
  import { useToast } from '../../composables/use-toast';
  
  interface Wheelchair {
    id: string;
    model: string;
    type: string;
    status: string;
    condition: string;
    location: string;
  }
  
  interface FormData {
    id?: string;
    model?: string;
    type?: string;
    status?: string;
    condition?: string;
    location?: string;
  }
  
  const { showToast } = useToast();
  
  const wheelchairs = ref<Wheelchair[]>([
    { id: 'WC001', model: 'Standard Manual', type: 'Manual', status: 'Available', condition: 'Excellent', location: 'Warehouse A' },
    { id: 'WC002', model: 'Lightweight Folding', type: 'Manual', status: 'Rented', condition: 'Good', location: 'Client Site' },
    { id: 'WC003', model: 'Electric Power', type: 'Electric', status: 'Available', condition: 'Excellent', location: 'Warehouse B' },
    { id: 'WC004', model: 'Sports Active', type: 'Manual', status: 'Maintenance', condition: 'Fair', location: 'Repair Shop' },
    { id: 'WC005', model: 'Heavy Duty', type: 'Manual', status: 'Available', condition: 'Good', location: 'Warehouse A' },
  ]);
  
  const isModalOpen = ref(false);
  const editingWheelchair = ref<Wheelchair | null>(null);
  const formData = ref<FormData>({});
  
  const wheelchairFormFields = [
    { name: 'id', label: 'ID', type: 'text' },
    { name: 'model', label: 'Model', type: 'text' },
    { name: 'type', label: 'Type', type: 'select', options: ['Manual', 'Electric'] },
    { name: 'status', label: 'Status', type: 'select', options: ['Available', 'Rented', 'Maintenance'] },
    { name: 'condition', label: 'Condition', type: 'select', options: ['Excellent', 'Good', 'Fair', 'Poor'] },
    { name: 'location', label: 'Location', type: 'text' },
  ];
  
  const openAddModal = () => {
    editingWheelchair.value = null;
    formData.value = {};
    isModalOpen.value = true;
  };
  
  const openEditModal = (wheelchair: Wheelchair) => {
    editingWheelchair.value = wheelchair;
    formData.value = { ...wheelchair };
    isModalOpen.value = true;
  };
  
  const saveWheelchair = (data: FormData) => {
    if (editingWheelchair.value) {
      // Update existing wheelchair
      const index = wheelchairs.value.findIndex(w => w.id === editingWheelchair.value!.id);
      if (index !== -1) {
        wheelchairs.value[index] = { ...wheelchairs.value[index], ...data };
      }
    } else {
      // Add new wheelchair
      wheelchairs.value.push({ ...data } as Wheelchair);
    }
    
    isModalOpen.value = false;
    showToast({
      type: 'success',
      title: editingWheelchair.value ? 'Wheelchair Updated' : 'Wheelchair Created',
      message: `Wheelchair has been ${editingWheelchair.value ? 'updated' : 'created'} successfully.`,
    });
  };
  
  const deleteWheelchair = (wheelchair: Wheelchair) => {
    wheelchairs.value = wheelchairs.value.filter(w => w.id !== wheelchair.id);
    
    showToast({
      type: 'success',
      title: 'Wheelchair Deleted',
      message: 'Wheelchair has been deleted successfully.',
    });
  };
  </script>