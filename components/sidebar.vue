<template>
  <!-- Overlay untuk mobile -->
  <div
    v-if="isMounted && isMobileView && isOpen"
    class="fixed inset-0 z-30 bg-black/50 md:hidden"
    @click="$emit('toggle')"
  ></div>

  <div
    class="sidebar bg-white border-r text-card-foreground transition-all duration-300 h-screen z-40 flex flex-col"
    :class="[
      isTabletOrLarger ? (isOpen ? 'w-64' : 'w-16') : 'w-64',
      isTabletOrLarger ? 'relative' : 'fixed',
      !isTabletOrLarger && !isOpen ? '-translate-x-full' : 'translate-x-0',
    ]"
  >
    <!-- Logo -->
    <div class="flex h-16 items-center border-b px-4 shrink-0">
      <div class="flex items-center gap-2">
        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white shrink-0">
          <NuxtImg src="/logo-monitoring.webp" class="w-8 h-8" alt="Logo" />
        </div>
        <span
          class="font-semibold transition-opacity duration-200 whitespace-nowrap"
          :class="{
            'opacity-0 w-0 overflow-hidden': !isOpen,
            'opacity-100': isOpen,
          }"
        >
          Wheel Care
        </span>
      </div>
    </div>

    <!-- Navigation -->
    <div class="flex-1 overflow-y-auto overflow-x-hidden py-4">
      <nav class="px-2 flex flex-col gap-4">
        <div v-for="(group, idx) in navigation" :key="idx" class="space-y-1">
          <!-- Beranda tanpa dropdown -->
          <template v-if="group.title === 'Beranda'">
            <h2 v-if="isOpen" class="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              {{ group.title }}
            </h2>
            <div>
              <router-link
                v-for="item in group.items"
                :key="item.name"
                :to="item.href"
                class="group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors"
                :class="[
                  isRouteActive(item.href)
                    ? 'bg-accent text-accent-foreground font-semibold'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  !isOpen ? 'justify-center' : '',
                ]"
                @click="isMobileView && $emit('toggle')"
              >
                <NuxtIcon
                  :name="item.NuxtIcon"
                  :class="{ 'mr-3': isOpen }"
                  v-if="item.NuxtIcon"
                  class="h-5 w-5 flex-shrink-0"
                />
                <span v-if="isOpen" class="truncate transition-opacity whitespace-nowrap">
                  {{ item.name }}
                </span>
                <span v-else class="sr-only">{{ item.name }}</span>
              </router-link>
            </div>
          </template>
          <!-- Kategori lain dengan dropdown -->
          <template v-else>
            <button
              @click="toggleDropdown(idx)"
              class="flex items-center w-full px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 hover:bg-gray-100 rounded transition"
              :class="isOpenDropdown[idx] ? 'bg-gray-100' : ''"
              v-if="isOpen"
            >
              <span>{{ group.title }}</span>
              <Icon :name="isOpenDropdown[idx] ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" class="ml-auto h-4 w-4" />
            </button>
            <div v-show="isOpenDropdown[idx] || !isOpen" class="space-y-1">
              <router-link
                v-for="item in group.items"
                :key="item.name"
                :to="item.href"
                class="group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors"
                :class="[
                  isRouteActive(item.href)
                    ? 'bg-accent text-accent-foreground font-semibold'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  !isOpen ? 'justify-center' : '',
                ]"
                @click="isMobileView && $emit('toggle')"
              >
                <NuxtIcon
                  :name="item.NuxtIcon"
                  :class="{ 'mr-3': isOpen }"
                  v-if="item.NuxtIcon"
                  class="h-5 w-5 flex-shrink-0"
                />
                <span v-if="isOpen" class="truncate transition-opacity whitespace-nowrap">
                  {{ item.name }}
                </span>
                <span v-else class="sr-only">{{ item.name }}</span>
              </router-link>
            </div>
          </template>
        </div>
      </nav>
    </div>

    <!-- Collapse button -->
    <div v-if="showToggle && isTabletOrLarger" class="border-t py-3 px-4 w-full bg-white shrink-0">
      <button
        @click="$emit('toggle')"
        class="flex items-center justify-center w-full rounded-md py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        :class="{ 'justify-center': !isOpen }"
      >
        <Icon :name="isOpen ? 'heroicons:chevron-left' : 'heroicons:chevron-right'" class="h-5 w-5" />
        <span v-if="isOpen" class="ml-2 transition-opacity">Collapse</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";

// Tipe data
interface NavigationItem {
  name: string;
  href: string;
  NuxtIcon?: string;
}
interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}

// PROPS
defineProps<{
  isOpen: boolean;
  showToggle?: boolean;
}>();

const route = useRoute();
const currentPath = computed(() => route.path);

// SSR fix
const isMobileView = ref(false);
const isTabletOrLarger = ref(true);
const isMounted = ref(false);

const handleResize = () => {
  if (typeof window !== "undefined") {
    isMobileView.value = window.innerWidth < 768;
    isTabletOrLarger.value = window.innerWidth >= 768;
  }
};
onMounted(() => {
  isMounted.value = true;
  handleResize();
  window.addEventListener("resize", handleResize);
});
onUnmounted(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("resize", handleResize);
  }
});

// Aktif route helper
const isRouteActive = (path: string): boolean => {
  return currentPath.value === path || currentPath.value.startsWith(`${path}/`);
};

// === STRUKTUR NAVIGATION ===
const navigation: NavigationGroup[] = [
  {
    title: "Beranda",
    items: [
      { name: "Beranda", href: "/admin", NuxtIcon: "ic:baseline-home" },
    ],
  },
  {
    title: "Pengguna",
    items: [
      { name: "Pelanggan", href: "/admin/pengguna/pelanggan", NuxtIcon: "ic:baseline-person" },
      { name: "Guide", href: "/admin/pengguna/guide", NuxtIcon: "mdi:account-group-outline" },
      { name: "Agen", href: "/admin/pengguna/agent", NuxtIcon: "ic:baseline-store" },
    ],
  },
  {
    title: "Produk",
    items: [
      { name: "Model", href: "/admin/model-wheelchair", NuxtIcon: "ic:baseline-wheelchair-pickup" },
      { name: "Voucher", href: "/admin/voucher", NuxtIcon: "mdi:ticket-percent-outline" },
      { name: "Paket", href: "/admin/packages", NuxtIcon: "ic:baseline-medical-services" },
    ],
  },
  {
    title: "Komplain",
    items: [
      { name: "Komplain", href: "/admin/komplain", NuxtIcon: "ic:baseline-error-outline" },
    ],
  },
  {
    title: "Pemeliharaan",
    items: [
      { name: "Pemeliharaan", href: "/admin/maintenance", NuxtIcon: "ic:baseline-build" },
    ],
  },
  {
    title: "Keuangan",
    items: [
      { name: "Transaksi", href: "/admin/transaksi", NuxtIcon: "ic:baseline-shopping-cart" },
      { name: "Insentif Guide", href: "/admin/insentif-guide", NuxtIcon: "mdi:cash-multiple" },
      { name: "Tarif Guide", href: "/admin/tarif-guide", NuxtIcon: "mdi:account-cash" },
      { name: "Tarif Ongkir", href: "/admin/tarif-ongkir", NuxtIcon: "mdi:currency-usd" },
      { name: "Pengembalian", href: "/admin/pengembalian", NuxtIcon: "mdi:cash-refund" },
    ],
  },
  {
    title: "Laporan",
    items: [
      { name: "Laporan", href: "/admin/report", NuxtIcon: "ic:baseline-description" },
    ],
  },
];

// STATE untuk dropdown kategori
const isOpenDropdown = ref(navigation.map((_, i) => i === 0)); // Beranda open, lainnya tutup

function toggleDropdown(idx: number) {
  // Hanya Beranda yang tidak bisa di-expand
  if (navigation[idx].title === "Beranda") return;
  isOpenDropdown.value[idx] = !isOpenDropdown.value[idx];
}
</script>

<style scoped>
.sidebar {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}
.sidebar * {
  transition-property: width, opacity, margin, padding, transform;
  transition-duration: 300ms;
  transition-timing-function: ease-in-out;
}
@supports (-webkit-touch-callout: none) {
  .h-screen {
    height: -webkit-fill-available;
  }
}
</style>
