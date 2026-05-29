<template>
  <div class="flex items-center justify-between">
    <p class="text-xs text-surface-400">
      Showing <span class="font-semibold text-surface-700 dark:text-surface-300">{{ from }}–{{ to }}</span> of <span class="font-semibold text-surface-700 dark:text-surface-300">{{ total }}</span>
    </p>
    <div class="flex items-center gap-1">
      <button @click="$emit('change', modelValue - 1)" :disabled="modelValue <= 1" class="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 disabled:opacity-30 disabled:cursor-not-allowed text-surface-500 transition-colors">
        <ChevronLeft class="w-4 h-4" />
      </button>
      <template v-for="p in pages" :key="p">
        <span v-if="p === '…'" class="px-2 text-surface-400 text-sm">…</span>
        <button
          v-else
          @click="$emit('change', p)"
          :class="['w-8 h-8 rounded-lg text-sm font-semibold transition-colors', p === modelValue ? 'bg-primary-600 text-white' : 'hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-600 dark:text-surface-400']"
        >{{ p }}</button>
      </template>
      <button @click="$emit('change', modelValue + 1)" :disabled="modelValue >= totalPages" class="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 disabled:opacity-30 disabled:cursor-not-allowed text-surface-500 transition-colors">
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  modelValue: Number,
  totalPages: Number,
  total:      Number,
  perPage:    Number,
})
defineEmits(['change'])

const from = computed(() => Math.min((props.modelValue - 1) * props.perPage + 1, props.total))
const to   = computed(() => Math.min(props.modelValue * props.perPage, props.total))

const pages = computed(() => {
  const p = props.totalPages, c = props.modelValue
  if (p <= 7) return Array.from({ length: p }, (_, i) => i + 1)
  if (c <= 4) return [1, 2, 3, 4, 5, '…', p]
  if (c >= p - 3) return [1, '…', p-4, p-3, p-2, p-1, p]
  return [1, '…', c-1, c, c+1, '…', p]
})
</script>
