<!-- @format -->

<template>
  <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
    <el-form-item prop="username">
      <el-input v-model="loginForm.username" placeholder="请输入账号">
        <template #prefix>
          <el-icon class="el-input__icon">
            <user />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        v-model="loginForm.password"
        type="password"
        placeholder="请输入密码"
        show-password
        autocomplete="new-password"
      >
        <template #prefix>
          <el-icon class="el-input__icon">
            <lock />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
  </el-form>

  <div class="flex justify-end pb-[10px] text-[1.2em] text-gray-500">
    <div class="cursor-pointer hover:text-blue-400" v-if="!isRegister" @click="changeForm">还没有账号?点击注册</div>
    <div class="cursor-pointer hover:text-blue-400" v-else @click="changeForm">已有账号?点击登录</div>
  </div>

  <div>
    <el-button
      v-if="!isRegister"
      class="w-[100%]"
      :icon="UserFilled"
      round
      size="large"
      type="primary"
      :loading="loading"
      @click="login(loginFormRef)"
    >
      登录
    </el-button>
    <el-button
      v-else
      class="w-[100%]"
      :icon="UserFilled"
      round
      size="large"
      type="primary"
      :loading="loading"
      @click="register(registerFormRef)"
    >
      注册
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { HOME_URL } from '@/config'
import { getTimeState } from '@/utils'
import { Login } from '@/api/interface'
import { ElMessage, ElNotification } from 'element-plus'
import { loginApi, registerApi } from '@/api/modules/auth'
import { useUserStore } from '@/stores/modules/user'
import { useTabsStore } from '@/stores/modules/tabs'
import { useKeepAliveStore } from '@/stores/modules/keepAlive'
import { initDynamicRouter } from '@/routers/modules/dynamicRouter'
import { UserFilled } from '@element-plus/icons-vue'
import type { ElForm } from 'element-plus'
import md5 from 'md5'

const isRegister = ref(false)

const router = useRouter()
const userStore = useUserStore()
const tabsStore = useTabsStore()
const keepAliveStore = useKeepAliveStore()

type FormInstance = InstanceType<typeof ElForm>
const loginFormRef = ref<FormInstance>()
const registerFormRef = ref<FormInstance>()
const loginRules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  confirmPassword: [{ required: true, message: '请确认密码', trigger: 'blur' }],
})

const loading = ref(false)
const loginForm = reactive<Login.ReqLoginForm>({
  username: '',
  password: '',
  confirmPassword: '',
})

// login
const login = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async valid => {
    if (!valid) return
    loading.value = true
    try {
      // 1.执行登录接口
      const { data } = await loginApi({
        ...loginForm,
        password: md5(loginForm.password),
      })
      userStore.setToken(data.token)
      userStore.setUserInfo(data.userInfo)

      // 2.添加动态路由
      await initDynamicRouter()

      // 3.清空 tabs、keepAlive 数据
      tabsStore.setTabs([])
      keepAliveStore.setKeepAliveName([])

      // 4.跳转到首页
      router.push(HOME_URL)
      const welcomeStr = getTimeState()
      ElNotification({
        title: '欢迎使用online-exam 😄😄😄',
        dangerouslyUseHTMLString: true,
        message: welcomeStr + ',' + data.userInfo.nickName,
        type: 'success',
        duration: 8000,
      })
    } finally {
      loading.value = false
    }
  })
}

//register
const register = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async valid => {
    if (!valid) return
    loading.value = true
    try {
      const { msg } = await registerApi({
        ...loginForm,
        password: md5(loginForm.password),
      })
      ElMessage.success(msg)
    } finally {
      loading.value = false
    }
  })
}

const changeForm = () => {
  loginForm.username = ''
  loginForm.password = ''
  loginForm.confirmPassword = ''
  isRegister.value = !isRegister.value
}

onMounted(() => {
  // 监听 enter 事件（调用登录）
  document.onkeydown = (e: KeyboardEvent) => {
    if (e.code === 'Enter' || e.code === 'enter' || e.code === 'NumpadEnter') {
      if (loading.value) return
      login(loginFormRef.value)
    }
  }
})

onBeforeUnmount(() => {
  document.onkeydown = null
})
</script>

<style scoped lang="scss">
@import '../index';
</style>
