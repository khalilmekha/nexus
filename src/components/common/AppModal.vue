<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('update:modelValue', false)" />
        <div class="relative bg-white dark:bg-surface-800 rounded-2xl shadow-card-lg border border-surface-100 dark:border-surface-700 w-full max-h-[90vh] overflow-y-auto" :class="widthClass">
          <div class="flex items-center justify-between p-5 border-b border-surface-100 dark:border-surface-700">
            <h2 class="text-base font-bold text-surface-900 dark:text-white">{{ title }}</h2>
            <button @click="$emit('update:modelValue', false)" class="p-1.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-400 transition-colors">
              <X class="w-4 h-4" />
            </button>
          </div>
          <div class="p-5">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps({
  modelValue: Boolean,
  title: String,
  size: { type: String, default: 'md' }
})
defineEmits(['update:modelValue'])

const widthClass = computed(() => ({
  sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl'
}[props.size]))
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .relative, .modal-leave-to .relative { transform: scale(0.95) translateY(8px); }
</style>
