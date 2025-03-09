<template>
  <div class="login row justify-content-center">
    <div class="col-12 col-xl-11">
      <div class="card">
        <div class="card-header">登录</div>
        <div class="card-body">
          <div v-if="error" class="alert alert-danger">
            {{ error }}
          </div>
          
          <form @submit.prevent="handleLogin" class="login-form">
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
                placeholder="请输入您的密码"
              >
            </div>
            
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-center mt-5">
              <button type="submit" class="btn btn-primary btn-lg mb-3 mb-md-0 px-5" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                登录
              </button>
              <RouterLink to="/register" class="text-center fs-5">没有账号？去注册</RouterLink>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''
  
  try {
    const result = await authStore.login(email.value, password.value)
    
    if (result.success) {
      router.push('/')
    } else {
      error.value = result.message
    }
  } catch (err) {
    error.value = '登录失败，请稍后重试'
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

.login-form {
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