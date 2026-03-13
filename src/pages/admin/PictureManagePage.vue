<template>
  <div class="pictureManage">
    <!--    搜索框-->
    <a-form layout="inline" :model="searchParams" @finish="doSearch">
      <a-form-item label="关键词">
        <a-input v-model:value="searchParams.searchText" placeholder="从名称和简介搜索" allow-clear />
      </a-form-item>
      <a-form-item label="类型">
        <a-input v-model:value="searchParams.category" placeholder="请输入图片类型" allow-clear />
      </a-form-item>
      <a-form-item label="标签">
        <a-select v-model:value="searchParams.tags" mode="tags" style="min-width: 180px" placeholder="请输入标签" allow-clear />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">搜索</a-button>
      </a-form-item>
      <div style="margin-bottom: 20px"></div>
    </a-form>

    <!--    表格-->
    <a-table
      :columns="columns"
      :data-source="pictureList"
      :pagination="pagination"
      @change="doTableChange"
      :scroll="{ x: 'max-content' }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'url'">
          <a-image style="width: 50px" :src="record.url" />
        </template>

        <template v-if="column.dataIndex === 'tags'">
          <a-space wrap>
            <a-tag v-for="tag in JSON.parse(record.tags || '[]')" :key="tag"> {{ tag }}</a-tag>
          </a-space>
        </template>

        <template v-if="column.dataIndex === 'picInfo'">
          <div>格式：{{ record.picFormat }}</div>
          <div>宽度：{{ record.picWidth }}</div>
          <div>高度：{{ record.picHeight }}</div>
          <div>宽高比：{{ record.picWidth / record.picHeight }}</div>
          <div>大小：{{ (record.picSize / 1024).toFixed(2) + 'KB' }}</div>
        </template>

        <template v-if="column.dataIndex === 'createTime'">
          <div>{{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}</div>
        </template>

        <template v-if="column.dataIndex === 'editTime'">
          <div>{{ dayjs(record.editTime).format('YYYY-MM-DD HH:mm:ss') }}</div>
        </template>

        <template v-else-if="column.key === 'action'">
          <a-space>
            <a-button type="link" :href="`/add_picture?id=${record.id}`" target="_blank">编辑</a-button>
            <a-button type="primary" @click="doDelete(record.id)" danger ghost>删除</a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { deletePictureUsingPost, listPictureByPageUsingPost } from '@/api/pictureController.ts'
import dayjs from 'dayjs'
import { message } from 'ant-design-vue'
const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: '图片',
    dataIndex: 'url',
  },
  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: '简介',
    dataIndex: 'introduction',
    ellipsis: true,
  },
  {
    title: '类型',
    dataIndex: 'category',
  },
  {
    title: '标签',
    dataIndex: 'tags',
  },
  {
    title: '图片信息',
    dataIndex: 'picInfo',
  },
  {
    title: '用户 id',
    dataIndex: 'pictureId',
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

const pictureList = ref<API.Picture[]>([])
const total = ref<number>(0)
// 搜索条件
const searchParams = reactive<API.PictureQueryRequest>({
  category: '',
  tags: [],
  searchText: '',
  current: 1,
  pageSize: 10,
  sortOrder: 'descend',
})
// 调用搜索接口
const searchParam = async () => {
  const res = await listPictureByPageUsingPost(searchParams)
  if (res.data.code === 0 && res.data.data) {
    pictureList.value = res.data.data.records ?? []
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
  const res = await deletePictureUsingPost({ id: id })
  if (res.data.code === 0) {
    message.success('删除成功')
    await searchParam()
  } else {
    message.error('删除失败' + res.data.message)
  }
}
</script>
