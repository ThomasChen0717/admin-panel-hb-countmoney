<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="账号" name="account">
                <account :user="user"/>
              </el-tab-pane>
              <el-tab-pane label="密码" name="password">
                <password :user="user"/>
              </el-tab-pane>
              <el-tab-pane label="头像" name="Avatar">
                <avatar :user="user"/>
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
  components: { UserCard, Account, Password, Avatar},
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
        id:this.id
      }
    }
  }
}
</script>
