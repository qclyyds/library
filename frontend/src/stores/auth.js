import { defineStore } from 'pinia'
import axios from 'axios'
import { ref, computed } from 'vue'
import router from '../router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const token = ref(localStorage.getItem('token') || '')
  
  const isLoggedIn = computed(() => !!token.value)
  
  async function login(email, password) {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password
      })
      
      const userData = response.data
      
      user.value = userData.user
      token.value = userData.token
      
      localStorage.setItem('user', JSON.stringify(userData.user))
      localStorage.setItem('token', userData.token)
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || '登录失败，请稍后重试'
      }
    }
  }
  
  async function register(username, email, password) {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', {
        username,
        email,
        password
      })
      
      return { success: true, message: response.data.message }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || '注册失败，请稍后重试'
      }
    }
  }
  
  function logout() {
    user.value = null
    token.value = ''
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    router.push('/login')
  }
  
  // 初始化请求头
  if (token.value) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }
  
  return { user, isLoggedIn, login, register, logout }
}) 