<template>
  <div>
    <h2 class="mb-4 text-2xl font-bold">Dashboard Overview</h2>

    <!-- Summary Cards -->
    <div class="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <SummaryCard
        v-for="(card, index) in summaryCards"
        :key="index"
        :title="card.title"
        :value="card.value"
        :trend="card.trend"
        :percentage="card.percentage"
        :icon="card.icon"
        :bg-color="card.bgColor"
      />
    </div>

    <!-- Recent Activities -->
    <DataTable
      title="Recent Activities"
      item-name="Activity"
      :columns="[
        'id',
        'user',
        'wheelchair',
        'startDate',
        'endDate',
        'status',
      ]"
      :data="recentActivities"
      @add="$emit('add-rental')"
      @edit="$emit('edit-rental', $event)"
      @delete="$emit('delete-rental', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import SummaryCard from "../dashboard/summary-card.vue";
import DataTable from "../dashboard/data-table.vue";
import type { Component } from 'vue';
import { User , ShipWheel, ActivitySquare,AccessibilityIcon } from 'lucide-vue-next';
interface SummaryCard {
  title: string;
  value: string;
  trend: "up" | "down";
  percentage: string;
  icon: Component;
  bgColor: string;
}

interface RecentActivity {
  id: string;
  user: string;
  wheelchair: string;
  startDate: string;
  endDate: string;
  status: string;
}


const summaryCards: SummaryCard[] = [
  {
    title: "Total Users",
    value: "1,248",
    trend: "up",
    percentage: "12",
    icon: User, // langsung component-nya
    bgColor: "bg-blue-500",
  },
  {
    title: "Total Wheelchairs",
    value: "342",
    trend: "up",
    percentage: "8",
    icon: ShipWheel,
    bgColor: "bg-green-500",
  },
  {
    title: "Active Rentals",
    value: "156",
    trend: "up",
    percentage: "24",
    icon: ActivitySquare,
    bgColor: "bg-purple-500",
  },
  {
    title: "Available Wheelchairs",
    value: "186",
    trend: "down",
    percentage: "5",
    icon: AccessibilityIcon,
    bgColor: "bg-orange-500",
  },
];


const recentActivities: RecentActivity[] = [
  {
    id: "R001",
    user: "Jane Smith",
    wheelchair: "WC002",
    startDate: "2023-04-01",
    endDate: "2023-05-01",
    status: "Active",
  },
  {
    id: "R003",
    user: "Emily Davis",
    wheelchair: "WC003",
    startDate: "2023-04-10",
    endDate: "2023-05-10",
    status: "Active",
  },
  {
    id: "R005",
    user: "John Doe",
    wheelchair: "WC004",
    startDate: "2023-04-05",
    endDate: "2023-05-05",
    status: "Active",
  },
];

// const emit = defineEmits<{
//   (e: "add-rental"): void;
//   (e: "edit-rental", item: RecentActivity): void;
//   (e: "delete-rental", item: RecentActivity): void;
// }>();
</script>
