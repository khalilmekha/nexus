<template>
  <div class="card p-5 animate-fade-in">
    <div class="flex items-start justify-between mb-4">
      <div class="p-2.5 rounded-xl" :class="colorClasses.bg">
        <component :is="icon" class="w-5 h-5" :class="colorClasses.icon" />
      </div>
      <span
        class="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg"
        :class="trend === 'up' ? 'bg-success-500/10 text-success-500' : 'bg-danger-500/10 text-danger-400'"
      >
        <TrendingUp v-if="trend === 'up'" class="w-3 h-3" />
        <TrendingDown v-else class="w-3 h-3" />
        {{ Math.abs(change) }}%
      </span>
    </div>
    <p class="text-2xl font-bold text-surface-900 dark:text-white mb-1 font-mono tracking-tight">{{ formattedValue }}</p>
    <p class="text-sm text-surface-500 dark:text-surface-400">{{ label }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { TrendingUp, TrendingDown } from 'lucide-vue-next'

const props = defineProps({
  label:  String,
  value:  Number,
  change: Number,
  trend:  String,
  icon:   Object,
  color:  { type: String, default: 'primary' },
  format: { type: String, default: 'number' },
})

const COLOR_MAP = {
  primary: { bg: 'bg-primary-100 dark:bg-primary-950/60', icon: 'text-primary-600 dark:text-primary-400' },
  success: { bg: 'bg-success-500/10',  icon: 'text-success-500' },
  warning: { bg: 'bg-warning-500/10',  icon: 'text-warning-500' },
  accent:  { bg: 'bg-accent-500/10',   icon: 'text-accent-500' },
}
const colorClasses = computed(() => COLOR_MAP[props.color] || COLOR_MAP.primary)

const formattedValue = computed(() => {
  if (props.format === 'currency') return `$${props.value.toLocaleString('en-US', { minimumFractionDigits: 0 })}`
  if (props.format === 'decimal')  return `$${props.value.toFixed(2)}`
  return props.value.toLocaleString('en-US')
})
</script>
