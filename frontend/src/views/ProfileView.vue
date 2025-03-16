<template>
  <div class="profile">
    <div class="profile-container">
      <div class="profile-box">
        <h2 class="profile-title">个人中心</h2>
        
        <div v-if="authStore.user" class="profile-content">
          <!-- 用户信息部分 -->
          <div class="user-panel">
            <div class="avatar-section">
              <div class="avatar">
                {{ authStore.user.username.charAt(0).toUpperCase() }}
              </div>
              <span class="role-badge" :class="{'is-admin': authStore.user.role === 'admin'}">
                {{ authStore.user.role === 'admin' ? '管理员' : '普通用户' }}
              </span>
            </div>
            
            <div class="info-section">
              <div class="info-item">
                <label>用户名</label>
                <span>{{ authStore.user.username }}</span>
              </div>
              
              <div class="info-item">
                <label>邮箱</label>
                <span>{{ authStore.user.email }}</span>
              </div>
              
              <div class="info-item">
                <label>注册时间</label>
                <span>{{ formatDate(authStore.user.created_at) }}</span>
              </div>
            </div>
            
            <div class="action-section">
              <button 
                class="logout-btn"
                @click="handleLogout"
              >
                退出登录
              </button>
            </div>
          </div>

          <!-- 管理员功能部分 -->
          <div v-if="authStore.user?.role === 'admin'" class="admin-panel">
            <div class="d-flex justify-content-between align-items-center">
              <h3 class="admin-title mb-0">管理员功能</h3>
              <div class="admin-actions">
                <button class="btn btn-primary me-2" @click="addBook">
                  添加图书
                </button>
                <button class="btn btn-success me-2" @click="addUser">
                  添加用户
                </button>
                <button class="btn btn-info me-2" @click="showBookList = !showBookList">
                  {{ showBookList ? '隐藏图书列表' : '显示图书列表' }}
                </button>
                <button class="btn btn-warning" @click="showUserList = !showUserList">
                  {{ showUserList ? '隐藏用户列表' : '显示用户列表' }}
                </button>
              </div>
            </div>

            <!-- 图书列表 -->
            <div v-if="showBookList" class="book-list mt-4">
              <div v-if="loading" class="text-center">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">加载中...</span>
                </div>
              </div>
              
              <div v-else-if="error" class="alert alert-danger">
                {{ error }}
              </div>
              
              <div v-else class="table-responsive">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>书名</th>
                      <th>作者</th>
                      <th>分类</th>
                      <th>价格</th>
                      <th>库存</th>
                      <th>推荐</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="book in books" :key="book.id">
                      <td>{{ book.id }}</td>
                      <td>{{ book.title }}</td>
                      <td>{{ book.author }}</td>
                      <td>{{ book.category || '未分类' }}</td>
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

            <!-- 用户列表 -->
            <div v-if="showUserList" class="user-list mt-4">
              <div v-if="userLoading" class="text-center">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">加载中...</span>
                </div>
              </div>
              
              <div v-else-if="userError" class="alert alert-danger">
                {{ userError }}
              </div>
              
              <div v-else class="table-responsive">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>用户名</th>
                      <th>邮箱</th>
                      <th>角色</th>
                      <th>注册时间</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="user in users" :key="user.id">
                      <td>{{ user.id }}</td>
                      <td>{{ user.username }}</td>
                      <td>{{ user.email }}</td>
                      <td>
                        <span class="badge" :class="user.role === 'admin' ? 'bg-danger' : 'bg-secondary'">
                          {{ user.role === 'admin' ? '管理员' : '普通用户' }}
                        </span>
                      </td>
                      <td>{{ formatDate(user.created_at) }}</td>
                      <td>
                        <button class="btn btn-sm btn-info me-2" @click="editUser(user)">
                          编辑
                        </button>
                        <button class="btn btn-sm btn-danger" @click="deleteUser(user.id)">
                          删除
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
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
              <label for="category" class="form-label">分类</label>
              <select 
                class="form-select" 
                id="category" 
                v-model="bookForm.category"
              >
                <option value="">请选择分类</option>
                <option value="文学小说">文学小说</option>
                <option value="科幻小说">科幻小说</option>
                <option value="计算机技术">计算机技术</option>
                <option value="历史">历史</option>
                <option value="经济管理">经济管理</option>
                <option value="悬疑推理">悬疑推理</option>
                <option value="人工智能">人工智能</option>
                <option value="教育">教育</option>
                <option value="投资理财">投资理财</option>
                <option value="世界史">世界史</option>
                <option value="中国史">中国史</option>
              </select>
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
            <div class="mb-3">
              <div class="form-check">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  id="featured" 
                  v-model="bookForm.featured"
                >
                <label class="form-check-label" for="featured">
                  设为推荐图书
                </label>
                <small class="text-muted d-block">推荐的图书将会在首页展示</small>
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

  <!-- 添加用户编辑模态框 -->
  <div class="modal fade" id="userModal" tabindex="-1" ref="userModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ editingUser ? '编辑用户' : '添加用户' }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleUserSubmit">
            <div class="mb-3">
              <label for="username" class="form-label">用户名</label>
              <input 
                type="text" 
                class="form-control" 
                id="username" 
                v-model="userForm.username"
                required
              >
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">邮箱</label>
              <input 
                type="email" 
                class="form-control" 
                id="email" 
                v-model="userForm.email"
                required
              >
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">密码</label>
              <input 
                type="password" 
                class="form-control" 
                id="password" 
                v-model="userForm.password"
                :required="!editingUser"
              >
              <small class="text-muted" v-if="editingUser">留空表示不修改密码</small>
            </div>
            <div class="mb-3">
              <label for="role" class="form-label">角色</label>
              <select 
                class="form-select" 
                id="role" 
                v-model="userForm.role"
                required
              >
                <option value="user">普通用户</option>
                <option value="admin">管理员</option>
              </select>
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
import { ref, onMounted, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { Modal } from 'bootstrap'
import axios from 'axios'

const authStore = useAuthStore()
const router = useRouter()

const showAddModal = ref(false)
const showBookList = ref(false)
const showUserList = ref(false)
const loading = ref(false)
const error = ref(null)
const books = ref([])
const editingBook = ref(null)
const bookModal = ref(null)
const modalInstance = ref(null)
const imagePreview = ref(null)
const selectedFile = ref(null)

const userLoading = ref(false)
const userError = ref(null)
const users = ref([])
const editingUser = ref(null)
const userModal = ref(null)
const userModalInstance = ref(null)

const bookForm = ref({
  title: '',
  author: '',
  description: '',
  category: '',
  price: 0,
  stock: 0,
  cover_image: '',
  featured: false
})

const userForm = ref({
  username: '',
  email: '',
  password: '',
  role: 'user'
})

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

async function handleLogout() {
  if (confirm('确定要退出登录吗？')) {
    authStore.logout()
    router.push('/login')
  }
}

// 获取所有图书
async function fetchBooks() {
  loading.value = true
  error.value = null
  
  try {
    // 重新设置认证头
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
    
    console.log('获取图书列表...')
    const response = await axios.get('http://localhost:3000/api/admin/books')
    console.log('获取图书列表成功:', response.data.length, '条记录')
    books.value = response.data
  } catch (err) {
    console.error('获取图书列表错误:', err)
    if (err.response) {
      console.error('错误响应:', err.response.status, err.response.data)
    }
    error.value = '获取图书列表失败：' + (err.response?.data?.message || err.message)
  } finally {
    loading.value = false
  }
}

// 删除图书
async function deleteBook(bookId) {
  if (!confirm('确定要删除这本图书吗？')) return
  
  try {
    console.log('删除图书ID:', bookId)
    console.log('当前token:', localStorage.getItem('token'))
    
    // 重新设置认证头
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
    
    // 使用完整URL以避免baseURL配置问题
    const response = await axios.delete(`http://localhost:3000/api/admin/books/${bookId}`)
    console.log('删除响应:', response.data)
    await fetchBooks()
  } catch (err) {
    console.error('删除图书错误详情:', err)
    if (err.response) {
      console.error('错误响应:', err.response.status, err.response.data)
    }
    alert('删除图书失败：' + (err.response?.data?.message || err.message))
  }
}

// 设置为推荐图书
async function setFeatured(bookId) {
  try {
    console.log('设置图书ID为推荐:', bookId)
    // 重新设置认证头
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
    
    const response = await axios.patch(`http://localhost:3000/api/admin/books/${bookId}/featured`, { 
      featured: true 
    })
    console.log('设置推荐响应:', response.data)
    
    alert('已设置为推荐图书')
    await fetchBooks()
  } catch (err) {
    console.error('设置推荐失败:', err)
    if (err.response) {
      console.error('错误响应:', err.response.status, err.response.data)
    }
    alert('设置推荐失败：' + (err.response?.data?.message || err.message))
  }
}

// 取消推荐图书
async function cancelFeatured(bookId) {
  try {
    console.log('取消图书ID的推荐:', bookId)
    // 重新设置认证头
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
    
    const response = await axios.patch(`http://localhost:3000/api/admin/books/${bookId}/featured`, { 
      featured: false 
    })
    console.log('取消推荐响应:', response.data)
    
    alert('已取消推荐状态')
    await fetchBooks()
  } catch (err) {
    console.error('取消推荐失败:', err)
    if (err.response) {
      console.error('错误响应:', err.response.status, err.response.data)
    }
    alert('取消推荐失败：' + (err.response?.data?.message || err.message))
  }
}

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

// 编辑图书
function editBook(book) {
  editingBook.value = book
  bookForm.value = {
    ...book,
    // 确保boolean类型正确，数据库中可能是0/1
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
    // 重新设置认证头
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
    
    // 创建FormData对象用于文件上传
    const formData = new FormData()
    
    // 添加表单数据
    Object.keys(bookForm.value).forEach(key => {
      // 处理布尔值
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
      console.log('更新图书数据:', bookForm.value)
      const response = await axios.put(
        `http://localhost:3000/api/admin/books/${editingBook.value.id}`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      console.log('更新响应:', response.data)
    } else {
      // 添加图书
      console.log('添加图书数据:', bookForm.value)
      const response = await axios.post(
        'http://localhost:3000/api/admin/books', 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      console.log('添加响应:', response.data)
    }
    
    modalInstance.value.hide()
    await fetchBooks()
  } catch (err) {
    console.error('保存图书错误详情:', err)
    if (err.response) {
      console.error('错误响应:', err.response.status, err.response.data)
    }
    alert('保存图书失败：' + (err.response?.data?.message || err.message))
  }
}

// 获取所有用户
async function fetchUsers() {
  userLoading.value = true
  userError.value = null
  
  try {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
    
    console.log('获取用户列表...')
    const response = await axios.get('http://localhost:3000/api/admin/users')
    console.log('获取用户列表成功:', response.data.length, '条记录')
    users.value = response.data
  } catch (err) {
    console.error('获取用户列表错误:', err)
    if (err.response) {
      console.error('错误响应:', err.response.status, err.response.data)
    }
    userError.value = '获取用户列表失败：' + (err.response?.data?.message || err.message)
  } finally {
    userLoading.value = false
  }
}

// 删除用户
async function deleteUser(userId) {
  if (!confirm('确定要删除这个用户吗？')) return
  
  try {
    console.log('删除用户ID:', userId)
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
    
    const response = await axios.delete(`http://localhost:3000/api/admin/users/${userId}`)
    console.log('删除响应:', response.data)
    await fetchUsers()
  } catch (err) {
    console.error('删除用户错误详情:', err)
    if (err.response) {
      console.error('错误响应:', err.response.status, err.response.data)
    }
    alert('删除用户失败：' + (err.response?.data?.message || err.message))
  }
}

// 编辑用户
function editUser(user) {
  editingUser.value = user
  userForm.value = {
    username: user.username || '',
    email: user.email || '',
    password: '',
    role: user.role || 'user'
  }
  userModalInstance.value.show()
}

// 添加用户
function addUser() {
  editingUser.value = null
  userForm.value = {
    username: '',
    email: '',
    password: '',
    role: 'user'
  }
  userModalInstance.value.show()
}

// 处理用户表单提交
async function handleUserSubmit() {
  try {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
    
    if (editingUser.value) {
      // 更新用户
      console.log('更新用户数据:', userForm.value)
      const response = await axios.put(`http://localhost:3000/api/admin/users/${editingUser.value.id}`, userForm.value)
      console.log('更新响应:', response.data)
    } else {
      // 添加用户
      console.log('添加用户数据:', userForm.value)
      const response = await axios.post('http://localhost:3000/api/admin/users', userForm.value)
      console.log('添加响应:', response.data)
    }
    
    userModalInstance.value.hide()
    await fetchUsers()
  } catch (err) {
    console.error('保存用户错误详情:', err)
    if (err.response) {
      console.error('错误响应:', err.response.status, err.response.data)
    }
    alert('保存用户失败：' + (err.response?.data?.message || err.message))
  }
}

// 监听showBookList变化，当显示列表时加载数据
watch(showBookList, (newVal) => {
  if (newVal) {
    fetchBooks();
  }
});

// 监听showUserList变化，当显示列表时加载数据
watch(showUserList, (newVal) => {
  if (newVal) {
    fetchUsers()
  }
})

onMounted(() => {
  // 初始化模态框
  try {
    modalInstance.value = new Modal(bookModal.value)
    userModalInstance.value = new Modal(userModal.value)
  } catch (err) {
    console.error('初始化模态框失败:', err)
  }
  
  // 检查登录状态和认证token
  if (!authStore.isLoggedIn) {
    console.warn('用户未登录，无法进行管理员操作')
    return
  }
  
  if (authStore.user?.role !== 'admin') {
    console.warn('当前用户不是管理员，无法进行管理员操作')
    return
  }
  
  // 确保已设置Authorization header
  const token = localStorage.getItem('token')
  if (!token) {
    console.error('未找到认证token，请重新登录')
    return
  }
  
  // 设置认证头
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  console.log('已设置Authorization header')
})
</script>

<style scoped>
.profile {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f2f5;
  padding: 30px 20px;
}

.profile-container {
  width: 100%;
  max-width: 1200px;
  transition: all 0.3s ease;
}

.profile-box {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.profile-title {
  text-align: center;
  margin-bottom: 40px;
  color: #2c3e50;
  font-size: 28px;
  font-weight: 700;
  position: relative;
}

.profile-title::after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #409eff, #64b5f6);
  border-radius: 2px;
}

.profile-content {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
}

.user-panel {
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 35px;
}

.admin-panel {
  flex: 2;
  min-width: 400px;
}

.avatar-section {
  text-align: center;
  position: relative;
}

.avatar {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: linear-gradient(135deg, #409eff, #64b5f6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: 600;
  margin-bottom: 20px;
  box-shadow: 0 8px 16px rgba(64, 158, 255, 0.3);
  transition: all 0.3s ease;
  border: 5px solid white;
}

.avatar:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 20px rgba(64, 158, 255, 0.4);
}

.role-badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  background-color: #95a5a6;
  color: white;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 0;
  right: -10px;
}

.role-badge.is-admin {
  background: linear-gradient(135deg, #e74c3c, #ff7675);
}

.info-section {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  background-color: #f8f9fa;
  padding: 25px;
  border-radius: 12px;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.05);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item label {
  color: #7f8c8d;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.info-item label::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  background-color: #409eff;
  border-radius: 50%;
  margin-right: 8px;
}

.info-item span {
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
  padding: 10px;
  background-color: white;
  border-radius: 8px;
  border-left: 3px solid #409eff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.action-section {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.logout-btn {
  padding: 12px 28px;
  background: linear-gradient(135deg, #f56c6c, #ff9b9b);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 8px rgba(245, 108, 108, 0.3);
}

.logout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(245, 108, 108, 0.4);
}

.logout-btn:active {
  transform: translateY(1px);
}

.admin-section {
  width: 100%;
  height: 100%;
  padding: 30px;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  border-left: 3px solid #e74c3c;
}

.admin-title {
  color: #2c3e50;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 0;
  display: flex;
  align-items: center;
}

.admin-title::before {
  content: '';
  display: inline-block;
  width: 10px;
  height: 20px;
  background-color: #e74c3c;
  margin-right: 10px;
  border-radius: 3px;
}

.admin-actions {
  display: flex;
  gap: 15px;
}

.admin-actions button {
  transition: all 0.3s;
  border-radius: 8px;
  font-weight: 600;
  padding: 10px 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.admin-actions button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

.admin-actions button:active {
  transform: translateY(1px);
}

.book-list {
  margin-top: 30px;
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  max-height: 400px;
  overflow-y: auto;
}

.table-responsive {
  border-radius: 8px;
  overflow: hidden;
}

.table {
  margin-bottom: 0;
}

.table thead th {
  background-color: #f2f6fc;
  color: #2c3e50;
  font-weight: 600;
  border: none;
  padding: 15px;
}

.table tbody td {
  padding: 12px 15px;
  vertical-align: middle;
  border-color: #eef2f7;
}

.table-striped tbody tr:nth-of-type(odd) {
  background-color: #f8f9fa;
}

.btn-sm {
  border-radius: 6px;
  font-weight: 500;
  padding: 5px 12px;
  transition: all 0.2s;
}

.btn-info {
  background-color: #17a2b8;
  border-color: #17a2b8;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}

.book-cover {
  width: 50px;
  height: 70px;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 自定义滚动条样式 */
.book-list::-webkit-scrollbar {
  width: 8px;
}

.book-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.book-list::-webkit-scrollbar-thumb {
  background: #bbb;
  border-radius: 10px;
}

.book-list::-webkit-scrollbar-thumb:hover {
  background: #999;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .profile-container {
    max-width: 95%;
  }
}

@media (max-width: 992px) {
  .profile-content {
    flex-direction: column;
  }
  
  .user-panel, .admin-panel {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .profile-box {
    padding: 30px 20px;
  }
  
  .admin-actions {
    flex-direction: row;
  }
  
  .admin-actions .btn {
    font-size: 14px;
    padding: 8px 15px;
  }
  
  .info-section {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .avatar {
    width: 90px;
    height: 90px;
    font-size: 32px;
  }
}

@media (max-width: 576px) {
  .d-flex.justify-content-between.align-items-center {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 15px;
  }

  .admin-title {
    margin-bottom: 15px;
  }
  
  .admin-actions {
    width: 100%;
  }
  
  .admin-actions .btn {
    flex: 1;
  }
  
  .table thead th,
  .table tbody td {
    padding: 10px 8px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .profile-box {
    padding: 25px 15px;
    border-radius: 12px;
  }
  
  .profile-title {
    font-size: 22px;
    margin-bottom: 30px;
  }
  
  .avatar {
    width: 80px;
    height: 80px;
    font-size: 28px;
  }
  
  .admin-section {
    padding: 20px 15px;
  }
}

/* 添加用户列表样式 */
.user-list {
  margin-top: 30px;
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  max-height: 400px;
  overflow-y: auto;
}

/* 用户角色标签样式 */
.badge {
  padding: 6px 12px;
  font-weight: 500;
  font-size: 12px;
}

.bg-danger {
  background-color: #e74c3c !important;
}

.bg-secondary {
  background-color: #95a5a6 !important;
}

/* 自定义用户列表滚动条样式 */
.user-list::-webkit-scrollbar {
  width: 8px;
}

.user-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.user-list::-webkit-scrollbar-thumb {
  background: #bbb;
  border-radius: 10px;
}

.user-list::-webkit-scrollbar-thumb:hover {
  background: #999;
}
</style> 