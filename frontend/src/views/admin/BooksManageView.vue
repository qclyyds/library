<template>
  <div class="books-manage">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>图书管理</h2>
      <div class="btn-group">
        <button class="btn btn-primary" @click="addBook">
          添加图书
        </button>
        <button class="btn btn-info" @click="showFeaturedBooks = !showFeaturedBooks">
          {{ showFeaturedBooks ? '显示所有图书' : '管理推荐图书' }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">加载中...</span>
      </div>
    </div>
    
    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>
    
    <div v-else class="table-responsive">
      <h4 v-if="showFeaturedBooks" class="mb-3">推荐图书管理</h4>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>封面</th>
            <th>书名</th>
            <th>作者</th>
            <th>价格</th>
            <th>库存</th>
            <th>推荐</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in displayedBooks" :key="book.id">
            <td>{{ book.id }}</td>
            <td>
              <img :src="book.cover_image ? `http://localhost:3000${book.cover_image}` : 'https://via.placeholder.com/50x70?text=无封面'" alt="封面" class="book-cover" v-if="book.cover_image">
              <span v-else>无封面</span>
            </td>
            <td>{{ book.title }}</td>
            <td>{{ book.author }}</td>
            <td>¥{{ book.price }}</td>
            <td>{{ book.stock }}</td>
            <td>
              <span v-if="book.featured" class="badge bg-success">推荐</span>
              <span v-else class="badge bg-secondary">普通</span>
            </td>
            <td>
              <button class="btn btn-sm btn-info me-2" @click="editBook(book)">
                编辑
              </button>
              <button 
                v-if="book.featured" 
                class="btn btn-sm btn-warning me-2" 
                @click="cancelFeatured(book.id)"
                title="取消推荐"
              >
                取消推荐
              </button>
              <button 
                v-else
                class="btn btn-sm btn-success me-2" 
                @click="setFeatured(book.id)"
                title="设为推荐"
              >
                设为推荐
              </button>
              <button class="btn btn-sm btn-danger" @click="deleteBook(book.id)">
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- 添加/编辑图书的模态框 -->
  <div class="modal fade" id="bookModal" tabindex="-1" ref="bookModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ editingBook ? '编辑图书' : '添加图书' }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
            <div class="mb-3">
              <label for="title" class="form-label">书名</label>
              <input 
                type="text" 
                class="form-control" 
                id="title" 
                v-model="bookForm.title"
                required
              >
            </div>
            <div class="mb-3">
              <label for="author" class="form-label">作者</label>
              <input 
                type="text" 
                class="form-control" 
                id="author" 
                v-model="bookForm.author"
                required
              >
            </div>
            <div class="mb-3">
              <label for="description" class="form-label">描述</label>
              <textarea 
                class="form-control" 
                id="description" 
                v-model="bookForm.description"
                rows="3"
              ></textarea>
            </div>
            <div class="mb-3">
              <label for="price" class="form-label">价格</label>
              <input 
                type="number" 
                class="form-control" 
                id="price" 
                v-model="bookForm.price"
                min="0"
                step="0.01"
                required
              >
            </div>
            <div class="mb-3">
              <label for="stock" class="form-label">库存</label>
              <input 
                type="number" 
                class="form-control" 
                id="stock" 
                v-model="bookForm.stock"
                min="0"
                required
              >
            </div>
            <div class="mb-3">
              <label for="category" class="form-label">分类</label>
              <input 
                type="text" 
                class="form-control" 
                id="category" 
                v-model="bookForm.category"
              >
            </div>
            <div class="mb-3 form-check">
              <input 
                type="checkbox" 
                class="form-check-input" 
                id="featured" 
                v-model="bookForm.featured"
              >
              <label class="form-check-label" for="featured">设为推荐图书</label>
              <small class="text-muted d-block">推荐的图书将会在首页展示</small>
            </div>
            <div class="mb-3">
              <label for="cover_image" class="form-label">封面图片</label>
              <input 
                type="file" 
                class="form-control" 
                id="cover_image" 
                @change="handleFileUpload"
                accept="image/*"
              >
              <small class="text-muted d-block mt-1">* 如不更换封面，请留空</small>
              <div v-if="imagePreview" class="mt-2">
                <img :src="imagePreview" alt="预览" class="img-thumbnail" style="height: 100px;">
                <p class="small text-muted">新封面预览</p>
              </div>
              <div v-else-if="editingBook && editingBook.cover_image" class="mt-2">
                <img :src="editingBook.cover_image.startsWith('http') ? editingBook.cover_image : `http://localhost:3000${editingBook.cover_image}`" alt="当前封面" class="img-thumbnail" style="height: 100px;">
                <p class="small text-muted">当前封面图片（保持不变）</p>
              </div>
            </div>
            <div class="text-end">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
              <button type="submit" class="btn btn-primary">保存</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { Modal } from 'bootstrap'

const books = ref([])
const loading = ref(false)
const error = ref(null)
const showAddModal = ref(false)
const editingBook = ref(null)
const bookModal = ref(null)
const modalInstance = ref(null)
const imagePreview = ref(null)
const selectedFile = ref(null)
const showFeaturedBooks = ref(false)

// 计算属性：根据当前显示模式过滤图书
const displayedBooks = computed(() => {
  if (showFeaturedBooks.value) {
    return books.value.filter(book => book.featured);
  }
  return books.value;
});

const bookForm = ref({
  title: '',
  author: '',
  description: '',
  price: 0,
  stock: 0,
  featured: false
})

// 处理文件上传
function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    
    // 创建图片预览
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// 获取所有图书
async function fetchBooks() {
  loading.value = true
  error.value = null
  
  try {
    const response = await axios.get('http://localhost:3000/api/admin/books')
    books.value = response.data
  } catch (err) {
    error.value = '获取图书列表失败'
    console.error(err)
  } finally {
    loading.value = false
  }
}

// 删除图书
async function deleteBook(bookId) {
  if (!confirm('确定要删除这本图书吗？')) return
  
  try {
    await axios.delete(`http://localhost:3000/api/admin/books/${bookId}`)
    await fetchBooks()
  } catch (err) {
    alert('删除图书失败：' + (err.response?.data?.message || err.message))
  }
}

// 取消推荐图书
async function cancelFeatured(bookId) {
  try {
    loading.value = true
    const response = await axios.patch(`http://localhost:3000/api/admin/books/${bookId}/featured`, { 
      featured: false 
    })
    
    alert('已取消推荐状态')
    await fetchBooks()
  } catch (err) {
    console.error('取消推荐失败:', err)
    alert('取消推荐失败：' + (err.response?.data?.message || err.message))
  } finally {
    loading.value = false
  }
}

// 设置为推荐图书
async function setFeatured(bookId) {
  try {
    loading.value = true
    const response = await axios.patch(`http://localhost:3000/api/admin/books/${bookId}/featured`, { 
      featured: true 
    })
    
    alert('已设置为推荐图书')
    await fetchBooks()
  } catch (err) {
    console.error('设置推荐失败:', err)
    alert('设置推荐失败：' + (err.response?.data?.message || err.message))
  } finally {
    loading.value = false
  }
}

// 编辑图书
function editBook(book) {
  editingBook.value = book
  bookForm.value = { 
    ...book,
    featured: book.featured === 1 || book.featured === true
  }
  imagePreview.value = null
  selectedFile.value = null
  modalInstance.value.show()
}

// 添加图书
function addBook() {
  editingBook.value = null
  bookForm.value = {
    title: '',
    author: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    featured: false
  }
  imagePreview.value = null
  selectedFile.value = null
  modalInstance.value.show()
}

// 处理表单提交
async function handleSubmit() {
  try {
    // 创建FormData对象用于文件上传
    const formData = new FormData()
    
    // 添加表单数据
    Object.keys(bookForm.value).forEach(key => {
      // 处理布尔值和数字
      if (key === 'featured') {
        formData.append(key, bookForm.value[key] ? 'true' : 'false')
      } else {
        formData.append(key, bookForm.value[key])
      }
    })
    
    // 添加文件（如果有）
    if (selectedFile.value) {
      formData.append('cover_image', selectedFile.value)
    }
    
    if (editingBook.value) {
      // 更新图书
      await axios.put(
        `http://localhost:3000/api/admin/books/${editingBook.value.id}`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
    } else {
      // 添加图书
      await axios.post(
        'http://localhost:3000/api/admin/books', 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
    }
    
    modalInstance.value.hide()
    await fetchBooks()
  } catch (err) {
    alert('保存图书失败：' + (err.response?.data?.message || err.message))
  }
}

onMounted(() => {
  fetchBooks()
  modalInstance.value = new Modal(bookModal.value)
})
</script>

<style scoped>
.book-cover {
  width: 50px;
  height: 70px;
  object-fit: cover;
}
</style> 