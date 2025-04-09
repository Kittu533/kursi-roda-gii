<template>
  <div>
    <AgentDetail v-if="!isEditing" />
    <AgentForm v-else />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import AgentDetail from "~/components/agent/agent-detail.vue";
import AgentForm from "~/components/agent/agent-form.vue";

const route = useRoute();
const isEditing = computed(() => route.path.includes("/edit"));
</script>
