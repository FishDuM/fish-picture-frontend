<template>
  <div class="spaceManage">
    <a-flex justify="space-between" align="middle">
      <h2>空间管理</h2>
      <a-space>
        <a-button type="primary" :href="`/add_space`" target="_blank">创建空间</a-button>
      </a-space>
    </a-flex>
    <!--    搜索框-->
    <a-form layout="vertical" :model="searchParams" @finish="doSearch">
      <a-form-item label="空间名称" name="spaceName">
        <a-input v-model:value="searchParams.spaceName" placeholder="请输入空间名称" allow-clear />
      </a-form-item>
      <a-form-item label="空间级别" name="spaceLevel">
        <a-select
          v-model:value="searchParams.spaceLevel"
          :options="SPACE_LEVEL_OPTIONS"
          placeholder="请输入空间级别"
          style="min-width: 180px"
          allow-clear
        />
      </a-form-item>

      <a-form-item label="用户ID" name="userId">
        <a-input v-model:value="searchParams.userId" placeholder="请输入用户ID" allow-clear />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%" :loading="loading">
          提交
        </a-button>
      </a-form-item>
    </a-form>

    <!--    表格-->
    <a-table
      :columns="columns"
      :data-source="spaceList"
      :pagination="pagination"
      @change="doTableChange"
      :scroll="{ x: 'max-content' }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'spaceLevel'">
          <div>{{ SPACE_LEVEL_MAP[record.spaceLevel] }}</div>
        </template>

        <template v-if="column.dataIndex === 'spaceUseInfo'">
          <div>大小：{{ formatSize(record.totalSize) }} / {{ formatSize(record.maxSize) }}</div>
          <div>数量：{{ record.totalCount }} / {{ record.maxCount }}</div>
        </template>

        <template v-if="column.dataIndex === 'createTime'">
          <div>{{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}</div>
        </template>

        <template v-if="column.dataIndex === 'editTime'">
          <div>{{ dayjs(record.editTime).format('YYYY-MM-DD HH:mm:ss') }}</div>
        </template>

        <template v-else-if="column.key === 'action'">
          <a-space wrap style="max-width: 40px">
            <a-button type="link" :href="`/add_space?id=${record.id}`" target="_blank"
              >编辑</a-button
            >
            <a-button type="primary" @click="doDelete(record.id)" danger ghost>删除</a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { deleteSpaceUsingPost, listSpaceByPageUsingPost } from '@/api/spaceController.ts'
import dayjs from 'dayjs'
import { message } from 'ant-design-vue'
import { SPACE_LEVEL_MAP, SPACE_LEVEL_OPTIONS } from '@/constants/space.ts'
import { formatSize } from '@/utils'
const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: '空间名称',
    dataIndex: 'spaceName',
  },
  {
    title: '空间级别',
    dataIndex: 'spaceLevel',
  },
  {
    title: '使用情况',
    dataIndex: 'spaceUseInfo',
  },
  {
    title: '用户 id',
    dataIndex: 'userId',
    width: 80,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '编辑时间',
    dataIndex: 'editTime',
  },
  {
    title: '操作',
    key: 'action',
  },
]

const spaceList = ref<API.Space[]>([])
const total = ref<number>(0)
// 搜索条件
const searchParams = reactive<API.SpaceQueryRequest>({
  spaceName: '',
  spaceLevel: undefined,
  userId: undefined,
  current: 1,
  pageSize: 10,
  sortOrder: 'descend',
})
// 调用搜索接口
const searchParam = async () => {
  const res = await listSpaceByPageUsingPost(searchParams)
  if (res.data.code === 0 && res.data.data) {
    spaceList.value = res.data.data.records ?? []
    total.value = Number(res.data.data.total) ?? 0
  } else {
    message.error('获取空间列表失败' + res.data.message)
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
  const res = await deleteSpaceUsingPost({ id: id })
  if (res.data.code === 0) {
    message.success('删除成功')
    await searchParam()
  } else {
    message.error('删除失败' + res.data.message)
  }
}

// lodding
const loading = ref(false)
</script>
