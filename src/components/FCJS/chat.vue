<template>
    <div class="body">
        <div class="chat">
            <div class="chat_head">
                <div class="back">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href='#icon-houtui'></use>
                    </svg>
                </div>
                <div class="userstatus" :class="{connectsuccess: status}">
                </div>
                <div @click='connect'>{{chathead}}</div>
            </div>
            <!-- 聊天室主体 -->
            <div class="chat_content">

            </div>
            <div class="input_block">
                <input type="text" v-model="text">
                <el-popover ref="popover" placement="top" title="标题" width="200" trigger="click">
                    <div class="expression" slot="reference">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href='#icon-biaoqing'></use>
                        </svg>
                    </div>
                </el-popover>
                <div class="expression">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href='#icon-tupian'></use>
                    </svg>
                </div>
                <div class="button" @click='send'>发送</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                text: '',
                username: '',
                touser: '',
                chathead: '连接中..',
                status: false,
                chatInfo: [],
                oldchatInfo: [],
                adminInfo: []
            }
        },
        methods: {
            /**
             * 连接
             */
            connect() {
                this.chathead = '连接中...'
                this.username = this.info.username
                if (this.username && this.username.length > 0 && this.status == false) {
                    this.$socket.emit('connection')
                    this.$socket.emit('storeClientInfo', {
                        userid: this.info.userid,
                        customId: this.username,
                        type: 'ADMIN'
                    })
                    console.log('聊天服务启动');
                }
            },
            send() {
                this.$socket.emit('sayto', {
                    id: this.adminInfo,
                    msg: this.text
                })
            }
        },
        sockets: {
            newconnect(data) {
                // this.connect()
            },
            disconnect() {
                this.chathead = '断开连接'
                this.status = false
                console.log("与服务器断开连接");
                this.connect()
            },
            sayto(data) {
                console.log(`用户${data.user}向您发送了:${data.msg}`);
            },
            userDisconnect(data) {
                if (data.clientId == this.adminInfo.clientId) {
                    this.chathead = '客服掉线,等待重连'
                    this.status = false
                    this.connect()
                }
            },
            finedAdmin(data) {
                if (data.status) {
                    this.adminInfo = data.adminInfo
                    this.chathead = this.adminInfo.customId
                    this.status = true
                } else {
                    this.chathead = '当前无客服在线'
                }
            }
        },
        mounted() {
        },
    }
</script>

<style lang="scss" scoped>
    .body {
        width: 100vw;
        height: 100vh;
        background: #2e2f3d;
        margin: 0;
        padding: 0;
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
    }

    .chat {
        background: white;
        height: 700px;
        border-radius: 10px;
        border: 1px solid #f1f1f1;
        width: 830px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;

        .chat_head {
            width: 830px;
            height: 50px;
            font-family: '微软雅黑';
            font-size: 1.2em;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #fff;
            position: relative;
            border-bottom: 1px solid #f2f2f2;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;

            .back {
                position: absolute;
                left: 10px;
                font-size: 1.8em;
            }

            .userstatus {
                width: 10px;
                height: 10px;
                background: red;
                position: relative;
                left: -10px;
                border-radius: 50%;
            }

            .connectsuccess {
                background: #59fc18;
            }
        }

        .chat_content {
            width: 830px;
            height: 600px;
            background: white;
            overflow-y: auto;
        }

        .input_block {
            height: 50px;
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-around;
            align-items: center;
            border-top: 1px solid #f2f2f2;

            input {
                height: 35px;
                width: 550px;
                background: #f2f2f2;
                border-radius: 25px;
                border: 0;
                outline: 0;
                font-size: 1.1em;
                padding-left: 10px;
            }

            .expression {
                width: 35px;
                height: 35px;
                font-size: 1.8em;
                cursor: pointer;
            }

            .button {
                width: 80px;
                height: 35px;
                text-align: center;
                line-height: 35px;
                color: white;
                border-radius: 5px;
                cursor: pointer;
                background: #409EFF
            }
        }
    }

    .order {
        width: 300px;
        height: 700px;
        background: white;
        border: 1px solid #f1f1f1;
        border-left: 0;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;

        .order_head {
            width: 300px;
            height: 50px;
            border-bottom: 1px solid #f2f2f2;
            font-family: '微软雅黑';
            font-size: 1.2em;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #fff;
            border-top-right-radius: 10px;
        }
    }
</style>