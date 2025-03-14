<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
const router = useRouter()

function logout() {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <header class="fixed-top">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <RouterLink class="navbar-brand fs-4" to="/">图书馆管理系统</RouterLink>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <RouterLink class="nav-link fs-5 mx-2" to="/">首页</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link fs-5 mx-2" to="/library">图书馆</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link fs-5 mx-2" to="/orders">订单</RouterLink>
            </li>
          </ul>
          <ul class="navbar-nav">
            <template v-if="authStore.isLoggedIn && authStore.user">
              <li class="nav-item">
                <RouterLink class="nav-link fs-5 mx-2" to="/profile">
                  {{ authStore.user.username }}的个人中心
                </RouterLink>
              </li>
              <li class="nav-item">
                <a class="nav-link fs-5 mx-2" href="#" @click.prevent="logout">退出登录</a>
              </li>
            </template>
            <template v-else>
              <li class="nav-item">
                <RouterLink class="nav-link fs-5 mx-2" to="/login">登录</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link fs-5 mx-2" to="/register">注册</RouterLink>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </nav>
  </header>

  <main class="container mt-navbar">
    <RouterView />
  </main>
</template>

<style>
/* 重置样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  background-color: #f8f9fa;
  min-height: 100vh;
}

/* 导航栏高度变量 */
:root {
  --navbar-height: 56px;
}

/* 为主内容区域添加足够的顶部边距，防止被导航栏覆盖 */
.mt-navbar {
  margin-top: calc(var(--navbar-height) + 1.5rem);
  padding-bottom: 2rem;
}

/* 小屏幕上减少边距 */
@media (max-width: 768px) {
  .mt-navbar {
    margin-top: calc(var(--navbar-height) + 1rem);
  }
}

/* 导航栏样式 */
.navbar {
  height: var(--navbar-height);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 响应式调整 */
@media (max-width: 991px) {
  .navbar-collapse {
    background-color: #0d6efd;
    padding: 1rem;
    border-radius: 0 0 0.25rem 0.25rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
}

/* 页面容器样式 */
.container {
  max-width: 1140px;
}

/* 卡片样式 */
.card {
  border-radius: 0.25rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

/* 响应式字体大小 */
@media (max-width: 768px) {
  h1 {
    font-size: 1.75rem;
  }
  
  h2 {
    font-size: 1.5rem;
  }
  
  h3 {
    font-size: 1.3rem;
  }
  
  .card-body {
    padding: 1rem;
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>

