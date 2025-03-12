<template>
  <div class="library">
    <div class="row">
      <!-- 小屏幕上的筛选按钮 -->
      <div class="col-12 d-md-none mb-3">
        <button class="btn btn-primary w-100" type="button" data-bs-toggle="collapse" data-bs-target="#filterCollapse">
          显示/隐藏筛选选项
        </button>
      </div>
      
      <!-- 左侧筛选栏 -->
      <div class="col-md-3 mb-4">
        <div class="collapse d-md-block" id="filterCollapse">
          <div 
            class="card filter-card" 
            :class="{ 'filter-fixed': isFilterFixed }" 
            ref="filterCard"
          >
            <div class="card-header">
              筛选
            </div>
            <div class="card-body">
              <div class="mb-3">
                <label for="search" class="form-label">搜索图书</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="search" 
                  v-model="filters.title" 
                  placeholder="输入图书名称"
                  @input="applyFilters"
                >
              </div>
              
              <div class="mb-3">
                <label class="form-label">分类</label>
                <div class="form-check">
                  <input 
                    class="form-check-input" 
                    type="radio" 
                    id="all-categories" 
                    value=""
                    v-model="filters.category"
                    @change="applyFilters"
                    @click="toggleFilterFixed"
                  >
                  <label class="form-check-label" for="all-categories">
                    全部
                  </label>
                </div>
                <div class="form-check" v-for="category in categories" :key="category">
                  <input 
                    class="form-check-input" 
                    type="radio" 
                    :id="category" 
                    :value="category" 
                    v-model="filters.category"
                    @change="applyFilters"
                    @click="toggleFilterFixed"
                  >
                  <label class="form-check-label" :for="category">
                    {{ category }}
                  </label>
                </div>
              </div>
              
              <button class="btn btn-secondary w-100" @click="resetFilters">
                重置筛选
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧内容区 -->
      <div class="col-md-9">
        <div v-if="bookStore.loading" class="text-center">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">加载中...</span>
          </div>
        </div>
        
        <div v-else-if="bookStore.error" class="alert alert-danger">
          {{ bookStore.error }}
        </div>
        
        <div v-else-if="bookStore.books.length === 0" class="alert alert-info">
          没有找到符合条件的图书
        </div>
        
        <div v-else class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          <div v-for="book in bookStore.books" :key="book.id" class="col">
            <div class="card book-card h-100">
              <div class="card-img-wrapper">
                <img 
                  :src="book.cover || 'https://via.placeholder.com/200x300?text=暂无封面'" 
                  class="card-img-top" 
                  :alt="book.title"
                >
                <div class="card-img-overlay">
                  <RouterLink 
                    :to="`/book/${book.id}`" 
                    class="btn btn-primary btn-sm view-detail"
                  >
                    查看详情
                  </RouterLink>
                </div>
              </div>
              <div class="card-body d-flex flex-column">
                <h5 class="card-title text-truncate" :title="book.title">{{ book.title }}</h5>
                <h6 class="card-subtitle mb-2 text-muted text-truncate" :title="book.author">{{ book.author }}</h6>
                <div class="d-flex justify-content-between align-items-center mt-auto">
                  <span class="text-primary fw-bold price">¥{{ book.price }}</span>
                  <span class="badge bg-secondary">{{ book.category }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 分页控件 -->
        <div v-if="bookStore.books.length > 0" class="d-flex flex-column align-items-center mt-4 pagination-wrapper">
          <div class="btn-group">
            <button 
              class="btn btn-primary" 
              @click="prevPage" 
              :disabled="currentPage === 1"
            >上一页</button>
            <button 
              v-for="page in displayedPages" 
              :key="page"
              class="btn" 
              :class="page === currentPage ? 'btn-primary' : 'btn-outline-primary'"
              @click="changePage(page)"
            >{{ page }}</button>
            <button 
              class="btn btn-primary" 
              @click="nextPage" 
              :disabled="currentPage === totalPages"
            >下一页</button>
          </div>
          <div class="mt-2 text-muted">
            当前第 {{ currentPage }} 页，共 {{ totalPages }} 页（共 {{ bookStore.totalBooks }} 本书）
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useBookStore } from '../stores/book'

const bookStore = useBookStore()
const categories = ref(['文学小说', '科幻小说', '计算机技术', '历史', '经济管理', '悬疑推理', '人工智能', '教育', '投资理财', '世界史', '中国史'])
const filterCard = ref(null)
const isFilterFixed = ref(false)

const filters = ref({
  title: '',
  category: ''
})

const currentPage = ref(1)
const pageSize = 12 // 每页显示12本书

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(bookStore.totalBooks / pageSize) || 1
})

// 显示哪些页码按钮（最多显示5个页码）
const displayedPages = computed(() => {
  const total = totalPages.value
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  
  let start = currentPage.value - 2
  let end = currentPage.value + 2
  
  if (start < 1) {
    start = 1
    end = 5
  } else if (end > total) {
    end = total
    start = total - 4
  }
  
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

function applyFilters() {
  currentPage.value = 1
  fetchBooks()
}

function resetFilters() {
  filters.value = {
    title: '',
    category: ''
  }
  currentPage.value = 1
  isFilterFixed.value = false
  fetchBooks()
}

function changePage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  fetchBooks()
  
  // 滚动到页面顶部
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

function fetchBooks() {
  bookStore.fetchBooks({
    ...filters.value,
    page: currentPage.value,
    pageSize: pageSize
  })
}

// 切换筛选面板的固定状态
function toggleFilterFixed() {
  isFilterFixed.value = !isFilterFixed.value
}

// 设置初始偏移量
let filterTopOffset = 0
let headerHeight = 0

// 监听滚动事件
function handleScroll() {
  if (isFilterFixed.value) return
  
  if (!filterCard.value) return
  
  // 获取顶部导航栏高度 + 一些额外空间
  if (headerHeight === 0) {
    const header = document.querySelector('header')
    headerHeight = header ? header.offsetHeight + 20 : 70
  }
  
  // 如果尚未设置初始偏移量，先计算
  if (filterTopOffset === 0) {
    filterTopOffset = filterCard.value.getBoundingClientRect().top + window.scrollY - headerHeight
  }
  
  // 设置sticky定位的top值
  filterCard.value.style.top = `${headerHeight}px`
}

onMounted(() => {
  fetchBooks()
  window.addEventListener('scroll', handleScroll)
  // 初始化后调用一次
  setTimeout(handleScroll, 500)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// 修改翻页方法
function prevPage() {
  if (currentPage.value > 1) {
    changePage(currentPage.value - 1)
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    changePage(currentPage.value + 1)
  }
}
</script>

<style scoped>
@media (max-width: 767px) {
  .card-title {
    font-size: 1.1rem;
  }
  
  .card-subtitle {
    font-size: 0.9rem;
  }
}

/* 确保导航栏不会覆盖内容 */
.library {
  position: relative;
  z-index: 1;
}

/* 分页按钮样式 */
.pagination {
  display: none;
}

/* 筛选卡片样式 */
.filter-card {
  transition: all 0.3s ease;
  position: sticky;
  top: 70px; /* 这个值会被JS动态调整，与导航栏高度有关 */
}

/* 固定状态的筛选卡片 */
.filter-fixed {
  position: fixed;
  z-index: 100;
  width: calc(25% - 2rem); /* 保持与col-md-3大致相同的宽度 */
}

/* 媒体查询以处理小屏幕上的固定筛选 */
@media (max-width: 767px) {
  .filter-fixed {
    position: fixed;
    top: 70px;
    left: 1rem;
    right: 1rem;
    width: auto;
    z-index: 1000;
  }
}

.pagination-wrapper {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin: 2rem 0;
}

.btn-group .btn {
  margin: 0 2px;
}

@media (max-width: 576px) {
  .btn-group .btn:not(:first-child):not(:last-child) {
    display: none;
  }
  
  .pagination-wrapper {
    margin: 1rem 0;
    padding: 0.5rem;
  }
}

/* 书籍卡片样式 */
.book-card {
  transition: all 0.3s ease;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-img-wrapper {
  position: relative;
  padding-top: 140%; /* 调整图片比例为 7:10 */
  overflow: hidden;
  background-color: #f8f9fa;
}

.card-img-wrapper img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.book-card:hover .card-img-wrapper img {
  transform: scale(1.05);
}

.card-img-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.book-card:hover .card-img-overlay {
  opacity: 1;
}

.view-detail {
  transform: translateY(20px);
  transition: transform 0.3s ease;
  padding: 0.5rem 1.5rem;
  font-size: 0.9rem;
}

.book-card:hover .view-detail {
  transform: translateY(0);
}

.card-body {
  padding: 1rem;
  background-color: #fff;
}

.card-title {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  line-height: 1.4;
  font-weight: 600;
  color: #333;
}

.card-subtitle {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
}

.price {
  font-size: 1.1rem;
  color: #e74c3c;
}

.badge {
  font-weight: normal;
  padding: 0.5em 0.8em;
  background-color: #f0f0f0;
  color: #666;
}

/* 响应式调整 */
@media (max-width: 767px) {
  .book-card {
    margin-bottom: 1rem;
  }
  
  .card-title {
    font-size: 0.95rem;
  }
  
  .card-subtitle {
    font-size: 0.85rem;
  }
  
  .price {
    font-size: 1rem;
  }
  
  .badge {
    font-size: 0.8rem;
  }
}
</style> 