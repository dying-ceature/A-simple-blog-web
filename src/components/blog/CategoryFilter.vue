<!--
  @file CategoryFilter.vue
  @description 文章分类筛选选择器组件。
-->
<script setup lang="ts">
import type { Category } from '../../services/blogStorage'

defineProps<{
  categories: Category[]
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <select
    :value="modelValue"
    @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    class="h-10 rounded-md border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
  >
    <option value="">全部分类</option>
    <option v-for="c in categories" :key="c.id" :value="c.id">
      {{ c.name }}
    </option>
  </select>
</template>
