<template>
    <div :id="id" :class="className" :style="{height:height,width:width}" />
  </template>
  
  <script>
  import echarts from 'echarts'
  import resize from './mixins/resize'
  
  export default {
    mixins: [resize],
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      id: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '200px'
      },
      height: {
        type: String,
        default: '200px'
      },
      chartData: {
        type: Array
      },
      hour: {
        type: String
      }
    },
    data() {
      return {
        chart: null
      }
    },
  
    watch: {
      chartData: {
        handler(newData) {
          this.updateChart(newData)
        },
        deep: true
      }
    },
    mounted() {
      this.initChart()
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
  
    methods: {
      initChart() {
        this.chart = echarts.init(document.getElementById(this.id))
        this.updateChart(this.chartData)
      },
  
      updateChart(data) {
        this.chart.clear()
        this.chart.setOption({
          backgroundColor: '#394056',
          title: {
            top: 20,
            text: '在线人数',
            textStyle: {
              fontWeight: 'normal',
              fontSize: 16,
              color: '#F1F1F3'
            },
            left: '1%'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              lineStyle: {
                color: '#57617B'
              }
            }
          },
          legend: {
            top: 20,
            icon: 'rect',
            itemWidth: 14,
            itemHeight: 5,
            itemGap: 13,
            data: ['在线用户', '缓存用户'],
            right: '4%',
            textStyle: {
              fontSize: 12,
              color: '#F1F1F3'
            }
          },
          grid: {
            top: 100,
            left: '2%',
            right: '2%',
            bottom: '2%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: 'grey'
              }
            },
            data:
              Array.from({ length: 12 }, (_, i) => {
                return this.hour + ':' + String(i * 5).padStart(2, '0')
              })
          }],
          yAxis: [{
            type: 'value',
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: 'grey'
              }
            },
            axisLabel: {
              margin: 10,
              textStyle: {
                fontSize: 14
              }
            },
            splitLine: {
              lineStyle: {
                color: 'grey'
              }
            }
          }],
          series: [{
            name: '在线用户',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(137, 189, 27, 0.3)'
                }, {
                  offset: 0.8,
                  color: 'rgba(137, 189, 27, 0)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
              }
            },
            itemStyle: {
              normal: {
                color: 'rgb(137,189,27)',
                borderColor: 'rgba(137,189,2,0.27)',
                borderWidth: 12
  
              }
            },
            data: this.chartData.map((dataPoint) => dataPoint.onlineUserCount)
          },
          {
            name: '缓存用户',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(0, 136, 212, 0.3)'
                }, {
                  offset: 0.8,
                  color: 'rgba(0, 136, 212, 0)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
              }
            },
            itemStyle: {
              normal: {
                color: 'rgb(0,136,212)',
                borderColor: 'rgba(0,136,212,0.2)',
                borderWidth: 12
  
              }
            },
            data: this.chartData.map((dataPoint) => dataPoint.cacheUserCount)
          }]
        })
      }
    }
  }
  </script>
  