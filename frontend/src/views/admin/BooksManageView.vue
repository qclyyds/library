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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const books = ref([])
const loading = ref(false)
const error = ref(null)

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

onMounted(() => {
  fetchBooks()
})
</script>

<style scoped>
.book-cover {
  width: 50px;
  height: 70px;
  object-fit: cover;
}
</style> 