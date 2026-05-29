<template>
  <RouterView />
  <NotificationStack />
</template>

<script setup>
import { onMounted } from 'vue'
import { useUiStore } from '@/stores/ui'
import NotificationStack from '@/components/common/NotificationStack.vue'

const ui = useUiStore()
onMounted(() => ui.initDark())
</script>
