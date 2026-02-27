import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

/**
 * 存储登录信息的状态
 */
export const userLoginStore = defineStore('loginUser', () => {
  /**
   * 登陆用户的初始状态
   */
  const loginUser = ref<any>({
    userName: '未登录',
  })
  /**
   * 设置登录用户
   */
  function setLoginUser(newLoginUser: any) {
    loginUser.value = newLoginUser
  }

  /**
   * 根据后端获取的用户信息
   */
  async function fetchLoginUser() {
    // const res = await getCurrentUser()
    // if (res.data.code === 0 && res.data.data) {
    //   setLoginUser(res.data.data)
    // }
  }

  return { loginUser, setLoginUser, fetchLoginUser }
})
