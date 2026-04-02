<template>
  <div class="pictureManage">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="图片管理">
        <!--    搜索框-->
        <a-form layout="inline" :model="searchParams" @finish="doSearch">
          <a-form-item label="关键词">
            <a-input
              v-model:value="searchParams.searchText"
              placeholder="从名称和简介搜索"
              allow-clear
            />
          </a-form-item>
          <a-form-item label="类型">
            <a-input
              v-model:value="searchParams.category"
              placeholder="请输入图片类型"
              allow-clear
            />
          </a-form-item>
          <a-form-item label="标签">
            <a-select
              v-model:value="searchParams.tags"
              mode="tags"
              style="min-width: 180px"
              placeholder="请输入标签"
              allow-clear
            />
          </a-form-item>

          <a-form-item label="审核状态">
            <a-input-group compact>
              <a-select v-model:value="searchParams.reviewstatus">
                <a-select-option :value="PIC_REVIEW_STATUS_ENUM.REVIEWING">待审核</a-select-option>
                <a-select-option :value="PIC_REVIEW_STATUS_ENUM.PASS">已通过</a-select-option>
                <a-select-option :value="PIC_REVIEW_STATUS_ENUM.REJECT">已拒绝</a-select-option>
              </a-select>
            </a-input-group>
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

            <template v-if="column.dataIndex === 'reviewMessage'">
              <div>审核状态：{{ PIC_REVIEW_STATUS_MAP[record.reviewstatus] }}</div>
              <div>审核信息：{{ record.reviewmessage }}</div>
              <div>审核人：{{ record.reviewerid }}</div>
              <div v-if="record.reviewtime">
                审核时间：{{ dayjs(record.reviewtime).format('YYYY-MM-DD HH:mm:ss') }}
              </div>
            </template>

            <template v-if="column.dataIndex === 'createTime'">
              <div>{{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}</div>
            </template>

            <template v-if="column.dataIndex === 'editTime'">
              <div>{{ dayjs(record.editTime).format('YYYY-MM-DD HH:mm:ss') }}</div>
            </template>

            <template v-else-if="column.key === 'action'">
              <a-space wrap style="max-width: 40px">
                <a-button
                  v-if="record.reviewstatus !== PIC_REVIEW_STATUS_ENUM.PASS"
                  type="link"
                  @click="handleReview(record, PIC_REVIEW_STATUS_ENUM.PASS)"
                  >通过</a-button
                >
                <a-button
                  type="link"
                  danger
                  v-if="record.reviewstatus !== PIC_REVIEW_STATUS_ENUM.REJECT"
                  @click="handleReview(record, PIC_REVIEW_STATUS_ENUM.REJECT)"
                  target="_blank"
                  >拒绝</a-button
                >
                <a-button type="link" :href="`/add_picture?id=${record.id}`" target="_blank"
                  >编辑</a-button
                >
                <a-button type="primary" @click="doDelete(record.id)" danger ghost>删除</a-button>
              </a-space>
            </template>
          </template>
        </a-table>
      </a-tab-pane>
      <a-tab-pane key="2" tab="批量创建图片" force-render>
        <a-form name="basic" autocomplete="off" style="max-width: 50%; margin: 30px auto">
          <a-form-item label="数量" name="count">
            <a-input-number
              :min="1"
              :max="30"
              v-model:value="searchAllUrl.count"
              placeholder="请输入获取图片的数量"
              style="width: 100%"
            />
          </a-form-item>

          <a-form-item label="图片命名前缀" name="namePrefix">
            <a-input v-model:value="searchAllUrl.namePrefix" placeholder="请输入图片名称前缀" />
          </a-form-item>

          <a-form-item label="图片搜索关键词" name="searchText">
            <a-input v-model:value="searchAllUrl.searchText" placeholder="请输入图片搜索关键词" />
          </a-form-item>

          <a-form-item>
            <a-button style="width: 100%" type="primary" @click="doSearchAllByUrl"
              >批量抓取</a-button
            >
          </a-form-item>
        </a-form>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import {
  deletePictureUsingPost,
  doPictureReviewUsingPost,
  listPictureByPageUsingPost,
  uploadPictureByBatchUsingPost,
} from '@/api/pictureController.ts'
import dayjs from 'dayjs'
import { message } from 'ant-design-vue'
import { PIC_REVIEW_STATUS_ENUM, PIC_REVIEW_STATUS_MAP } from '@/constants/picture.ts'
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
    title: '审核信息',
    dataIndex: 'reviewMessage',
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
  reviewstatus: 1,
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

// 审核
const handleReview = async (record: API.Picture, status: number) => {
  const res = await doPictureReviewUsingPost({
    id: record.id,
    reviewMessage: '管理员操作',
    reviewStatus: status,
  })
  if (res.data.code === 0) {
    message.success('审核成功')
    await searchParam()
  } else {
    message.error('审核失败' + res.data.message)
  }
}

const activeKey = ref('1')

const searchAllUrl = ref<API.PictureUploadByBatchRequest>({
  count: 1,
  namePrefix: '',
  searchText: '',
})

const doSearchAllByUrl = async () => {
  const res = await uploadPictureByBatchUsingPost(searchAllUrl.value)
  if (res.data.code === 0) {
    message.success('批量获取成功')
  } else {
    message.error('批量获取失败' + res.data.message)
  }
}
</script>
