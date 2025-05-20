// composables/consume-api/maintenance.api.ts
import { useApi } from '@/composables/use-fetch-api'
import type { MaintenanceRecord, CreateMaintenancePayload } from '~/types/maintenance'

// Mendapatkan semua data maintenance dengan filter
export const getAllMaintenance = (filter: MaintenanceFilter) => {
  return useApi<{ response: { records: MaintenanceRecord[]; page: any } }>('/maintenance/admin', {
    method: 'GET',
    query: filter,
    service: 'core'
  })
}

// Mendapatkan detail maintenance berdasarkan ID
export const getMaintenanceById = (id: string) => {
  return useApi<{ response: MaintenanceRecord }>(`/maintenance/admin/${id}`, {
    method: 'GET',
    service: 'core'
  })
}

// **Menambahkan fungsi getWheelchairById**
export const getWheelchairById = (id: string) => {
  return useApi<{ response: any }>(`/wheelchair/admin/${id}`, {
    method: 'GET',
    service: 'core'
  })
}

// Membuat maintenance baru
export const createMaintenance = (data: CreateMaintenancePayload) => {
  return useApi('/maintenance/admin', {
    method: 'POST',
    body: data,
    service: 'core'
  })
}

// Memperbarui data maintenance
export const updateMaintenance = (id: string, data: Partial<CreateMaintenancePayload>) => {
  return useApi(`/maintenance/admin/${id}`, {
    method: 'PATCH',
    body: data,
    service: 'core'
  })
}

// Menghapus maintenance berdasarkan ID
export const deleteMaintenance = (id: string) => {
  return useApi(`/maintenance/admin/${id}`, {
    method: 'DELETE',
    service: 'core'
  })
}
