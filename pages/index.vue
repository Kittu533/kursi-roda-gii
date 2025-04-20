<template>
  <div class="min-h-screen bg-gray-100 p-4 md:p-6">
    <h1 class="text-2xl font-bold mb-6">Dashboard</h1>
    
    <!-- Date Filter -->
    <div class="mb-6">
      <h2 class="text-lg font-medium mb-3">Periode</h2>
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div class="relative flex items-center border rounded-lg p-2 bg-white w-full sm:w-64">
          <CalendarIcon class="h-5 w-5 text-gray-500 mr-2" />
          <input 
            type="text" 
            v-model="dateRangeText" 
            class="bg-transparent outline-none flex-1"
            readonly
            @click="showDatePicker = !showDatePicker"
          />
          <div v-if="showDatePicker" class="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-lg p-4 z-10">
            <div class="flex flex-col sm:flex-row gap-4">
              <div>
                <div class="mb-2 font-medium">Dari:</div>
                <select v-model="startMonth" class="border p-1 rounded">
                  <option v-for="(month, index) in months" :key="`start-${index}`" :value="index">{{ month }}</option>
                </select>
                <select v-model="startYear" class="border p-1 rounded ml-2">
                  <option v-for="year in years" :key="`start-${year}`" :value="year">{{ year }}</option>
                </select>
              </div>
              <div>
                <div class="mb-2 font-medium">Sampai:</div>
                <select v-model="endMonth" class="border p-1 rounded">
                  <option v-for="(month, index) in months" :key="`end-${index}`" :value="index">{{ month }}</option>
                </select>
                <select v-model="endYear" class="border p-1 rounded ml-2">
                  <option v-for="year in years" :key="`end-${year}`" :value="year">{{ year }}</option>
                </select>
              </div>
            </div>
            <div class="mt-3 flex justify-end">
              <button 
                @click="applyDateRange" 
                class="bg-blue-500 text-white px-3 py-1 rounded text-sm"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
        <button 
          @click="fetchData" 
          class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition w-full sm:w-auto"
        >
          Lihat
        </button>
      </div>
    </div>
    
    <!-- Charts Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <!-- Wheelchair Status Distribution -->
      <div class="bg-white p-4 md:p-6 rounded-lg shadow-sm">
        <h3 class="text-base font-medium mb-4">Distribusi Status Kursi Roda</h3>
        <div class="flex flex-col md:flex-row items-center justify-center">
          <div class="relative h-48 w-48">
            <canvas ref="wheelchairStatusChart"></canvas>
          </div>
          <div class="mt-4 md:mt-0 md:ml-6 space-y-3">
            <div class="flex items-center">
              <div class="h-5 w-5 rounded mr-3" style="background-color: #4f7df9;"></div>
              <span>Tersedia</span>
            </div>
            <div class="flex items-center">
              <div class="h-5 w-5 rounded mr-3" style="background-color: #d9b38c;"></div>
              <span>Disewakan</span>
            </div>
            <div class="flex items-center">
              <div class="h-5 w-5 rounded mr-3" style="background-color: #a5e9b7;"></div>
              <span>Dalam perbaikan</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Agent Performance -->
      <div class="bg-white p-4 md:p-6 rounded-lg shadow-sm">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-base font-medium">Performa Agen</h3>
          <div class="flex items-center">
            <span class="text-sm text-gray-500 mr-2">Bulan</span>
            <ChevronDownIcon class="h-4 w-4 text-gray-500" />
          </div>
        </div>
        <div class="h-48 md:h-64 flex items-center justify-center">
          <canvas ref="agentPerformanceChart"></canvas>
        </div>
      </div>
      
      <!-- Wheelchair Usage Trend -->
      <div class="bg-white p-4 md:p-6 rounded-lg shadow-sm">
        <h3 class="text-base font-medium mb-4">Tren Penggunaan Kursi Roda</h3>
        <div class="h-48 md:h-64 relative">
          <div class="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
            Tipe A-48
          </div>
          <canvas ref="usageTrendChart"></canvas>
        </div>
      </div>
      
      <!-- Total Transactions -->
      <div class="bg-white p-4 md:p-6 rounded-lg shadow-sm">
        <h3 class="text-base font-medium mb-4">Total Transaksi</h3>
        <div class="h-48 md:h-64 relative">
          <div class="absolute top-0 left-0 w-full text-center">
            <div class="text-sm text-gray-500">November 2024</div>
            <div class="font-medium">107</div>
          </div>
          <canvas ref="transactionsChart" class="mt-8"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { 
  CalendarIcon,
  ChevronDownIcon
} from 'lucide-vue-next'
import Chart from 'chart.js/auto'

// Chart references
const wheelchairStatusChart = ref(null)
const agentPerformanceChart = ref(null)
const usageTrendChart = ref(null)
const transactionsChart = ref(null)

// Chart instances
let wheelchairStatusChartInstance = ref(null) // Changed from const to let
const agentPerformanceChartInstance = ref(null)
const usageTrendChartInstance = ref(null)
const transactionsChartInstance = ref(null)

// Date picker state
const showDatePicker = ref(false)
const months = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]
const currentYear = new Date().getFullYear()
const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2]
const startMonth = ref(2) // Maret
const startYear = ref(2025)
const endMonth = ref(2) // Maret
const endYear = ref(2025)

// Computed date range text
const dateRangeText = computed(() => {
  return `1 ${months[startMonth.value]} ${startYear.value} - 31 ${months[endMonth.value]} ${endYear.value}`
})

// Apply date range and close picker
const applyDateRange = () => {
  showDatePicker.value = false
}

// Dashboard data
const dashboardData = reactive({
  wheelchairStatus: {
    tersedia: 50,
    disewakan: 25,
    dalamPerbaikan: 25
  },
  agentPerformance: {
    'Agen A': 34,
    'Agen B': 30,
    'Agen C': 36
  },
  usageTrend: {
    'Senin': 30,
    'Selasa': 35,
    'Rabu': 48,
    'Kamis': 40,
    'Jumat': 35,
    'Sabtu': 45,
    'Minggu': 50
  },
  totalTransactions: {
    data: [80, 105, 90, 80, 70, 90],
    labels: ['Oktober', 'November', 'Desember', 'Januari', 'Februari', 'Maret'],
    highlight: {
      month: 'November',
      year: 2024,
      value: 107
    }
  }
})

// Fetch data based on filters
const fetchData = () => {
  // For demo purposes, we'll just use the static data that matches the screenshot
  updateAgentPerformanceChart()
  updateUsageTrendChart()
  updateTransactionsChart()
  
  // Close date picker if open
  showDatePicker.value = false
}

// Create percentage labels plugin
const createPercentageLabelsPlugin = () => {
  return {
    id: 'percentageLabels',
    afterDraw: (chart) => {
      const ctx = chart.ctx
      chart.data.datasets[0].data.forEach((value, index) => {
        const meta = chart.getDatasetMeta(0)
        const arc = meta.data[index]
        const centerX = arc.x
        const centerY = arc.y
        const angle = arc.startAngle + (arc.endAngle - arc.startAngle) / 2
        
        // Calculate position - adjust radius based on segment for better positioning
        let radius = arc.outerRadius * 0.7
        
        // Adjust position for each segment to match the image
        if (index === 0) { // Tersedia (50%)
          radius = arc.outerRadius * 0.75
        } else if (index === 1) { // Disewakan (25%)
          radius = arc.outerRadius * 0.65
        } else if (index === 2) { // Dalam perbaikan (25%)
          radius = arc.outerRadius * 0.65
        }
        
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius
        
        // Draw text
        ctx.save()
        ctx.fillStyle = 'white'
        ctx.font = 'bold 16px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(value + '%', x, y)
        ctx.restore()
      })
    }
  }
}

// Initialize wheelchair status chart
const initChart = () => {
  if (wheelchairStatusChartInstance.value) {
    wheelchairStatusChartInstance.value.destroy()
  }
  
  if (wheelchairStatusChart.value) {
    wheelchairStatusChartInstance.value = new Chart(wheelchairStatusChart.value, {
      type: 'doughnut',
      data: {
        labels: ['Tersedia', 'Disewakan', 'Dalam perbaikan'],
        datasets: [{
          data: [50, 25, 25],
          backgroundColor: [
            '#4072EE', // Blue for Tersedia
            '#E5A95E', // Tan/light brown for Disewakan
            '#5BEA74'  // Light green for Dalam perbaikan
          ],
          borderWidth: 0,
          cutout: '50%'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true
          }
        },
        layout: {
          padding: 8
        }
      },
      plugins: [createPercentageLabelsPlugin()]
    })
  }
}

// Update agent performance chart
const updateAgentPerformanceChart = () => {
  if (agentPerformanceChartInstance.value) {
    agentPerformanceChartInstance.value.destroy()
  }
  
  if (agentPerformanceChart.value) {
    agentPerformanceChartInstance.value = new Chart(agentPerformanceChart.value, {
      type: 'pie',
      data: {
        labels: ['Agen A', 'Agen B', 'Agen C'],
        datasets: [{
          data: [
            dashboardData.agentPerformance['Agen A'],
            dashboardData.agentPerformance['Agen B'],
            dashboardData.agentPerformance['Agen C']
          ],
          backgroundColor: ['#86efac', '#fb923c', '#9ca3af'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                size: 12
              }
            }
          }
        }
      },
      plugins: [createPercentageLabelsPlugin()]
    })
  }
}

// Update usage trend chart
const updateUsageTrendChart = () => {
  if (usageTrendChartInstance.value) {
    usageTrendChartInstance.value.destroy()
  }
  
  if (usageTrendChart.value) {
    usageTrendChartInstance.value = new Chart(usageTrendChart.value, {
      type: 'line',
      data: {
        labels: Object.keys(dashboardData.usageTrend),
        datasets: [{
          label: 'Penggunaan',
          data: Object.values(dashboardData.usageTrend),
          borderColor: '#3b82f6',
          tension: 0.3,
          fill: false,
          pointRadius: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 60,
            ticks: {
              stepSize: 10,
              font: {
                size: 10
              }
            },
            grid: {
              color: '#f3f4f6'
            }
          },
          x: {
            ticks: {
              font: {
                size: 10
              }
            },
            grid: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    })
  }
}

// Update transactions chart
const updateTransactionsChart = () => {
  if (transactionsChartInstance.value) {
    transactionsChartInstance.value.destroy()
  }
  
  if (transactionsChart.value) {
    transactionsChartInstance.value = new Chart(transactionsChart.value, {
      type: 'bar',
      data: {
        labels: dashboardData.totalTransactions.labels,
        datasets: [{
          label: 'Transaksi',
          data: dashboardData.totalTransactions.data,
          backgroundColor: '#3b82f6',
          borderRadius: 4,
          barThickness: 20,
          maxBarThickness: 30
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 120,
            ticks: {
              stepSize: 20,
              font: {
                size: 10
              }
            },
            grid: {
              color: '#f3f4f6'
            }
          },
          x: {
            ticks: {
              font: {
                size: 10
              }
            },
            grid: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    })
  }
}

// Initialize charts on mount
onMounted(() => {
  initChart() // Initialize the wheelchair status chart
  // Comment out this line since we're using initChart instead
  // updateWheelchairStatusChart()
  updateAgentPerformanceChart()
  updateUsageTrendChart()
  updateTransactionsChart()
})
</script>