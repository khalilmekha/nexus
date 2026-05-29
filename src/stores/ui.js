import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const darkMode = ref(localStorage.getItem('nexus_dark') === 'true')
  const sidebarOpen = ref(true)
  const notifications = ref([])

  function toggleDark() {
    darkMode.value = !darkMode.value
    localStorage.setItem('nexus_dark', darkMode.value)
    document.documentElement.classList.toggle('dark', darkMode.value)
  }

  function initDark() {
    document.documentElement.classList.toggle('dark', darkMode.value)
  }

  function notify(message, type = 'success', duration = 3500) {
    const id = Date.now()
    notifications.value.push({ id, message, type })
    setTimeout(() => dismiss(id), duration)
  }

  function dismiss(id) {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  function toggleSidebar() { sidebarOpen.value = !sidebarOpen.value }

  return { darkMode, sidebarOpen, notifications, toggleDark, initDark, notify, dismiss, toggleSidebar }
})
