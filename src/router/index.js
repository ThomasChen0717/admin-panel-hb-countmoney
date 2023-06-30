import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

import { getRoles } from '@/api/role'

/**
 * Note: sub-menu only appear when route children.length >= 1
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '主页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user', noCache: true }
      }
    ]
  }
]
/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/role',
    alwaysShow: true,
    name: 'Permission',
    meta: {
      title: '权限',
      icon: 'lock',
      roles: null
    },
    children: [
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'Role_Permission',
        meta: {
          title: '职位权限',
          roles: null
        }
      }
    ]
  },
  {
    path: '/database',
    component: Layout,
    redirect: '/database/upload-excel',
    alwaysShow: true,
    name: 'Database',
    meta: {
      title: '数据库操作',
      icon: 'excel',
      roles: null
    },
    children: [
      {
        path: 'upload-excel',
        component: () => import('@/views/excel/upload-excel'),
        name: 'UploadExcel',
        meta: { title: '上传Excel表格至数据库', roles: null }
      }
    ]
  },
  {
    path: '/stats',
    component: Layout,
    redirect: '/stats/user-online-table',
    alwaysShow: true,
    name: 'Stats',
    meta: {
      title: '统计数据',
      icon: 'chart',
      roles: null
    },
    children: [
      {
        path: 'user-online-table',
        component: () => import('@/views/stats/user-online-table'),
        name: 'UserOnlineTable',
        meta: { title: '在线人数（表格）', roles: null }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

async function updateAsyncRouteRoles() {
  try {
    // Update roles for async routes
    asyncRoutes.forEach((route) => {
      if (!route.hidden) {
        getRoles({ routeName: route.name }).then((response) => {
          route.meta.roles = '[' + response.data + ']'
        })
        if (route.children) {
          route.children.forEach((childRoute) => {
            getRoles({ routeName: childRoute.name }).then((response) => {
              childRoute.meta.roles = '[' + response.data + ']'
            })
          })
        }
      }
    })
    resetRouter()
  } catch (error) {
    console.error(error)
  }
}

// Call the function to update the roles when the application starts
updateAsyncRouteRoles()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
