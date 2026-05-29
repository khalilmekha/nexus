<template>
  <Teleport to="body">
    <div class="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="n in ui.notifications"
          :key="n.id"
          class="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-card-lg text-sm font-medium pointer-events-auto min-w-64 max-w-sm"
          :class="{
            'bg-surface-900 dark:bg-surface-800 text-white border border-surface-700': n.type === 'success',
            'bg-danger-500 text-white': n.type === 'error',
            'bg-warning-500 text-white': n.type === 'warning',
          }"
        >
          <CheckCircle2 v-if="n.type === 'success'" class="w-4 h-4 text-success-400 shrink-0" />
          <XCircle v-else-if="n.type === 'error'" class="w-4 h-4 shrink-0" />
          <AlertCircle v-else class="w-4 h-4 shrink-0" />
          <span class="flex-1">{{ n.message }}</span>
          <button @click="ui.dismiss(n.id)" class="opacity-60 hover:opacity-100 transition-opacity">
            <X class="w-3.5 h-3.5" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useUiStore } from '@/stores/ui'
import { CheckCircle2, XCircle, AlertCircle, X } from 'lucide-vue-next'
const ui = useUiStore()
</script>

<style scoped>
.toast-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.toast-leave-active { transition: all 0.2s ease; }
.toast-enter-from   { opacity: 0; transform: translateY(8px) scale(0.95); }
.toast-leave-to     { opacity: 0; transform: translateX(100%); }
</style>
