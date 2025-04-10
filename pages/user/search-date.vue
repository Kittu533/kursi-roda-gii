<template>
  <div class="pb-20">
    <!-- Header -->
    <div class="p-4 flex items-center">
      <button @click="$router.back()" class="mr-3">
        <Icon name="lucide:chevron-left" class="h-5 w-5" />
      </button>
      <div class="flex-1">
        <div
          class="bg-orange-100 rounded-full p-2 mr-3 inline-flex items-center"
        >
          <Icon name="lucide:map-pin" class="text-orange-500 h-5 w-5" />
        </div>
        <span class="text-sm font-medium">{{ selectedLocation.name }}</span>
      </div>
    </div>

    <!-- Date Selection -->
    <div class="p-4">
      <h2 class="text-lg font-medium text-center mb-4">Pilih Tanggal Ambil</h2>

      <!-- Date Picker -->
      <DatePicker v-model="dateRange" />

      <!-- Selected Dates Display -->
      <div class="mt-6 space-y-4">
        <div class="flex items-center border border-gray-200 rounded-md p-3">
          <div class="flex-1">
            <h3 class="text-sm text-gray-500">Tanggal Sewa</h3>
            <p class="text-sm font-medium">
              {{
                dateRange.startDate
                  ? formatDate(dateRange.startDate)
                  : "Pilih tanggal"
              }}
            </p>
          </div>
          <Icon name="lucide:calendar" class="h-5 w-5 text-gray-400" />
        </div>

        <div class="flex items-center border border-gray-200 rounded-md p-3">
          <div class="flex-1">
            <h3 class="text-sm text-gray-500">Tanggal Kembali</h3>
            <p class="text-sm font-medium">
              {{
                dateRange.endDate
                  ? formatDate(dateRange.endDate)
                  : "Pilih tanggal"
              }}
            </p>
          </div>
          <Icon name="lucide:calendar" class="h-5 w-5 text-gray-400" />
        </div>
      </div>

      <!-- Confirm Button -->
      <div class="mt-6">
        <button
          @click="confirmDateSelection"
          :disabled="!isDateRangeValid"
          class="w-full py-3 bg-orange-500 text-white rounded-md font-medium transition-colors"
          :class="{ 'opacity-70': !isDateRangeValid }"
        >
          Cari
        </button>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <BottomNavigation />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import type { Location, DateRange } from "~/types";

const router = useRouter();
definePageMeta({
    title: 'User Home',
    layout: 'users',
  });
const selectedLocation = ref<Location>({
  id: "1",
  name: "Agen A",
  address: "Jl. Ibrahim Al-Khalil No. 12, Al-Haram, Makkah, Arab Saudi",
});

const dateRange = ref<DateRange>({
  startDate: null,
  endDate: null,
});

const isDateRangeValid = computed(() => {
  return dateRange.value.startDate !== null && dateRange.value.endDate !== null;
});

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const confirmDateSelection = () => {
  if (!isDateRangeValid.value) return;

  console.log("Selected date range:", dateRange.value);
  // Navigate back or to another page with the selected dates
  router.push("/");
};

onMounted(() => {
  // Initialize dateRange with values from localStorage if available
  const storedStartDate = localStorage.getItem("startDate");
  const storedEndDate = localStorage.getItem("endDate");

  if (storedStartDate && storedEndDate) {
    dateRange.value = {
      startDate: new Date(storedStartDate),
      endDate: new Date(storedEndDate),
    };
  }
});

watch(
  dateRange,
  (newDateRange) => {
    if (newDateRange.startDate) {
      localStorage.setItem("startDate", newDateRange.startDate.toISOString());
    } else {
      localStorage.removeItem("startDate");
    }

    if (newDateRange.endDate) {
      localStorage.setItem("endDate", newDateRange.endDate.toISOString());
    } else {
      localStorage.removeItem("endDate");
    }
  },
  { deep: true }
);
</script>
