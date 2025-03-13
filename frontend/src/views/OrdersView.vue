<template>
  <div class="orders">
    <h1 class="mb-4">我的订单</h1>
    
    <div v-if="orderStore.loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">加载中...</span>
      </div>
    </div>
    
    <div v-else-if="orderStore.error" class="alert alert-danger">
      {{ orderStore.error }}
    </div>
    
    <div v-else-if="orderStore.orders.length === 0" class="alert alert-info">
      您还没有任何订单，<RouterLink to="/library">去图书馆看看</RouterLink>
    </div>
    
    <div v-else class="order-list">
      <div v-for="order in orderStore.orders" :key="order.id" class="card mb-4">
        <div class="card-header">
          <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
            <div class="mb-2 mb-md-0">
              <span class="fw-bold">订单号: {{ order.id }}</span>
              <span class="d-block d-md-inline ms-md-3 text-muted">{{ formatDate(order.orderDate) }}</span>
            </div>
            <div>
              <span class="fs-5 text-primary me-3">¥{{ order.totalPrice }}</span>
              <button 
                class="btn btn-danger btn-sm"
                @click="cancelOrder(order.id)"
                :disabled="orderStore.cancelling === order.id"
              >
                {{ orderStore.cancelling === order.id ? '删除中...' : '删除订单' }}
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
                </div>
                <span>¥{{ item.price }}</span>
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
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

async function cancelOrder(orderId) {
  if (confirm('确定要删除这个订单吗？删除后将无法恢复！')) {
    await orderStore.cancelOrder(orderId)
  }
}
</script> 