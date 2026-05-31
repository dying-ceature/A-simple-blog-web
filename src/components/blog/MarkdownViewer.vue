<!--
  @file MarkdownViewer.vue
  @description 简单 Markdown 预览组件，基于极简规则将 Markdown 文本转换为 HTML。
-->
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  content: string
}>()

/**
 * @description 简单的 Markdown 转 HTML 逻辑，仅支持标题、粗体、行内代码与换行等基础语法。
 */
function markdownToHtml(markdown: string): string {
  let html = markdown

  // 代码块
  html = html.replace(/```([\s\S]*?)```/g, (_match, p1) => {
    const escaped = p1.replace(/</g, '&lt;').replace(/>/g, '&gt;')
    return `<pre class="rounded-md bg-muted p-3 text-xs overflow-auto"><code>${escaped}</code></pre>`
  })

  // 标题
  html = html.replace(/^### (.*$)/gim, '<h3 class="mt-3 text-sm font-semibold">$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2 class="mt-4 text-base font-semibold">$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1 class="mt-4 text-lg font-bold">$1</h1>')

  // 粗体
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

  // 斜体
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')

  // 行内代码
  html = html.replace(/`([^`]+)`/g, '<code class="rounded bg-muted px-1 text-xs">$1</code>')

  // 列表
  html = html.replace(/^- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
  html = html.replace(/(<li[\s\S]*?<\/li>)/gim, '<ul class="my-2">$1</ul>')

  // 换行
  html = html.replace(/\n/g, '<br />')

  return html.trim()
}

const html = computed(() => markdownToHtml(props.content || ''))
</script>

<template>
  <div
    class="prose prose-sm max-w-none dark:prose-invert"
    v-html="html"
  />
</template>
