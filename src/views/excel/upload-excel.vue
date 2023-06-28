<template>
  <div class="app-container">
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    <h2 class="table-title">{{ tableTitle }}</h2>
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="page" :page-sizes="[1]" :limit="1" layout="total, prev, pager, next, jumper" @pagination="getTable" />
    <div class="update-button" style="text-align: center;">
      <el-button style="margin:auto; margin-top:5vh" type="primary" :loading="loading" @click="updateDatabase($event)">
        更新
      </el-button>
    </div>
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { upload } from '@/api/excel'
import Pagination from '@/components/Pagination'
export default {
  name: 'UploadExcel',
  components: { UploadExcelComponent, Pagination },
  data() {
    return {
      loading: false,
      excelData: [{ header: [], result: [] }],
      tableData: [],
      tableHeader: [],
      tableTitle: '',
      files: [],
      page: 1,
      total: 0
    }
  },
  methods: {
    getTable() {
      const currentPageData = this.excelData[this.page - 1]
      this.tableData = currentPageData.result
      this.tableHeader = currentPageData.header
      this.tableTitle = this.files[this.page - 1].name
    },
    beforeUpload(files) {
      this.excelData = [{ header: [], result: [] }]
      this.tableData = []
      this.tableHeader = []
      this.tableTitle = '' // Reset the tableTitle
      this.page = 1 // Reset the page
      this.total = 0 // Reset the total

      let isLt1G = true

      this.files.forEach((file) => {
        if (file.size / 1024 / 1024 / 1024 >= 1) {
          isLt1G = false // Set isLt1G to false if any file size exceeds 1GB
          return
        }
      })

      if (isLt1G) {
        this.files = files
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1GB in size.',
        type: 'warning'
      })

      return false
    },
    handleSuccess(excelData) {
      this.excelData = excelData
      this.total = this.excelData.length
      this.getTable()
    },
    updateDatabase(event) {
      event.preventDefault()
      this.loading = true
      const formData = new FormData()
      this.files.forEach((file) => formData.append('file', file))
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      upload(formData, config).then(response => {
        this.$message({
                        message: response.message,
                        type: 'success',
                        duration: 5 * 1000
        })
        this.loading = false
      })
        .catch(error => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  .response{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30vh;

  }
</style>
