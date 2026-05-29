<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-surface-900 dark:text-white">Good {{ timeOfDay }}, {{ auth.user?.name?.split(' ')[0] }} 👋</h2>
        <p class="text-sm text-surface-400 mt-0.5">Here's what's happening with your store today.</p>
      </div>
      <div class="flex items-center gap-3">
        <!-- Date range toggle -->
        <div class="flex gap-1 bg-surface-100 dark:bg-surface-700 rounded-xl p-1">
          <button
            v-for="r in ranges"
            :key="r.value"
            @click="activeRange = r.value"
            :class="['px-3 py-1.5 rounded-lg text-xs font-semibold transition-all', activeRange === r.value ? 'bg-white dark:bg-surface-600 text-surface-900 dark:text-white shadow-sm' : 'text-surface-500 dark:text-surface-400']"
          >{{ r.label }}</button>
        </div>
        <span class="text-xs text-surface-400 font-mono hidden sm:block">{{ today }}</span>
      </div>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <div v-for="i in 4" :key="i" class="card p-5 animate-pulse h-28">
        <div class="h-4 bg-surface-200 dark:bg-surface-700 rounded w-1/2 mb-3" />
        <div class="h-8 bg-surface-200 dark:bg-surface-700 rounded w-3/4" />
      </div>
    </div>

    <!-- Stat cards -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard label="Total Revenue"    :value="stats.totalRevenue.value"  :change="stats.totalRevenue.change"  :trend="stats.totalRevenue.trend"  :icon="DollarSign"   color="primary" format="currency" />
      <StatCard label="Total Orders"     :value="stats.totalOrders.value"   :change="stats.totalOrders.change"   :trend="stats.totalOrders.trend"   :icon="ShoppingCart" color="accent"  format="number"  />
      <StatCard label="Active Users"     :value="stats.totalUsers.value"    :change="stats.totalUsers.change"    :trend="stats.totalUsers.trend"    :icon="Users"        color="success" format="number"  />
      <StatCard label="Avg. Order Value" :value="stats.avgOrderValue.value" :change="stats.avgOrderValue.change" :trend="stats.avgOrderValue.trend" :icon="TrendingUp"   color="warning" format="decimal" />
    </div>

    <!-- Charts row -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div class="xl:col-span-2">
        <RevenueChart v-if="stats" :stats="slicedStats" />
        <div v-else class="card p-5 h-72 animate-pulse">
          <div class="h-full bg-surface-100 dark:bg-surface-700 rounded-xl" />
        </div>
      </div>
      <OrderStatusChart v-if="stats" :data="stats.ordersByStatus" />
      <div v-else class="card p-5 h-72 animate-pulse">
        <div class="h-full bg-surface-100 dark:bg-surface-700 rounded-xl" />
      </div>
    </div>

    <!-- Bottom row -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <!-- Top products -->
      <div class="card p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-semibold text-surface-900 dark:text-white">Top Products</h3>
          <RouterLink to="/products" class="text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline">View all</RouterLink>
        </div>
        <div v-if="loading" class="space-y-3">
          <div v-for="i in 5" :key="i" class="h-10 bg-surface-100 dark:bg-surface-700 rounded-xl animate-pulse" />
        </div>
        <div v-else class="space-y-2">
          <div v-for="p in stats.topProducts" :key="p.id" class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors">
            <span class="text-base">{{ p.image }}</span>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-surface-800 dark:text-surface-200 truncate">{{ p.name }}</p>
              <div class="flex items-center gap-2 mt-1">
                <div class="flex-1 h-1.5 bg-surface-100 dark:bg-surface-700 rounded-full overflow-hidden">
                  <div class="h-full bg-primary-500 rounded-full" :style="{ width: `${(p.sales / stats.topProducts[0].sales) * 100}%` }" />
                </div>
                <span class="text-xs text-surface-400 shrink-0">{{ p.sales }} sold</span>
              </div>
            </div>
            <span class="text-sm font-semibold text-surface-900 dark:text-white font-mono">${{ p.price }}</span>
          </div>
        </div>
      </div>

      <!-- Recent orders -->
      <div class="card p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-semibold text-surface-900 dark:text-white">Recent Orders</h3>
          <RouterLink to="/orders" class="text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline">View all</RouterLink>
        </div>
        <div v-if="loading" class="space-y-3">
          <div v-for="i in 5" :key="i" class="h-10 bg-surface-100 dark:bg-surface-700 rounded-xl animate-pulse" />
        </div>
        <div v-else class="space-y-2">
          <div v-for="order in recentOrders" :key="order.id" class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors">
            <div class="w-8 h-8 rounded-xl bg-surface-100 dark:bg-surface-700 flex items-center justify-center shrink-0">
              <ShoppingCart class="w-3.5 h-3.5 text-surface-500" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-surface-800 dark:text-surface-200 truncate">{{ order.customer }}</p>
              <p class="text-xs text-surface-400">{{ order.id }}</p>
            </div>
            <div class="text-right shrink-0">
              <p class="text-sm font-semibold text-surface-900 dark:text-white font-mono">${{ order.total.toFixed(2) }}</p>
              <StatusBadge :status="order.status" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { dashboardService, orderService } from '@/services/api'
import StatCard from '@/components/common/StatCard.vue'
import RevenueChart from '@/components/charts/RevenueChart.vue'
import OrderStatusChart from '@/components/charts/OrderStatusChart.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { DollarSign, ShoppingCart, Users, TrendingUp } from 'lucide-vue-next'

const auth    = useAuthStore()
const loading = ref(true)
const stats   = ref(null)
const recentOrders = ref([])

const ranges = [
  { label: '3M', value: 3 },
  { label: '6M', value: 6 },
  { label: '12M', value: 12 },
]
const activeRange = ref(12)

const slicedStats = computed(() => {
  if (!stats.value) return null
  const n = activeRange.value
  return {
    ...stats.value,
    revenueByMonth: stats.value.revenueByMonth.slice(-n),
    ordersByMonth:  stats.value.ordersByMonth.slice(-n),
    usersByMonth:   stats.value.usersByMonth.slice(-n),
  }
})

const today = computed(() => new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))
const timeOfDay = computed(() => {
  const h = new Date().getHours()
  return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'
})

onMounted(async () => {
  try {
    stats.value = await dashboardService.getStats()
    const r = await orderService.list({ perPage: 5 })
    recentOrders.value = r.items
  } finally {
    loading.value = false
  }
})
</script>
