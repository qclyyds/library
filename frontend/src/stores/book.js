import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue'

export const useBookStore = defineStore('book', () => {
  const books = ref([])
  const featuredBooks = ref([])
  const currentBook = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const totalBooks = ref(0)
  
  async function fetchBooks(filters = {}) {
    loading.value = true
    error.value = null
    
    try {
      let url = 'http://localhost:3000/api/books'
      const params = new URLSearchParams()
      
      // 获取当前页码和每页数量
      const page = filters.page || 1
      const pageSize = filters.pageSize || 12
      
      // 添加分页参数
      params.append('page', page)
      params.append('pageSize', pageSize)
      
      // 添加其他筛选参数
      if (filters.category) {
        params.append('category', filters.category)
      }
      
      if (filters.title) {
        params.append('title', filters.title)
      }
      
      url += `?${params.toString()}`
      const response = await axios.get(url)
      
      // 如果后端已经实现了分页
      if (response.data.books && typeof response.data.total === 'number') {
        books.value = response.data.books
        totalBooks.value = response.data.total
      } else {
        // 如果后端还没实现分页，在前端进行分页处理
        const allBooks = response.data
        totalBooks.value = allBooks.length
        
        // 计算当前页的起始和结束索引
        const startIndex = (page - 1) * pageSize
        const endIndex = startIndex + pageSize
        
        // 获取当前页的图书
        books.value = allBooks.slice(startIndex, endIndex)
      }
    } catch (err) {
      error.value = '获取图书列表失败'
      console.error(err)
    } finally {
      loading.value = false
    }
  }
  
  async function fetchFeaturedBooks() {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.get('http://localhost:3000/api/books/featured')
      featuredBooks.value = response.data
    } catch (err) {
      error.value = '获取推荐图书失败'
      console.error(err)
    } finally {
      loading.value = false
    }
  }
  
  async function fetchBookById(id) {
    loading.value = true
    error.value = null
    currentBook.value = null
    
    try {
      const response = await axios.get(`http://localhost:3000/api/books/${id}`)
      currentBook.value = response.data
    } catch (err) {
      error.value = '获取图书详情失败'
      console.error(err)
    } finally {
      loading.value = false
    }
  }
  
  return { 
    books, 
    featuredBooks, 
    currentBook, 
    loading, 
    error,
    totalBooks,
    fetchBooks, 
    fetchFeaturedBooks, 
    fetchBookById 
  }
}) 