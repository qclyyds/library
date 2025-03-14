<template>
  <div class="admin-layout">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div class="container">
        <RouterLink class="navbar-brand" to="/admin">管理后台</RouterLink>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminNavbar">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="adminNavbar">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <RouterLink class="nav-link" to="/admin/books">图书管理</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/admin/orders">订单管理</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/admin/users">用户管理</RouterLink>
            </li>
          </ul>
          <ul class="navbar-nav">
            <li class="nav-item">
              <RouterLink class="nav-link" to="/">返回前台</RouterLink>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" @click.prevent="logout">退出登录</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    
    <div class="container">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

async function logout() {
  await authStore.logout()
  router.push('/login')
}
</script> 