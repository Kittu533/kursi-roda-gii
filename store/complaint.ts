import { defineStore } from "pinia"
import { ref, computed } from "vue"
import type { Complaint, ComplaintFilter } from "~/types/complaint"
import { useComplaints } from "~/composables/complaint/use-complaint"
import { useNotification } from "~/composables/use-notification"

export const useComplaintStore = defineStore("complaint", () => {
  // Composables
  const {
    complaints: complaintsRef,
    selectedComplaint: selectedComplaintRef,
    pagination: paginationRef,
    isLoading,
    error,
    fetchComplaints,
    fetchComplaintById,
    saveComplaint,
    removeComplaint,
  } = useComplaints()

  const notification = useNotification()

  // State
  const filter = ref<ComplaintFilter>({
    page: 1,
    complaintId: '',
    customerId: '',
    transactionId: '',
    type: '',
    status: '',
    startDate: '',
    endDate: '',
    itemsPerPage: 5,
  })

  // Actions
  const loadComplaints = async () => {
    try {
      const result = await fetchComplaints(filter.value)
      return result
    } catch (e) {
      notification.error("Gagal memuat data pengembalian")
      throw e
    }
  }

  const setFilter = async (newFilter: Partial<ComplaintFilter>) => {
    filter.value = {
      ...filter.value,
      ...newFilter,
      // Reset to page 1 when filter changes (except when explicitly changing page)
      page: newFilter.page || 1,
    }

    return await loadComplaints()
  }

  const resetFilter = async () => {
    filter.value = {
      page: 1,
      complaintId: '',
      customerId: '',
      transactionId: '',
      type: '',
      status: '',
      startDate: '',
      endDate: '',
      itemsPerPage: 5,
    }

    return await loadComplaints()
  }

  const loadComplaintDetails = async (id: string) => {
    try {
      return await fetchComplaintById(id)
    } catch (e) {
      notification.error("Gagal memuat detail pengembalian")
      throw e
    }
  }

  const updateComplaint = async (id: string, complaintData: Partial<Complaint>) => {
    try {
      const result = await saveComplaint({ id, ...complaintData })
      notification.success("Data pengembalian berhasil diperbarui")
      return result
    } catch (e) {
      notification.error("Gagal memperbarui data pengembalian")
      throw e
    }
  }

  const createComplaint = async (complaintData: Omit<Complaint, "id">) => {
    try {
      const result = await saveComplaint(complaintData)
      notification.success("Data pengembalian berhasil dibuat")
      return result
    } catch (e) {
      notification.error("Gagal membuat data pengembalian")
      throw e
    }
  }

  const deleteComplaint = async (id: string) => {
    try {
      const result = await removeComplaint(id)
      if (result) {
        notification.success("Data pengembalian berhasil dihapus")
        await loadComplaints()
      }
      return result
    } catch (e) {
      notification.error("Gagal menghapus data pengembalian")
      throw e
    }
  }

  // Getters
  const complaints = computed(() => complaintsRef.value)
  const selectedComplaint = computed(() => selectedComplaintRef.value)
  const pagination = computed(() => paginationRef.value)

  return {
    // State
    filter,
    complaints,
    selectedComplaint,
    pagination,
    isLoading,
    error,

    // Actions
    loadComplaints,
    setFilter,
    resetFilter,
    loadComplaintDetails,
    updateComplaint,
    createComplaint,
    deleteComplaint,
  }
})