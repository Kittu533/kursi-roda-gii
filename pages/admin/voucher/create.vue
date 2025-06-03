<template>
  <div class="p-4">
    <!-- Breadcrumb -->
    <div class="flex items-center space-x-2 text-sm mb-4">
      <NuxtLink to="/admin/voucher" class="text-muted-foreground hover:text-foreground">Voucher</NuxtLink>
      <span class="text-muted-foreground">›</span>
      <span>Buat Baru</span>
    </div>

    <h1 class="text-xl font-bold mb-4">Voucher Baru</h1>

    <!-- Form -->
    <div class="bg-white rounded-md p-4 space-y-4">
      <!-- Kode Voucher -->
      <div>
        <label class="block text-sm">Kode Voucher*</label>
        <input type="text" v-model="formData.kodeVoucher" class="w-full border rounded-md px-3 py-2" required />
      </div>

      <!-- Nilai Voucher -->
      <div>
        <label class="block text-sm">Nilai Voucher (Rp)</label>
        <input type="number" min="0" v-model="formData.nilaiVoucher" class="w-full border rounded-md px-3 py-2"
          placeholder="Contoh: 50000" />
      </div>

      <!-- Persen Voucher -->
      <div>
        <label class="block text-sm">Persen Voucher (%)</label>
        <input type="number" min="0" max="100" v-model="formData.persenVoucher"
          class="w-full border rounded-md px-3 py-2" placeholder="Contoh: 20" />
      </div>

      <!-- Tanggal Berlaku -->
      <div>
        <label class="block text-sm">Tanggal Berlaku*</label>
        <input type="date" v-model="formData.tanggalBerlaku" class="w-full border rounded-md px-3 py-2" required />
      </div>

      <!-- Tanggal Berakhir -->
      <div>
        <label class="block text-sm">Tanggal Berakhir*</label>
        <input type="date" v-model="formData.tanggalBerakhir" class="w-full border rounded-md px-3 py-2" required />
      </div>

      <!-- Usage Limit -->
      <div>
        <label class="block text-sm">Batas Penggunaan</label>
        <input type="number" min="1" v-model="formData.usageLimit" class="w-full border rounded-md px-3 py-2"
          required />
      </div>

      <!-- Used Count (readonly = 0) -->
      <div>
        <label class="block text-sm">Jumlah Telah Digunakan</label>
        <input type="number" min="0" :value="formData.used_count"
          @input="formData.used_count = Number($event.target.value)" class="w-full border rounded-md px-3 py-2" />

      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-end mt-4 space-x-2">
      <button @click="cancelForm"
        class="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50">Batal</button>
      <button @click="saveVoucher" class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">Simpan
        Voucher</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useVoucherStore } from '~/store/voucher'
import type { CreateVoucherPayload } from '~/types/voucher'
import { useVoucherStatusStore } from '~/store/voucher-status'


const router = useRouter()
const voucherStore = useVoucherStore()

const voucherStatusStore = useVoucherStatusStore()
const activeStatusId = ref<string | null>(null)

onMounted(async () => {
  await voucherStatusStore.fetchStatuses()
  activeStatusId.value = voucherStatusStore.getStatusIdByName('active')
})

const formData = ref({
  kodeVoucher: '',
  nilaiVoucher: '',        // Optional, bisa dihitung ke persen
  persenVoucher: '',       // Optional
  tanggalBerlaku: '',
  tanggalBerakhir: '',
  usageLimit: 1,
  used_count: 0
})

const saveVoucher = async () => {
  if (!formData.value.kodeVoucher || !formData.value.tanggalBerlaku || !formData.value.tanggalBerakhir) {
    alert('Harap isi semua field yang wajib diisi!')
    return
  }

  if (!activeStatusId.value) {
    alert('Gagal mendapatkan ID status voucher active')
    return
  }

  try {
    const discount = formData.value.persenVoucher
      ? parseFloat(formData.value.persenVoucher) / 100
      : parseFloat(formData.value.nilaiVoucher) / 100000

    const payload: CreateVoucherPayload = {
      voucher_code: formData.value.kodeVoucher,
      discount_percentage: String(discount),
      start_date: formData.value.tanggalBerlaku,
      end_date: formData.value.tanggalBerakhir,
      usage_limit: Number(formData.value.usageLimit),
      used_count: Number(formData.value.used_count) || 0,
      vouchers_status_id: activeStatusId.value
    }

    await voucherStore.createNewVoucher(payload)
    alert('Voucher berhasil disimpan!')
    router.push('/admin/voucher')
  } catch (error) {
    console.error('Gagal menyimpan voucher:', error)
    alert('Terjadi kesalahan saat menyimpan voucher')
  }
}


const cancelForm = () => {
  if (confirm('Yakin membatalkan pembuatan voucher?')) {
    router.push('/admin/voucher')
  }
}
</script>
