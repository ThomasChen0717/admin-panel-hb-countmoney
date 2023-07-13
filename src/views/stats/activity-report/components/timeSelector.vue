<template>
  <div>
      时间:
      <el-radio-group v-model="timeInterval" class="quickSelect" @change="handleRadioChange">
        <el-radio-button label='yesterday'>昨天</el-radio-button>
        <el-radio-button label='pastSevenDays'>过去7天</el-radio-button>
        <el-radio-button label='pastThirtyDays'>过去30天</el-radio-button>
      </el-radio-group>
  
      <el-date-picker v-model="selectedRange" type="daterange" @change="handleDateChange" />
    </div>
  </template>
  
  <script>
  export default {
    name: 'TimeSelector',
    data() {
        const yesterday = new Date()
        const yesterdayEnd = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        yesterdayEnd.setDate(yesterdayEnd.getDate() - 1)
        return {
            timeInterval: 'yesterday',
            selectedRange: [yesterday, yesterdayEnd],
            usedRadio: false,
        };
    },
    created(){
      this.usedRadio = true
      this.handleDateChange()
    },
    methods: {
      handleRadioChange() {
        const yesterday = new Date()
        const yesterdayEnd = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        yesterdayEnd.setDate(yesterdayEnd.getDate() - 1)
        if (this.timeInterval === 'yesterday') {
            this.selectedRange = [yesterday, yesterdayEnd]
        } else if (this.timeInterval === 'pastSevenDays') {
            const startDate = new Date(yesterday)
            startDate.setDate(startDate.getDate() - 6)
            this.selectedRange = [startDate, yesterdayEnd]
        } else if (this.timeInterval === 'pastThirtyDays') {
            const startDate = new Date(yesterday)
            startDate.setDate(startDate.getDate() - 29)
            this.selectedRange = [startDate, yesterdayEnd]
        }
        this.usedRadio = true
        this.handleDateChange();
      },

      async handleDateChange() {
        if (this.selectedRange != null) {
          if (!this.usedRadio) {
            this.timeInterval = null
          } else {
            this.usedRadio = false
          }
          this.adjustDate()
          this.$emit("range-change", this.selectedRange);
    }
  },

      adjustDate(){
            const adjustedStartDate = new Date(this.selectedRange[0])
            adjustedStartDate.setHours(0)
            adjustedStartDate.setMinutes(0)
            adjustedStartDate.setSeconds(0)
            const adjustedEndDate = new Date(this.selectedRange[1])
            adjustedEndDate.setHours(23)
            adjustedEndDate.setMinutes(59)
            adjustedEndDate.setSeconds(59)
            this.selectedRange[0] = adjustedStartDate
            this.selectedRange[1] = adjustedEndDate
        }
    },
  };
  </script>
  <style style="scss" scoped>
    .quickSelect{
          margin-right: 32px;
    }
  </style>