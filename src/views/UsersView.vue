<template>
  <div class="space-y-5 animate-fade-in">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center gap-3">
      <div class="flex-1">
        <h2 class="text-xl font-bold text-surface-900 dark:text-white">Users</h2>
        <p class="text-sm text-surface-400">Manage accounts and permissions</p>
      </div>
      <button @click="openCreate" class="btn-primary">
        <UserPlus class="w-4 h-4" /> Add User
      </button>
    </div>

    <!-- Summary cards -->
    <div class="grid grid-cols-3 gap-4" v-if="!loading">
      <div class="card p-4 text-center">
        <p class="text-2xl font-bold text-surface-900 dark:text-white font-mono">{{ users.length }}</p>
        <p class="text-xs text-surface-400 mt-0.5">Total Users</p>
      </div>
      <div class="card p-4 text-center">
        <p class="text-2xl font-bold text-success-500 font-mono">{{ activeCount }}</p>
        <p class="text-xs text-surface-400 mt-0.5">Active</p>
      </div>
      <div class="card p-4 text-center">
        <p class="text-2xl font-bold text-primary-500 font-mono">{{ adminCount }}</p>
        <p class="text-xs text-surface-400 mt-0.5">Admins</p>
      </div>
    </div>

    <!-- Skeleton summary -->
    <div class="grid grid-cols-3 gap-4" v-else>
      <div v-for="i in 3" :key="i" class="card p-4">
        <div class="h-8 bg-surface-100 dark:bg-surface-700 rounded-lg animate-pulse mb-1" />
        <div class="h-3 w-16 mx-auto bg-surface-100 dark:bg-surface-700 rounded animate-pulse" />
      </div>
    </div>

    <!-- Table -->
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-surface-100 dark:border-surface-700 bg-surface-50 dark:bg-surface-900/50">
              <th class="text-left px-4 py-3 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">User</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider hidden md:table-cell">Joined</th>
              <th class="text-right px-4 py-3 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider hidden lg:table-cell">Orders</th>
              <th class="text-right px-4 py-3 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider hidden lg:table-cell">Spent</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Role</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Status</th>
              <th class="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-100 dark:divide-surface-700/50">
            <template v-if="loading">
              <tr v-for="i in 5" :key="i">
                <td colspan="7" class="px-4 py-3">
                  <div class="h-8 bg-surface-100 dark:bg-surface-700 rounded-lg animate-pulse" />
                </td>
              </tr>
            </template>
            <template v-else-if="users.length === 0">
              <tr>
                <td colspan="7" class="py-16 text-center">
                  <Users class="w-10 h-10 text-surface-300 dark:text-surface-600 mx-auto mb-3" />
                  <p class="text-surface-400 font-medium">No users found</p>
                </td>
              </tr>
            </template>
            <template v-else>
              <tr
                v-for="user in users"
                :key="user.id"
                class="hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors group"
              >
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {{ user.avatar }}
                    </div>
                    <div>
                      <p class="text-sm font-medium text-surface-800 dark:text-surface-200">{{ user.name }}</p>
                      <p class="text-xs text-surface-400">{{ user.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3 hidden md:table-cell">
                  <span class="text-sm text-surface-500 dark:text-surface-400">{{ formatDate(user.joined) }}</span>
                </td>
                <td class="px-4 py-3 text-right hidden lg:table-cell">
                  <span class="text-sm font-mono text-surface-600 dark:text-surface-400">{{ user.orders }}</span>
                </td>
                <td class="px-4 py-3 text-right hidden lg:table-cell">
                  <span class="text-sm font-bold font-mono text-surface-900 dark:text-white">${{ user.spent.toLocaleString() }}</span>
                </td>
                <td class="px-4 py-3">
                  <select
                    :value="user.role"
                    @change="changeRole(user, $event.target.value)"
                    :disabled="user.id === auth.user?.id"
                    class="text-xs bg-surface-100 dark:bg-surface-700 border-0 rounded-xl px-2 py-1.5 text-surface-600 dark:text-surface-300 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-40 cursor-pointer"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td class="px-4 py-3">
                  <button
                    @click="toggleStatus(user)"
                    :disabled="user.id === auth.user?.id"
                    class="disabled:opacity-40"
                  >
                    <StatusBadge :status="user.status" />
                  </button>
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      v-if="user.id !== auth.user?.id"
                      @click="confirmDeactivate(user)"
                      class="p-1.5 rounded-lg hover:bg-danger-500/10 text-surface-400 hover:text-danger-500 transition-colors"
                      :title="user.status === 'active' ? 'Deactivate' : 'Activate'"
                    >
                      <UserX v-if="user.status === 'active'" class="w-3.5 h-3.5" />
                      <UserCheck v-else class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add User Modal -->
    <AppModal v-model="showCreateModal" title="Add User" size="md">
      <form @submit.prevent="handleCreate" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-2">
            <label class="block text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1.5">Full Name</label>
            <input v-model="form.name" required class="input" placeholder="e.g. Jane Smith" />
          </div>
          <div class="col-span-2">
            <label class="block text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1.5">Email</label>
            <input v-model="form.email" type="email" required class="input" placeholder="jane@example.com" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1.5">Role</label>
            <select v-model="form.role" class="input">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1.5">Status</label>
            <select v-model="form.status" class="input">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" @click="showCreateModal = false" class="btn-secondary">Cancel</button>
          <button type="submit" class="btn-primary" :disabled="saving">
            <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
            Add User
          </button>
        </div>
      </form>
    </AppModal>

    <!-- Confirm status change modal -->
    <AppModal v-model="showConfirmModal" title="Change User Status" size="sm">
      <p class="text-sm text-surface-600 dark:text-surface-400 mb-5">
        {{ confirmTarget?.status === 'active' ? 'Deactivate' : 'Activate' }}
        <span class="font-semibold text-surface-900 dark:text-white">{{ confirmTarget?.name }}</span>?
      </p>
      <div class="flex justify-end gap-2">
        <button @click="showConfirmModal = false" class="btn-secondary">Cancel</button>
        <button @click="executeStatusChange" class="btn-danger" :disabled="saving">
          <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
          Confirm
        </button>
      </div>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { userService } from '@/services/api'
import { useUiStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'
import StatusBadge from '@/components/common/StatusBadge.vue'
import AppModal from '@/components/common/AppModal.vue'
import { Users, UserPlus, UserX, UserCheck, Loader2 } from 'lucide-vue-next'

const ui   = useUiStore()
const auth = useAuthStore()

const users   = ref([])
const loading = ref(true)
const saving  = ref(false)
const showCreateModal  = ref(false)
const showConfirmModal = ref(false)
const confirmTarget    = ref(null)

const form = reactive({ name: '', email: '', role: 'user', status: 'active' })

const activeCount = computed(() => users.value.filter(u => u.status === 'active').length)
const adminCount  = computed(() => users.value.filter(u => u.role === 'admin').length)

async function loadUsers() {
  loading.value = true
  try { users.value = await userService.list() }
  finally { loading.value = false }
}

function openCreate() {
  Object.assign(form, { name: '', email: '', role: 'user', status: 'active' })
  showCreateModal.value = true
}

async function handleCreate() {
  saving.value = true
  try {
    const user = await userService.create({ ...form })
    users.value.push(user)
    showCreateModal.value = false
    ui.notify(`${user.name} added successfully`, 'success')
  } catch (e) {
    ui.notify(e.message, 'error')
  } finally {
    saving.value = false
  }
}

async function changeRole(user, role) {
  try {
    await userService.updateRole(user.id, role)
    user.role = role
    ui.notify(`${user.name} is now ${role === 'admin' ? 'an admin' : 'a regular user'}`, 'success')
  } catch (e) {
    ui.notify(e.message, 'error')
  }
}

function confirmDeactivate(user) {
  confirmTarget.value   = user
  showConfirmModal.value = true
}

async function executeStatusChange() {
  saving.value = true
  const user   = confirmTarget.value
  const next   = user.status === 'active' ? 'inactive' : 'active'
  try {
    await userService.updateStatus(user.id, next)
    user.status = next
    showConfirmModal.value = false
    ui.notify(`${user.name} is now ${next}`, 'success')
  } catch (e) {
    ui.notify(e.message, 'error')
  } finally {
    saving.value = false
  }
}

async function toggleStatus(user) {
  if (user.id === auth.user?.id) return
  confirmDeactivate(user)
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

onMounted(loadUsers)
</script>
