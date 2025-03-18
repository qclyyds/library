<template>
  <div class="home">
    <!-- 轮播图替换原来的欢迎文本 -->
    <div id="libraryCarousel" class="carousel slide mb-4" data-bs-ride="carousel">
      <div class="carousel-indicators">
        <button type="button" data-bs-target="#libraryCarousel" data-bs-slide-to="0" class="active" aria-current="true" aria-label="第一张幻灯片"></button>
        <button type="button" data-bs-target="#libraryCarousel" data-bs-slide-to="1" aria-label="第二张幻灯片"></button>
        <button type="button" data-bs-target="#libraryCarousel" data-bs-slide-to="2" aria-label="第三张幻灯片"></button>
      </div>
      <div class="carousel-inner rounded-3">
        <div class="carousel-item active">
          <img src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200&h=400&fit=crop" class="d-block w-100" alt="图书馆图片1">
          <div class="carousel-caption d-none d-md-block">
            <h2>欢迎来到图书馆管理系统</h2>
            <p>在这里您可以浏览、借阅和管理书籍</p>
            <RouterLink to="/library" class="btn btn-primary btn-lg">浏览图书</RouterLink>
          </div>
        </div>
        <div class="carousel-item">
          <img src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=1200&h=400&fit=crop" class="d-block w-100" alt="图书馆图片2">
          <div class="carousel-caption d-none d-md-block">
            <h2>发现优质读物</h2>
            <p>挑选您喜爱的书籍，拓展知识视野</p>
            <RouterLink to="/library" class="btn btn-success btn-lg">查看全部图书</RouterLink>
          </div>
        </div>
        <div class="carousel-item">
          <img src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1200&h=400&fit=crop" class="d-block w-100" alt="图书馆图片3">
          <div class="carousel-caption d-none d-md-block">
            <h2>加入我们的读书社区</h2>
            <p>注册账号，管理您的借阅活动</p>
            <RouterLink to="/register" class="btn btn-info btn-lg">立即注册</RouterLink>
          </div>
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#libraryCarousel" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">上一个</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#libraryCarousel" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">下一个</span>
      </button>
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
.carousel-item img {
  height: 400px;
  object-fit: cover;
}

.carousel-caption {
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding: 20px;
}

@media (max-width: 768px) {
  .carousel-item img {
    height: 300px;
  }
  
  .carousel-caption {
    padding: 10px;
  }
  
  .btn-lg {
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
  }
}
</style> 