import { defineStore } from 'pinia'
import {
  fetchAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage
} from '@/composables/consume-api/package.api'

import type {
  Package,
  PackagePayload
} from '~/types/package'

interface PackageStoreState {
  packages: Package[]
  selectedPackage: Package | null
  isLoading: boolean
  error: string | null
}

export const usePackageStore = defineStore('package', {
  state: (): PackageStoreState => ({
    packages: [],
    selectedPackage: null,
    isLoading: false,
    error: null
  }),

  actions: {
    async loadPackages(): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        const res = await fetchAllPackages()
        this.packages = res.response.filter(pkg => !pkg.deleted_at)
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Gagal memuat data paket'
        console.error('Error loading packages:', error)
      } finally {
        this.isLoading = false
      }
    },

    async getPackageDetail(id: string): Promise<Package | null> {
      try {
        this.isLoading = true
        this.error = null

        const res = await getPackageById(id)
        this.selectedPackage = res.response
        return this.selectedPackage
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Gagal memuat detail paket'
        console.error('Error getting package detail:', error)
        return null
      } finally {
        this.isLoading = false
      }
    },

    clearSelectedPackage(): void {
      this.selectedPackage = null
    },

    async createNewPackage(payload: PackagePayload): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        await createPackage(payload)
        await this.loadPackages()
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Gagal membuat paket'
        console.error('Error creating package:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updatePackage(id: string, data: Partial<PackagePayload>): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        await updatePackage(id, data)

        if (this.selectedPackage?.id === id) {
          await this.getPackageDetail(id)
        }

        await this.loadPackages()
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Gagal memperbarui paket'
        console.error('Error updating package:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async deletePackage(id: string): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        await deletePackage(id)
        this.packages = this.packages.filter(p => p.id !== id)

        if (this.selectedPackage?.id === id) {
          this.clearSelectedPackage()
        }

        await this.loadPackages()
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Gagal menghapus paket'
        console.error('Error deleting package:', error)
      } finally {
        this.isLoading = false
      }
    }
  }
})
