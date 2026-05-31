<!--
  @file NotFoundPage.vue
  @description 简单 404 页面。
-->
<template>
  <div class="flex min-h-[60vh] flex-col items-center justify-center text-center">
    <h1 class="mb-2 text-2xl font-semibold tracking-tight">
      404
    </h1>
    <p class="mb-4 text-sm text-muted-foreground">
      抱歉，页面不存在或已被移动。
    </p>
    <RouterLink
      to="/"
      class="text-xs text-primary underline underline-offset-2"
    >
      返回首页
    </RouterLink>
  </div>
</template>
