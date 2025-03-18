<template>
  <div class="login-page">
    <div class="login-box">
      <div class="login-left">
        <div class="illustration-container">
          <img src="D:\demo\library\frontend\src\assets\images\sign.png" alt="图书馆插图" class="illustration">
        </div>
      </div>
      
      <div class="login-right">
        <div class="login-header">
          <h3 class="login-title-en">User Login</h3>
          <h2 class="login-title">欢迎登录<br>图书馆管理系统</h2>
        </div>
        
        <form @submit.prevent="handleSubmit" class="login-form">
          <div class="form-group">
            <div class="input-with-icon">
              <i class="bi bi-person"></i>
              <input
                type="text"
                id="username"
                v-model="username"
                class="form-control"
                placeholder="用户名或邮箱"
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
                v-model="password"
                class="form-control"
                placeholder="密码"
                required
              >
            </div>
          </div>
          
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
          
          <div class="form-group">
            <button 
              type="submit" 
              class="login-btn"
              :disabled="loading"
            >
              {{ loading ? '登录中...' : '立即登录' }}
            </button>
          </div>
        </form>
        
        <div class="register-link">
          还没有账号？ <RouterLink to="/register">去注册</RouterLink>
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

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref(null)

async function handleSubmit() {
  loading.value = true
  error.value = null
  
  try {
    await authStore.login(username.value, password.value)
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.message || '登录失败，请检查用户名和密码'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
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

.login-box {
  display: flex;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
  max-width: 920px;
  margin: 20px;
}

.login-left {
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

.login-right {
  width: 495px;
  padding: 50px 40px;
}

.login-header {
  margin-bottom: 40px;
}

.login-title-en {
  color: #6c757d;
  font-weight: normal;
  margin-bottom: 10px;
  font-size: 18px;
}

.login-title {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
}

.login-form {
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

.login-btn {
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

.login-btn:hover {
  background-color: #1976d2;
}

.login-btn:disabled {
  background-color: #90caf9;
  cursor: not-allowed;
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin: 10px 0;
  text-align: center;
}

.register-link {
  text-align: center;
  font-size: 14px;
  color: #6c757d;
  margin-top: 20px;
}

.register-link a {
  color: #2196f3;
  text-decoration: none;
  font-weight: 500;
}

.register-link a:hover {
  text-decoration: underline;
}

@media (max-width: 900px) {
  .login-box {
    flex-direction: column;
    max-width: 500px;
    margin: 0 auto;
  }
  
  .login-left, .login-right {
    width: 100%;
  }
  
  .login-left {
    padding: 30px;
    justify-content: center;
  }
  
  .illustration {
    margin-top: 60px;
    max-width: 200px;
  }
  
  .login-right {
    padding: 30px;
  }
}

@media (max-width: 480px) {
  .login-left {
    display: none;
  }
  
  .login-right {
    padding: 40px 20px;
  }
}
</style> 