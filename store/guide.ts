import { defineStore } from "pinia"
import { ref, computed } from "vue"
import type { Guide, GuideFilter } from "~/types/guide"
import { useGuides } from "~/composables/guide/use-guide"
import { useNotification } from "~/composables/use-notification"

export const useGuideStore = defineStore("guide", () => {
    // Composables
    const {
        guides: guidesRef,
        selectedGuide: selectedGuideRef,
        pagination: paginationRef,
        isLoading,
        error,
        fetchGuides,
        fetchGuideById,
        saveGuide,
        removeGuide,
    } = useGuides()

    const notification = useNotification()

    // State
    const filter = ref<GuideFilter>({
        status: "",
        date: "",
        page: 1,
        itemsPerPage: 5,
    })

    // Actions
    const loadGuides = async () => {
        try {
            const result = await fetchGuides(filter.value)
            return result
        } catch (e) {
            notification.error("Failed to load guides")
            throw e
        }
    }

    const setFilter = async (newFilter: Partial<GuideFilter>) => {
        filter.value = {
            ...filter.value,
            ...newFilter,
            // Reset to page 1 when filter changes (except when explicitly changing page)
            page: newFilter.page || 1,
        }

        return await loadGuides()
    }

    const resetFilter = async () => {
        filter.value = {
            status: "",
            date: "",
            page: 1,
            itemsPerPage: 5,
        }

        return await loadGuides()
    }

    const loadGuideDetails = async (id: string) => {
        try {
            return await fetchGuideById(id)
        } catch (e) {
            notification.error("Failed to load guide details")
            throw e
        }
    }

    const updateGuide = async (id: string, guideData: Partial<Guide>) => {
        try {
            const result = await saveGuide({ id, ...guideData })
            notification.success("Guide updated successfully")
            return result
        } catch (e) {
            notification.error("Failed to update guide")
            throw e
        }
    }

    const deleteGuide = async (id: string) => {
        try {
            const result = await removeGuide(id)
            if (result) {
                notification.success("Guide deleted successfully")
                await loadGuides()
            }
            return result
        } catch (e) {
            notification.error("Failed to delete guide")
            throw e
        }
    }

    // Getters
    const guides = computed(() => guidesRef.value)
    const selectedGuide = computed(() => selectedGuideRef.value)
    const pagination = computed(() => paginationRef.value)

    return {
        // State
        filter,
        guides,
        selectedGuide,
        pagination,
        isLoading,
        error,

        // Actions
        loadGuides,
        setFilter,
        resetFilter,
        loadGuideDetails,
        updateGuide,
        deleteGuide,
    }
})

