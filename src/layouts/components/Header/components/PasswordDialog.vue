<!-- @format -->

<template>
  <el-dialog
    :show-close="false"
    :close-on-click-modal="false"
    v-model="dialogVisible"
    title="修改密码"
    width="500px"
    draggable
  >
    <el-form size="large" label-width="100px">
      <el-form-item label="手机号">
        <el-input v-model="params.phoneNumber"></el-input>
      </el-form-item>
      <el-form-item label="新密码">
        <el-input type="password" v-model="params.newPassword"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码">
        <el-input type="password" v-model="params.confirmNewPassword"></el-input>
      </el-form-item>
      <el-form-item label="验证码">
        <div class="flex w-[100%] justify-between">
          <el-input class="w-[50%]" v-model="params.code"></el-input>
          <el-button @click="getConfirmCode">获取验证码</el-button>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitHandler">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { getConfirmCodeApi, updatePasswordApi } from '@/api/modules/auth'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

const dialogVisible = ref(false)

const params = ref({
  phoneNumber: '',
  code: '',
  newPassword: '',
  confirmNewPassword: '',
})

//获取验证码
const getConfirmCode = async () => {
  const { msg } = await getConfirmCodeApi(params.value)
  ElMessage.success(msg)
}

//修改密码
const submitHandler = async () => {
  const { msg } = await updatePasswordApi(params.value)
  ElMessage.success(msg)
  dialogVisible.value = false
}
const openDialog = () => {
  dialogVisible.value = true
}

defineExpose({ openDialog })
</script>
