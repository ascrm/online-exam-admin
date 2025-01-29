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
        <el-button type="primary" :icon="CirclePlus" @click="openDialog">新增管理员</el-button>
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
        <el-button type="primary" link :icon="Refresh" @click="resetPass(scope.row)">重置密码</el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <UserDialog ref="userDialogRef"></UserDialog>
    <ImportExcel ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { ref, reactive } from 'vue'
import { User } from '@/api/interface'
import { useHandleData } from '@/hooks/useHandleData'
import ProTable from '@/components/ProTable/index.vue'
import ImportExcel from '@/components/ImportExcel/index.vue'
import { ProTableInstance, ColumnProps } from '@/components/ProTable/interface'
import { CirclePlus, Delete, Refresh } from '@element-plus/icons-vue'
import { getUserListApi, deleteUserApi, resetUserPassWordApi, batchDelUserApi } from '@/api/modules/user'
import UserDialog from './components/userDialog.vue'

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
  return getUserListApi({ pageNum: newParams.pageNum, pageSize: newParams.pageSize })
}

// 表格配置项
const columns = reactive<ColumnProps<User.ResUserList>[]>([
  { type: 'selection', fixed: 'left', width: 70 },
  {
    prop: 'username',
    label: '用户账号',
    search: { el: 'input', tooltip: '我是搜索提示' },
  },
  { prop: 'role', label: '角色' },
  { prop: 'nickName', label: '昵称' },
  {
    prop: 'gender',
    label: '性别',
    search: { el: 'select', props: { filterable: true } },
  },
  { prop: 'email', label: '邮箱', width: 200 },
  { prop: 'phone', label: '电话' },
  { prop: 'createdAt', label: '创建时间', width: 240 },
  { prop: 'operation', label: '操作', fixed: 'right', width: 220 },
])

// 删除用户信息
const deleteAccount = async (params: User.ResUserList) => {
  await useHandleData(deleteUserApi, { id: params.id }, `删除【${params.username}】用户`)
  proTable.value?.getTableList()
}

// 批量删除用户信息
const batchDelete = async (ids: string[]) => {
  await useHandleData(batchDelUserApi, { ids: ids.join(',') }, '删除所选用户信息')
  proTable.value?.clearSelection()
  proTable.value?.getTableList()
}

// 重置用户密码
const resetPass = async (params: User.ResUserList) => {
  await useHandleData(resetUserPassWordApi, { id: params.id }, `重置【${params.username}】用户密码`)
  proTable.value?.getTableList()
}

//新增管理员
const userDialogRef = ref<InstanceType<typeof UserDialog> | null>(null)
const openDialog = () => {
  userDialogRef.value?.acceptParams({ getTableList: proTable.value?.getTableList })
}
</script>
