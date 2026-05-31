<!--
  @file SearchBar.vue
  @description 文章搜索输入组件。
-->
<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: []
}>()
</script>

<template>
  <div class="flex gap-2">
    <input
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @keyup.enter="emit('search')"
      placeholder="搜索标题或内容关键字…"
      class="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
    />
    <button
      type="button"
      class="rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      @click="emit('search')"
    >
      搜索
    </button>
  </div>
</template>
