<script setup lang="ts">
// 菜单列表
import { UserOutlined, PictureOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { h, ref } from 'vue'
import { userLoginStore } from '@/stores/userLoginStore.ts'

const menuItems = [
  {
    key: '/',
    label: '公共图库',
    icon: () => h(PictureOutlined),
  },
  {
    key: '/my_space',
    label: '我的空间',
    icon: () => h(UserOutlined),
  },
]

const router = useRouter()

const userStore = userLoginStore()

// 当前选中菜单
const current = ref<string[]>([])
// 监听路由变化，更新当前选中菜单
router.afterEach((to, from, failure) => {
  current.value = [to.path]
})

// 路由跳转事件
const doMenuClick = ({ key }: { key: string }) => {
  router.push({
    path: key,
  })
}
</script>

<template>
  <div id="globalSider" v-if="userStore.loginUser.username !== '未登录'">
    <a-layout-sider width="200" breakpoint="lg">
      <a-menu v-model:selectedKeys="current" mode="inline" :items="menuItems" @click="doMenuClick">
      </a-menu>
    </a-layout-sider>
  </div>
</template>

<style scoped></style>
