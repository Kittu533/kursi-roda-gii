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
        <!-- Home icon omitted for brevity -->
        Home
      </NuxtLink>
      <span>/</span>
      <NuxtLink to="/admin/voucher" class="text-muted-foreground hover:text-foreground">
        Voucher
      </NuxtLink>
      <span>/</span>
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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label for="kodeVoucher" class="text-sm font-medium">Kode Voucher*</label>
            <input id="kodeVoucher" type="text" v-model="formData.kodeVoucher"
              class="w-full px-3 py-2 border rounded-md" required />
          </div>
          <div class="space-y-2">
            <label for="maksVoucher" class="text-sm font-medium">Maks. Penggunaan Voucher*</label>
            <input id="maksVoucher" type="number" v-model="formData.maksVoucher"
              class="w-full px-3 py-2 border rounded-md" min="0" />
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label for="minVoucher" class="text-sm font-medium">Min. Penggunaan Voucher*</label>
            <input id="minVoucher" type="number" v-model="formData.minVoucher"
              class="w-full px-3 py-2 border rounded-md" min="0" />
          </div>
          <div class="space-y-2">
            <label for="persenVoucher" class="text-sm font-medium">Persen Voucher (%)</label>
            <input id="persenVoucher" type="number" v-model="formData.persenVoucher"
              class="w-full px-3 py-2 border rounded-md" min="0" max="100" />
          </div>
        </div>
        <div class="space-y-2">
          <label for="usageLimit" class="text-sm font-medium">Batas Penggunaan Voucher*</label>
          <input id="usageLimit" type="number" v-model="formData.usageLimit" class="w-full px-3 py-2 border rounded-md"
            min="1" required />
        </div>
        <!-- Jika ingin, tampilkan usedCount (biasanya saat edit, user tidak perlu input manual di tambah voucher) -->
        <input type="hidden" v-model="formData.usedCount" />

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
        <div class="space-y-2">
          <label for="status" class="text-sm font-medium">Status*</label>
          <select id="status" v-model="formData.status" class="w-full px-3 py-2 border rounded-md" required>
            <option value="" disabled>Pilih Status</option>
            <option v-for="option in voucherStatusStore.statuses" :key="option.id" :value="option.id">
              {{ option.status }}
            </option>
          </select>
        </div>
      </div>

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
import { useVoucherStatusStore } from '~/store/voucher-status'

const route = useRoute()
const router = useRouter()
const voucherId = computed(() => route.params.id as string)
const isEditing = computed(() => !!voucherId.value)
const voucherStore = useVoucherStore()
const voucherStatusStore = useVoucherStatusStore()
const isLoading = computed(() => voucherStore.isLoading || voucherStatusStore.isLoading)
const error = computed(() => voucherStore.error || voucherStatusStore.error)

const formData = ref({
  kodeVoucher: '',
  maksVoucher: undefined,
  minVoucher: undefined,
  persenVoucher: undefined,
  tanggalBerlaku: '',
  tanggalBerakhir: '',
  usageLimit: undefined,
  usedCount: 0,
  status: ''
})

const saveVoucher = async () => {
  // Validasi field wajib
  if (
    !formData.value.kodeVoucher ||
    !formData.value.tanggalBerlaku ||
    !formData.value.tanggalBerakhir ||
    !formData.value.status ||
    !formData.value.usageLimit
  ) {
    alert('Harap isi semua field yang wajib diisi!')
    return
  }
  try {
    // Payload sesuai body POST kamu
    const payload = {
      voucher_code: formData.value.kodeVoucher,
      discount_percentage: Number(formData.value.persenVoucher) / 100, // float, misal 0.1
      max_discount: Number(formData.value.maksVoucher),
      min_order_amount: Number(formData.value.minVoucher),
      start_date: formData.value.tanggalBerlaku,
      end_date: formData.value.tanggalBerakhir,
      usage_limit: Number(formData.value.usageLimit),
      used_count: Number(formData.value.usedCount),
      vouchers_status_id: formData.value.status
    }

    if (isEditing.value) {
      await voucherStore.updateVoucher(voucherId.value, payload)
    } else {
      await voucherStore.createNewVoucher(payload)

    }

    router.push('/admin/voucher')
  } catch (err) {
    console.error('Error saving voucher:', err)
    alert('Terjadi kesalahan saat menyimpan voucher.')
  }
}

// Saat komponen mount, ambil list status voucher dan data voucher (jika edit)
onMounted(async () => {
  await voucherStatusStore.loadVoucherStatuses()
  if (isEditing.value) {
    try {
      const voucher = await voucherStore.getVoucherDetail(voucherId.value)
      if (voucher) {
        formData.value = {
          kodeVoucher: voucher.voucher_code ?? '',
          maksVoucher: voucher.max_discount,
          minVoucher: voucher.min_order_amount,
          persenVoucher: voucher.discount_percentage ? Number(voucher.discount_percentage) * 100 : undefined,
          tanggalBerlaku: voucher.start_date ?? '',
          tanggalBerakhir: voucher.end_date ?? '',
          usageLimit: voucher.usage_limit,
          usedCount: voucher.used_count ?? 0,
          status: voucher.vouchers_status_id || ''
        }
      }
    } catch (err) {
      console.error('Error loading voucher:', err)
    }
  }
})
</script>
