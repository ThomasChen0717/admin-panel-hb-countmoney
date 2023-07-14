<template>
    <div>
        <strong>详细信息</strong>
        <pagination v-show="total > 0" :total="total" :page.sync="page" :page-sizes="[1]" :limit="1" layout="total, prev, pager, next, jumper" :autoScroll = "false" @pagination="getTable" />
        <h1 class="table-title">{{ tableTitle }}</h1>
        <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;" row-class-name="bold-row">
            <el-table-column v-for="item of tableHeader" :key="item.key" :prop="item.key" :label="item.label" />
        </el-table>
        <div class = "chart">
            <Chart height="50vh" width="100%" :chart-data="tableData" :title=tableTitle />
        </div>
        <pagination v-show="total > 0" :total="total" :page.sync="page" :page-sizes="[1]" :limit="1" layout="total, prev, pager, next, jumper" :autoScroll = "false" @pagination="getTable" />
    </div>
</template>
<script>
import { getUserActivityTable } from '@/api/database'
import Chart from '@/components/Charts/userActiveChart'
import Pagination from '@/components/Pagination'
export default {
    name: 'StatTable',
    components: {Pagination, Chart},
    props: {
        selectedRange: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            allData: [],
            tableData: [],
            tableHeader: [
                { key: 'time', label: '时间' },
                { key: 'activeUserCount', label: '活跃用户数' },
                { key: 'newUserCount', label: '新增用户数量' },
                { key: 'totalUserCount', label: '累积用户数量' },
            ],
            tableTitle: '',
            page: 1,
            total: 0,
            startDate: null
        }
    },
    watch: {
        async selectedRange(newRange){
            try {
                const response = await getUserActivityTable(newRange);
                this.allData = response.data
                this.total = response.data.length
                this.startDate = newRange[0];
                this.page = 1
                this.getTable()
            } catch (error) {
            }
        }
    },
    methods: {
        getTable(){
            const currentPageData = this.allData[this.page - 1]
            this.tableData = currentPageData
            const adjustedDate = new Date(this.startDate)
            adjustedDate.setDate(adjustedDate.getDate() + this.page - 1)
            this.tableTitle = adjustedDate.toLocaleDateString()
        }
    }
}
</script>
<style lang="scss">
    .table-title{ 
        font-family: 'Josefin Sans', sans-serif;
        font-weight: normal;
        font-size: 36px;
    }
    .bold-row:nth-child(25){
        font-weight:bold;
        font-size:18px;
    }
</style>