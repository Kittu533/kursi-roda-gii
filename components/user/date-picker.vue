<template>
  <div class="bg-white p-4">
    <div class="flex justify-between items-center mb-4">
      <button @click="prevMonth" class="p-1">
        <Icon name="mdi:chevron-left" class="h-5 w-5" />
      </button>
      <h2 class="text-sm font-medium">{{ monthYearText }}</h2>
      <button @click="nextMonth" class="p-1">
        <Icon name="mdi:chevron-right" class="h-5 w-5" />
      </button>
    </div>

    <div class="grid grid-cols-7 gap-1 text-center mb-2">
      <div v-for="day in weekDays" :key="day" class="text-xs text-gray-500">
        {{ day }}
      </div>
    </div>

    <div class="grid grid-cols-7 gap-1">
      <div
        v-for="(date, index) in calendarDays"
        :key="index"
        class="aspect-square flex items-center justify-center text-xs rounded-full"
        :class="getDayClasses(date)"
        @click="selectDate(date)"
      >
        {{ date ? date.getDate() : "" }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { DateRange } from "~/types";

const props = defineProps<{
  modelValue: DateRange;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: DateRange): void;
}>();

const currentMonth = ref(new Date());

const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

const monthYearText = computed(() => {
  return currentMonth.value.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
});

const calendarDays = computed(() => {
  const year = currentMonth.value.getFullYear();
  const month = currentMonth.value.getMonth();

  // First day of the month
  const firstDay = new Date(year, month, 1);
  // Last day of the month
  const lastDay = new Date(year, month + 1, 0);

  // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
  const firstDayOfWeek = firstDay.getDay();

  // Total days in the month
  const daysInMonth = lastDay.getDate();

  // Create an array to hold all calendar days
  const days: (Date | null)[] = [];

  // Add empty slots for days before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null);
  }

  // Add all days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  // Add empty slots to complete the grid (optional)
  const totalCells = Math.ceil(days.length / 7) * 7;
  while (days.length < totalCells) {
    days.push(null);
  }

  return days;
});

const prevMonth = () => {
  const year = currentMonth.value.getFullYear();
  const month = currentMonth.value.getMonth();
  currentMonth.value = new Date(year, month - 1, 1);
};

const nextMonth = () => {
  const year = currentMonth.value.getFullYear();
  const month = currentMonth.value.getMonth();
  currentMonth.value = new Date(year, month + 1, 1);
};

const selectDate = (date: Date | null) => {
  if (!date) return;

  const newRange = { ...props.modelValue };

  if (!newRange.startDate || (newRange.startDate && newRange.endDate)) {
    // Start a new range
    newRange.startDate = date;
    newRange.endDate = null;
  } else {
    // Complete the range
    if (date < newRange.startDate) {
      newRange.endDate = newRange.startDate;
      newRange.startDate = date;
    } else {
      newRange.endDate = date;
    }
  }

  emit("update:modelValue", newRange);
};

const isDateInRange = (date: Date | null): boolean => {
  if (!date || !props.modelValue.startDate) return false;

  if (props.modelValue.endDate) {
    return (
      date >= props.modelValue.startDate && date <= props.modelValue.endDate
    );
  }

  return date.getTime() === props.modelValue.startDate.getTime();
};

const isStartDate = (date: Date | null): boolean => {
  if (!date || !props.modelValue.startDate) return false;
  return date.getTime() === props.modelValue.startDate.getTime();
};

const isEndDate = (date: Date | null): boolean => {
  if (!date || !props.modelValue.endDate) return false;
  return date.getTime() === props.modelValue.endDate.getTime();
};

const getDayClasses = (date: Date | null) => {
  if (!date) return "invisible";

  const today = new Date();
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  if (isStartDate(date) || isEndDate(date)) {
    return "bg-orange-500 text-white cursor-pointer";
  }

  if (isDateInRange(date)) {
    return "bg-orange-100 text-orange-800 cursor-pointer";
  }

  if (isToday) {
    return "border border-orange-500 cursor-pointer";
  }

  return "hover:bg-gray-100 cursor-pointer";
};
</script>
