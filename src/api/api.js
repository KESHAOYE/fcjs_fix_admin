/**
 * 统一管理API
 * Author: KESHAOYE
 * Time: 2020-01-08
 */
import {get,post}  from '@/plugin/axios'

    // 登录
export const logins = data => post('/api/login/LOGINU', data)
export const autologin = data => post('/api/login/LOGINAUTO',data)
   // 判断管理员
export const getrole = data => post('/api/adminlogin/GETADMINSTATE',data)
   // 用户信息
export const getuserinfo = data => post('/api/login/GETUSERINFO', data)
  // 获取菜单
export const getrouter = data => post('/api/adminlogin/GETROUTER',data)

  // 广告相关
export const getaad = data=> post('/api/ad/GETADBYID',data)
export const getad = data=> post('/api/ad/GETADS',data)
export const deletead = data => post('/api/ad/DELETEAD',data)
export const updatead = data => post('/api/ad/UPDATEAD',data)
export const addad = data => post('/api/ad/ADDAD',data)
  // 品牌相关
export const getbrand = data=> post('/api/brand/GETBRANDS',data)
export const getbrandbyid = data=> post('/api/brand/GETBRANDBYID',data)
export const deletebrand = data => post('/api/brand/DELETEBRAND',data)
export const updatebrand = data => post('/api/brand/UPDATEBRAND',data)
export const addbrand = data => post('/api/brand/ADDBRAND',data)
// 分类相关
export const getsort = data=> post('/api/sort/GETSORTS',data)
export const getsortbyid = data=> post('/api/sort/GETSORTBYID',data)
export const deletesort = data => post('/api/sort/DELETESORT',data)
export const updatesort = data => post('/api/sort/UPDATESORT',data)
export const addsort = data => post('/api/sort/ADDSORT',data)
// 规格
export const getspec = data=> post('/api/spec/GETSPECS',data)
export const getspecbyid = data=> post('/api/spec/GETSPECBYID',data)
export const deletespec = data => post('/api/spec/DELETESPEC',data)
export const updatespec = data => post('/api/spec/UPDATESPEC',data)
export const addspec = data => post('/api/spec/ADDSPEC',data)
// 商品相关
export const getshop = data=> post('/api/shop/GETSHOPS',data)
export const getshopbyid = data=> post('/api/shop/GETSHOPBYID',data)
export const deleteshop = data => post('/api/shop/DELETESHOP',data)
export const updateshop = data => post('/api/shop/UPDATESHOP',data)
export const addshop = data => post('/api/shop/ADDSHOP',data)

// sku属性相关
export const getskustock = data=> post('/api/stock/GETSTOCK',data)
export const getskubyid = data=> post('/api/stock/GETSTOCKBYID',data)
export const deletesku = data => post('/api/stock/DELETESTOCK',data)
export const updatesku = data => post('/api/stock/UPDATESTOCK',data)
export const addsku = data => post('/api/stock/ADDSTOCK',data)
// fix item相关
export const getfixitem = data=> post('/api/fixitem/GETFIXITEMS',data)
export const getfixitembyid = data=> post('/api/fixitem/GETFIXITEMBYID',data)
export const deletefixitem = data => post('/api/fixitem/DELETEFIXITEM',data)
export const updatefixitem = data => post('/api/fixitem/UPDATEFIXITEM',data)
export const addfixitem = data => post('/api/fixitem/ADDFIXITEM',data)

// 分类相关
export const getfixitemsort = data=> post('/api/fixitemsort/GETSORTS',data)
export const getfixitemsortbyid = data=> post('/api/fixitemsort/GETSORTBYID',data)
export const deletefixitemsort = data => post('/api/fixitemsort/DELETESORT',data)
export const updatefixitemsort = data => post('/api/fixitemsort/UPDATESORT',data)
export const addfixitemsort = data => post('/api/fixitemsort/ADDSORT',data)

// 维修机型
export const getfixmodel = data=> post('/api/fixmodel/GETMODELS',data)
export const getfixmodelbyid = data=> post('/api/fixmodel/GETMODELBYID',data)
export const deletefixmodel = data => post('/api/fixmodel/DELETEMODEL',data)
export const updatefixmodel = data => post('/api/fixmodel/UPDATEMODEL',data)
export const addfixmodel = data => post('/api/fixmodel/ADDMODEL',data)

 // 优惠券管理
 export const getcoupon = data=> post('/api/coupon/GETCOUPONBYSORT',data)
 export const getcouponbyid = data=> post('/api/coupon/GETCOUPONBYID',data)
 export const deletecoupon = data => post('/api/coupon/DELETECOUPON',data)
 export const updatecoupon = data => post('/api/coupon/UPDATECOUPON',data)
 export const addcoupon = data => post('/api/coupon/ADDCOUPON',data)