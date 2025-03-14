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
      <div class="col-md-3 mb-4" id="filter-wrapper">
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
      <div class="col-md-9 content-area">
        <div v-if="bookStore.loading" class="text-center loading-indicator">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">加载中...</span>
          </div>
        </div>
        
        <div v-else-if="bookStore.error" class="alert alert-danger content-message">
          {{ bookStore.error }}
        </div>
        
        <div v-else-if="bookStore.books.length === 0" class="alert alert-info content-message">
          没有找到符合条件的图书
        </div>
        
        <div v-else class="books-grid">
          <div class="books-container">
            <div v-for="book in bookStore.books" :key="book.id" class="book-item">
              <div class="card book-card">
                <div class="card-img-wrapper">
                  <img 
                    :src="book.cover || 'https://via.placeholder.com/150x200?text=暂无封面'" 
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
                  <h6 class="card-subtitle mb-1 text-muted text-truncate" :title="book.author">{{ book.author }}</h6>
                  <div class="d-flex justify-content-between align-items-center mt-auto">
                    <span class="text-primary fw-bold price">¥{{ book.price }}</span>
                    <span class="badge bg-secondary">{{ book.category }}</span>
                  </div>
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
  }).finally(() => {
    // 数据加载完成后，确保布局正确
    setTimeout(() => {
      // 强制重新计算布局
      const booksGrid = document.querySelector('.books-grid');
      if (booksGrid) {
        // 触发重排
        booksGrid.style.display = 'none';
        // 强制浏览器重绘
        void booksGrid.offsetHeight;
        booksGrid.style.display = '';
      }
    }, 100);
  });
}

// 切换筛选面板的固定状态
function toggleFilterFixed() {
  // 只在移动设备上切换状态
  if (window.innerWidth < 768) {
    isFilterFixed.value = !isFilterFixed.value
  }
}

// 设置初始偏移量
let filterTopOffset = 0
let headerHeight = 0

// 监听滚动事件
function handleScroll() {
  if (!filterCard.value) return
  
  // 获取顶部导航栏高度 + 一些额外空间
  if (headerHeight === 0) {
    const header = document.querySelector('header')
    headerHeight = header ? header.offsetHeight + 20 : 70
  }
  
  // 设置sticky定位的top值
  filterCard.value.style.top = `${headerHeight}px`
}

onMounted(() => {
  fetchBooks()
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', handleScroll)
  
  // 初始化后调用一次
  setTimeout(handleScroll, 500)
  
  // 数据加载后再次调用以确保高度正确
  setTimeout(handleScroll, 1000)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleScroll)
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
  width: 100%; /* 确保宽度始终为100% */
  margin-bottom: 1rem;
}

/* 固定状态的筛选卡片 */
.filter-fixed {
  position: sticky;
  top: 70px;
  z-index: 100;
}

/* 固定左侧筛选栏区域 */
#filter-wrapper {
  min-height: calc(100vh - 120px); /* 设置固定高度，减去头部和一些边距 */
}

/* 筛选栏内容区固定高度，超出时出现滚动条 */
#filter-wrapper .card-body {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

/* 右侧内容区固定最小高度 */
.content-area {
  min-height: calc(100vh - 120px);
  max-height: calc(100vh - 120px); /* 限制最大高度 */
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 防止内容溢出 */
}

/* 确保图书网格区域可以滚动 */
.books-grid {
  height: calc(100vh - 250px); /* 固定高度，减去头部、分页和其他元素的高度 */
  overflow-y: auto; /* 垂直滚动 */
  padding-right: 5px; /* 为滚动条预留空间 */
  margin-bottom: 0; /* 移除底部边距 */
  margin-top: 0;
  border: 1px solid #eee; /* 添加边框使滚动区域更明显 */
  min-height: 400px; /* 添加最小高度，确保即使内容少也不会塌陷 */
  position: relative; /* 确保定位上下文 */
  display: block; /* 确保以块级元素显示 */
}

/* 图书容器 */
.books-container {
  display: flex;
  flex-wrap: wrap;
  padding: 5px;
  min-height: calc(100% - 10px);
  position: relative;
  width: 100%;
  box-sizing: border-box;
  background-color: #ffffff;
  height: 100%; /* 固定高度 */
}

/* 图书项目 */
.book-item {
  width: 25%; /* 每行4本书 */
  padding: 5px;
  box-sizing: border-box;
}

/* 书籍卡片样式 */
.book-card {
  transition: all 0.2s ease;
  border: none;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  height: 100%;
  max-width: 100%; /* 确保卡片不超出容器 */
}

/* 减小卡片内边距 */
.card-body {
  padding: 0.5rem;
  background-color: #fff;
  font-size: 0.8rem;
}

/* 缩小标题文字 */
.card-title {
  font-size: 0.85rem;
  margin-bottom: 0.2rem;
  line-height: 1.2;
  font-weight: 600;
  color: #333;
  height: 1.2em; /* 固定高度确保对齐 */
}

/* 缩小副标题文字 */
.card-subtitle {
  font-size: 0.75rem;
  color: #666;
  margin-bottom: 0.3rem;
  height: 1.2em; /* 固定高度确保对齐 */
}

/* 调整价格文字 */
.price {
  font-size: 0.85rem;
  color: #e74c3c;
}

/* 调整标签大小 */
.badge {
  font-weight: normal;
  padding: 0.2em 0.4em;
  background-color: #f0f0f0;
  color: #666;
  font-size: 0.65rem;
}

/* 固定分页控件位置 */
.pagination-wrapper {
  background-color: #f8f9fa;
  padding: 0.5rem;
  border-radius: 4px;
  margin-top: 0.5rem;
  margin-bottom: 0;
  flex-shrink: 0; /* 防止分页区域被压缩 */
  position: sticky;
  bottom: 0;
  width: 100%;
}

/* 加载指示器垂直居中 */
.loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

/* 固定内容容器 */
.library .row {
  display: flex;
  flex-wrap: nowrap;
}

/* 确保筛选栏容器高度一致 */
#filter-wrapper .collapse {
  height: 100%;
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
    max-height: 80vh; /* 限制最大高度 */
    overflow-y: auto; /* 允许滚动 */
  }
  
  /* 移动端不使用固定高度 */
  #filter-wrapper, .content-area {
    min-height: auto;
    max-height: none;
  }
  
  /* 移动端允许自动换行 */
  .library .row {
    flex-wrap: wrap;
  }
  
  /* 移动端两列显示 */
  .book-item {
    width: 50%; /* 小屏幕2列 */
  }
  
  /* 调整图书网格高度为自适应 */
  .books-grid {
    height: auto;
    max-height: none;
    overflow-y: visible;
    border: none;
  }
  
  .card-title, .card-subtitle {
    height: auto;
  }
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

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-img-wrapper {
  position: relative;
  padding-top: 120%; /* 调整图片比例，进一步降低高度 */
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

/* 修改移动端响应式布局 */
@media (max-width: 991px) {
  .book-item {
    width: 33.333%; /* 中等屏幕3列 */
  }
}

/* 空内容或错误消息样式 */
.content-message {
  margin: 2rem;
  text-align: center;
  padding: 2rem;
}
</style> 