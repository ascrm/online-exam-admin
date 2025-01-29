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
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button type="primary" :icon="CirclePlus" @click="openDialog('新增')">新增题目</el-button>
        <el-button
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.selectedListIds)"
        >
          批量删除题目
        </el-button>
      </template>

      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View">查看详情</el-button>

        <el-button type="primary" link :icon="EditPen" @click="openDialog('编辑', scope.row)">编辑</el-button>

        <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <QuestionDialog ref="dialogRef"></QuestionDialog>
    <ImportExcel />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { ref, reactive } from 'vue'
import { User } from '@/api/interface'
import { useHandleData } from '@/hooks/useHandleData'
import ProTable from '@/components/ProTable/index.vue'
import ImportExcel from '@/components/ImportExcel/index.vue'
import { ProTableInstance, ColumnProps } from '@/components/ProTable/interface'
import { CirclePlus, Delete, EditPen, View } from '@element-plus/icons-vue'
import { batchDelExamPaperApi, editExamPaperApi } from '@/api/modules/examPaper'
import QuestionDialog from './components/questionDialog.vue'
import { addQuestionApi, batchDelQuestionApi, deleteQuestionApi, getQuestionListApi } from '@/api/modules/question'

// ProTable 实例
const proTable = ref<ProTableInstance>()

// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ type: 1 })
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
  return getQuestionListApi({ pageNum: newParams.pageNum, pageSize: newParams.pageSize })
}

// 表格配置项
const columns = reactive<ColumnProps<User.ResUserList>[]>([
  { type: 'selection', fixed: 'left', width: 70 },
  { prop: 'questionTypeLabel', label: '题型', fixed: 'left', width: 120 },

  {
    prop: 'name',
    label: '题目名称',
    fixed: 'left',
    search: { el: 'input', tooltip: '我是搜索提示' },
  },
  { prop: 'description', label: '题干' },
  { prop: 'difficultyLabel', label: '难度' },
  { prop: 'createdBy', label: '作者' },
  { prop: 'createdAt', label: '创建时间', width: 240 },
  { prop: 'operation', label: '操作', fixed: 'right', width: 290 },
])

// 删除题目信息
const deleteAccount = async (params: any) => {
  await useHandleData(deleteQuestionApi, { id: params.id }, `删除【${params.name}】题目`)
  proTable.value?.getTableList()
}

// 批量删除题目信息
const batchDelete = async (ids: string[]) => {
  await useHandleData(batchDelQuestionApi, { ids: ids.join(',') }, '删除所选题目信息')
  proTable.value?.clearSelection()
  proTable.value?.getTableList()
}

//新增-编辑题目
const dialogRef = ref<InstanceType<typeof QuestionDialog> | null>(null)
const openDialog = (title: string, row: any = {}) => {
  const params = {
    title,
    row: { ...row },
    api: title === '新增' ? addQuestionApi : editExamPaperApi,
    getTableList: proTable.value?.getTableList,
  }
  dialogRef.value?.acceptParams(params)
}
</script>
