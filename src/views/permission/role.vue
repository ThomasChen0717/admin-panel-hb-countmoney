<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">新建权限</el-button>

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="权限名" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.name !== 'admin'" type="primary" size="small" icon="el-icon-edit" @click="handleEdit(scope)">修改</el-button>
          <el-button v-if="scope.row.name !== 'admin'" type="danger" size="small" icon="el-icon-delete" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" :title="dialogType==='edit'?'修改权限':'新建权限'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="权限名">
          <el-input ref = "name" v-model="role.name" placeholder="权限名" @keyup.enter.native = "confirmRole"/>
        </el-form-item>
        <el-form-item label="路由">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            show-checkbox
            node-key="path"
            class="permission-tree"
            @check="handleNodeClick"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { getRoles, addRole, deleteRole, updateRole } from '@/api/role'
import { mapGetters } from 'vuex'
import { filterAsyncRoutes } from '@/store/modules/permission'
import { asyncRoutes } from '@/router/index'

const defaultRole = {
  name: '',
  routes: []
}

export default {
  data() {
    return {
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      serviceRoutes: [],
      tempName: "",
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  computed: {
    routesData() {
      return this.routes
    },
    ...mapGetters([
      'permission_routes'
    ])
  },

  created() {
    this.getRoutes()
    this.getAllRoles()
  },
  methods: {
    getRoutes() {
      const res = this.permission_routes
      this.serviceRoutes = res
      this.routes = this.generateRoutes(res)
    },
    async getAllRoles() {
      const res = await getRoles({ routeName: 'AllRoles' })
      this.rolesList = res.data.map(roleName => ({ name: roleName.replace(/'/g, ''), routes: filterAsyncRoutes(asyncRoutes, roleName.replace(/'/g, '')) }))
    },

    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes(routes, basePath = '/') {
      const res = []

      for (let route of routes) {
        // skip some route
        if (route.hidden || route.path === '/') { continue }

        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)

        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }

        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title,
          name: route && route.name
        }

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },
    generateArr(routes) {
      let data = []
      routes.forEach(route => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },
    handleAddRole() {
      this.role = Object.assign({}, defaultRole)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
      this.checkStrictly = true
    },
    handleEdit(scope) {
      this.role = deepClone(scope.row)
      this.tempName = this.role.name
      this.$nextTick(() => {
        const routes = this.generateRoutes(this.role.routes)
        this.$refs.tree.setCheckedNodes(this.generateArr(routes))
      })
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
    },
    handleDelete({ $index, row }) {
      this.$confirm('确定要删除吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteRole(row.name)
          this.rolesList.splice($index, 1)
          this.$message({
            type: '成功!',
            message: '删除成功！'
          })
        })
        .catch(err => { console.error(err) })
    },
    generateTree(routes, basePath = '/', checkedKeys) {
      const res = []
      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)

        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(route.children, routePath, checkedKeys, res)
        }

        if (checkedKeys.includes(routePath)) {
          res.push(route)
        }
        if (route.children && route.children.length >= 1) {
          res.push(...route.children)
        }
      }
      return res
    },
    confirmRole() {
      const isEdit = this.dialogType === 'edit'

      const checkedKeys = this.$refs.tree.getCheckedKeys()
      this.role.routes = this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)
      if (isEdit) {
        const index = this.rolesList.findIndex(role => role.name === this.tempName)
        if (index !== -1) {
          // Update the name property of the row directly
          this.rolesList[index].name = this.role.name
          this.rolesList[index].routes = this.role.routes
        }
        const formData = new FormData();
        formData.append('body', JSON.stringify(this.role));
        formData.append('oldName', this.tempName);
        updateRole(formData)
      } else {
        addRole(this.role)
        this.rolesList.push(this.role)
      }

      const { name } = this.role
      this.dialogVisible = false
      this.$notify({
        title: '成功！',
        dangerouslyUseHTMLString: true,
        message: `
            <div>Role Name: ${name}</div>
          `,
        type: 'success'
      })
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    }, 
    handleNodeClick(nodeData) {
        // Get the parent node
        const parentNode = this.findParent(nodeData)

        const checkedKeys = this.$refs.tree.getCheckedKeys();

        if (parentNode) {
          const parentKey = parentNode[this.$refs.tree.nodeKey];

          // Check if the parent node is not already selected
          if (!checkedKeys.includes(parentKey)) {
            this.$refs.tree.setChecked(parentNode, true);
          }
        } 

        if(nodeData.children){
          const key = nodeData[this.$refs.tree.nodeKey]
          if(!checkedKeys.includes(key)){
            for(const child of nodeData.children){
              const childKey = child[this.$refs.tree.nodeKey]
              if(checkedKeys.includes(childKey)){
                this.$refs.tree.setChecked(child, false);
              }
            }
          } else if(checkedKeys.includes(key)){
            for(const child of nodeData.children){
              const childKey = child[this.$refs.tree.nodeKey]
              if(!checkedKeys.includes(childKey)){
                this.$refs.tree.setChecked(child, true);
              }
            }
          }
        }
    },

    findParent(nodeData){
      for(const route of this.routes){
        if(route !== nodeData && this.isParent(nodeData, route)){
          return route
        }
      }
      return null
    },

    isParent(node, parent){
      if(parent.children){
        return parent.children.includes(node)
      }
      return false;
    }
  }
}

</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
