import { Message, MessageBox } from 'element-ui'
import util from '@/libs/util.js'
import router from '@/router'
import { logins,getrole,getuserinfo,getrouter } from '@api/api'

export default {
  namespaced: true,
  actions: {
    /**
     * @description 登录
     * @param {Object} context
     * @param {Object} payload username {String} 用户账号
     * @param {Object} payload password {String} 密码
     * @param {Object} payload route {Object} 登录成功后定向的路由对象 任何 vue-router 支持的格式
     */
    login ({ dispatch }, data) {
      return new Promise((resolve, reject) => {
        // 开始请求登录接口
        logins(data)
          .then(res => {
            console.log(res)
            if(res.code == 200 ){
            const result = {
              phone: data.phone,
              _T_:`'${res._T_}'`
            }
            window.localStorage.setItem('_T_',JSON.stringify(result))
            resolve(dispatch('isadmin',{phone:data.phone}))
          }else{
            Message({
              message: res.message,
              type: 'error'
            })
          }
          })
          .catch(err => {
            console.log('err: ', err)
            reject(err)
          })
      })
    },
   getuserinfos({commit,dispatch},data){
      return new Promise(resolve=>{
        getuserinfo(data)
        .then(async data=>{
          await dispatch('d2admin/user/set', data.info,{root:true})
          resolve(dispatch('getrouter'))
        })
      })
    },
    isadmin({commit,dispatch},data){
      return new Promise((resolve,reject) => {
      getrole(data)
      .then(res => {
        if(res.code == 200){
          window.localStorage.setItem('role',JSON.stringify(res))
          resolve(dispatch('getuserinfos',data))
        }else{
          Message({
            message: res.message,
            type: 'error',
            duration: 1500
          })
          reject()
        }
      })
    })
    },
    getrouter({commit,dispatch}){
      return new Promise(async (resolve,reject)=>{
        let userinfo = await dispatch('d2admin/db/get', {
          dbName: 'sys',
          path: 'user.info',
          defaultValue: {},
          user: true
        }, { root: true })
        getrouter({userid: userinfo.userid})
        .then(data=>{
          Message({
            message: '登录成功',
            type: 'success'
          })
          window.localStorage.setItem('menu',JSON.stringify(data.info))
          commit('d2admin/menu/asideSet',data.info,{ root: true })
          resolve()
        })
        .catch(err=>{
          Message({
            message: err,
            type: 'error'
          })
          reject()
        })
      })
    },
    /**
     * @description 注销用户并返回登录页面
     * @param {Object} context
     * @param {Object} payload confirm {Boolean} 是否需要确认
     */
    logout ({ commit, dispatch }, { confirm = false } = {}) {
      /**
       * @description 注销
       */
      async function logout () {
        // 删除cookie
        window.localStorage.removeItem('_T_')
        window.localStorage.removeItem('role')
        // 清空 vuex 用户信息
        await dispatch('d2admin/user/set', {}, { root: true })
        // 跳转路由
        router.push({
          name: 'login'
        })
      }
      // 判断是否需要确认
      if (confirm) {
        commit('d2admin/gray/set', true, { root: true })
        MessageBox.confirm('确定要注销当前用户吗', '注销用户', {
          type: 'warning'
        })
          .then(() => {
            commit('d2admin/gray/set', false, { root: true })
            logout()
          })
          .catch(() => {
            commit('d2admin/gray/set', false, { root: true })
            Message({
              message: '取消注销操作'
            })
          })
      } else {
        logout()
      }
    },
    /**
     * @description 用户登录后从持久化数据加载一系列的设置
     * @param {Object} context
     */
    load ({ dispatch }) {
      return new Promise(async resolve => {
        // DB -> store 加载用户名
        await dispatch('d2admin/user/load', null, { root: true })
        // DB -> store 加载主题
        await dispatch('d2admin/theme/load', null, { root: true })
        // DB -> store 加载页面过渡效果设置
        await dispatch('d2admin/transition/load', null, { root: true })
        // DB -> store 持久化数据加载上次退出时的多页列表
        await dispatch('d2admin/page/openedLoad', null, { root: true })
        // DB -> store 持久化数据加载侧边栏折叠状态
        await dispatch('d2admin/menu/asideCollapseLoad', null, { root: true })
        // DB -> store 持久化数据加载全局尺寸
        await dispatch('d2admin/size/load', null, { root: true })
        // DB -> store 持久化数据加载颜色设置
        await dispatch('d2admin/color/load', null, { root: true })
        // end
        resolve()
      })
    }
  }
}
