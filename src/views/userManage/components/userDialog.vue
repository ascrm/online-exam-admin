<!-- @format -->

<script setup lang="ts">
import { ref } from 'vue'

const dialogFormVisible = ref(true)

const form = ref({
  username: '',
})

//打开对话框
const open = () => {
  dialogFormVisible.value = true
}

defineExpose({
  open,
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
          <el-button type="primary" @click="dialogFormVisible = false"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
