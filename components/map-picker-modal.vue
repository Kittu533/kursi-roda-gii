<template>
    <div v-if="show" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
        <div class="bg-white p-4 rounded shadow-lg max-w-lg w-full relative">
            <button class="absolute top-2 right-2" @click="close">Tutup</button>
            <div style="height:300px" id="modal-map"></div>
            <div class="mt-2">
                <div>Lat: {{ lat }}, Lng: {{ lng }}</div>
                <div>Alamat: {{ address }}</div>
                <div class="mt-3 flex justify-between">
                    <button class="bg-blue-500 text-white px-4 py-2 rounded" @click="chooseLocation">Pilih Lokasi
                        Ini</button>
                    <button class="bg-gray-300 px-4 py-2 rounded" @click="close">Tutup</button>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps({
    show: Boolean,
    initLat: { type: Number, default: -6.1751 },
    initLng: { type: Number, default: 106.865 }
})
const emit = defineEmits(['close', 'selected'])

const lat = ref(props.initLat)
const lng = ref(props.initLng)
const address = ref('')
let map: L.Map | null = null
let marker: L.Marker | null = null

onMounted(() => {
    map = L.map('modal-map').setView([lat.value, lng.value], 15)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © OpenStreetMap contributors'
    }).addTo(map)
    marker = L.marker([lat.value, lng.value]).addTo(map)
    map.on('click', (e: L.LeafletMouseEvent) => {
        lat.value = e.latlng.lat
        lng.value = e.latlng.lng
        marker?.setLatLng(e.latlng)
        fetchAddress()
    })
    fetchAddress()
})

onUnmounted(() => {
    map?.remove()
    map = null
    marker = null
})

const fetchAddress = async () => {
    address.value = 'Loading...'
    try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat.value}&lon=${lng.value}`
        const res = await fetch(url)
        const json = await res.json()
        address.value = json.display_name || '-'
    } catch {
        address.value = '-'
    }
}

function chooseLocation() {
    emit('selected', {
        lat: lat.value,
        lng: lng.value,
        address: address.value
    })

    emit('close')
}
function close() {
    emit('close')
}
</script>
