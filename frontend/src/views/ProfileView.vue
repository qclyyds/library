<template>
  <div class="profile">
    <h1 class="mb-4">个人中心</h1>
    
    <div v-if="!authStore.isLoggedIn" class="alert alert-warning">
      您尚未登录，<RouterLink to="/login">去登录</RouterLink>
    </div>
    
    <div v-else class="row">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">个人信息</div>
          <div class="card-body">
            <p><strong>用户名：</strong> {{ authStore.user.username }}</p>
            <p><strong>邮箱：</strong> {{ authStore.user.email }}</p>
            <button class="btn btn-danger" @click="logout">退出登录</button>
          </div>
        </div>
      </div>
      
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">快速导航</div>
          <div class="card-body">
            <div class="list-group">
              <RouterLink to="/library" class="list-group-item list-group-item-action">
                浏览图书
              </RouterLink>
              <RouterLink to="/orders" class="list-group-item list-group-item-action">
                我的订单
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

function logout() {
  authStore.logout()
}
</script> 