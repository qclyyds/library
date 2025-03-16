<template>
  <div class="register">
    <div class="register-container">
      <div class="register-box">
        <h2 class="register-title">注册</h2>
        
        <form @submit.prevent="handleSubmit" class="register-form">
          <div class="form-group">
            <label for="username">用户名</label>
            <input
              type="text"
              id="username"
              v-model="formData.username"
              class="form-control"
              placeholder="请输入用户名"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="email">邮箱</label>
            <input
              type="email"
              id="email"
              v-model="formData.email"
              class="form-control"
              placeholder="请输入邮箱"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="password">密码</label>
            <input
              type="password"
              id="password"
              v-model="formData.password"
              class="form-control"
              placeholder="请输入密码"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">确认密码</label>
            <input
              type="password"
              id="confirmPassword"
              v-model="formData.confirmPassword"
              class="form-control"
              placeholder="请再次输入密码"
              required
            >
          </div>

          <div class="form-group">
            <label>账户类型</label>
            <div class="role-options">
              <label class="role-option">
                <input
                  type="radio"
                  name="role"
                  value="user"
                  v-model="formData.role"
                >
                <span class="role-text">普通用户</span>
              </label>
              <label class="role-option">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  v-model="formData.role"
                >
                <span class="role-text">管理员</span>
              </label>
            </div>
          </div>
          
          <div class="form-group">
            <button 
              type="submit" 
              class="submit-btn"
              :disabled="loading"
            >
              {{ loading ? '注册中...' : '注册' }}
            </button>
          </div>
          
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
        </form>
        
        <div class="login-link">
          已有账号？ <RouterLink to="/login">去登录</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const formData = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'user'
})

const loading = ref(false)
const error = ref(null)

async function handleSubmit() {
  if (formData.value.password !== formData.value.confirmPassword) {
    error.value = '两次输入的密码不一致'
    return
  }
  
  loading.value = true
  error.value = null
  
  try {
    await authStore.register({
      username: formData.value.username,
      email: formData.value.email,
      password: formData.value.password,
      role: formData.value.role
    })
    router.push('/login')
  } catch (err) {
    error.value = err.response?.data?.message || '注册失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  padding: 20px;
}

.register-container {
  width: 100%;
  max-width: 420px;
}

.register-box {
  background: white;
  padding: 60px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.register-title {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
  font-size: 24px;
  font-weight: 600;
}

.register-form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #2c3e50;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s;
}

.form-control:focus {
  border-color: #409eff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.role-options {
  display: flex;
  gap: 20px;
}

.role-option {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.role-option input[type="radio"] {
  margin-right: 8px;
}

.role-text {
  color: #2c3e50;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.submit-btn:hover {
  background-color: #66b1ff;
}

.submit-btn:disabled {
  background-color: #a0cfff;
  cursor: not-allowed;
}

.error-message {
  color: #f56c6c;
  font-size: 14px;
  margin-top: 8px;
  text-align: center;
}

.login-link {
  text-align: center;
  font-size: 14px;
  color: #606266;
}

.login-link a {
  color: #409eff;
  text-decoration: none;
}

.login-link a:hover {
  color: #66b1ff;
}

@media (max-width: 480px) {
  .register-box {
    padding: 30px 20px;
  }
  
  .register-title {
    font-size: 20px;
    margin-bottom: 20px;
  }
}
</style> 