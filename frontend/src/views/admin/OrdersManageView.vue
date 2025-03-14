<template>
  <div class="orders-manage">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>订单管理</h2>
    </div>

    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>订单号</th>
            <th>用户ID</th>
            <th>下单时间</th>
            <th>总金额</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ order.user_id }}</td>
            <td>{{ formatDate(order.order_date) }}</td>
            <td>¥{{ order.total_price }}</td>
            <td>
              <button class="btn btn-sm btn-info me-2" @click="viewOrderDetails(order)">
                查看详情
              </button>
              <button class="btn btn-sm btn-danger" @click="deleteOrder(order.id)">
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const orders = ref([])
const loading = ref(false)
const error = ref(null)

// 获取所有订单
async function fetchOrders() {
  loading.value = true
  error.value = null
  
  try {
    const response = await axios.get('http://localhost:3000/api/admin/orders')
    orders.value = response.data
  } catch (err) {
    error.value = '获取订单列表失败'
    console.error(err)
  } finally {
    loading.value = false
  }
}

// 删除订单
async function deleteOrder(orderId) {
  if (!confirm('确定要删除这个订单吗？')) return
  
  try {
    await axios.delete(`http://localhost:3000/api/admin/orders/${orderId}`)
    await fetchOrders()
  } catch (err) {
    alert('删除订单失败：' + (err.response?.data?.message || err.message))
  }
}

// 格式化日期
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

onMounted(() => {
  fetchOrders()
})
</script> 