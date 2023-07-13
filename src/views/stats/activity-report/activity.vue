<template>
    <div class="stats-container">
        <el-row>
            <TimeSelector 
                @range-change="handleTimeRangeChange"
            />
        </el-row>

        <el-row>
            <ActiveStats 
                :selectedRange="selectedRange"
            />
        </el-row>

        <el-row>
            <StatTable 
                :selectedRange="selectedRange"
            />
        </el-row>

    </div>
</template>
<script>
import TimeSelector from './components/timeSelector'
import ActiveStats from './components/activeStats'
import StatTable from './components/statTable'
export default {
    name: 'activity',
    components: {TimeSelector, ActiveStats, StatTable},
    data() {
        return {
            selectedRange: []
        }
    }, 
    methods: {
        handleTimeRangeChange(range) {
            this.selectedRange = range
        },
    },
    }
</script>
<style lang="scss" scoped>
    @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans&display=swap');
    .stats-container{
        padding: 32px 5vw;
        background:rgb(240, 242, 245);
        position:relative;
        min-height: 100vh;
    }
    .el-row{
        background:#fff;
        padding:16px 16px 16px;
        margin-bottom:32px;
    }
</style>