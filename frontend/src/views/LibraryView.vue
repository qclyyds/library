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
        
        <div v-else class="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 g-3">
          <div v-for="book in bookStore.books" :key="book.id" class="col">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">{{ book.title }}</h5>
                <h6 class="card-subtitle mb-2 text-muted">{{ book.author }}</h6>
                <p class="card-text">{{ book.description?.substring(0, 80) }}{{ book.description?.length > 80 ? '...' : '' }}</p>
                <p class="card-text text-primary fw-bold">¥{{ book.price }}</p>
                <RouterLink :to="`/book/${book.id}`" class="btn btn-outline-primary">查看详情</RouterLink>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 分页控件 -->
        <div v-if="bookStore.totalBooks > 0" class="d-flex justify-content-center mt-4">
          <nav aria-label="Page navigation">
            <ul class="pagination">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">上一页</a>
              </li>
              <li v-for="page in displayedPages" :key="page" class="page-item" :class="{ active: page === currentPage }">
                <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">下一页</a>
              </li>
            </ul>
          </nav>
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
const pageSize = 15 // 每页显示15本书

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(bookStore.totalBooks / pageSize) || 1
})

// 显示哪些页码按钮（最多显示5个页码）
const displayedPages = computed(() => {
  if (totalPages.value <= 5) {
    return Array.from({ length: totalPages.value }, (_, i) => i + 1)
  }
  
  // 如果当前页接近开始
  if (currentPage.value <= 3) {
    return [1, 2, 3, 4, 5]
  }
  
  // 如果当前页接近结束
  if (currentPage.value >= totalPages.value - 2) {
    return [
      totalPages.value - 4,
      totalPages.value - 3,
      totalPages.value - 2,
      totalPages.value - 1,
      totalPages.value
    ]
  }
  
  // 当前页在中间
  return [
    currentPage.value - 2,
    currentPage.value - 1,
    currentPage.value,
    currentPage.value + 1,
    currentPage.value + 2
  ]
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
  
  // 滚动到页面顶部，提高用户体验
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
  margin-bottom: 1rem;
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
</style> 