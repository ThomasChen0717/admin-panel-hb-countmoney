<template>
  <div>
    <strong>活跃统计</strong>
    <div class="data">
      <el-card class="box-card">
        <div slot="header" class="card-header">
          活跃用户数
        </div>
        <div class="box-item">
          <Header><strong>{{ activeUserCount }}</strong></Header>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="card-header">
          新增用户数
        </div>
        <div class="box-item">
          <Header><strong>{{ newUserCount }}</strong></Header>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="card-header">
          累计用户数
        </div>
        <div class="box-item">
          <Header><strong>{{ totalUserCount }}</strong></Header>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserActivity } from '@/api/database'
export default {
  name: 'ActiveStats',
  props: {
    selectedRange: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      activeUserCount: null,
      newUserCount: null,
      totalUserCount: null
    }
  },
  watch: {
    async selectedRange(newRange) {
      try {
        const response = await getUserActivity(newRange)
        this.activeUserCount = response.data.activeUserCount
        this.newUserCount = response.data.newUserCount
        this.totalUserCount = response.data.totalUserCount
      } catch (error) {
      }
    }
  },
  methods: {
    formatDate(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }
  }
}
</script>
<style lang="scss">
     .data {
        display: flex;
        flex-wrap: wrap; /* Allow cards to wrap onto a new line */
        justify-content: space-between;
        margin-top: 16px;
    }

    .data .box-card {
        flex: 1; /* Distribute available space equally among the cards */
        margin-right: 16px; /* Add spacing between cards */
    }

    .data .box-card:last-child {
        margin-right: 0; /* Remove margin for the last card */
    }

    .data .box-card .card-header{
        text-align: center;
    }
    .data .box-card .box-item {
        font-size: 36px;
        text-align: center;
        font-family: 'Josefin Sans', sans-serif;
        font-weight: normal;
    }
</style>
