<template>
  <span class="badge" :class="classes">{{ label }}</span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ status: String })

const CONFIG = {
  active:       { label: 'Active',       cls: 'bg-success-500/10 text-success-600 dark:text-success-400' },
  inactive:     { label: 'Inactive',     cls: 'bg-surface-100 dark:bg-surface-700 text-surface-500' },
  delivered:    { label: 'Delivered',    cls: 'bg-success-500/10 text-success-600 dark:text-success-400' },
  shipped:      { label: 'Shipped',      cls: 'bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400' },
  processing:   { label: 'Processing',   cls: 'bg-warning-500/10 text-warning-600 dark:text-warning-400' },
  pending:      { label: 'Pending',      cls: 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400' },
  cancelled:    { label: 'Cancelled',    cls: 'bg-danger-500/10 text-danger-500' },
  refunded:     { label: 'Refunded',     cls: 'bg-accent-500/10 text-accent-500' },
  out_of_stock: { label: 'Out of Stock', cls: 'bg-danger-500/10 text-danger-500' },
  low_stock:    { label: 'Low Stock',    cls: 'bg-warning-500/10 text-warning-600 dark:text-warning-400' },
}

const cfg    = computed(() => CONFIG[props.status] || { label: props.status, cls: 'bg-surface-100 text-surface-500' })
const label  = computed(() => cfg.value.label)
const classes = computed(() => cfg.value.cls)
</script>
