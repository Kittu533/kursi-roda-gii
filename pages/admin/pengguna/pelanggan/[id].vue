<template>
  <DetailView
    title="Pelanggan - detail"
    card-title="Data Pelanggan"
    :breadcrumbs="breadcrumbs"
    :fields="fields"
    :data="customerData"
    :loading="isLoading"
    :error="error"
    @save="saveCustomer"
  >
    <!-- Custom field rendering if needed -->
    <template v-if="customerData" #field-status="{ data }">
      <span :class="`px-2 py-1 rounded-md text-xs font-medium ${getStatusClass(data.status)}`">
        {{ formatStatus(data.status) }}
      </span>
    </template>
  </DetailView>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCustomerStore } from '~/store/customer'
import { formatGender, formatStatus, getStatusClass } from '~/utils/formatters'

// Define Customer interface
interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  gender: string;
  registerDate: string;
  lastLogin: string;
  status: string;
  [key: string]: string | number | boolean;
}

// Router
const route = useRoute()
const router = useRouter()
const customerId = computed(() => route.params.id as string)

// Store
const customerStore = useCustomerStore()
const customer = computed<Customer | null>(() => customerStore.selectedCustomer)
// Create a non-reactive copy of the customer data to avoid circular references
const customerData = computed(() => customer.value ? {...customer.value} : null)
const isLoading = computed(() => customerStore.isLoading)
const error = computed(() => customerStore.error)

// Breadcrumbs
const breadcrumbs = [
  { text: 'Pengguna', to: '/admin/pengguna' },
  { text: 'Pelanggan', to: '/admin/pengguna/pelanggan' }
]

// Fields configuration
const fields = [
  { key: 'id', label: 'ID Pelanggan' },
  { key: 'name', label: 'Nama Lengkap' },
  { key: 'phone', label: 'Nomor Telepon' },
  { key: 'email', label: 'Email' },
  {
    key: 'gender',
    label: 'Gender',
    formatter: formatGender
  },
  { key: 'registerDate', label: 'Akun dibuat' },
  { key: 'lastLogin', label: 'Akun diperbarui' },
  {
    key: 'status',
    label: 'Status',
    type: 'status' as const,
    formatter: formatStatus,
    getStatusClass: getStatusClass
  }
]

// Methods
const saveCustomer = async () => {
  if (customer.value) {
    try {
      await customerStore.updateCustomer(customer.value.id, customer.value)
      await router.push('/admin/pengguna/pelanggan')
    } catch (error) {
      console.error('Error saving customer:', error)
    }
  }
}

// Lifecycle
const customerDetailsLoaded = ref(false)

const loadCustomer = async () => {
  if (customerId.value) {
    try {
      await customerStore.loadCustomerDetails(customerId.value)
      customerDetailsLoaded.value = true
    } catch (error) {
      console.error('Error loading customer details:', error)
      customerDetailsLoaded.value = true
    }
  }
}

onMounted(async () => {
  await loadCustomer()
})
</script>