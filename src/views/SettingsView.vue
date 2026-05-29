<template>
  <div class="space-y-5 animate-fade-in max-w-2xl">
    <div>
      <h2 class="text-xl font-bold text-surface-900 dark:text-white">Settings</h2>
      <p class="text-sm text-surface-400">Manage your account and preferences</p>
    </div>

    <!-- Profile -->
    <div class="card p-5 space-y-4">
      <h3 class="text-sm font-semibold text-surface-900 dark:text-white border-b border-surface-100 dark:border-surface-700 pb-3">Profile</h3>
      <div class="flex items-center gap-4">
        <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-xl font-bold">
          {{ auth.user?.avatar }}
        </div>
        <div>
          <p class="font-semibold text-surface-900 dark:text-white">{{ auth.user?.name }}</p>
          <p class="text-sm text-surface-400">{{ auth.user?.email }}</p>
          <span class="badge mt-1" :class="auth.isAdmin ? 'bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400' : 'bg-surface-100 dark:bg-surface-700 text-surface-500'">
            {{ auth.user?.role }}
          </span>
        </div>
      </div>
    </div>

    <!-- Appearance -->
    <div class="card p-5 space-y-4">
      <h3 class="text-sm font-semibold text-surface-900 dark:text-white border-b border-surface-100 dark:border-surface-700 pb-3">Appearance</h3>
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-surface-800 dark:text-surface-200">Dark Mode</p>
          <p class="text-xs text-surface-400">Toggle between light and dark theme</p>
        </div>
        <button
          @click="ui.toggleDark"
          :class="['relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200', ui.darkMode ? 'bg-primary-600' : 'bg-surface-200 dark:bg-surface-600']"
        >
          <span :class="['inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200', ui.darkMode ? 'translate-x-6' : 'translate-x-1']" />
        </button>
      </div>
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-surface-800 dark:text-surface-200">Sidebar Collapsed</p>
          <p class="text-xs text-surface-400">Collapse the sidebar for more space</p>
        </div>
        <button
          @click="ui.toggleSidebar"
          :class="['relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200', !ui.sidebarOpen ? 'bg-primary-600' : 'bg-surface-200 dark:bg-surface-600']"
        >
          <span :class="['inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200', !ui.sidebarOpen ? 'translate-x-6' : 'translate-x-1']" />
        </button>
      </div>
    </div>

    <!-- Sign out (all users) -->
    <div class="card p-5 border-danger-200 dark:border-danger-900/50">
      <h3 class="text-sm font-semibold text-danger-600 dark:text-danger-400 border-b border-danger-100 dark:border-danger-900/50 pb-3 mb-4">Danger Zone</h3>
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-surface-800 dark:text-surface-200">Sign Out</p>
          <p class="text-xs text-surface-400">Log out of all sessions</p>
        </div>
        <button @click="handleLogout" class="btn-danger text-xs px-3 py-2">
          <LogOut class="w-3.5 h-3.5" /> Sign Out
        </button>
      </div>
    </div>

    <!-- Version -->
    <p class="text-xs text-surface-300 dark:text-surface-600 text-center">Nexus Admin v1.0.0 · Built with Vue 3 + Pinia + Tailwind CSS</p>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { useRouter } from 'vue-router'
import { LogOut } from 'lucide-vue-next'

const auth   = useAuthStore()
const ui     = useUiStore()
const router = useRouter()

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>
