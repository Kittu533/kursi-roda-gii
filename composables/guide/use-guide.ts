import { ref, computed } from "vue"
import type { Guide, GuideFilter, GuidePagination } from "~/types/guide"
import { useGuideApi } from "~/composables/consume-api/guide.api"

export function useGuides() {
    const guideApi = useGuideApi()

    // State
    const guides = ref<Guide[]>([])
    const selectedGuide = ref<Guide | null>(null)
    const pagination = ref<GuidePagination>({
        currentPage: 1,
        totalPages: 0,
        total: 0,
        itemsPerPage: 5,
        data: [],
    })

    // Methods
    const fetchGuides = async (filter?: GuideFilter) => {
        const result = await guideApi.getGuides(filter)
        pagination.value = result
        guides.value = result.data
        return result
    }

    const fetchGuideById = async (id: string) => {
        selectedGuide.value = await guideApi.getGuideById(id)
        return selectedGuide.value
    }

    const saveGuide = async (guideData: Partial<Guide>) => {
        if (selectedGuide.value) {
            // Update existing guide
            selectedGuide.value = (await guideApi.updateGuide(selectedGuide.value.id, guideData)) as Guide
        } else {
            // Create new guide
            selectedGuide.value = await guideApi.createGuide(guideData as Omit<Guide, "id">)
        }

        return selectedGuide.value
    }

    const removeGuide = async (id: string) => {
        return await guideApi.deleteGuide(id)
    }

    // Computed
    const isLoading = computed(() => guideApi.isLoading.value)
    const error = computed(() => guideApi.error.value)

    return {
        // State
        guides,
        selectedGuide,
        pagination,
        isLoading,
        error,

        // Methods
        fetchGuides,
        fetchGuideById,
        saveGuide,
        removeGuide,
    }
}

