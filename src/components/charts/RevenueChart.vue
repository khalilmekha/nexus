<template>
  <div class="card p-5">
    <div class="flex items-center justify-between mb-5">
      <div>
        <h3 class="text-sm font-semibold text-surface-900 dark:text-white">Revenue Overview</h3>
        <p class="text-xs text-surface-400">Last 12 months</p>
      </div>
      <div class="flex gap-1 bg-surface-100 dark:bg-surface-700 rounded-xl p-1">
        <button
          v-for="t in ['Revenue', 'Orders', 'Users']"
          :key="t"
          @click="activeTab = t"
          :class="['px-3 py-1.5 rounded-lg text-xs font-semibold transition-all', activeTab === t ? 'bg-white dark:bg-surface-600 text-surface-900 dark:text-white shadow-sm' : 'text-surface-500 dark:text-surface-400']"
        >{{ t }}</button>
      </div>
    </div>
    <div class="h-56">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler } from 'chart.js'
import { useUiStore } from '@/stores/ui'

Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler)

const props = defineProps({ stats: Object })
const ui    = useUiStore()
const activeTab = ref('Revenue')

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const dataMap = computed(() => ({
  Revenue: props.stats?.revenueByMonth ?? [],
  Orders:  props.stats?.ordersByMonth ?? [],
  Users:   props.stats?.usersByMonth ?? [],
}))

const chartData = computed(() => {
  const data   = dataMap.value[activeTab.value]
  const color  = activeTab.value === 'Revenue' ? '#3b63f6' : activeTab.value === 'Orders' ? '#8b5cf6' : '#22c55e'
  return {
    labels: MONTHS,
    datasets: [{
      label: activeTab.value,
      data,
      borderColor: color,
      backgroundColor: `${color}18`,
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 5,
      borderWidth: 2.5,
    }]
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: ui.darkMode ? '#1e293b' : '#fff',
      borderColor: ui.darkMode ? '#334155' : '#e2e8f0',
      borderWidth: 1,
      titleColor: ui.darkMode ? '#94a3b8' : '#64748b',
      bodyColor: ui.darkMode ? '#f1f5f9' : '#0f172a',
      padding: 10,
      callbacks: {
        label: ctx => activeTab.value === 'Revenue'
          ? ` $${ctx.raw.toLocaleString()}`
          : ` ${ctx.raw.toLocaleString()}`
      }
    }
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: { color: ui.darkMode ? '#475569' : '#94a3b8', font: { size: 11, family: 'Sora' } }
    },
    y: {
      grid: { color: ui.darkMode ? '#1e293b' : '#f1f5f9', drawBorder: false },
      border: { display: false },
      ticks: {
        color: ui.darkMode ? '#475569' : '#94a3b8',
        font: { size: 11, family: 'Sora' },
        callback: v => activeTab.value === 'Revenue' ? `$${(v/1000).toFixed(0)}k` : v
      }
    }
  }
}))
</script>
