import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue'

export const useOrderStore = defineStore('order', () => {
  const orders = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  async function fetchUserOrders() {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.get('http://localhost:3000/api/orders')
      orders.value = response.data
    } catch (err) {
      error.value = '获取订单失败'
      console.error(err)
    } finally {
      loading.value = false
    }
  }
  
  async function createOrder(items) {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.post('http://localhost:3000/api/orders', { items })
      await fetchUserOrders()
      return { success: true, orderId: response.data.orderId }
    } catch (err) {
      error.value = '创建订单失败'
      console.error(err)
      return { success: false, message: err.response?.data?.message || '创建订单失败' }
    } finally {
      loading.value = false
    }
  }
  
  return { orders, loading, error, fetchUserOrders, createOrder }
}) 