<template>
  <div class="register-page">
    <div class="register-box">
      <div class="register-left">
        <div class="illustration-container">
          <img src="D:\demo\library\frontend\src\assets\images\login.png" alt="图书馆插图" class="illustration">
        </div>
      </div>
      
      <div class="register-right">
        <div class="register-header">
          <h3 class="register-title-en">User Register</h3>
          <h2 class="register-title">欢迎注册<br>图书馆管理系统</h2>
        </div>
        
        <form @submit.prevent="handleSubmit" class="register-form">
          <div class="form-group">
            <div class="input-with-icon">
              <i class="bi bi-person"></i>
              <input
                type="text"
                id="username"
                v-model="formData.username"
                class="form-control"
                placeholder="用户名"
                required
              >
            </div>
          </div>
          
          <div class="form-group">
            <div class="input-with-icon">
              <i class="bi bi-envelope"></i>
              <input
                type="email"
                id="email"
                v-model="formData.email"
                class="form-control"
                placeholder="邮箱"
                required
              >
            </div>
          </div>
          
          <div class="form-group">
            <div class="input-with-icon">
              <i class="bi bi-lock"></i>
              <input
                type="password"
                id="password"
                v-model="formData.password"
                class="form-control"
                placeholder="密码"
                required
              >
            </div>
          </div>
          
          <div class="form-group">
            <div class="input-with-icon">
              <i class="bi bi-lock-fill"></i>
              <input
                type="password"
                id="confirmPassword"
                v-model="formData.confirmPassword"
                class="form-control"
                placeholder="确认密码"
                required
              >
            </div>
          </div>

          <div class="role-selector">
            <label class="role-label">账户类型：</label>
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
          
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
          
          <div class="form-group">
            <button 
              type="submit" 
              class="register-btn"
              :disabled="loading"
            >
              {{ loading ? '注册中...' : '立即注册' }}
            </button>
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
.register-page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #2196f3 0%, #2196f3 40%, #1976d2 100%);
  margin: 0;
  padding: 0;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-x: hidden;
}

.register-box {
  display: flex;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
  max-width: 920px;
  margin: 20px;
}

.register-left {
  width: 425px;
  background: #f8f9fa;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.illustration-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.illustration {
  width: 100%;
  max-width: 300px;
  height: auto;
  object-fit: contain;
}

.register-right {
  width: 495px;
  padding: 50px 40px;
}

.register-header {
  margin-bottom: 40px;
}

.register-title-en {
  color: #6c757d;
  font-weight: normal;
  margin-bottom: 10px;
  font-size: 18px;
}

.register-title {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
}

.register-form {
  margin-bottom: 25px;
}

.form-group {
  margin-bottom: 20px;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
  background-color: #f5f8fb;
  border-radius: 10px;
  overflow: hidden;
}

.input-with-icon i {
  position: absolute;
  left: 15px;
  color: #adb5bd;
  font-size: 18px;
}

.form-control {
  width: 100%;
  padding: 15px 15px 15px 45px;
  border: none;
  background-color: transparent;
  font-size: 15px;
  color: #495057;
}

.form-control:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.25);
}

.form-control::placeholder {
  color: #adb5bd;
}

.role-selector {
  margin: 25px 0;
}

.role-label {
  display: inline-block;
  color: #495057;
  font-weight: 500;
  margin-bottom: 8px;
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
  color: #495057;
}

.register-btn {
  width: 100%;
  padding: 15px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.register-btn:hover {
  background-color: #1976d2;
}

.register-btn:disabled {
  background-color: #90caf9;
  cursor: not-allowed;
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin: 10px 0;
  text-align: center;
}

.login-link {
  text-align: center;
  font-size: 14px;
  color: #6c757d;
  margin-top: 20px;
}

.login-link a {
  color: #2196f3;
  text-decoration: none;
  font-weight: 500;
}

.login-link a:hover {
  text-decoration: underline;
}

@media (max-width: 900px) {
  .register-box {
    flex-direction: column;
    max-width: 500px;
    margin: 0 auto;
  }
  
  .register-left, .register-right {
    width: 100%;
  }
  
  .register-left {
    padding: 30px;
    justify-content: center;
  }
  
  .illustration {
    margin-top: 60px;
    max-width: 200px;
  }
  
  .register-right {
    padding: 30px;
  }
}

@media (max-width: 480px) {
  .register-left {
    display: none;
  }
  
  .register-right {
    padding: 40px 20px;
  }
}
</style> 