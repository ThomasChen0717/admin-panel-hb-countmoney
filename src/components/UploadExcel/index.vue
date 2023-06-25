<template>
  <div>
    <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" multiple @change="handleClick">
    <div class="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
      将文件拖到这里或者
      <el-button :loading="loading" style="margin-left:16px;" size="mini" type="primary" @click="handleUpload">
        浏览
      </el-button>
    </div>
  </div>
</template>

<script>
import XLSX from 'xlsx'

export default {
  props: {
    beforeUpload: Function, // eslint-disable-line
    onSuccess: Function// eslint-disable-line
  },
  data() {
    return {
      loading: false,
      excelData: [{ header: null, result: null }]
    }
  },
  methods: {
    handleDrop(e) {
      e.stopPropagation()
      e.preventDefault()
      if (this.loading) return
      const files = e.dataTransfer.files
      const rawFiles = Array.from(files)
      const excelFiles = rawFiles.filter((file) => this.isExcel(file))
      if (excelFiles.length !== rawFiles.length) {
        const nonExcelFiles = rawFiles.filter((file) => !this.isExcel(file))
        this.$message.error('Only supports upload .xlsx, .xls, .csv suffix files')
        console.log('Non-Excel files:', nonExcelFiles)
      }
      this.upload(excelFiles)
      e.stopPropagation()
      e.preventDefault()
    },
    handleDragover(e) {
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    },
    handleUpload() {
      this.$refs['excel-upload-input'].click()
    },
    handleClick(e) {
      const files = e.target.files
      const rawFiles = Array.from(files)
      if (!rawFiles) return
      this.upload(rawFiles)
    },
    upload(rawFiles) {
      if (!this.beforeUpload) {
        this.readerData(rawFiles)
        return
      }
      const before = this.beforeUpload(rawFiles)
      if (before) {
        this.readerData(rawFiles)
      }
    },
    readerData(rawFiles) {
      this.loading = true
      Promise.all(
        rawFiles.map((rawFile, index) => {
          return new Promise((resolve) => {
            const reader = new FileReader()
            reader.onload = (e) => {
              const data = e.target.result
              const workbook = XLSX.read(data, { type: 'array' })
              const SheetName = workbook.SheetNames[0]
              const worksheet = workbook.Sheets[SheetName]
              const header = this.getHeaderRow(worksheet)
              const results = XLSX.utils.sheet_to_json(worksheet)
              const excel = { header: header, result: results }
              this.excelData[index] = excel
              resolve()
            }
            reader.readAsArrayBuffer(rawFile)
          })
        })
      )
        .then(() => {
          this.loading = false
          this.onSuccess && this.onSuccess(this.excelData)
          this.excelData = [{ header: null, result: null }]
        })
        .catch((error) => {
          this.loading = false
          console.error('Error reading files:', error)
        })
    },
    getHeaderRow(sheet) {
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
        /* find the cell in the first row */
        let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
      }
      return headers
    },
    isExcel(file) {
      return /\.(xlsx|xls|csv)$/.test(file.name)
    }
  }
}
</script>

<style scoped>
.excel-upload-input{
  display: none;
  z-index: -9999;
}
.drop{
  border: 2px dashed #bbb;
  width: 600px;
  height: 160px;
  line-height: 160px;
  margin: 0 auto;
  font-size: 24px;
  border-radius: 5px;
  text-align: center;
  color: #bbb;
  position: relative;
}
</style>
