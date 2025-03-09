<template>
  <div class="book-detail">
    <div v-if="bookStore.loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">加载中...</span>
      </div>
    </div>
    
    <div v-else-if="bookStore.error" class="alert alert-danger">
      {{ bookStore.error }}
    </div>
    
    <div v-else-if="!bookStore.currentBook" class="alert alert-warning">
      未找到该图书
    </div>
    
    <div v-else class="row">
      <div class="col-md-4 mb-4 mb-md-0 text-center">
        <img src="https://via.placeholder.com/300x400" alt="Book Cover" class="img-fluid rounded shadow-sm" style="max-height: 400px;">
      </div>
      
      <div class="col-md-8">
        <h1 class="mb-3 h2 h1-md">{{ bookStore.currentBook.title }}</h1>
        <h5 class="text-muted mb-3">{{ bookStore.currentBook.author }}</h5>
        
        <div class="mb-3">
          <span class="badge bg-primary me-2">{{ bookStore.currentBook.category }}</span>
          <span v-if="bookStore.currentBook.stock > 0" class="badge bg-success">有库存</span>
          <span v-else class="badge bg-danger">无库存</span>
        </div>
        
        <p class="fs-4 fw-bold text-primary mb-3">¥{{ bookStore.currentBook.price }}</p>
        
        <p class="mb-4">{{ bookStore.currentBook.description }}</p>
        
        <div class="d-flex flex-wrap gap-2">
          <button 
            class="btn btn-primary flex-grow-1 flex-md-grow-0" 
            :disabled="!authStore.isLoggedIn || bookStore.currentBook.stock <= 0"
            @click="purchaseBook"
          >
            {{ authStore.isLoggedIn ? '购买' : '请先登录' }}
          </button>
          <button class="btn btn-outline-secondary flex-grow-1 flex-md-grow-0" @click="goBack">返回</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookStore } from '../stores/book'
import { useOrderStore } from '../stores/order'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const bookStore = useBookStore()
const orderStore = useOrderStore()
const authStore = useAuthStore()

onMounted(() => {
  const bookId = route.params.id
  bookStore.fetchBookById(bookId)
})

function goBack() {
  router.back()
}

async function purchaseBook() {
  if (!authStore.isLoggedIn) {
    router.push('/login')
    return
  }
  
  const book = bookStore.currentBook
  const result = await orderStore.createOrder([
    { bookId: book.id, quantity: 1, price: book.price }
  ])
  
  if (result.success) {
    alert('购买成功！')
    router.push('/orders')
  } else {
    alert(`购买失败: ${result.message}`)
  }
}
</script>

<style scoped>
@media (max-width: 768px) {
  .h1-md {
    font-size: 1.75rem;
  }
  
  .fs-4 {
    font-size: 1.25rem !important;
  }
}
</style> 