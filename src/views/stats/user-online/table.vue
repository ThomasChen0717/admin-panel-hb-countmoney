<template>
  <div class="app-container">
    <label style="font-weight: normal;"> 日期:
      <el-date-picker v-model="selectedDay" type="date" @change="getData" />
    </label>
    <label style="font-weight: normal;"> 时间:
      <el-select v-model="selectedHour" @change="getData">
        <el-option
          v-for="hour in hours"
          :key="hour.value"
          :label="hour.label"
          :value="hour.value"
        />
      </el-select>
    </label>
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for="item of tableHeader" :key="item.key" :prop="item.key" :label="item.label" />
    </el-table>
  </div>
</template>

<script>
import { getUserCount } from '@/api/database'

export default {
  name: 'UserOnlineTable',
  data() {
    return {
      tableData: [],
      tableHeader: [
        { key: 'id', label: '序号' },
        { key: 'logicServerId', label: '逻辑服序号' },
        { key: 'onlineUserCount', label: '在线用户数量' },
        { key: 'cacheUserCount', label: '缓存用户数量' },
        { key: 'createTimeString', label: '时间' }
      ],
      selectedDay: new Date(),
      selectedHour: null,
      hours: [
        { label: '未选择小时', value: null },
        ...Array.from({ length: 24 }, (_, i) => ({ label: String(i).padStart(2, '0') + ':00 - ' + String(i).padStart(2, '0') + ':59', value: String(i).padStart(2, '0') })) // Generate an array of hours from 00 to 23
      ]
    }
  },
  async created() {
    this.getData()
  },
  methods: {
    async getData() {
      if (this.selectedDay != null) {
        const adjustedDate = new Date(this.selectedDay.getTime() + 8 * 60 * 60 * 1000)
        const data = {
          date: adjustedDate,
          hour: this.selectedHour
        }
        getUserCount(data).then(response => {
          this.tableData = response.data
        })
          .catch(error => {
          })
      }
    }
  }
}
</script>

<style lang="scss">
</style>
