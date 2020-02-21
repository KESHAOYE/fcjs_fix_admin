<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  import util from '@/libs/util'
  import {
    autologin,
    getuserinfo
  } from '@/api/api'
  import {
    mapActions,
    mapState
  } from 'vuex'
  export default {
    name: 'app',
    watch: {
      '$i18n.locale': 'i18nHandle'
    },
    created() {
      if (localStorage.getItem('_T_')) {
        let info = JSON.parse(window.localStorage.getItem('_T_'))
        let phone = info.phone
        let token = info._T_
        const d = {
          phone: phone,
          token: token
        }
        autologin(d)
          .then(data => {
            if (data.code === 200) {
              const qss = {
                id: null,
                phone: phone
              }
              getuserinfo(qss).then(datas => {
                this.connect()
              })
            } else {
              console.log('token登录失败')
            }
          })
      }
      this.i18nHandle(this.$i18n.locale)
    },
    mounted() {},
    computed: {
      ...mapState('d2admin/user', [
        'info'
      ]),
      ...mapState('d2admin/chat', [
        'userinfo'
      ])
    },
    methods: {
      ...mapActions('d2admin/account', [
        'getuserinfos'
      ]),
      i18nHandle(val, oldVal) {
        util.cookies.set('lang', val)
        document.querySelector('html').setAttribute('lang', val)
      },
      connect() {
        this.$store.commit('d2admin/chat/set', '连接中..')
        if (this.info.username && this.info.username.length > 0) {
          this.$socket.emit('connection')
          this.$socket.emit('storeClientInfo', {
            userid: this.info.userid,
            customId: this.info.username,
            type: 'ADMIN'
          })
          this.$store.commit('d2admin/chat/set', '客服服务启动,等待连接')
        }
      }
    },
    sockets: {
      findUser(data) {
        if (this.$route.path != '/chat') {
          this.$notify({
            title: '提示',
            message: '与客户的会话自动建立，请前往客服中心处理',
            type: 'success',
            duration: 0
          })
        }
        this.$store.commit('d2admin/chat/changeUserinfo',data.userinfo)
        this.$store.commit('d2admin/chat/changeState', true)
        this.$store.commit('d2admin/chat/set', data.userinfo.customId)
      },
      userDisconnect(data) {
        if (data.clientId == this.userinfo.clientId) {
            this.$store.commit('d2admin/chat/changeState',false)
            this.$store.commit('d2admin/chat/set','用户掉线,闲置')
            this.$store.commit('d2admin/chat/changeUserinfo',{})
          }
      },
      sayto(data) {
        if (this.$route.path != '/chat') {
          this.$notify({
            title: '提示',
            message: `用户${data.user}向您发送了信息，请及时前往客服中心处理`,
            type: 'success',
            duration: 2500
          })
        }
        this.$store.commit('d2admin/chat/add',data)
      },
      disconnect() {
        this.$store.commit('d2admin/chat/set','断开连接')
        this.$store.commit('d2admin/chat/changeState',false)
        console.log("与服务器断开连接");
      },
    }
  }

</script>

<style lang="scss">
  @import '~@/assets/style/public-class.scss';
  
</style>
