<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab" @tab-click="handleTabClick">
              <el-tab-pane label="账号" name="account">
                <account :user="user" ref = "account" />
              </el-tab-pane>
              <el-tab-pane label="密码" name="password">
                <password :user="user" ref = "password"/>
              </el-tab-pane>
              <el-tab-pane label="头像" name="avatar">
                <avatar :user="user" ref = "avatar"/>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Account from './components/Account'
import Password from './components/Password'
import Avatar from './components/Avatar'

export default {
  name: 'Profile',
  components: { UserCard, Account, Password, Avatar },
  data() {
    return {
      user: {},
      activeTab: 'account'
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'role',
      'id'
    ])
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      this.user = {
        name: this.name,
        role: this.role,
        avatar: this.avatar,
        id: this.id
      }
    },
    handleTabClick(tab) {
      if (tab.name === 'account') {
        this.$refs.account.$refs.profileForm.resetFields();
      } else if (tab.name === 'password') {
        this.$refs.password.$refs.changePasswordForm.resetFields();
      } else{
        this.$refs.avatar.file = null;
        this.$refs.avatar.imageDataUrl = null;
      }
    }
  }
}
</script>
