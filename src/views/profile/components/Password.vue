<template>
    <el-form ref="changePasswordForm" :model="changePasswordForm" :rules="changePasswordRules" class="changePassword-form" label-position="left">
        <div class="title-container">
            <h3 class="title">更改密码</h3>
        </div>

        <el-tooltip v-model="capsTooltipOldPassword" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="oldPassword" label="当前密码">
            <el-input
                :key="oldPasswordType"
                ref="oldPassword"
                v-model="changePasswordForm.oldPassword"
                :type="oldPasswordType"
                name="oldPassword"
                tabindex="1"
                @keyup.native="checkCapslock($event, 'oldPassword')"
                @blur="capsTooltipOldPassword = false"
                :show-password="true"
            />
        </el-form-item>
        </el-tooltip>

        <el-tooltip v-model="capsTooltipNewPassword" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="newPassword" label="新密码">
            <el-input
            :key="newPasswordType"
            ref="newPassword"
            v-model="changePasswordForm.newPassword"
            :type="newPasswordType"
            name="newPassword"
            tabindex="2"
            @keyup.native="checkCapslock($event, 'newPassword')"
            @blur="capsTooltipNewPassword = false"
            :show-password="true"
            />
        </el-form-item>
        </el-tooltip>

        <el-tooltip v-model="capsTooltipConfirmNewPassword" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="confirmNewPassword" label="确认新密码">
            <el-input
            :key="confirmNewPasswordType"
            ref="confirmNewPassword"
            v-model="changePasswordForm.confirmNewPassword"
            :type="confirmNewPasswordType"
            name="confirmNewPassword"
            tabindex="3"
            @keyup.native="checkCapslock($event, 'confirmNewPassword')"
            @blur="capsTooltipConfirmNewPassword = false"
            :show-password="true"
            @keyup.enter.native="submit"
            />
        </el-form-item>
        </el-tooltip>

<el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="submit">更新</el-button>
</el-form>
</template>
  
<script>
import { validOldPassword} from '@/utils/validate'
import { changePassword } from '@/api/userInfo'
export default {
  name: 'changePassword',
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          id: null
        }
      }
    }
  },
  data() {
    const validateOldPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入当前密码！'))
        return
      }
      validOldPassword({password: value, id: this.user.id}).then(response => {
        if (!response) {
          callback(new Error('请输入正确的当前密码!'))
        } else {
          callback()
        }
      })
    }

    const validateNewPassword = (rule, value, callback) => {
      if (value !== this.changePasswordForm.newPassword) {
        callback(new Error('密码不匹配！'))
      } else {
        callback()
      }
    }
    return {
      changePasswordForm: {
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      },
      changePasswordRules: {
        oldPassword: [
          { required: true, trigger: 'blur', validator: validateOldPassword }
        ],
        newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        confirmNewPassword: [{
          required: true,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (this.changePasswordForm.newPassword === '') {
              callback()
            } else {
              validateNewPassword(rule, value, callback)
            }
          }
        }
        ],
      },
      oldPasswordType: 'password',
      newPasswordType: 'password',
      confirmNewPasswordType: 'password',
      capsTooltipOldPassword: false,
      capsTooltipNewPassword:false,
      capsTooltipConfirmNewPassword: false,
      loading: false
    }
  },

  mounted() {
    if (this.changePasswordForm.oldPassword === '') {
      this.$refs.oldPassword.focus()
    } else if (this.changePasswordForm.newPassword === '') {
      this.$refs.newPassword.focus()
    } else if (this.changePasswordForm.newPassword !== '') {
      this.$ref.confirmNewPassword.focus()
    }
  },

  methods: {
    checkCapslock(e, field) {
      const { key } = e
      if (field === 'oldPassword') {
        this.capsTooltipOldPassword = key && key.length === 1 && (key >= 'A' && key <= 'Z')
      } else if(field === 'newPassword'){
        this.capsTooltipNewPassword = key && key.length === 1 && (key >= 'A' && key <= 'Z')
      } else{
        this.capsTooltipConfirmNewPassword = key && key.length === 1 && (key >= 'A' && key <= 'Z')
      }
    },
    submit() {
        this.$refs.changePasswordForm.validate(valid => {
            if (valid) {
                this.loading = true
                this.changePassword({password:this.changePasswordForm.newPassword, id: this.user.id}).then((response) => {
                        this.$message({
                            message: response.message,
                            type: 'success',
                            duration: 5 * 1000
                        })
                        this.changePasswordForm.oldPassword = ''
                        this.changePasswordForm.newPassword = ''
                        this.changePasswordForm.confirmNewPassword = ''
                        this.loading = false
                    })
                    .catch((error) => {
                        this.changePasswordForm.oldPassword = ''
                        this.changePasswordForm.newPassword = ''
                        this.changePasswordForm.confirmNewPassword = ''
                        this.loading = false
                    })
            } else {
                console.log('error submit!!')
              return false
            }
        })
    },

    changePassword(userInfo){
        return new Promise((resolve, reject) => {
            changePassword(userInfo).then((response) => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }
  }
}
</script>

<style lang="scss">
.el-input__inner::-ms-reveal {
  display: none;
}
</style>
  