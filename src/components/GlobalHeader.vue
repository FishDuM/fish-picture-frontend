<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import { HomeOutlined } from '@ant-design/icons-vue'
import { MenuProps, message } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import { userLoginStore } from '@/stores/userLoginStore.ts'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons-vue'
import { userLogoutUsingPost } from '@/api/userController.ts'

// 当前选中菜单
const current = ref<string[]>([])

// 未经过滤的菜单项
const originItems = [
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: '主页',
    title: '主页',
  },
  {
    key: '/about',
    label: '关于',
    title: '关于',
  },
  {
    key: '/admin/manage',
    label: '用户管理',
    title: '用户管理',
  },
  // {
  //   key: 'others',
  //   label: h('a', { href: '#', target: '_blank' }, '关于小鱼'),
  //   title: '关于小鱼',
  // },
]

// 已过滤的菜单项
const items = computed(() => {
  return filteredItems(originItems)
})

const userLogin = userLoginStore()

// 过滤菜单项
const filteredItems = (menus = [] as MenuProps['items']) => {
  return menus?.filter((item) => {
    if ((item?.key as string)?.startsWith('/admin') && userLogin.loginUser.userRole !== 'admin') {
      return false
    }
    return true
  })
}

const router = useRouter()
const route = useRoute()

// 路由跳转事件
const doMenuClick = ({ key }: { key: string }) => {
  router.push({
    path: key,
  })
}

// 监听路由变化，更新当前选中菜单
router.afterEach((to, from, next) => {
  current.value = [to.path]
})

// 退出登录
async function logout() {
  const res = await userLogoutUsingPost()
  if (res.data.code === 0) {
    userLogin.setLoginUser({})
    message.success('退出成功')
    return
  } else {
    message.error('退出失败' + res.data.message)
  }
}

// 个人中心
function personSpace() {
  // TODO
}
</script>

<template>
  <div id="globalHeader">
    <a-row :wrap="false">
      <a-col flex="200px">
        <RouterLink to="/">
          <div class="title-bar">
            <img class="logo" src="../assets/logo.png" alt="logo" />
            <div class="title">小鱼云图库</div>
          </div>
        </RouterLink>
      </a-col>

      <!-- 菜单布局 -->
      <a-col flex="auto">
        <a-menu
          v-model:selectedKeys="current"
          mode="horizontal"
          :items="items"
          @click="doMenuClick"
        />
      </a-col>

      <a-col flex="150px">
        <div class="user-login-status">
          <!-- 登录用户信息 -->
          <div v-if="userLogin.loginUser.id">
            <a-dropdown>
              <a-space>
                <a-avatar :src="userLogin.loginUser.userAvatar" />
                {{ userLogin.loginUser.username ?? '小鱼' }}
              </a-space>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a href="javascript:;">
                      <UserOutlined @click="personSpace" />
                      个人中心</a
                    >
                  </a-menu-item>
                  <a-menu-item>
                    <a href="javascript:;" @click="logout">
                      <LogoutOutlined />
                      退出登录</a
                    >
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
          <a-button v-else-if="route.path !== '/user/login'" type="primary" href="/user/login"
            >登录</a-button
          >
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped>
.title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: black;
  font-size: 18px;
  margin-left: 16px;
}

.logo {
  height: 48px;
}
</style>
