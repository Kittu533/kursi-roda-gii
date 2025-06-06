<template>
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        @mousedown.self="close">
        <div class="bg-white rounded-lg shadow-lg p-4 relative max-w-xl w-full h-[80vh] flex flex-col">
            <button @click="close" class="absolute top-2 right-2 text-gray-600 hover:text-red-500" aria-label="Tutup">
                <Icon name="mdi:close" size="24" />
            </button>
            <div class="flex-1 flex items-center justify-center">
                <iframe v-if="url" :src="url" class="w-full h-full rounded" frameborder="0" allowfullscreen></iframe>
                <div v-else class="text-gray-400">Tidak ada dokumen</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    show: boolean,
    url: string
}>()
const emit = defineEmits(['close'])
function close() { emit('close') }
</script>
