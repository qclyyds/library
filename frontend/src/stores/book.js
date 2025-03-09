import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue'

export const useBookStore = defineStore('book', () => {
  const books = ref([])
  const featuredBooks = ref([])
  const currentBook = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  async function fetchBooks(filters = {}) {
    loading.value = true
    error.value = null
    
    try {
      let url = 'http://localhost:3000/api/books'
      
      if (Object.keys(filters).length > 0) {
        const params = new URLSearchParams()
        
        if (filters.category) {
          params.append('category', filters.category)
        }
        
        if (filters.title) {
          params.append('title', filters.title)
        }
        
        url += `?${params.toString()}`
      }
      
      const response = await axios.get(url)
      books.value = response.data
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
    fetchBooks, 
    fetchFeaturedBooks, 
    fetchBookById 
  }
}) 