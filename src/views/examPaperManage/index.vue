<!-- @format -->

<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
      @drag-sort="sortTable"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button type="primary" :icon="CirclePlus" @click="openDialog('新增')">新增试卷</el-button>
        <el-button type="primary" :icon="Download" plain @click="downloadFile">导出用户数据</el-button>
        <el-button
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.selectedListIds)"
        >
          批量删除用户
        </el-button>
      </template>

      <!-- 表格操作 -->
      <template #operation="scope">
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
import { useDownload } from '@/hooks/useDownload'
import { ElMessage, ElMessageBox } from 'element-plus'
import ProTable from '@/components/ProTable/index.vue'
import ImportExcel from '@/components/ImportExcel/index.vue'
import { ProTableInstance, ColumnProps } from '@/components/ProTable/interface'
import { CirclePlus, Delete, Download, EditPen, Refresh } from '@element-plus/icons-vue'
import { deleteUserApi, resetUserPassWordApi, exportUserInfoApi, BatchAddUserApi } from '@/api/modules/user'
import { addExamPaperApi, deleteExamPaperApi, editExamPaperApi, getExamPaperListApi } from '@/api/modules/examPaper'
import ExamPaperDialog from './components/examPaperDialog.vue'
import api from '@/api'

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
  {
    prop: 'duration',
    label: '考试时长',
  },
  {
    prop: 'totalScore',
    label: '总分',
  },
  { prop: 'passingScore', label: '及格分数' },
  { prop: 'isPublishedLabel', label: '是否发布' },
  {
    prop: 'description',
    label: '备注',
  },
  {
    prop: 'createdAt',
    label: '创建时间',
    width: 200,
    search: {
      el: 'date-picker',
      span: 2,
      props: { type: 'datetimerange', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      defaultValue: ['2022-11-12 11:35:00', '2022-12-12 11:35:00'],
    },
  },
  {
    prop: 'updatedAt',
    label: '修改时间',
    width: 200,
    search: {
      el: 'date-picker',
      span: 2,
      props: { type: 'datetimerange', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      defaultValue: ['2022-11-12 11:35:00', '2022-12-12 11:35:00'],
    },
  },
  { prop: 'operation', label: '操作', fixed: 'right', width: 200 },
])

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  ElMessage.success('修改列表排序成功')
}

// 删除用户信息
const deleteAccount = async (params: User.ResUserList) => {
  await useHandleData(deleteExamPaperApi, { id: params.id }, `删除【${params.username}】用户`)
  proTable.value?.getTableList()
}

// 批量删除用户信息
const batchDelete = async (id: string[]) => {
  await useHandleData(deleteUserApi, { id }, '删除所选用户信息')
  proTable.value?.clearSelection()
  proTable.value?.getTableList()
}

// 导出用户列表
const downloadFile = async () => {
  ElMessageBox.confirm('确认导出用户数据?', '温馨提示', { type: 'warning' }).then(() =>
    useDownload(exportUserInfoApi, '用户列表', proTable.value?.searchParam),
  )
}

//新增试卷
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
