<template>
  <div class="register-container">
    <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="register-form" autocomplete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">注册界面</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="registerForm.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltipPassword" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="registerForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock($event, 'password')"
            @blur="capsTooltipPassword = false"
          />
          <span class="show-pwd" @click="showPwd('password')">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-tooltip v-model="capsTooltipConfirmPassword" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="confirmPassword">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="confirmPasswordType"
            ref="confirmPassword"
            v-model="registerForm.confirmPassword"
            :type="confirmPasswordType"
            placeholder="确认密码"
            name="confirmPassword"
            tabindex="3"
            autocomplete="on"
            @keyup.native="checkCapslock($event, 'confirmPassword')"
            @blur="capsTooltipConfirmPassword = false"
          />
          <span class="show-pwd" @click="showPwd('confirmPassword')">
            <svg-icon :icon-class="confirmPasswordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-form-item prop="displayName">
        <span class="svg-container">
          <svg-icon icon-class="displayName" />
        </span>
        <el-input
          ref="displayName"
          v-model="registerForm.displayName"
          placeholder="昵称"
          name="displayName"
          tabindex="4"
          autocomplete="on"
          @keyup.enter.native="handleRegister"
        />
      </el-form-item>
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleRegister">注册</el-button>
      <div class="login-link">
        <a href="/login" class="login-link-text">回到登录</a>
      </div>
    </el-form>
  </div>
</template>

<script>
import { validUsername, validDisplayName } from '@/utils/validate'
import { register } from '@/api/user'
export default {
  name: 'Register',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('用户名不可为空！'))
        return
      }
      validUsername(value).then(response => {
        if (!response) {
          callback(new Error('用户名已存在！'))
        } else {
          callback()
        }
      })
    }

    const validateDisplayName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('昵称不可为空！'))
        return
      }
      validDisplayName(value).then(response => {
        if (!response) {
          callback(new Error('昵称已存在！'))
        } else {
          callback()
        }
      })
    }
    const validatePassword = (rule, value, callback) => {
      if (value !== this.registerForm.password) {
        callback(new Error('密码不匹配！'))
      } else {
        callback()
      }
    }
    return {
      registerForm: {
        username: '',
        password: '',
        displayName: ''
      },
      registerRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [{ required: true, message: '密码不可为空！', trigger: 'blur' }],
        confirmPassword: [{
          required: true,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (this.registerForm.password === '') {
              callback()
            } else {
              validatePassword(rule, value, callback)
            }
          }
        }
        ],
        displayName: [
          { required: true, trigger: 'blur', validator: validateDisplayName }
        ]
      },
      passwordType: 'password',
      confirmPasswordType: 'password',
      capsTooltipPassword: false,
      capsTooltipConfirmPassword: false,
      loading: false
    }
  },

  mounted() {
    if (this.registerForm.username === '') {
      this.$refs.username.focus()
    } else if (this.registerForm.password === '') {
      this.$refs.password.focus()
    } else if (this.registerForm.password !== '') {
      this.$ref.confirmPassword.focus()
    } else if (this.registerForm.displayName === '') {
      this.$ref.displayName.focus()
    }
  },
  methods: {
    checkCapslock(e, field) {
      const { key } = e
      if (field === 'password') {
        this.capsTooltipPassword = key && key.length === 1 && (key >= 'A' && key <= 'Z')
      } else {
        this.capsTooltipConfirmPassword = key && key.length === 1 && (key >= 'A' && key <= 'Z')
      }
    },
    showPwd(field) {
      if (field === 'password') {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      } else {
        if (this.confirmPasswordType === 'password') {
          this.confirmPasswordType = ''
        } else {
          this.confirmPasswordType = 'password'
        }
        this.$nextTick(() => {
          this.$refs.confirmPassword.focus()
        })
      }
    },
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.registerUser(this.registerForm).then(() => {
            this.$router.push('/login')
            this.loading = false
          })
            .catch((error) => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    // user register
    registerUser(userInfo) {
      const { username, password, displayName } = userInfo
      return new Promise((resolve, reject) => {
        register({ username: username.trim(), password: password, name: displayName }).then(
          resolve()
        ).catch(error => {
          reject(error)
        })
      })
    }
  }
}
</script>

<style lang="scss">

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (caret-color: $cursor)) {
  .register-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.register-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }

  .login-link {
    margin-top: 5px;
    text-align: center;
  }

  .login-link-text {
    text-decoration: none;
    color: rgb(150, 147, 147);
    font-size: 12px;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.register-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .register-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
