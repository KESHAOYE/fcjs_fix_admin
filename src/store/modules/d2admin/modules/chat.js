export default {
    namespaced: true,
    state: {
      // 是否连接
      status: false,
      // 对方用户名或连接状态
      chathead: '无连接',
      chatInfo:[],
      userinfo:{}
    },
    mutations: {
      /**
       * @description 改变状态
       * @param {Object} state state
       */
      changeState (state,data) {
        state.status = data
      },
      clean(state){
        state.chatInfo = []
      },
      add(state,data){
       state.chatInfo.push(data)
      },
      changeUserinfo(state,data){
        state.userinfo = data
      },
      /**
       * @description 设置用户名 或者 状态
       * @param {Object} state state
       * @param {Boolean} active active
       */
      set (state, data) {
        state.chathead = data
      }
    }
  }
  