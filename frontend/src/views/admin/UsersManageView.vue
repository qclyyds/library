<template>
  <div class="users-manage">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>用户管理</h2>
    </div>

    <div class="table-responsive">
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
              <span :class="{'badge bg-primary': user.role === 'user', 'badge bg-danger': user.role === 'admin'}">
                {{ user.role === 'admin' ? '管理员' : '普通用户' }}
              </span>
            </td>
            <td>{{ formatDate(user.created_at) }}</td>
            <td>
              <button 
                class="btn btn-sm btn-danger" 
                @click="deleteUser(user.id)"
                :disabled="user.role === 'admin'"
              >
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

const users = ref([])
const loading = ref(false)
const error = ref(null)

// 获取所有用户
async function fetchUsers() {
  loading.value = true
  error.value = null
  
  try {
    const response = await axios.get('http://localhost:3000/api/admin/users')
    users.value = response.data
  } catch (err) {
    error.value = '获取用户列表失败'
    console.error(err)
  } finally {
    loading.value = false
  }
}

// 删除用户
async function deleteUser(userId) {
  if (!confirm('确定要删除这个用户吗？此操作不可恢复！')) return
  
  try {
    await axios.delete(`http://localhost:3000/api/admin/users/${userId}`)
    await fetchUsers()
  } catch (err) {
    alert('删除用户失败：' + (err.response?.data?.message || err.message))
  }
}

// 格式化日期
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

onMounted(() => {
  fetchUsers()
})
</script> 