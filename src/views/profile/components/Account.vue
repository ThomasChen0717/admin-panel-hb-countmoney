<template>
  <el-form ref="profileForm" :model="profileForm" :rules="profileRules" class="profile-form" label-position="left" @submit.native.prevent>
    <div class="title-container">
      <h3 class="title">修改信息(下次登录生效)</h3>
    </div>
    <el-form-item label="昵称" prop="displayName">
      <el-input
        ref="displayName"
        v-model="profileForm.displayName"
        name="displayName"
        tabindex="1"
        @keyup.enter.native="submit"
      />
    </el-form-item>
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="submit">更新</el-button>
  </el-form>
</template>

<script>
import { changeName } from '@/api/userInfo'
import { validDisplayName } from '@/utils/validate'
export default {
  name: 'Profile',
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          id: null,
          name: ''
        }
      }
    }
  },
  data() {
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
    return {
      profileForm: {
        displayName: this.user.name
      },
      profileRules: {
        displayName: [
          { required: true, trigger: 'blur', validator: validateDisplayName }
        ]
      },
      loading: false
    }
  },

  mounted(){
    if(this.profileForm.displayName === ''){
      this.$refs.displayName.focus()
    }
  },
  methods: {
    submit() {
      this.$refs.profileForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.changedisplayName({ name: this.profileForm.displayName, id: this.user.id })
            .then((response) => {
              this.$message({
                message: response.message,
                type: 'success',
                duration: 5 * 1000
              })
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

    changedisplayName(userInfo) {
      return new Promise((resolve, reject) => {
        changeName(userInfo).then((response) => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
</script>
