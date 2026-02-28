<template>
  <div class="userManage">
    <!--    搜索框-->
    <a-form layout="inline" :model="searchParams" @finish="doSearch">
      <a-form-item label="账号">
        <a-input v-model:value="searchParams.userAccount" placeholder="输入账号" allow-clear />
      </a-form-item>
      <a-form-item label="用户名">
        <a-input v-model:value="searchParams.userName" placeholder="输入用户名" allow-clear />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">搜索</a-button>
      </a-form-item>
      <div style="margin-bottom: 20px"></div>
    </a-form>

    <!--    表格-->
    <a-table
      :columns="columns"
      :data-source="userList"
      :pagination="pagination"
      @change="doTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'userAvatar'">
          <a-image style="width: 50px" :src="record.userAvatar" />
        </template>

        <template v-else-if="column.dataIndex === 'userRole'">
          <div v-if="record.userRole === 'user'">
            <a-tag color="green">普通用户</a-tag>
          </div>
          <div v-else>
            <a-tag color="blue">管理员</a-tag>
          </div>
        </template>

        <template v-else-if="column.dataIndex === 'createTime'">
          <div>{{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}</div>
        </template>

        <template v-else-if="column.key === 'action'">
          <a-space>
            <a-button type="primary">编辑</a-button>
            <a-button type="primary" @click="doDelete(record.id)" danger ghost>删除</a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { deleteUserUsingPost, listUserVoByPageUsingPost } from '@/api/userController.ts'
import dayjs from 'dayjs'
import { message } from 'ant-design-vue'
const columns = [
  {
    title: 'id',
    dataIndex: 'id',
  },
  {
    title: '账号',
    dataIndex: 'userAccount',
  },
  {
    title: '用户名',
    dataIndex: 'username',
  },
  {
    title: '头像',
    dataIndex: 'userAvatar',
  },
  {
    title: '简介',
    dataIndex: 'userProfile',
  },
  {
    title: '用户角色',
    dataIndex: 'userRole',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    key: 'action',
  },
]
const userList = ref<API.UserVO[]>([])
const total = ref<number>(0)
// 搜索条件
const searchParams = reactive<API.UserQueryRequest>({
  userAccount: '',
  username: '',
  current: 1,
  pageSize: 10,
})
// 调用搜索接口
const searchParam = async () => {
  const res = await listUserVoByPageUsingPost(searchParams)
  if (res.data.code === 0 && res.data.data) {
    userList.value = res.data.data.records ?? []
    total.value = Number(res.data.data.total) ?? 0
  }
}

// 页面加载时请求一次数据
onMounted(async () => {
  await searchParam()
})

// 分页参数
const pagination = computed(() => {
  return {
    current: searchParams.current ?? 1,
    pageSize: searchParams.pageSize ?? 10,
    total: total.value,
    showSizeChanger: true,
    showTotal: (total: number) => `共 ${total} 条`,
  }
})

// 分页切换
const doTableChange = async (pagination: any) => {
  searchParams.current = pagination.current
  searchParams.pageSize = pagination.pageSize
  await searchParam()
}

// 搜索框
const doSearch = async () => {
  // 重置页码
  searchParams.current = 1
  await searchParam()
}

// 删除
const doDelete = async (id: number) => {
  if (!id) {
    return
  }
  const res = await deleteUserUsingPost({ id: id })
  if (res.data.code === 0) {
    message.success('删除成功')
    await searchParam()
  } else {
    message.error('删除失败' + res.data.message)
  }
}
</script>
