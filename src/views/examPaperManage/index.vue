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
        <el-button type="primary" :icon="CirclePlus" @click="openDialog('新增')">新增试卷</el-button>
        <el-button
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.selectedListIds)"
        >
          批量删除试卷
        </el-button>
      </template>

      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="Plus" @click="routerPushHandler(scope.row)">导入试题</el-button>

        <el-button type="primary" link :icon="EditPen" @click="openDialog('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <ExamPaperDialog ref="dialogRef"></ExamPaperDialog>
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
import { CirclePlus, Delete, EditPen, Plus } from '@element-plus/icons-vue'
import {
  addExamPaperApi,
  batchDelExamPaperApi,
  deleteExamPaperApi,
  editExamPaperApi,
  getExamPaperListApi,
} from '@/api/modules/examPaper'
import ExamPaperDialog from './components/examPaperDialog.vue'
import router from '@/routers'
import { stringify } from 'qs'

//路由跳转方法
const routerPushHandler = (params: any) => {
  localStorage.setItem('examPaper', JSON.stringify(params))
  router.push(`/importQuestion/`)
}

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
  return getExamPaperListApi({ pageNum: newParams.pageNum, pageSize: newParams.pageSize })
}

// 表格配置项
const columns = reactive<ColumnProps<User.ResUserList>[]>([
  { type: 'selection', fixed: 'left', width: 70 },
  {
    prop: 'name',
    label: '试卷名称',
    search: { el: 'input', tooltip: '我是搜索提示' },
  },
  { prop: 'duration', label: '考试时长' },
  { prop: 'totalScore', label: '总分' },
  { prop: 'passingScore', label: '及格分数' },
  { prop: 'isPublishedLabel', label: '是否发布' },
  { prop: 'description', label: '备注' },
  { prop: 'createdAt', label: '创建时间', width: 240 },
  { prop: 'updatedAt', label: '修改时间', width: 240 },
  { prop: 'operation', label: '操作', fixed: 'right', width: 260 },
])

// 删除试卷信息
const deleteAccount = async (params: User.ResUserList) => {
  await useHandleData(deleteExamPaperApi, { id: params.id }, `删除【${params.username}】试卷`)
  proTable.value?.getTableList()
}

// 批量删除试卷信息
const batchDelete = async (ids: string[]) => {
  await useHandleData(batchDelExamPaperApi, { ids: ids.join(',') }, '删除所选试卷信息')
  proTable.value?.clearSelection()
  proTable.value?.getTableList()
}

//新增-编辑试卷
const dialogRef = ref<InstanceType<typeof ExamPaperDialog> | null>(null)
const openDialog = (title: string, row: any = {}) => {
  const params = {
    title,
    row: { ...row },
    api: title === '新增' ? addExamPaperApi : editExamPaperApi,
    getTableList: proTable.value?.getTableList,
  }
  dialogRef.value?.acceptParams(params)
}
</script>
