<!--
  @file Pagination.vue
  @description 简单分页组件。
-->
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  page: number
  pageSize: number
  total: number
}>()

const emit = defineEmits<{
  change: [page: number]
}>()

const pageCount = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))
const pages = computed(() => Array.from({ length: pageCount.value }, (_, i) => i + 1))
</script>

<template>
  <div v-if="pageCount > 1" class="mt-6 flex items-center justify-center gap-1 text-xs">
    <button
      type="button"
      class="rounded-md border bg-background px-2 py-1 text-muted-foreground disabled:opacity-40"
      :disabled="page === 1"
      @click="emit('change', page - 1)"
    >
      上一页
    </button>
    <button
      v-for="p in pages"
      :key="p"
      type="button"
      :class="[
        'rounded-md px-2 py-1',
        p === page
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted',
      ]"
      @click="emit('change', p)"
    >
      {{ p }}
    </button>
    <button
      type="button"
      class="rounded-md border bg-background px-2 py-1 text-muted-foreground disabled:opacity-40"
      :disabled="page === pageCount"
      @click="emit('change', page + 1)"
    >
      下一页
    </button>
  </div>
</template>
