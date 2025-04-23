import { ref, computed } from "vue"
import type { Complaint, ComplaintFilter, ComplaintPagination } from "~/types/complaint"
import { useComplaintApi } from "~/composables/consume-api/complaint.api"

export function useComplaints() {
  const complaintApi = useComplaintApi()

  // State
  const complaints = ref<Complaint[]>([])
  const selectedComplaint = ref<Complaint | null>(null)
  const itemsPerPage = ref(10) // Default value, can be changed
  const pagination = ref<ComplaintPagination>({
    currentPage: 1,
    totalPages: 0,
    total: 0,
    itemsPerPage: itemsPerPage.value,
    data: [],
  })

  // Methods
  const fetchComplaints = async (filter?: ComplaintFilter) => {
    const result = await complaintApi.getComplaints(filter)
    pagination.value = result
    complaints.value = result.data
    return result
  }

  const fetchComplaintById = async (id: string) => {
    selectedComplaint.value = await complaintApi.getComplaintById(id)
    return selectedComplaint.value
  }

  const saveComplaint = async (complaintData: Partial<Complaint>) => {
    if (complaintData.id) {
      // Update existing complaint
      selectedComplaint.value = (await complaintApi.updateComplaint(complaintData.id, complaintData)) as Complaint
    } else {
      // Create new complaint
      selectedComplaint.value = await complaintApi.createComplaint(complaintData as Omit<Complaint, "id">)
    }

    return selectedComplaint.value
  }

  const removeComplaint = async (id: string) => {
    return await complaintApi.deleteComplaint(id)
  }

  // Computed
  const isLoading = computed(() => complaintApi.isLoading.value)
  const error = computed(() => complaintApi.error.value)

  return {
    // State
    complaints,
    selectedComplaint,
    pagination,
    isLoading,
    error,

    // Methods
    fetchComplaints,
    fetchComplaintById,
    saveComplaint,
    removeComplaint,
  }
}