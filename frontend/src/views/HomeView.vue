<template>
  <div class="home">
    <div class="jumbotron bg-light p-4 p-md-5 rounded-3 mb-4">
      <h1 class="display-5 display-md-4">欢迎来到图书馆管理系统</h1>
      <p class="lead">在这里您可以浏览、借阅和管理书籍</p>
      <hr class="my-4">
      <p>快速开始浏览我们的图书馆</p>
      <RouterLink to="/library" class="btn btn-primary btn-lg">浏览图书</RouterLink>
    </div>

    <h2 class="mb-4">推荐图书</h2>
    
    <div v-if="bookStore.loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">加载中...</span>
      </div>
    </div>
    
    <div v-else-if="bookStore.error" class="alert alert-danger">
      {{ bookStore.error }}
    </div>
    
    <div v-else class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
      <div v-for="book in bookStore.featuredBooks" :key="book.id" class="col">
        <div class="card h-100">
          <img 
            :src="book.cover_image ? `http://localhost:3000${book.cover_image}` : 'https://via.placeholder.com/300x400?text=暂无封面'" 
            class="card-img-top" 
            :alt="book.title"
            style="height: 200px; object-fit: cover;"
          >
          <div class="card-body">
            <h5 class="card-title">{{ book.title }}</h5>
            <h6 class="card-subtitle mb-2 text-muted">{{ book.author }}</h6>
            <p class="card-text">{{ book.description?.substring(0, 100) }}{{ book.description?.length > 100 ? '...' : '' }}</p>
            <p class="card-text text-primary fw-bold">¥{{ book.price }}</p>
            <RouterLink :to="`/book/${book.id}`" class="btn btn-outline-primary">查看详情</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useBookStore } from '../stores/book'

const bookStore = useBookStore()

onMounted(() => {
  bookStore.fetchFeaturedBooks()
})
</script>

<style scoped>
@media (max-width: 768px) {
  .display-5 {
    font-size: 1.8rem;
  }
  
  .lead {
    font-size: 1rem;
  }
  
  .btn-lg {
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
  }
}
</style> 