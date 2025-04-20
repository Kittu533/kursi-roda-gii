<template>
  <!-- Mobile overlay - only for small screens -->
  <div
    v-if="isMounted && isMobileView && isOpen"
    class="fixed inset-0 z-30 bg-black/50 md:hidden"
    @click="$emit('toggle')"
  ></div>
  <div
    class="sidebar bg-white border-r text-card-foreground transition-all duration-300 h-screen z-40 flex flex-col"
    :class="[
      // Different width based on screen size and open state
      isTabletOrLarger ? (isOpen ? 'w-64' : 'w-16') : 'w-64',
      // Position differently based on screen size
      isTabletOrLarger ? 'relative' : 'fixed',
      // Only translate off-screen on mobile when closed
      !isTabletOrLarger && !isOpen ? '-translate-x-full' : 'translate-x-0',
    ]"
  >
    <!-- Logo -->
    <div class="flex h-16 items-center border-b px-4 shrink-0">
      <div class="flex items-center gap-2">
        <div
          class="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white shrink-0"
        >
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
    
    <!-- Navigation - with proper overflow handling -->
    <div class="flex-1 overflow-y-auto overflow-x-hidden py-4">
      <nav class="px-2 flex flex-col gap-4">
        <div class="space-y-1" v-for="(group, index) in navigation" :key="index">
          <h2
            v-if="isOpen"
            class="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1"
          >
            {{ group.title }}
          </h2>
          <div class="space-y-1">
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
                class="h-5 w-5 flex-shrink-0"
                :class="{ 'mr-3': isOpen }"
                v-if="item.NuxtIcon"
              />
              <span 
                v-if="isOpen" 
                class="truncate transition-opacity whitespace-nowrap"
              >
                {{ item.name }}
              </span>
              <span v-else class="sr-only">{{ item.name }}</span>
            </router-link>
          </div>
        </div>
      </nav>
    </div>
    
    <!-- Toggle button - only show on tablet and larger -->
    <div
      v-if="showToggle && isTabletOrLarger"
      class="border-t py-3 px-4 w-full bg-white shrink-0"
    >
      <button
        @click="$emit('toggle')"
        class="flex items-center justify-center w-full rounded-md py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        :class="{ 'justify-center': !isOpen }"
      >
        <Icon
          :name="isOpen ? 'heroicons:chevron-left' : 'heroicons:chevron-right'"
          class="h-5 w-5"
        />
        <span v-if="isOpen" class="ml-2 transition-opacity"> Collapse </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";

interface NavigationItem {
  name: string;
  href: string;
  NuxtIcon?: string;
}

interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}

const props = defineProps<{
  isOpen: boolean;
  showToggle?: boolean;
}>();

const route = useRoute();
const currentPath = computed(() => route.path);

// Fix for SSR - initialize without window
const isMobileView = ref(false);
const isTabletOrLarger = ref(true);
const isMounted = ref(false);

// Initialize screen size variables outside onMounted to avoid hook call issues
isMobileView.value = false;
isTabletOrLarger.value = true;

// Check screen size on resize
const handleResize = () => {
  if (typeof window !== "undefined") {
    isMobileView.value = window.innerWidth < 768;
    isTabletOrLarger.value = window.innerWidth >= 768;
  }
};

// Add and remove event listener only on client-side
onMounted(() => {
  // Set initial value after component is mounted (client-side only)
  isMounted.value = true;
  handleResize();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("resize", handleResize);
  }
});

// Helper function to check if a route is active (including child routes)
const isRouteActive = (path: string): boolean => {
  return currentPath.value === path || currentPath.value.startsWith(`${path}/`);
};

// Updated navigation with Nuxt icon names
const navigation: NavigationGroup[] = [
  {
    title: "Beranda",
    items: [{ name: "Beranda", href: "/admin", NuxtIcon: "ic:baseline-home" }],
  },
  {
    title: "Pengguna",
    items: [
      {
        name: "Pelanggan",
        href: "/admin/pengguna/pelanggan",
        NuxtIcon: "ic:baseline-person",
      },
      {
        name: "Guide",
        href: "/admin/pengguna/guide",
        NuxtIcon: "ic:baseline-person",
      },
      {
        name: "Agen",
        href: "/admin/pengguna/agent",
        NuxtIcon: "heroicons:users",
      },
    ],
  },
  {
    title: "Produk",
    items: [
      {
        name: "Kursi Roda",
        href: "/admin/product",
        NuxtIcon: "ic:baseline-wheelchair-pickup",
      },
      { name: "Voucher", href: "/admin/voucher", NuxtIcon: "heroicons:cube" },
      {
        name: "Paket",
        href: "/admin/packages",
        NuxtIcon: "material-symbols:package-2",
      },{
        name: "Maintenance",
        href: "/admin/maintenance",
        NuxtIcon: "material-symbols:package-2",
      },
    ],
  },
  {
    title: "Transaksi",
    items: [
      {
        name: "Pemesanan",
        href: "/admin/transaction/booking",
        NuxtIcon: "heroicons:shopping-cart",
      },
      {
        name: "Penarikan",
        href: "/admin/transaction/withdraw",
        NuxtIcon: "heroicons:arrows-right-left",
      },
    ],
  },
  {
    title: "Pengembalian",
    items: [
      {
        name: "Pengembalian",
        href: "/admin/return",
        NuxtIcon: "heroicons:arrows-right-left",
      },
      {
        name: "Pengembalian-Agen",
        href: "/admin/return-agent",
        NuxtIcon: "heroicons:arrows-right-left",
      },
    ],
  },
  {
    title: "Komplain",
    items: [
      {
        name: "Komplain",
        href: "/admin/complaint",
        NuxtIcon: "material-symbols:chat-outline",
      },
    ],
  },
  {
    title: "Laporan",
    items: [
      {
        name: "Laporan",
        href: "/admin/report",
        NuxtIcon: "heroicons:document-text",
      },
    ],
  },
];

// Initialize screen size variables outside onMounted to avoid hook call issues
</script>

<style scoped>
.sidebar {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

/* Smooth transitions for all elements */
.sidebar * {
  transition-property: width, opacity, margin, padding, transform;
  transition-duration: 300ms;
  transition-timing-function: ease-in-out;
}

/* Fix for mobile Safari height issues */
@supports (-webkit-touch-callout: none) {
  .h-screen {
    height: -webkit-fill-available;
  }
}
</style>