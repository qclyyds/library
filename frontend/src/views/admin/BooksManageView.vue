<template>
  <div class="books-manage">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>图书管理</h2>
      <button class="btn btn-primary" @click="showAddModal = true">
        添加图书
      </button>
    </div>

    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>封面</th>
            <th>书名</th>
            <th>作者</th>
            <th>价格</th>
            <th>库存</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in books" :key="book.id">
            <td>{{ book.id }}</td>
            <td>
              <img :src="book.cover_url" alt="封面" class="book-cover" v-if="book.cover_url">
              <span v-else>无封面</span>
            </td>
            <td>{{ book.title }}</td>
            <td>{{ book.author }}</td>
            <td>¥{{ book.price }}</td>
            <td>{{ book.stock }}</td>
            <td>
              <button class="btn btn-sm btn-info me-2" @click="editBook(book)">
                编辑
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
          <form @submit.prevent="handleSubmit">
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
              <label for="cover_url" class="form-label">封面图片URL</label>
              <input 
                type="url" 
                class="form-control" 
                id="cover_url" 
                v-model="bookForm.cover_url"
              >
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
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { Modal } from 'bootstrap'

const books = ref([])
const loading = ref(false)
const error = ref(null)
const showAddModal = ref(false)
const editingBook = ref(null)
const bookModal = ref(null)
const modalInstance = ref(null)

const bookForm = ref({
  title: '',
  author: '',
  description: '',
  price: 0,
  stock: 0,
  cover_url: ''
})

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

// 编辑图书
function editBook(book) {
  editingBook.value = book
  bookForm.value = { ...book }
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
    cover_url: ''
  }
  modalInstance.value.show()
}

// 处理表单提交
async function handleSubmit() {
  try {
    if (editingBook.value) {
      // 更新图书
      await axios.put(`http://localhost:3000/api/admin/books/${editingBook.value.id}`, bookForm.value)
    } else {
      // 添加图书
      await axios.post('http://localhost:3000/api/admin/books', bookForm.value)
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