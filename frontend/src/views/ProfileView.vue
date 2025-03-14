<template>
  <div class="profile">
    <div class="profile-container">
      <div class="profile-box">
        <h2 class="profile-title">个人中心</h2>
        
        <div class="user-info" v-if="authStore.user">
          <div class="avatar-section">
            <div class="avatar">
              {{ authStore.user.username.charAt(0).toUpperCase() }}
            </div>
            <span class="role-badge" :class="{'is-admin': authStore.user.role === 'admin'}">
              {{ authStore.user.role === 'admin' ? '管理员' : '普通用户' }}
            </span>
          </div>
          
          <div class="info-section">
            <div class="info-item">
              <label>用户名</label>
              <span>{{ authStore.user.username }}</span>
            </div>
            
            <div class="info-item">
              <label>邮箱</label>
              <span>{{ authStore.user.email }}</span>
            </div>
            
            <div class="info-item">
              <label>注册时间</label>
              <span>{{ formatDate(authStore.user.created_at) }}</span>
            </div>
          </div>
          
          <div class="action-section">
            <button 
              class="logout-btn"
              @click="handleLogout"
            >
              退出登录
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

async function handleLogout() {
  if (confirm('确定要退出登录吗？')) {
    authStore.logout()
    router.push('/login')
  }
}
</script>

<style scoped>
.profile {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  padding: 20px;
}

.profile-container {
  width: 100%;
  max-width: 480px;
}

.profile-box {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.profile-title {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
  font-size: 24px;
  font-weight: 600;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

.avatar-section {
  text-align: center;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #409eff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 15px;
}

.role-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  background-color: #95a5a6;
  color: white;
  font-size: 14px;
  font-weight: 500;
}

.role-badge.is-admin {
  background-color: #e74c3c;
}

.info-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item label {
  color: #7f8c8d;
  font-size: 14px;
}

.info-item span {
  color: #2c3e50;
  font-size: 16px;
  font-weight: 500;
}

.action-section {
  width: 100%;
  display: flex;
  justify-content: center;
}

.logout-btn {
  padding: 10px 24px;
  background-color: #f56c6c;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.logout-btn:hover {
  background-color: #f78989;
}

@media (max-width: 480px) {
  .profile-box {
    padding: 30px 20px;
  }
  
  .profile-title {
    font-size: 20px;
    margin-bottom: 20px;
  }
  
  .avatar {
    width: 60px;
    height: 60px;
    font-size: 24px;
  }
}
</style> 