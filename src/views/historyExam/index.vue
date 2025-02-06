<!-- @format -->

<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="routerPushHandler(scope.row)">查看详情</el-button>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { ref, reactive } from 'vue'
import { User } from '@/api/interface'
import ProTable from '@/components/ProTable/index.vue'
import { ProTableInstance, ColumnProps } from '@/components/ProTable/interface'
import { View } from '@element-plus/icons-vue'
import { getHistoryExamListApi } from '@/api/modules/historyExam'
import router from '@/routers'

// ProTable 实例
const proTable = ref<ProTableInstance>()

// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ type: 1 })

// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total,
  }
}

// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params))
  newParams.createTime && (newParams.startTime = newParams.createTime[0])
  newParams.createTime && (newParams.endTime = newParams.createTime[1])
  delete newParams.createTime
  return getHistoryExamListApi({ pageNum: newParams.pageNum, pageSize: newParams.pageSize })
}

// 表格配置项
const columns = reactive<ColumnProps<User.ResUserList>[]>([
  { type: 'selection', fixed: 'left', width: 70 },
  {
    prop: 'name',
    label: '试卷名称',
    search: { el: 'input', tooltip: '我是搜索提示' },
  },
  { prop: 'score', label: '试卷得分' },
  { prop: 'passingScore', label: '及格分数' },
  { prop: 'totalScore', label: '试卷总分' },
  { prop: 'createdAt', label: '考试时间', width: 240 },
  { prop: 'operation', label: '操作', fixed: 'right', width: 220 },
])

const routerPushHandler = (row: any) => {
  localStorage.setItem('examPaper', JSON.stringify(row))
  router.push('/historyExamInfo')
}
</script>
