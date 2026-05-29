<template>
  <div class="card p-5">
    <h3 class="text-sm font-semibold text-surface-900 dark:text-white mb-1">Orders by Status</h3>
    <p class="text-xs text-surface-400 mb-5">Current distribution</p>
    <div class="h-44">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>
    <div class="grid grid-cols-2 gap-2 mt-4">
      <div v-for="(item, i) in legendItems" :key="i" class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ background: item.color }" />
        <span class="text-xs text-surface-500 dark:text-surface-400 truncate">{{ item.label }}</span>
        <span class="ml-auto text-xs font-semibold text-surface-700 dark:text-surface-300">{{ item.value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'

Chart.register(ArcElement, Tooltip, Legend)

const props = defineProps({ data: Object })

const COLORS  = ['#22c55e','#3b63f6','#8b5cf6','#f97316','#ef4444']
const STATUSES = ['delivered','shipped','processing','pending','cancelled']

const values = computed(() => STATUSES.map(s => props.data?.[s] ?? 0))

const chartData = computed(() => ({
  labels: STATUSES.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
  datasets: [{ data: values.value, backgroundColor: COLORS, borderWidth: 0, hoverOffset: 4 }]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '72%',
  plugins: { legend: { display: false }, tooltip: { padding: 8 } }
}

const legendItems = computed(() =>
  STATUSES.map((s, i) => ({ label: s.charAt(0).toUpperCase() + s.slice(1), value: values.value[i], color: COLORS[i] }))
)
</script>
