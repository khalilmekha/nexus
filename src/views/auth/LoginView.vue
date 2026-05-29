<template>
  <div class="min-h-screen bg-surface-950 flex items-center justify-center px-4 relative overflow-hidden">
    <!-- Background grid -->
    <div class="absolute inset-0 opacity-[0.03] pointer-events-none" style="background-image: linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px); background-size: 40px 40px;" />
    <!-- Glow blobs -->
    <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />
    <div class="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

    <div class="relative z-10 w-full max-w-md animate-slide-up">
      <!-- Card -->
      <div class="bg-surface-900 border border-surface-700 rounded-3xl p-8 shadow-card-lg">
        <!-- Logo -->
        <div class="flex items-center gap-3 mb-8">
          <div class="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center shadow-glow">
            <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <div>
            <h1 class="text-lg font-bold text-white tracking-tight">Nexus Admin</h1>
            <p class="text-xs text-surface-400">E-Commerce Platform</p>
          </div>
        </div>

        <h2 class="text-2xl font-bold text-white mb-1">Welcome back</h2>
        <p class="text-surface-400 text-sm mb-8">Sign in to your admin account</p>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-surface-300 mb-1.5">Email</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="aria@nexus.io"
              class="input bg-surface-800 border-surface-600 text-white placeholder-surface-500"
              required
              autocomplete="email"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-surface-300 mb-1.5">Password</label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPw ? 'text' : 'password'"
                placeholder="••••••••"
                class="input bg-surface-800 border-surface-600 text-white placeholder-surface-500 pr-10"
                required
                autocomplete="current-password"
              />
              <button type="button" @click="showPw = !showPw" class="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-200">
                <Eye v-if="!showPw" class="w-4 h-4" />
                <EyeOff v-else class="w-4 h-4" />
              </button>
            </div>
          </div>

          <div v-if="error" class="flex items-center gap-2 text-danger-400 text-sm bg-danger-500/10 rounded-xl p-3">
            <AlertCircle class="w-4 h-4 shrink-0" />
            {{ error }}
          </div>

          <button type="submit" class="btn-primary w-full justify-center py-3 mt-2" :disabled="loading">
            <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
            <span>{{ loading ? 'Signing in…' : 'Sign in' }}</span>
          </button>
        </form>

        <!-- Demo accounts -->
        <div class="mt-6 p-4 bg-surface-800/60 rounded-2xl border border-surface-700">
          <p class="text-xs font-semibold text-surface-400 mb-3">Demo accounts</p>
          <div class="space-y-2">
            <button
              v-for="demo in demoAccounts"
              :key="demo.email"
              @click="fillDemo(demo)"
              class="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-700 transition-colors text-left"
            >
              <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
                {{ demo.avatar }}
              </div>
              <div>
                <p class="text-xs font-semibold text-surface-200">{{ demo.name }}</p>
                <p class="text-xs text-surface-500">{{ demo.email }}</p>
              </div>
              <span class="ml-auto badge" :class="demo.role === 'admin' ? 'bg-primary-900/60 text-primary-400' : 'bg-surface-700 text-surface-400'">
                {{ demo.role }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { AlertCircle, Loader2, Eye, EyeOff } from 'lucide-vue-next'

const auth   = useAuthStore()
const router = useRouter()

const form     = ref({ email: '', password: '' })
const showPw   = ref(false)
const loading  = ref(false)
const error    = ref('')

const demoAccounts = [
  { name: 'Aria Chen',   email: 'aria@nexus.io',    avatar: 'AC', role: 'admin' },
  { name: 'Marcus Webb', email: 'marcus@example.com', avatar: 'MW', role: 'user' },
]

function fillDemo(demo) {
  form.value.email    = demo.email
  form.value.password = 'demo123'
}

async function handleLogin() {
  error.value   = ''
  loading.value = true
  try {
    await auth.login(form.value.email, form.value.password)
    router.push('/dashboard')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
