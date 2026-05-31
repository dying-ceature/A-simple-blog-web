/**
 * @file router/index.ts
 * @description 应用路由配置，包含前台博客与后台管理的路由，基于登录状态动态控制后台路由。
 */

import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../layouts/FrontLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../pages/front/HomePage.vue'),
        },
        {
          path: 'posts/:id',
          name: 'post-detail',
          component: () => import('../pages/front/PostDetailPage.vue'),
        },
      ],
    },
    {
      path: '/admin/login',
      name: 'login',
      component: () => import('../pages/admin/LoginPage.vue'),
    },
    {
      path: '/admin',
      component: () => import('../layouts/AdminLayout.vue'),
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('../pages/admin/DashboardPage.vue'),
        },
        {
          path: 'posts',
          name: 'posts-manage',
          component: () => import('../pages/admin/PostsManagePage.vue'),
        },
        {
          path: 'posts/new',
          name: 'post-new',
          component: () => import('../pages/admin/PostEditPage.vue'),
        },
        {
          path: 'posts/:id',
          name: 'post-edit',
          component: () => import('../pages/admin/PostEditPage.vue'),
        },
        {
          path: 'categories',
          name: 'categories-manage',
          component: () => import('../pages/admin/CategoriesManagePage.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../pages/NotFoundPage.vue'),
    },
  ],
})

// 路由守卫：未登录时重定向到登录页
router.beforeEach((to, _from, next) => {
  if (to.path.startsWith('/admin') && to.path !== '/admin/login') {
    const authStore = useAuthStore()
    authStore.initFromStorage()
    if (!authStore.isAuthenticated) {
      return next({ path: '/admin/login', query: { from: to.fullPath } })
    }
  }
  next()
})

export default router
