<template>
  <div class="flex h-screen bg-surface-50 dark:bg-surface-950 overflow-hidden font-sans">
    <!-- Sidebar overlay on mobile -->
    <div
      v-if="ui.sidebarOpen && isMobile"
      class="fixed inset-0 bg-black/40 z-20 lg:hidden"
      @click="ui.toggleSidebar"
    />

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed lg:static inset-y-0 left-0 z-30 flex flex-col transition-all duration-300 ease-in-out',
        'bg-white dark:bg-surface-900 border-r border-surface-100 dark:border-surface-800',
        ui.sidebarOpen ? 'w-64' : 'w-16'
      ]"
    >
      <!-- Logo -->
      <div class="flex items-center gap-3 px-4 h-16 border-b border-surface-100 dark:border-surface-800 shrink-0">
        <div class="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        </div>
        <Transition name="fade">
          <span v-if="ui.sidebarOpen" class="font-bold text-lg text-surface-900 dark:text-white tracking-tight">Nexus</span>
        </Transition>
      </div>

      <!-- Nav -->
      <nav class="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        <div v-for="group in navGroups" :key="group.label" class="mb-4">
          <Transition name="fade">
            <p v-if="ui.sidebarOpen" class="px-3 mb-1.5 text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-widest">
              {{ group.label }}
            </p>
          </Transition>
          <RouterLink
            v-for="item in group.items"
            :key="item.to"
            :to="item.to"
            class="nav-link"
            :class="{ 'active': $route.path.startsWith(item.to) && item.to !== '/' }"
            :title="!ui.sidebarOpen ? item.label : ''"
          >
            <component :is="item.icon" class="w-4 h-4 shrink-0" />
            <Transition name="fade">
              <span v-if="ui.sidebarOpen" class="truncate">{{ item.label }}</span>
            </Transition>
            <Transition name="fade">
              <span
                v-if="ui.sidebarOpen && item.badge > 0"
                class="ml-auto badge bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400"
              >{{ item.badge }}</span>
            </Transition>
          </RouterLink>
        </div>
      </nav>

      <!-- User profile -->
      <div class="border-t border-surface-100 dark:border-surface-800 p-3 shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {{ auth.user?.avatar }}
          </div>
          <Transition name="fade">
            <div v-if="ui.sidebarOpen" class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-surface-900 dark:text-white truncate">{{ auth.user?.name }}</p>
              <p class="text-xs text-surface-400 dark:text-surface-500 capitalize">{{ auth.user?.role }}</p>
            </div>
          </Transition>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Topbar -->
      <header class="h-16 bg-white dark:bg-surface-900 border-b border-surface-100 dark:border-surface-800 flex items-center gap-4 px-4 lg:px-6 shrink-0">
        <button @click="ui.toggleSidebar" class="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-500 dark:text-surface-400 transition-colors">
          <component :is="ui.sidebarOpen ? PanelLeftClose : PanelLeft" class="w-4 h-4" />
        </button>

        <h1 class="text-base font-semibold text-surface-900 dark:text-white">{{ pageTitle }}</h1>

        <div class="flex-1" />

        <!-- Dark mode -->
        <button @click="ui.toggleDark" class="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-500 dark:text-surface-400 transition-colors" title="Toggle dark mode">
          <Moon v-if="!ui.darkMode" class="w-4 h-4" />
          <Sun v-else class="w-4 h-4" />
        </button>

        <!-- Role badge -->
        <span v-if="auth.isAdmin" class="badge bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 hidden sm:inline-flex">
          Admin
        </span>

        <!-- Logout (labeled) -->
        <button @click="handleLogout" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-500 dark:text-surface-400 transition-colors text-sm font-medium" title="Logout">
          <LogOut class="w-4 h-4" />
          <span class="hidden sm:inline">Logout</span>
        </button>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto p-4 lg:p-6">
        <RouterView v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" :key="$route.path" />
          </Transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { orderService } from '@/services/api'
import { useWindowSize } from '@vueuse/core'
import {
  LayoutDashboard, Package, ShoppingCart, Users, Settings,
  LogOut, Moon, Sun, PanelLeft, PanelLeftClose
} from 'lucide-vue-next'

const auth   = useAuthStore()
const ui     = useUiStore()
const router = useRouter()
const route  = useRoute()
const { width } = useWindowSize()
const isMobile  = computed(() => width.value < 1024)

const pendingCount = ref(0)
onMounted(() => { pendingCount.value = orderService.getPendingCount() })

const navGroups = computed(() => [
  {
    label: 'Core',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/orders',    label: 'Orders',    icon: ShoppingCart, badge: pendingCount.value },
      { to: '/products',  label: 'Products',  icon: Package },
    ]
  },
  ...(auth.isAdmin ? [{
    label: 'Admin',
    items: [
      { to: '/users',    label: 'Users',    icon: Users },
      { to: '/settings', label: 'Settings', icon: Settings },
    ]
  }] : [
    { label: 'Account', items: [{ to: '/settings', label: 'Settings', icon: Settings }] }
  ])
])

const pageTitles = { '/dashboard': 'Dashboard', '/products': 'Products', '/orders': 'Orders', '/users': 'Users', '/settings': 'Settings' }
const pageTitle  = computed(() => pageTitles[route.path] || 'Nexus Admin')

async function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.page-enter-active, .page-leave-active { transition: all 0.2s ease; }
.page-enter-from { opacity: 0; transform: translateY(6px); }
.page-leave-to   { opacity: 0; transform: translateY(-6px); }
</style>
