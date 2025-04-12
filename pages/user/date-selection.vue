<template>
  <div class="flex flex-col h-screen bg-white">
    <!-- Header -->
    <div class="p-4 flex items-center">
      <button @click="$router.back()" class="mr-3">
        <!-- Back icon -->
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      <div>
        <div class="flex items-center">
          <div class="bg-orange-100 rounded-full p-2 mr-2 inline-flex items-center justify-center">
            <!-- Location marker icon -->
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-500">
              <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <span class="text-sm font-medium">Agen A</span>
        </div>
        <p class="text-xs text-orange-500 ml-10">Jl. Ibrahim Al-Khalil No. 12, Al-Haram, Makkah</p>
      </div>
    </div>

    <!-- Date Selection Form -->
    <div class="p-4 flex-1">
      <div class="space-y-4">
        <!-- Rental Date -->
        <div class="flex items-center justify-between border-b border-gray-200 py-3">
          <span class="text-gray-500">Tanggal Sewa</span>
          <button @click="openStartDatePicker" class="flex items-center cursor-pointer">
            <span class="mr-2 text-sm">
              {{ dateRange.startDate ? formatDate(dateRange.startDate) : "Pilih tanggal" }}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </button>
        </div>

        <!-- Return Date -->
        <div class="flex items-center justify-between border-b border-gray-200 py-3">
          <span class="text-gray-500">Tanggal Kembali</span>
          <button @click="openEndDatePicker" class="flex items-center cursor-pointer">
            <span class="mr-2 text-sm">
              {{ dateRange.endDate ? formatDate(dateRange.endDate) : "Pilih tanggal" }}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </button>
        </div>
      </div>

      <!-- Search Button -->
      <div class="mt-8">
        <button
          @click="search"
          :disabled="!isDateRangeValid"
          class="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-md font-medium transition-colors"
          :class="{ 'opacity-70': !isDateRangeValid }"
        >
          Cari
        </button>
      </div>
    </div>

    <!-- Date Picker Modal -->
    <div v-if="showDatePicker" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-4 w-11/12 max-w-md">
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-lg font-medium">{{ pickerTitle }}</h3>
          <button @click="closeDatePicker" class="text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <p class="text-sm text-gray-500 mb-4">{{ pickerDescription }}</p>
        
        <!-- Month Navigation -->
        <div class="flex justify-between items-center mb-4">
          <button @click="prevMonth" class="p-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <h3 class="text-md font-medium">{{ currentMonthName }} {{ currentYear }}</h3>
          <button @click="nextMonth" class="p-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
        
        <!-- Days of Week -->
        <div class="grid grid-cols-7 gap-1 text-center mb-2">
          <div v-for="day in daysOfWeek" :key="day" class="text-xs text-gray-500 font-medium">
            {{ day }}
          </div>
        </div>
        
        <!-- Calendar Grid -->
        <div class="grid grid-cols-7 gap-1">
          <!-- Empty cells for days before the first day of the month -->
          <div 
            v-for="_ in firstDayOfMonth" 
            :key="'empty-' + _" 
            class="h-10 rounded-md"
          ></div>
          
          <!-- Days of the month -->
          <div 
            v-for="day in daysInMonth" 
            :key="day" 
            @click="selectDate(day)"
            class="h-10 flex items-center justify-center rounded-md cursor-pointer text-sm"
            :class="getDayClass(day)"
          >
            {{ day }}
          </div>
        </div>
        
        <div class="mt-4 flex justify-end">
          <button @click="confirmDateSelection" class="px-4 py-2 bg-orange-500 text-white rounded-md">
            Pilih
          </button>
        </div>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <div class="fixed bottom-0 left-0 right-0 flex justify-center z-10">
      <div class="bg-white border-t border-gray-200 flex justify-around items-center h-16 w-full max-w-[480px]">
        <a
          href="/"
          class="flex flex-col items-center justify-center w-1/3 h-full text-orange-500"
        >
          <!-- Home icon -->
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-1">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span class="text-xs">Beranda</span>
        </a>

        <a
          href="/transaksi"
          class="flex flex-col items-center justify-center w-1/3 h-full text-gray-400"
        >
          <!-- Transaction icon -->
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-1">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span class="text-xs">Transaksi</span>
        </a>

        <a
          href="/akun"
          class="flex flex-col items-center justify-center w-1/3 h-full text-gray-400"
        >
          <!-- Account icon -->
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-1">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span class="text-xs">Akun</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
definePageMeta({
    title: 'User Home',
    layout: 'users',
  });
// Define the DateRange interface
interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

const router = useRouter();

// Date state
const dateRange = ref<DateRange>({
  startDate: null,
  endDate: null
});

// Date picker state
const showDatePicker = ref(false);
const currentPickerType = ref<'start' | 'end'>('start');
const pickerTitle = computed(() => 
  currentPickerType.value === 'start' ? 'Pilih Tanggal Sewa' : 'Pilih Tanggal Kembali'
);
const pickerDescription = computed(() => 
  currentPickerType.value === 'start' ? 'Pilih tanggal mulai sewa Anda' : 'Pilih tanggal pengembalian Anda'
);

// Calendar state
const currentDate = ref(new Date());
const selectedDay = ref<number | null>(null);
const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// Computed properties for calendar
const currentYear = computed(() => currentDate.value.getFullYear());
const currentMonth = computed(() => currentDate.value.getMonth());
const currentMonthName = computed(() => {
  const options = { month: 'long' } as Intl.DateTimeFormatOptions;
  return new Date(currentYear.value, currentMonth.value, 1).toLocaleDateString('en-US', options);
});

const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
});

const firstDayOfMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).getDay();
});

// Calendar navigation
const nextMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1);
};

const prevMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1);
};

// Open date pickers
const openStartDatePicker = () => {
  currentPickerType.value = 'start';
  showDatePicker.value = true;
  
  // Initialize with current selection if available
  if (dateRange.value.startDate) {
    const startDate = new Date(dateRange.value.startDate);
    currentDate.value = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    selectedDay.value = startDate.getDate();
  } else {
    currentDate.value = new Date();
    selectedDay.value = null;
  }
};

const openEndDatePicker = () => {
  // Only allow opening end date picker if start date is selected
  if (!dateRange.value.startDate) {
    openStartDatePicker();
    return;
  }
  
  currentPickerType.value = 'end';
  showDatePicker.value = true;
  
  // Initialize with current selection if available
  if (dateRange.value.endDate) {
    const endDate = new Date(dateRange.value.endDate);
    currentDate.value = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
    selectedDay.value = endDate.getDate();
  } else {
    // Start with the month of the start date
    const startDate = new Date(dateRange.value.startDate);
    currentDate.value = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    selectedDay.value = null;
  }
};

const closeDatePicker = () => {
  showDatePicker.value = false;
  selectedDay.value = null;
};

// Date selection logic
const selectDate = (day: number) => {
  const selectedDate = new Date(currentYear.value, currentMonth.value, day);
  
  // Don't allow selecting dates in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selectedDate < today) {
    return;
  }
  
  // Don't allow selecting end date before start date
  if (currentPickerType.value === 'end' && dateRange.value.startDate) {
    if (selectedDate < dateRange.value.startDate) {
      return;
    }
  }
  
  selectedDay.value = day;
};

// Confirm date selection
const confirmDateSelection = () => {
  if (selectedDay.value) {
    const selectedDate = new Date(currentYear.value, currentMonth.value, selectedDay.value);
    
    if (currentPickerType.value === 'start') {
      dateRange.value.startDate = selectedDate;
      
      // If end date is before start date, clear end date
      if (dateRange.value.endDate && dateRange.value.endDate < selectedDate) {
        dateRange.value.endDate = null;
      }
    } else {
      dateRange.value.endDate = selectedDate;
    }
  }
  
  showDatePicker.value = false;
  selectedDay.value = null;
};

// Helper to determine the class for each day
const getDayClass = (day: number) => {
  const date = new Date(currentYear.value, currentMonth.value, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Check if this date is today
  const isToday = date.getTime() === today.getTime();
  
  // Check if this date is the selected day in the picker
  const isSelected = selectedDay.value === day;
  
  // Check if this date is in the past
  const isPast = date < today;
  
  // Check if this date is the start date
  const isStartDate = dateRange.value.startDate && 
    date.getTime() === new Date(dateRange.value.startDate).setHours(0, 0, 0, 0);
  
  // Check if this date is the end date
  const isEndDate = dateRange.value.endDate && 
    date.getTime() === new Date(dateRange.value.endDate).setHours(0, 0, 0, 0);
  
  // For end date picker, check if date is before start date
  const isBeforeStartDate = currentPickerType.value === 'end' && 
    dateRange.value.startDate && date < dateRange.value.startDate;
  
  return {
    'bg-orange-500 text-white': isSelected || isStartDate || isEndDate,
    'border border-orange-500': isToday && !isSelected && !isStartDate && !isEndDate,
    'text-gray-300 cursor-not-allowed': isPast || isBeforeStartDate,
    'hover:bg-orange-100': !isPast && !isBeforeStartDate && !isSelected && !isStartDate && !isEndDate
  };
};

// Check if both dates are selected
const isDateRangeValid = computed(() => {
  return dateRange.value.startDate !== null && dateRange.value.endDate !== null;
});

// Format date for display
const formatDate = (date: Date | null): string => {
  if (!date) return "";
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Search function
const search = () => {
  if (!isDateRangeValid.value) return;
  
  console.log("Selected dates:", {
    startDate: dateRange.value.startDate,
    endDate: dateRange.value.endDate
  });
  
  // Format tanggal untuk query parameter
  const formattedStartDate = formatDate(dateRange.value.startDate);
  const formattedEndDate = formatDate(dateRange.value.endDate);
  
  // Best practice untuk routing dengan named route
  router.push({
    name: 'user-location-selection',
    query: { 
      startDate: formattedStartDate,
      endDate: formattedEndDate
    }
  });
};

// Helper function untuk format tanggal
</script>