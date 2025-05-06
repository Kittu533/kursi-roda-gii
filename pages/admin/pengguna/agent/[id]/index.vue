<template>
  <DetailView
    title="Agen - Detail"
    card-title="Data Agen"
    :breadcrumbs="breadcrumbs"
    :fields="fields"
    :data="agent"
    :loading="isLoading"
    :error="error"
    back-button-text="Kembali"
    save-button-text="Edit"
    @back="router.push('/admin/pengguna/agent')"
    @save="router.push(`/admin/pengguna/agent/${agent?.id}/edit`)"
  >
  </DetailView>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAgentStore } from "~/store/agent";
import DetailView from "~/components/detail-view.vue";

// Router
const route = useRoute();
const router = useRouter();
const agentId = computed(() => route.params.id as string);

// Store
const agentStore = useAgentStore();
const agent = computed(() => agentStore.selectedAgent);
const isLoading = computed(() => agentStore.isLoading);
const error = computed(() => agentStore.error);

// Breadcrumbs
const breadcrumbs = [
  { text: "Pengguna", to: "/admin/pengguna/agent" },
  { text: "Agen", to: "/admin/pengguna/agent" },
  { text: "Detail" },
];

// Fields configuration
const fields = [
  { key: "id", label: "ID Agen" },
  { key: "name", label: "Nama Lengkap" },
  { key: "photo", label: "Foto Profil" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Nomor Telepon" },
  { key: "username", label: "Username" },
  { key: "location", label: "Lokasi" },
  { key: "openHour", label: "Jam Buka" },
  { key: "closeHour", label: "Jam Tutup" },
  { key: "status", label: "Status", type: "status" },
];

// Lifecycle
const loaded = ref(false);

onMounted(async () => {
  if (agentId.value) {
    try {
      await agentStore.loadAgentDetails(agentId.value);
    } catch (error) {
      console.error("Error loading agent details:", error);
    } finally {
      loaded.value = true;
    }
  }
});
</script>
