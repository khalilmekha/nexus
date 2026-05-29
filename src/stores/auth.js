import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/api'
import { useUiStore } from '@/stores/ui'

export const useAuthStore = defineStore('auth', () => {
  const user    = ref(null)
  const token   = ref(localStorage.getItem('nexus_token') || null)
  const loading = ref(false)
  const error   = ref(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin         = computed(() => user.value?.role === 'admin')

  async function login(email, password) {
    loading.value = true
    error.value   = null
    try {
      const data  = await authService.login(email, password)
      token.value = data.token
      user.value  = data.user
      localStorage.setItem('nexus_token', data.token)

      // Welcome toast
      const ui = useUiStore()
      const hour = new Date().getHours()
      const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
      ui.notify(`${greeting}, ${data.user.name.split(' ')[0]}! 👋`, 'success')
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchMe() {
    if (!token.value) return
    try {
      user.value = await authService.me(token.value)
    } catch {
      logout()
    }
  }

  function logout() {
    user.value  = null
    token.value = null
    localStorage.removeItem('nexus_token')
  }

  return { user, token, loading, error, isAuthenticated, isAdmin, login, fetchMe, logout }
})
