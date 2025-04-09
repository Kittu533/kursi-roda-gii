<template>
  <Dialog :open="isOpen" @update:open="$emit('update:isOpen', $event)">
    <DialogContent class="sm:max-w-md h-[500px] w-[450px] flex justify-center items-center p-24 rounded-[20px] ">
      <DialogClose v-if="showCloseButton" class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X class="h-4 w-4" />
        <span class="sr-only">Close</span>
      </DialogClose>
      <div class="flex flex-col items-center p-2 gap-[40px]">
        <div 
          class="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          :class="{
            'bg-red-600': type === 'delete',
            'bg-blue-600': type === 'edit',
            'bg-green-600': type === 'success'
          }"
        >
          <!-- Delete icon -->
          <svg v-if="type === 'delete'" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          
          <!-- Edit icon -->
          <svg v-if="type === 'edit'" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
          
          <!-- Success icon -->
          <svg v-if="type === 'success'" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
        </div>
        <DialogTitle class="text-center mb-4">{{ message }}</DialogTitle>
        <div v-if="showButtons" class="flex w-full gap-3">
            <DialogClose asChild>
            <button 
              class="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-[12px]"
              @click="$emit('cancel')"
            >
              {{ cancelText }}
            </button>
            </DialogClose>
            <button 
            class="flex-1 py-2 px-4 rounded-md text-white text-[12px]"
            :class="{
              'bg-red-500 hover:bg-red-600': type === 'delete',
              'bg-blue-500 hover:bg-blue-600': type === 'edit',
              'bg-green-500 hover:bg-green-600': type === 'success'
            }"
            @click="$emit('confirm')"
            >
            {{ confirmText }}
            </button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { 
  Dialog, 
  DialogContent, 
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog'
import { X } from 'lucide-vue-next'

defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  type: {
    type: String,
    default: 'delete',
    validator: (value: string) => ['delete', 'edit', 'success'].includes(value)
  },
  message: {
    type: String,
    required: true
  },
  showButtons: {
    type: Boolean,
    default: true
  },
  showCloseButton: {
    type: Boolean,
    default: true
  },
  confirmText: {
    type: String,
    default: 'Ya'
  },
  cancelText: {
    type: String,
    default: 'Tidak'
  }
})

defineEmits(['update:isOpen', 'confirm', 'cancel'])
</script>