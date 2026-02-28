import { userLoginStore } from '@/stores/userLoginStore.ts'
import { message } from 'ant-design-vue'
import router from '@/router'

// 是否为首次获取登录用户
let firestLogin = true

router.beforeEach(async (to, form, next) => {
  const loginStore = userLoginStore()

  let loginUser = loginStore.loginUser
  if (firestLogin) {
    // 确保页面刷新时，首次加载时，等待后端传来数据再校验
    await loginStore.fetchLoginUser()
    loginUser = loginStore.loginUser
    firestLogin = false
  }
  const userRole = loginUser.userRole
  if (to.path.startsWith('/admin') && userRole !== 'admin') {
    router.push('/')
    message.error('无权限查看')
    return
  }
  next()
})
