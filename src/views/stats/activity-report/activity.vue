<template>
    <div class="stats-container">
        <el-row>
            <TimeSelector 
                @count-change="handleCountChange"
            />
        </el-row>

        <el-row>
            <ActiveStats 
                :active-user-count="activeUserCount"
                :new-user-count="newUserCount"
                :total-user-count="totalUserCount"
            />
        </el-row>
    </div>
</template>
<script>
import TimeSelector from './components/timeSelector'
import ActiveStats from './components/activeStats'
export default {
    name: 'activity',
    components: {TimeSelector, ActiveStats},
    data() {
        return {
            activeUserCount:null,
            newUserCount: null, 
            totalUserCount:null
        }
    }, 
    methods: {
        handleCountChange({ activeUserCount, newUserCount, totalUserCount }) {
            this.activeUserCount = activeUserCount;
            this.newUserCount = newUserCount;
            this.totalUserCount = totalUserCount;
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