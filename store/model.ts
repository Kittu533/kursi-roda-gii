import { defineStore } from "pinia";
import type { Model, ModelFilter, ModelPagination } from "~/types/model";

export const useModelStore = defineStore("model", () => {
  const models = ref<Model[]>([]);
  const pagination = ref<ModelPagination | null>(null);
  const filter = ref<ModelFilter>({
    page: 1,
    itemsPerPage: 10,
  });

  const isLoading = ref(false);

  // Load all models (you can modify endpoint)
  const loadModels = async () => {
    isLoading.value = true;
    try {
      const { data } = await useFetch("/api/models", {
        params: filter.value,
      });

      if (data.value) {
        models.value = data.value.data || [];
        pagination.value = {
          currentPage: data.value.currentPage,
          totalPages: data.value.totalPages,
          total: data.value.total,
          itemsPerPage: data.value.itemsPerPage,
          data: data.value.data,
        };
      }
    } catch (error) {
      console.error("Gagal memuat data model:", error);
    } finally {
      isLoading.value = false;
    }
  };

  const setFilter = (newFilter: Partial<ModelFilter>) => {
    filter.value = { ...filter.value, ...newFilter };
    loadModels(); // reload on filter change
  };

  const resetFilter = () => {
    filter.value = {
      page: 1,
      itemsPerPage: 10,
    };
    loadModels();
  };

  const deleteModel = async (id: string) => {
    try {
      await $fetch(`/api/models/${id}`, { method: "DELETE" });
      models.value = models.value.filter((m) => m.id !== id);
    } catch (error) {
      console.error("Gagal menghapus model:", error);
    }
  };

  return {
    models,
    pagination,
    filter,
    isLoading,
    loadModels,
    setFilter,
    resetFilter,
    deleteModel,
  };
});
