<template>
  <div class="space-y-5 animate-fade-in">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center gap-3">
      <div class="flex-1">
        <h2 class="text-xl font-bold text-surface-900 dark:text-white">Products</h2>
        <p class="text-sm text-surface-400">Manage your product catalog</p>
      </div>
      <button @click="openCreate" class="btn-primary">
        <Plus class="w-4 h-4" /> Add Product
      </button>
    </div>

    <!-- Filters -->
    <div class="card p-4">
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input v-model="filters.search" @input="debouncedLoad" type="text" placeholder="Search products…" class="input pl-9" />
        </div>
        <select v-model="filters.category" @change="() => { syncUrl(); loadProducts(1) }" class="input sm:w-44">
          <option value="">All Categories</option>
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>
        <select v-model="filters.status" @change="() => { syncUrl(); loadProducts(1) }" class="input sm:w-40">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="low_stock">Low Stock</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-surface-100 dark:border-surface-700 bg-surface-50 dark:bg-surface-900/50">
              <th class="text-left px-4 py-3 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Product</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider hidden md:table-cell">Category</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider hidden sm:table-cell">SKU</th>
              <th class="text-right px-4 py-3 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Price</th>
              <th class="text-right px-4 py-3 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider hidden lg:table-cell">Stock</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Status</th>
              <th class="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-100 dark:divide-surface-700/50">
            <template v-if="loading">
              <tr v-for="i in 6" :key="i">
                <td colspan="7" class="px-4 py-3">
                  <div class="h-8 bg-surface-100 dark:bg-surface-700 rounded-lg animate-pulse" />
                </td>
              </tr>
            </template>
            <template v-else-if="products.length === 0">
              <tr>
                <td colspan="7" class="py-16 text-center">
                  <Package class="w-10 h-10 text-surface-300 dark:text-surface-600 mx-auto mb-3" />
                  <p class="text-surface-500 dark:text-surface-400 font-medium">No products found</p>
                  <p class="text-sm text-surface-400 dark:text-surface-500 mt-1">Try adjusting your search or filters</p>
                </td>
              </tr>
            </template>
            <template v-else>
              <tr
                v-for="product in products"
                :key="product.id"
                class="hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors group"
              >
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <span class="text-xl">{{ product.image }}</span>
                    <span class="text-sm font-medium text-surface-800 dark:text-surface-200">{{ product.name }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 hidden md:table-cell">
                  <span class="text-sm text-surface-500 dark:text-surface-400">{{ product.category }}</span>
                </td>
                <td class="px-4 py-3 hidden sm:table-cell">
                  <span class="text-xs font-mono text-surface-400 bg-surface-100 dark:bg-surface-700 px-2 py-1 rounded-lg">{{ product.sku }}</span>
                </td>
                <td class="px-4 py-3 text-right">
                  <span class="text-sm font-semibold font-mono text-surface-900 dark:text-white">${{ product.price.toFixed(2) }}</span>
                </td>
                <td class="px-4 py-3 text-right hidden lg:table-cell">
                  <span class="text-sm font-mono" :class="product.stock === 0 ? 'text-danger-500' : product.stock <= 10 ? 'text-warning-500' : 'text-surface-600 dark:text-surface-400'">
                    {{ product.stock }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <StatusBadge :status="product.status" />
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button @click="openEdit(product)" class="p-1.5 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-950/50 text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" title="Edit">
                      <Pencil class="w-3.5 h-3.5" />
                    </button>
                    <button @click="confirmDelete(product)" class="p-1.5 rounded-lg hover:bg-danger-500/10 text-surface-400 hover:text-danger-500 transition-colors" title="Delete">
                      <Trash2 class="w-3.5 h-3.5" />
                    </button>
                  </div>
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
          @change="loadProducts"
        />
      </div>
    </div>

    <!-- Create / Edit Modal -->
    <AppModal v-model="showModal" :title="editing ? 'Edit Product' : 'Add Product'" size="md">
      <form @submit.prevent="handleSave" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-2">
            <label class="block text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1.5">Product Name</label>
            <input v-model="form.name" required class="input" placeholder="e.g. Nexus Pro Keyboard" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1.5">Category</label>
            <select v-model="form.category" required class="input">
              <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1.5">SKU</label>
            <input v-model="form.sku" required class="input" placeholder="e.g. NPK-001" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1.5">Price ($)</label>
            <input v-model.number="form.price" type="number" step="0.01" min="0" required class="input" placeholder="0.00" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1.5">Stock</label>
            <input v-model.number="form.stock" type="number" min="0" required class="input" placeholder="0" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1.5">Emoji Icon</label>
            <input v-model="form.image" class="input" placeholder="e.g. 📦" />
          </div>
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" @click="showModal = false" class="btn-secondary">Cancel</button>
          <button type="submit" class="btn-primary" :disabled="saving">
            <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
            {{ editing ? 'Save Changes' : 'Add Product' }}
          </button>
        </div>
      </form>
    </AppModal>

    <!-- Delete confirm -->
    <AppModal v-model="showDeleteModal" title="Delete Product" size="sm">
      <p class="text-sm text-surface-600 dark:text-surface-400 mb-5">
        Are you sure you want to delete <span class="font-semibold text-surface-900 dark:text-white">{{ deleteTarget?.name }}</span>? This cannot be undone.
      </p>
      <div class="flex justify-end gap-2">
        <button @click="showDeleteModal = false" class="btn-secondary">Cancel</button>
        <button @click="handleDelete" class="btn-danger" :disabled="saving">
          <Loader2 v-if="saving" class="w-4 h-4 animate-spin" /> Delete
        </button>
      </div>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { productService } from '@/services/api'
import { useUiStore } from '@/stores/ui'
import StatusBadge from '@/components/common/StatusBadge.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import AppModal from '@/components/common/AppModal.vue'
import { Plus, Search, Pencil, Trash2, Loader2, Package } from 'lucide-vue-next'
import { useRouter, useRoute } from 'vue-router'

const ui     = useUiStore()
const router = useRouter()
const route  = useRoute()

const products   = ref([])
const loading    = ref(true)
const saving     = ref(false)
const page       = ref(1)
const perPage    = 6
const total      = ref(0)
const totalPages = ref(1)
const showModal       = ref(false)
const showDeleteModal = ref(false)
const editing         = ref(null)
const deleteTarget    = ref(null)

const categories = ['Electronics', 'Accessories', 'Audio', 'Networking', 'Storage']

// Restore filters from URL query params on load
const filters = reactive({
  search:   route.query.search   || '',
  category: route.query.category || '',
  status:   route.query.status   || '',
})
const form = reactive({ name: '', category: 'Electronics', sku: '', price: 0, stock: 0, image: '📦' })

function syncUrl() {
  router.replace({ query: { ...route.query, search: filters.search || undefined, category: filters.category || undefined, status: filters.status || undefined } })
}

let debounceTimer = null
function debouncedLoad() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => { syncUrl(); loadProducts(1) }, 400)
}

async function loadProducts(p = page.value) {
  loading.value = true
  page.value = p
  try {
    const res = await productService.list({ page: p, perPage, ...filters })
    products.value   = res.items
    total.value      = res.total
    totalPages.value = res.totalPages
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editing.value = null
  Object.assign(form, { name: '', category: 'Electronics', sku: '', price: 0, stock: 0, image: '📦' })
  showModal.value = true
}

function openEdit(product) {
  editing.value = product.id
  Object.assign(form, { name: product.name, category: product.category, sku: product.sku, price: product.price, stock: product.stock, image: product.image })
  showModal.value = true
}

function confirmDelete(product) {
  deleteTarget.value  = product
  showDeleteModal.value = true
}

async function handleSave() {
  saving.value = true
  try {
    if (editing.value) {
      await productService.update(editing.value, { ...form })
      ui.notify('Product updated successfully')
    } else {
      await productService.create({ ...form })
      ui.notify('Product created successfully')
    }
    showModal.value = false
    loadProducts(editing.value ? page.value : 1)
  } catch (e) {
    ui.notify(e.message, 'error')
  } finally {
    saving.value = false
  }
}

async function handleDelete() {
  saving.value = true
  try {
    await productService.delete(deleteTarget.value.id)
    ui.notify('Product deleted')
    showDeleteModal.value = false
    loadProducts(1)
  } catch (e) {
    ui.notify(e.message, 'error')
  } finally {
    saving.value = false
  }
}

onMounted(() => loadProducts())
</script>
