<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">{{ isEditing ? 'Edit Voucher' : 'Tambah Voucher Baru' }}</h2>
      </div>
    </div>

    <!-- Breadcrumb Navigation -->
    <div class="flex items-center space-x-2 text-sm">
      <NuxtLink to="/" class="text-muted-foreground hover:text-foreground">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-home">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </NuxtLink>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        class="lucide lucide-chevron-right text-muted-foreground">
        <path d="m9 18 6-6-6-6" />
      </svg>
      <NuxtLink to="/admin/voucher" class="text-muted-foreground hover:text-foreground">
        Voucher
      </NuxtLink>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        class="lucide lucide-chevron-right text-muted-foreground">
        <path d="m9 18 6-6-6-6" />
      </svg>
      <span>{{ isEditing ? 'Edit' : 'Tambah' }}</span>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-red-100 p-4 rounded-md text-red-800">
      {{ error }}
    </div>

    <!-- Form -->
    <form @submit.prevent="saveVoucher" class="bg-white border rounded-md overflow-hidden">
      <div class="p-4 border-b">
        <h3 class="text-lg font-medium">{{ isEditing ? 'Data Voucher' : 'Data Voucher Baru' }}</h3>
      </div>
      <div class="p-4 space-y-4">
        <!-- ID Voucher -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label for="idVoucher" class="text-sm font-medium">ID Voucher</label>
            <input id="idVoucher" type="text" v-model="formData.idVoucher" class="w-full px-3 py-2 border rounded-md"
              :disabled="isEditing" readonly />
          </div>

          <div class="space-y-2">
            <label for="kodeVoucher" class="text-sm font-medium">Kode Voucher*</label>
            <input id="kodeVoucher" type="text" v-model="formData.kodeVoucher"
              class="w-full px-3 py-2 border rounded-md" required />
          </div>
        </div>

        <!-- Nilai dan Persen Voucher -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label for="nilaiVoucher" class="text-sm font-medium">Nilai Voucher (Rp)</label>
            <input id="nilaiVoucher" type="text" v-model="formData.nilaiVoucher"
              class="w-full px-3 py-2 border rounded-md" placeholder="Contoh: 50000" />
          </div>

          <div class="space-y-2">
            <label for="persenVoucher" class="text-sm font-medium">Persen Voucher (%)</label>
            <input id="persenVoucher" type="text" v-model="formData.persenVoucher"
              class="w-full px-3 py-2 border rounded-md" placeholder="Contoh: 10" />
          </div>
        </div>

        <!-- Tanggal Berlaku dan Berakhir -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label for="tanggalBerlaku" class="text-sm font-medium">Tanggal Berlaku*</label>
            <input id="tanggalBerlaku" type="date" v-model="formData.tanggalBerlaku"
              class="w-full px-3 py-2 border rounded-md" required />
          </div>

          <div class="space-y-2">
            <label for="tanggalBerakhir" class="text-sm font-medium">Tanggal Berakhir*</label>
            <input id="tanggalBerakhir" type="date" v-model="formData.tanggalBerakhir"
              class="w-full px-3 py-2 border rounded-md" required />
          </div>
        </div>

        <!-- Jumlah dan Terpakai -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label for="jumlahVoucher" class="text-sm font-medium">Jumlah Voucher*</label>
            <input id="jumlahVoucher" type="number" v-model="formData.jumlahVoucher"
              class="w-full px-3 py-2 border rounded-md" min="1" required />
          </div>

          <div class="space-y-2">
            <label for="voucherTerpakai" class="text-sm font-medium">Voucher Terpakai</label>
            <input id="voucherTerpakai" type="number" v-model="formData.voucherTerpakai"
              class="w-full px-3 py-2 border rounded-md" min="0" :readonly="isEditing" />
          </div>
        </div>

      </div>

      <!-- Action Buttons -->
      <div class="p-4 border-t flex justify-end gap-2">
        <button type="button" class="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
          @click="router.push('/admin/voucher')">
          Batal
        </button>
        <button type="submit" class="bg-[#4072EE] text-white px-4 py-2 rounded-md hover:bg-[#3060DD]">
          Simpan Perubahan
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVoucherStore } from '~/store/voucher'
import type { Voucher, UpdateVoucherPayload } from '~/types/voucher'

// Router & Store
const route = useRoute()
const router = useRouter()
const voucherId = computed(() => route.params.id as string)
const isEditing = computed(() => !!voucherId.value)

const voucherStore = useVoucherStore()
const isLoading = computed(() => voucherStore.isLoading)
const error = computed(() => voucherStore.error)

// Form data
const formData = ref({
  kodeVoucher: '',
  nilaiVoucher: '',       // akan dikonversi ke persen
  persenVoucher: '',      // ditampilkan dalam %
  tanggalBerlaku: '',
  tanggalBerakhir: '',
  usageLimit: 1,
  voucherTerpakai: 0
})

// Save Logic
const saveVoucher = async () => {
  if (!formData.value.kodeVoucher || !formData.value.tanggalBerlaku || !formData.value.tanggalBerakhir) {
    alert('Harap isi semua field yang wajib diisi!')
    return
  }

  try {
    const discount =
      formData.value.persenVoucher
        ? parseFloat(formData.value.persenVoucher) / 100
        : parseFloat(formData.value.nilaiVoucher) / 100000

    const payload: UpdateVoucherPayload = {
      voucher_code: formData.value.kodeVoucher,
      discount_percentage: String(discount),
      start_date: formData.value.tanggalBerlaku,
      end_date: formData.value.tanggalBerakhir,
      usage_limit: Number(formData.value.usageLimit),
      used_count: Number(formData.value.voucherTerpakai),
      // voucher_status_id: '...' // jika diperlukan, pastikan bukan undefined
    }


    if (isEditing.value) {
      await voucherStore.updateVoucher(voucherId.value, payload)
    }

    router.push('/admin/voucher')
  } catch (err) {
    console.error('Error saving voucher:', err)
    alert('Terjadi kesalahan saat menyimpan voucher.')
  }
}

// Load existing data
onMounted(async () => {
  if (isEditing.value) {
    try {
      const voucher = await voucherStore.getVoucherDetail(voucherId.value)
      if (voucher) {
        formData.value = {
          kodeVoucher: voucher.voucher_code,
          nilaiVoucher: String(parseFloat(voucher.discount_percentage) * 100000), // perkiraan nilai uang
          persenVoucher: String(parseFloat(voucher.discount_percentage) * 100),
          tanggalBerlaku: voucher.start_date,
          tanggalBerakhir: voucher.end_date,
          usageLimit: voucher.usage_limit,
          voucherTerpakai: voucher.used_count
        }
      }
    } catch (err) {
      console.error('Error loading voucher:', err)
    }
  }
})
</script>
