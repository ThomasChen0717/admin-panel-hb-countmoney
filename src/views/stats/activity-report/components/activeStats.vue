<template>
    <div>
        <strong>活跃统计</strong>
        <div class="data">
            <el-card class="box-card">
                <div slot="header" class="card-header">
                    活跃用户数
                </div>
                <div class="box-item">
                    <Header><strong>{{activeUserCount}}</strong></Header>
                </div>
            </el-card>
            <el-card class="box-card">
                <div slot="header" class="card-header">
                    新增用户数
                </div>
                <div class="box-item">
                    <Header><strong>{{newUserCount}}</strong></Header>
                </div>
            </el-card>
            <el-card class="box-card">
                <div slot="header" class="card-header">
                    累计用户数
                </div>
                <div class="box-item">
                    <Header><strong>{{totalUserCount}}</strong></Header>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ActiveStats',
    props: {
        activeUserCount: {
            required: true,
        },
        newUserCount: {
            required: true,
        },
        totalUserCount: {
            required: true,
        },
    },
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
        font-size: 48px;
        text-align: center;
        font-family: 'Josefin Sans', sans-serif;
    }
</style>