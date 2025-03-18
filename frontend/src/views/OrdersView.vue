<template>
  <div class="orders">
    <h1 class="mb-4">我的借阅记录</h1>
    
    <div v-if="orderStore.loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">加载中...</span>
      </div>
    </div>
    
    <div v-else-if="orderStore.error" class="alert alert-danger">
      {{ orderStore.error }}
    </div>
    
    <div v-else-if="orderStore.orders.length === 0" class="alert alert-info">
      您还没有任何借阅记录，<RouterLink to="/library">去图书馆看看</RouterLink>
    </div>
    
    <div v-else class="order-list">
      <div v-for="order in orderStore.orders" :key="order.id" class="card mb-4">
        <div class="card-header">
          <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
            <div class="mb-2 mb-md-0">
              <span class="fw-bold">借阅编号: {{ order.id }}</span>
              <span class="d-block d-md-inline ms-md-3 text-muted">借阅日期: {{ formatDate(order.orderDate) }}</span>
              <span class="d-block d-md-inline ms-md-3 text-muted">应还日期: {{ formatDate(order.dueDate) }}</span>
              <span v-if="order.returnDate" class="d-block d-md-inline ms-md-3 text-success">归还日期: {{ formatDate(order.returnDate) }}</span>
              <span v-if="order.cancelDate" class="d-block d-md-inline ms-md-3 text-danger">取消日期: {{ formatDate(order.cancelDate) }}</span>
            </div>
            <div>
              <span class="badge" :class="getStatusClass(order)">{{ order.status }}</span>
              <button 
                v-if="!order.returnDate && !order.cancelDate"
                class="btn btn-primary btn-sm ms-2"
                @click="cancelOrder(order.id)"
                :disabled="orderStore.cancelling === order.id"
              >
                {{ orderStore.cancelling === order.id ? '处理中...' : '归还图书' }}
              </button>
            </div>
          </div>
        </div>
        
        <div class="table-responsive">
          <ul class="list-group list-group-flush">
            <li v-for="item in order.items" :key="item.bookId" class="list-group-item">
              <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                <div class="mb-2 mb-md-0">
                  <RouterLink :to="`/book/${item.bookId}`">{{ item.title }}</RouterLink>
                  <span class="text-muted d-block d-md-inline ms-md-2">- {{ item.author }}</span>
                  <span class="text-muted d-block d-md-inline ms-md-2">ISBN: {{ item.isbn || '暂无' }}</span>
                  <span class="text-muted d-block d-md-inline ms-md-2">位置: {{ item.location || '暂无' }}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useOrderStore } from '../stores/order'

const orderStore = useOrderStore()

onMounted(() => {
  orderStore.fetchUserOrders()
})

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

function getStatusClass(order) {
  switch (order.status) {
    case '已归还':
      return 'bg-success'
    case '已取消':
      return 'bg-secondary'
    case '已逾期':
      return 'bg-danger'
    case '借阅中':
      return 'bg-primary'
    default:
      return 'bg-secondary'
  }
}

async function cancelOrder(orderId) {
  if (confirm('确定要归还这本书吗？')) {
    await orderStore.cancelOrder(orderId)
  }
}
</script>

<style scoped>
.badge {
  font-size: 0.9rem;
  padding: 0.5em 0.8em;
}
</style> 