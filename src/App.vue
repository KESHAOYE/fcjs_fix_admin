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
              getuserinfo(qss).then(datas => {})
            } else {
              console.log('token登录失败')
            }
          })
      }
      this.connect()
      this.i18nHandle(this.$i18n.locale)
    },
    mounted() {
    },
    computed: {
      ...mapState('d2admin/user', [
        'info'
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
        this.$store.commit('d2admin/chat/set','连接中..')
        if (this.info.username && this.info.username.length > 0) {
          this.$socket.emit('connection')
          this.$socket.emit('storeClientInfo', {
            userid: this.info.userid,
            customId: this.info.username,
            type: 'ADMIN'
          })
          console.log('聊天服务启动');
        }
      }
    }
  }

</script>

<style lang="scss">
  @import '~@/assets/style/public-class.scss';

</style>
