<!-- @format -->

<script setup lang="ts">
import { addUserApi } from '@/api/modules/user'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

const dialogFormVisible = ref(false)
const dialogParams = ref({
  getTableList: () => {},
})

const form = ref({
  username: '',
})

const addUser = async () => {
  await addUserApi({ username: form.value.username })
  dialogFormVisible.value = false
  ElMessage.success('新增成功')
  dialogParams.value.getTableList()
}

//打开对话框
const acceptParams = (params: any) => {
  dialogFormVisible.value = true
  dialogParams.value = params
}

defineExpose({
  acceptParams,
})
</script>

<template>
  <div>
    <el-dialog v-model="dialogFormVisible" title="新增管理员" width="500">
      <el-form v-model="form">
        <el-form-item label="账号">
          <el-input v-model="form.username" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="addUser"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
