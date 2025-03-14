import { defineStore } from 'pinia'
import axios from 'axios'
import { ref, computed } from 'vue'
import router from '../router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))
  
  const isLoggedIn = ref(!!token.value)
  
  async function login(email, password) {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password
      })
      
      const { token: newToken, user: userData } = response.data
      
      token.value = newToken
      user.value = userData
      isLoggedIn.value = true
      
      localStorage.setItem('token', newToken)
      
      // 设置 axios 默认 headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || '登录失败'
      }
    }
  }
  
  async function register(userData) {
    const response = await axios.post('http://localhost:3000/api/auth/register', userData)
    return response.data
  }
  
  function logout() {
    token.value = null
    user.value = null
    isLoggedIn.value = false
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    router.push('/login')
  }
  
  // 如果有 token，设置 axios 默认 headers
  if (token.value) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }
  
  return {
    user,
    token,
    isLoggedIn,
    login,
    register,
    logout
  }
}) 