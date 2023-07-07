<template>
    <div class="app-container">
        <el-button type="primary" @click="AddClientVersion">添加版本</el-button>
        <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
            <el-table-column v-for="item of visibleColumns" :key="item.key" :prop="item.key" :label="item.label" />
            <el-table-column label="操作">
                <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" @click="editItem(scope.row)">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="deleteItem(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" @open="handleDialogOpen" :title="dialogType==='edit'?'修改版本':'新建版本'">
            <el-form ref="newClientVersionForm" :model="newClientVersionForm" :rules="newClientVersionRules" class="new-client-version-form" label-width="110px" label-position="left">
                <el-form-item prop ="clientVersion" label="客户端版本">
                    <el-input v-model="newClientVersionForm.clientVersion" ref="clientVersion"/>
                </el-form-item>
                <el-form-item label="已审核">
                    <el-checkbox v-model="newClientVersionForm.isVerified" :true-label= 1 :false-label= 0 />
                </el-form-item>
                <el-form-item prop ="verificationServer" label="审核服">
                    <el-input v-model="newClientVersionForm.verificationServer" ref="verificationServer"/>
                </el-form-item>
                <el-form-item prop ="releaseServer" label="正式服">
                    <el-input v-model="newClientVersionForm.releaseServer" ref="releaseServer"/>
                </el-form-item>
                <el-form-item prop ="verificationPreLoginServer" label="审核未登录服">
                    <el-input v-model="newClientVersionForm.verificationPreLoginServer" ref="verificationPreLoginServer"/>
                </el-form-item>
                <el-form-item prop ="releasePreLoginServer" label="正式未登录服">
                    <el-input v-model="newClientVersionForm.releasePreLoginServer" ref="releasePreLoginServer"/>
                </el-form-item>
            </el-form>
            <div style="text-align:right;">
                <el-button type="danger" @click="dialogVisible=false">取消</el-button>
                <el-button type="primary" :loading = "loading" @click="confirmClientVersion">确定</el-button>
            </div>
        </el-dialog>
  </div>
</template>
<script>
import { getClientVersion, addNewClientVersion, updateClientVersion, deleteClientVersion} from '@/api/database'
export default {
    name: "client-version",
    data() {
        return{
            tableData: [],
            tableHeader: [
                { key: 'id'},
                { key: 'clientVersion', label: '客户端版本' },
                { key: 'isVerified', label: '已审核' },
                { key: 'verificationServer', label: '审核服' },
                { key: 'releaseServer', label: '正式服'},
                { key: 'verificationPreLoginServer', label: '审核未登录服' },
                { key: 'releasePreLoginServer', label: '正式未登录服'},
            ],
            dialogVisible: false,
            loading: false,
            dialogType: 'new',
            newClientVersionForm: {
                clientVersion: '',
                isVerified: 0,
                verificationServer: '',
                releaseServer: '',
                verificationPreLoginServer: '',
                releasePreLoginServer: '', 
            },
            newClientVersionRules: {
                clientVersion: [{ required: true, message: '版本不可为空！', trigger: 'blur' }],
                verificationServer: [{required: true, message: '审核服不可为空!', trigger: 'blur' }],
                releaseServer: [{required: true, message: '正式服不可为空!', trigger: 'blur' }],
                verificationPreLoginServer: [{required: true, message: '审核未登录服不可为空!', trigger: 'blur' }],
                releasePreLoginServer:  [{required: true, message: '正式未登录服不可为空!', trigger: 'blur' }]
            }
        }
    }, 
    async created(){
        this.getData()
    }, 
    computed: {
        visibleColumns() {
            return this.tableHeader.filter(item => item.key !== 'id');
        }
    },
    methods:{
        async getData(){
            getClientVersion().then(response => {
                this.tableData = response.data
            })
            .catch(error => {
            })
        },
        handleDialogOpen() {
            this.$nextTick(() => {
                if (this.newClientVersionForm.clientVersion === '') {
                    this.$refs.clientVersion.focus()
                } else if (this.newClientVersionForm.verificationServer === '') {
                    this.$refs.verificationServer.focus()
                } else if (this.newClientVersionForm.releaseServer === '') {
                    this.$refs.releaseServer.focus()
                } else if (this.newClientVersionForm.verificationPreLoginServer === '') {
                    this.$refs.verificationPreLoginServer.focus()
                } else if (this.newClientVersionForm.releasePreLoginServer === ''){
                    this.$refs.releasePreLoginServer.focus()
                }
            })
            this.resetRules()
        },
        resetForm() {
            this.newClientVersionForm.clientVersion = ''
            this.newClientVersionForm.isVerified = 0
            this.newClientVersionForm.verificationServer = ''
            this.newClientVersionForm.releaseServer = ''
            this.newClientVersionForm.verificationPreLoginServer = ''
            this.newClientVersionForm.releasePreLoginServer = ''
        },

        resetRules() {
            this.$nextTick(() => {
                this.$refs.newClientVersionForm.clearValidate();
            })
        },

        AddClientVersion(){
            this.resetForm()
            this.dialogType = 'new'
            this.dialogVisible = true
        },

        editItem(row){
            this.newClientVersionForm.clientVersion = row.clientVersion
            this.newClientVersionForm.isVerified = row.isVerified
            this.newClientVersionForm.verificationServer = row.verificationServer
            this.newClientVersionForm.releaseServer = row.releaseServer
            this.newClientVersionForm.verificationPreLoginServer = row.verificationPreLoginServer
            this.newClientVersionForm.releasePreLoginServer = row.releasePreLoginServer
            this.newClientVersionForm.id = row.id
            this.dialogType = 'edit'
            this.dialogVisible = true
        },

        deleteItem(row){
            deleteClientVersion(row.id).then((response) => {
                    this.getData()
                    this.$notify({
                        title: response.message,
                        dangerouslyUseHTMLString: true,
                        message: `
                            <div>客户端版本: ${this.newClientVersionForm.clientVersion}</div>
                        `,
                        type: 'success'
                    })
                }) 
                .catch((error) => {
                })
        },

        confirmClientVersion(){
            const isEdit = this.dialogType === 'edit'
            this.$refs.newClientVersionForm.validate(valid => {
                if (valid) {
                    this.loading = true
                    if(isEdit){
                        updateClientVersion(this.newClientVersionForm).then((response) => {
                            this.getData()
                            this.dialogVisible = false
                            this.loading = false
                            this.$notify({
                                title: response.message,
                                dangerouslyUseHTMLString: true,
                                message: `
                                    <div>客户端版本: ${this.newClientVersionForm.clientVersion}</div>
                                `,
                                type: 'success'
                            })
                        }) 
                        .catch((error) => {
                            this.loading = false 
                        })
                    }
                    else{
                        addNewClientVersion(this.newClientVersionForm).then((response) => {
                            this.getData()
                            this.dialogVisible = false
                            this.loading = false
                            this.$notify({
                                title: response.message,
                                dangerouslyUseHTMLString: true,
                                message: `
                                    <div>客户端版本: ${this.newClientVersionForm.clientVersion}</div>
                                `,
                                type: 'success'
                            })
                        })
                        .catch((error) => {
                            this.loading = false
                        })
                    }
                } else{
                    console.log('error submit!!')
                    return false
                }
            })
        },
    }
}

</script>
<style lang="scss">
    
</style>