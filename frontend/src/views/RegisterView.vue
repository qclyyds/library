<template>
  <div class="register row justify-content-center">
    <div class="col-12 col-xl-11">
      <div class="card">
        <div class="card-header">注册</div>
        <div class="card-body">
          <div v-if="error" class="alert alert-danger">
            {{ error }}
          </div>
          
          <div v-if="success" class="alert alert-success">
            {{ success }}
          </div>
          
          <form @submit.prevent="handleRegister" class="register-form">
            <div class="mb-4">
              <label for="username" class="form-label">用户名</label>
              <input 
                type="text" 
                class="form-control form-control-lg" 
                id="username" 
                v-model="username" 
                required
                placeholder="请设置您的用户名"
              >
            </div>
            
            <div class="mb-4">
              <label for="email" class="form-label">邮箱</label>
              <input 
                type="email" 
                class="form-control form-control-lg" 
                id="email" 
                v-model="email" 
                required
                placeholder="请输入您的邮箱"
              >
            </div>
            
            <div class="mb-4">
              <label for="password" class="form-label">密码</label>
              <input 
                type="password" 
                class="form-control form-control-lg" 
                id="password" 
                v-model="password" 
                required
                placeholder="请设置您的密码"
              >
            </div>
            
            <div class="mb-4">
              <label for="confirm-password" class="form-label">确认密码</label>
              <input 
                type="password" 
                class="form-control form-control-lg" 
                id="confirm-password" 
                v-model="confirmPassword" 
                required
                placeholder="请再次输入密码"
              >
            </div>
            
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-center mt-5">
              <button type="submit" class="btn btn-primary btn-lg mb-3 mb-md-0 px-5" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                注册
              </button>
              <RouterLink to="/login" class="text-center fs-5">已有账号？去登录</RouterLink>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

async function handleRegister() {
  loading.value = true
  error.value = ''
  success.value = ''
  
  if (password.value !== confirmPassword.value) {
    error.value = '两次输入的密码不一致'
    loading.value = false
    return
  }
  
  try {
    const result = await authStore.register(username.value, email.value, password.value)
    
    if (result.success) {
      success.value = '注册成功，请登录'
      username.value = ''
      email.value = ''
      password.value = ''
      confirmPassword.value = ''
    } else {
      error.value = result.message
    }
  } catch (err) {
    error.value = '注册失败，请稍后重试'
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.card {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  border: none;
  margin: 2rem auto;
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  padding: 1.25rem 2rem;
  font-size: 1.5rem;
  font-weight: 500;
}

.card-body {
  padding: 2.5rem;
}

.register-form {
  max-width: 800px;
  margin: 0 auto;
}

.form-label {
  font-size: 1.1rem;
  font-weight: 500;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .card-body {
    padding: 1.5rem;
  }
  
  .card-header {
    padding: 1rem 1.5rem;
  }
}
</style> 