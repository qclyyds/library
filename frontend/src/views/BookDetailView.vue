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
        <img 
          :src="bookStore.currentBook.cover_image ? `http://localhost:3000${bookStore.currentBook.cover_image}` : 'https://via.placeholder.com/300x400?text=暂无封面'" 
          :alt="bookStore.currentBook.title" 
          class="img-fluid rounded shadow-sm" 
          style="max-height: 400px;"
        >
      </div>
      
      <div class="col-md-8">
        <h1 class="mb-3 h2 h1-md">{{ bookStore.currentBook.title }}</h1>
        <h5 class="text-muted mb-3">{{ bookStore.currentBook.author }}</h5>
        
        <div class="mb-3">
          <span class="badge bg-primary me-2">{{ bookStore.currentBook.category }}</span>
          <span class="badge bg-info me-2">ISBN: {{ bookStore.currentBook.isbn || '暂无' }}</span>
          <span class="badge bg-secondary me-2">出版商: {{ bookStore.currentBook.publisher || '暂无' }}</span>
          <span class="badge bg-warning text-dark">位置: {{ bookStore.currentBook.location || '暂无' }}</span>
        </div>
        
        <p class="mb-4">{{ bookStore.currentBook.description }}</p>
        
        <div class="d-flex flex-wrap gap-2">
          <button 
            class="btn btn-primary flex-grow-1 flex-md-grow-0" 
            :disabled="!authStore.isLoggedIn"
            @click="borrowBook"
          >
            {{ authStore.isLoggedIn ? '借阅' : '请先登录' }}
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

async function borrowBook() {
  if (!authStore.isLoggedIn) {
    router.push('/login')
    return
  }
  
  try {
    const book = bookStore.currentBook
    const result = await orderStore.createOrder([
      { bookId: book.id, quantity: 1 }
    ])
    
    if (result.success) {
      alert('借阅成功！')
      router.push('/orders')
    } else {
      alert(`借阅失败: ${result.message || '未知错误'}`)
    }
  } catch (error) {
    console.error('借阅过程中发生错误:', error)
    alert('借阅失败: 系统错误，请稍后重试')
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