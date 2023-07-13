<template>
    <div>
        <h2 class="table-title">{{ tableTitle }}</h2>
        <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
            <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="page" :page-sizes="[1]" :limit="1" layout="total, prev, pager, next, jumper" @pagination="getTable" />
    </div>
</template>
<script>
export default {
    
}
</script>
<style lang="">
    
</style>