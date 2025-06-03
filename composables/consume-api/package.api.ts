import { useApi } from '@/composables/use-fetch-api'
import type {
  Package,
  PackagePayload,
  PackageApiResponse,
  PackageListResponse
} from '~/types/package'

export const fetchAllPackages = () => {
  return useApi<PackageListResponse>('/admin/packages', {
    method: 'GET',
    service: 'core'
  })
}

export const getPackageById = (id: string) => {
  return useApi<PackageApiResponse>(`/admin/packages/${id}`, {
    method: 'GET',
    service: 'core'
  })
}

export const createPackage = (payload: PackagePayload) => {
  return useApi('/admin/packages', {
    method: 'POST',
    body: payload,
    service: 'core'
  })
}

export const updatePackage = (id: string, payload: Partial<PackagePayload>) => {
  return useApi(`/admin/packages/${id}`, {
    method: 'PATCH',
    body: payload,
    service: 'core'
  })
}

export const deletePackage = (id: string) => {
  return useApi(`/admin/packages/${id}/soft_delete`, {
    method: 'PATCH',
    service: 'core'
  })
}
