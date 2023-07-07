<template>
  <div class="container">
    <div class="content">
      <label style="font-weight: normal;"> 逻辑服序号:
        <el-select v-model="selectedLogicServer" @change="updateChart">
            <el-option label="100" value="100" />
            <el-option label="101" value="101" />
        </el-select>
      </label>
      <label style="font-weight: normal;"> 日期:
        <el-date-picker v-model="selectedDay" type="date" @change="updateChart" />
      </label>
      <label style="font-weight: normal;"> 时间:
        <el-select v-model="selectedHour" @change="updateChart">
          <el-option
            v-for="hour in hours"
            :key="hour.value"
            :label="hour.label"
            :value="hour.value"
          />
        </el-select>
      </label>
    </div>
    <div class="chart-container">
      <chart height="100%" width="100%" :chart-data="chartData" :hour="selectedHour" />
    </div>
  </div>
</template>

<script>
import Chart from '@/components/Charts/LineMarker'
import { getUserCountGraph } from '@/api/database'
export default {
  name: 'LineChart',
  components: { Chart },
  data() {
    return {
      selectedLogicServer: 100,
      selectedDay: new Date(),
      hours: [
        ...Array.from({ length: 24 }, (_, i) => ({ label: String(i).padStart(2, '0') + ':00 - ' + String(i).padStart(2, '0') + ':59', value: String(i).padStart(2, '0') })) // Generate an array of hours from 00 to 23
      ],
      selectedHour: '00',
      chartData: []
    }
  },
  async created() {
    this.updateChart()
  },
  methods: {
    async updateChart() {
      if (this.selectedDay != null) {
        const adjustedDate = new Date(this.selectedDay.getTime() + 8 * 60 * 60 * 1000)
        const data = {
          date: adjustedDate,
          hour: this.selectedHour,
          logicServerId: this.selectedLogicServer
        }
        getUserCountGraph(data).then(response => {
          this.chartData = response.data
        })
          .catch(error => {
          })
      }
    }
  }
}
</script>

  <style scoped>
  .container {
    height: calc(100vh - 84px);
    display: flex;
    flex-direction: column;
  }

  .content {
    flex: 1;
    padding: 20px;
  }

  .chart-container {
    height: 100%;
  }
  </style>
