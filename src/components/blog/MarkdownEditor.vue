<!--
  @file MarkdownEditor.vue
  @description Markdown 编辑 + 预览组件，模拟 md-editor-v3 的基础行为。
-->
<script setup lang="ts">
import MarkdownViewer from './MarkdownViewer.vue'

defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="flex flex-col gap-3 md:flex-row">
    <div class="flex-1">
      <div class="mb-1 flex items-center justify-between text-xs text-muted-foreground">
        <span>Markdown 编辑</span>
        <span>支持标题 / 列表 / 代码块等基础语法</span>
      </div>
      <textarea
        :value="modelValue"
        @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
        class="h-64 w-full resize-y rounded-md border bg-background p-2 text-xs outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
        placeholder="# 在这里输入 Markdown 内容…"
      />
    </div>
    <div class="flex-1 rounded-md border bg-card/60 p-3">
      <div class="mb-1 text-xs text-muted-foreground">实时预览</div>
      <MarkdownViewer :content="modelValue" />
    </div>
  </div>
</template>
