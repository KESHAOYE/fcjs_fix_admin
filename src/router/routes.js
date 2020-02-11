
import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

/**
 * 在主框架内显示
 */
const frameIn = [
  {
    path: '/',
    redirect: { name: 'index' },
    component: layoutHeaderAside,
    children: [
      // 首页
      {
        path: 'index',
        name: 'index',
        meta: {
          title: '首页',
          auth: true
        },
        component: _import('system/index'),
      },
      // 系统 前端日志
      {
        path: 'log',
        name: 'log',
        meta: {
          title: '前端日志',
          auth: true
        },
        component: _import('system/log')
      },
      // 刷新页面 必须保留
      {
        path: 'refresh',
        name: 'refresh',
        hidden: true,
        component: _import('system/function/refresh')
      },
      // 页面重定向 必须保留
      {
        path: 'redirect/:route*',
        name: 'redirect',
        hidden: true,
        component: _import('system/function/redirect')
      },
      {
        path: '/indexAdManage',
        name: 'indexAdManage',
        meta: {
          title: '首页广告管理',
          auth: true
        },
        component: ()=>import('../components/FCJS/ad/indexAdManage')
      },
      {
        path: '/shopRecomment',
        name: 'shopRecomment',
        meta: {
          title: '商品推荐',
          auth: true
        },
        component: ()=>import('../components/FCJS/ad/shopRecomment')
      },
      {
        path:'/adEditor',
        name: 'adEditor',
        meta: {
          title: '广告添加/编辑',
          auth: true
        },
        component: ()=>import('../components/FCJS/ad/adEditor')
      },
      {
        path:'/brandManage',
        name: 'brandManage',
        meta: {
          title: '品牌管理',
          auth: true
        },
        component: ()=>import('../components/FCJS/brand/brandManage')
      },
      {
        path:'/brandEditor',
        name: 'brandEditor',
        meta: {
          title: '品牌添加/编辑',
          auth: true
        },
        component: ()=>import('../components/FCJS/brand/brandEditor')
      },
      {
        path:'/sortManage',
        name: 'sortManage',
        meta: {
          title: '分类管理',
          auth: true
        },
        component: ()=>import('../components/FCJS/sort/sortManage')
      },
      {
        path:'/sortEditor',
        name: 'sortEditor',
        meta: {
          title: '分类添加/编辑',
          auth: true
        },
        component: ()=>import('../components/FCJS/sort/sortEditor')
      },
      {
        path:'/specManage',
        name: 'specManage',
        meta: {
          title: '规格管理',
          auth: true
        },
        component: ()=>import('../components/FCJS/spec/specManage')
      },
      {
        path:'/shopManage',
        name: 'shopManage',
        meta: {
          title: '商品管理',
          auth: true
        },
        component: ()=>import('../components/FCJS/shop/shopManage')
      },
      {
        path:'/shopEditor',
        name: 'shopEditor',
        meta: {
          title: '商品添加/编辑',
          auth: true,
        },
        component: ()=>import('../components/FCJS/shop/shopEditor')
      },
      {
        path:'/storageManage',
        name: 'storageManage',
        meta: {
          title: '库存管理',
          auth: true,
          cache: true
        },
        component: ()=>import('../components/FCJS/shop/stockManage')
      },
      {
        path:'/skuconcat',
        name: 'skuconcat',
        meta: {
          title: '库存管理',
          auth: true,
          cache: true
        },
        component: ()=>import('../components/FCJS/shop/skuconcat')
      },
      {
        path:'/fixItemManage',
        name: 'fixItemManage',
        meta: {
          title: '维修项目管理',
          auth: true,
          cache: true
        },
        component: ()=>import('../components/FCJS/fix/fixItemManage')
      },
      {
        path:'/fixSortManage',
        name: 'fixSortManage',
        meta: {
          title: '维修分类管理',
          auth: true,
          cache: true
        },
        component: ()=>import('../components/FCJS/fix/fixsortManage')
      },
      {
        path:'/fixsortsEditor',
        name: 'fixsortsEditor',
        meta: {
          title: '维修分类编辑',
          auth: true,
          cache: true
        },
        component: ()=>import('../components/FCJS/fix/fixsortEditor')
      },
      {
        path:'/fixModelManage',
        name: 'fixModelManage',
        meta: {
          title: '维修机型管理',
          auth: true,
          cache: true
        },
        component: ()=>import('../components/FCJS/fix/fixModelManage')
      },
      {
        path:'/fixModelEditor',
        name: 'fixModelEditor',
        meta: {
          title: '维修机型编辑',
          auth: true,
          cache: true
        },
        component: ()=>import('../components/FCJS/fix/fixModelEditor')
      },
      {
        path:'/couponManage',
        name: 'couponManage',
        meta: {
          title: '优惠券管理',
          auth: true,
          cache: true
        },
        component: ()=>import('../components/FCJS/coupon/couponManage')
      },
      {
        path:'/couponEditor',
        name: 'couponEditor',
        meta: {
          title: '优惠券编辑',
          auth: true,
          cache: true
        },
        component: ()=>import('../components/FCJS/coupon/couponEditor')
      },
    ]
  }
]

/**
 * 在主框架之外显示
 */
const frameOut = [
  // 登录
  {
    path: '/login',
    name: 'login',
    component: _import('system/login')
  },
  {
    path:'/chat',
    name: 'chat',
    meta: {
      title: '客服',
      auth: true,
      cache: true
    },
    component: ()=>import('../components/FCJS/chat')
  },
]

/**
 * 错误页面
 */
const errorPage = [
  {
    path: '*',
    name: '404',
    component: _import('system/error/404')
  }
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 重新组织后导出
export default [
  ...frameIn,
  ...frameOut,
  ...errorPage
]
