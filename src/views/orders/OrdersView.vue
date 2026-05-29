<template>
  <div class="space-y-5 animate-fade-in">
    <!-- Header -->
    <div>
      <h2 class="text-xl font-bold text-surface-900 dark:text-white">Orders</h2>
      <p class="text-sm text-surface-400">Manage and track customer orders</p>
    </div>

    <!-- Filters -->
    <div class="card p-4">
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input v-model="filters.search" @input="debouncedLoad" type="text" placeholder="Search by order ID or customer…" class="input pl-9" />
        </div>
        <select v-model="filters.status" @change="() => { syncUrl(); loadOrders(1) }" class="input sm:w-44">
          <option value="">All Statuses</option>
          <option v-for="s in statusOptions" :key="s.value" :value="s.value">{{ s.label }}</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-surface-100 dark:border-surface-700 bg-surface-50 dark:bg-surface-900/50">
              <th class="text-left px-4 py-3 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Order</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider hidden sm:table-cell">Customer</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider hidden md:table-cell">Date</th>
              <th class="text-center px-4 py-3 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider hidden lg:table-cell">Items</th>
              <th class="text-right px-4 py-3 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Total</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Status</th>
              <th class="px-4 py-3 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-100 dark:divide-surface-700/50">
            <template v-if="loading">
              <tr v-for="i in 8" :key="i">
                <td colspan="7" class="px-4 py-3">
                  <div class="h-8 bg-surface-100 dark:bg-surface-700 rounded-lg animate-pulse" />
                </td>
              </tr>
            </template>
            <template v-else-if="orders.length === 0">
              <tr>
                <td colspan="7" class="py-16 text-center">
                  <ShoppingCart class="w-10 h-10 text-surface-300 dark:text-surface-600 mx-auto mb-3" />
                  <p class="text-surface-500 dark:text-surface-400 font-medium">No orders found</p>
                  <p class="text-sm text-surface-400 dark:text-surface-500 mt-1">Try adjusting your search or filters</p>
                </td>
              </tr>
            </template>
            <template v-else>
              <tr
                v-for="order in orders"
                :key="order.id"
                class="hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors"
              >
                <td class="px-4 py-3">
                  <span class="text-sm font-mono font-semibold text-primary-600 dark:text-primary-400">{{ order.id }}</span>
                </td>
                <td class="px-4 py-3 hidden sm:table-cell">
                  <div>
                    <p class="text-sm font-medium text-surface-800 dark:text-surface-200">{{ order.customer }}</p>
                    <p class="text-xs text-surface-400">{{ order.email }}</p>
                  </div>
                </td>
                <td class="px-4 py-3 hidden md:table-cell">
                  <span class="text-sm text-surface-500 dark:text-surface-400">{{ formatDate(order.date) }}</span>
                </td>
                <td class="px-4 py-3 text-center hidden lg:table-cell">
                  <span class="text-sm text-surface-600 dark:text-surface-400">{{ order.items }}</span>
                </td>
                <td class="px-4 py-3 text-right">
                  <span class="text-sm font-bold font-mono text-surface-900 dark:text-white">${{ order.total.toFixed(2) }}</span>
                </td>
                <td class="px-4 py-3">
                  <StatusBadge :status="order.status" />
                </td>
                <td class="px-4 py-3">
                  <select
                    :value="order.status"
                    @change="updateStatus(order, $event.target.value)"
                    :disabled="updatingId === order.id"
                    class="text-xs bg-surface-100 dark:bg-surface-700 border-0 rounded-xl px-2 py-1.5 text-surface-600 dark:text-surface-300 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 cursor-pointer"
                  >
                    <option v-for="s in statusOptions" :key="s.value" :value="s.value">{{ s.label }}</option>
                  </select>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-4 py-3 border-t border-surface-100 dark:border-surface-700">
        <PaginationBar
          :model-value="page"
          :total-pages="totalPages"
          :total="total"
          :per-page="perPage"
          @change="loadOrders"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { orderService } from '@/services/api'
import { useUiStore } from '@/stores/ui'
import StatusBadge from '@/components/common/StatusBadge.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import { Search, ShoppingCart } from 'lucide-vue-next'

const ui     = useUiStore()
const router = useRouter()
const route  = useRoute()

const orders     = ref([])
const loading    = ref(true)
const updatingId = ref(null)
const page       = ref(1)
const perPage    = 8
const total      = ref(0)
const totalPages = ref(1)

// Restore filters from URL
const filters = reactive({
  search: route.query.search || '',
  status: route.query.status || '',
})

const statusOptions = [
  { value: 'pending',    label: 'Pending'    },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped',    label: 'Shipped'    },
  { value: 'delivered',  label: 'Delivered'  },
  { value: 'cancelled',  label: 'Cancelled'  },
  { value: 'refunded',   label: 'Refunded'   },
]

function syncUrl() {
  router.replace({ query: { ...route.query, search: filters.search || undefined, status: filters.status || undefined } })
}

let debounceTimer = null
function debouncedLoad() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => { syncUrl(); loadOrders(1) }, 400)
}

async function loadOrders(p = page.value) {
  loading.value = true
  page.value = p
  try {
    const res = await orderService.list({ page: p, perPage, ...filters })
    orders.value     = res.items
    total.value      = res.total
    totalPages.value = res.totalPages
  } finally {
    loading.value = false
  }
}

async function updateStatus(order, newStatus) {
  if (newStatus === order.status) return
  updatingId.value = order.id
  try {
    await orderService.updateStatus(order.id, newStatus)
    order.status = newStatus
    ui.notify(`Order ${order.id} updated to ${newStatus}`, 'success')
  } catch (e) {
    ui.notify(e.message, 'error')
  } finally {
    updatingId.value = null
  }
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

onMounted(() => loadOrders())
</script>
