import axios from 'axios';
import qs from 'qs';
import { Message } from 'element-ui';
import router from '@/router/routes';
import store from '@/store'
//判断环境
if (process.env.NODE_ENV == "development") {
    process.env.BASE_API = "localhost:3000"
} else if (process.env.NODE_ENV == "debug") {
    process.env.BASE_API = "localhost:3000"
} else if (process.env.NODE_ENV == "production") {
    process.env.BASE_API = "localhost:3000"
}
const server = axios.create({
        baseURL: process.env.BASE_API,
        //时延 5s
        timeout: 10000
    })
    //请求拦截器-在发送请求前判断是否带token
server.interceptors.request.use(
        config => {
            const role = window.localStorage.getItem('role')? JSON.parse(window.localStorage.getItem('role')).info[0].roleid : ''
            const token = window.localStorage.getItem('_T_')?JSON.parse(window.localStorage.getItem('_T_'))._T_:''
            const phone = store.state.d2admin.user.info ? store.state.d2admin.user.info.phone : ''
            token && (config.headers.Authorization = token);
            role && (config.headers.roleid = role)
            phone && (config.headers.phone=phone)
            return config;
        },
        error => {
            return Promise.error(error)
        }
    )
    //响应拦截器-如果状态码错误，则报错
server.interceptors.response.use(
        response => {
            if (response.data.code === 200) {
                return Promise.resolve(response)
            } else {
                switch (response.data.code) {
                    case 201:
                            Message({
                                message: "您不是管理员，无法登录此系统",
                                type: "error",
                                duration: "2500"
                            })
                            break;
                    //400：请求错误
                    case 400:
                        Message({
                            message: "请求发生错误！工程师紧急维修中",
                            type: "error",
                            duration: "2500"
                        })
                        break;
                        //401：登陆失败：即用户名或密码错误
                    case 401:
                        router.push({
                            path: "/login",
                        })
                        Message({
                            message: "用户名或密码错误",
                            type: "error",
                            duration: "2500"
                        })
                        break;
                        //402：验证码错误：手机验证码发生错误
                    case 402:
                        Message({
                            message: "验证码错误",
                            type: "error",
                            duration: "2500"
                        })
                        break;
                        //601：拒绝访问：token过期/无token情况已经由请求拦截器截拦
                    case 601:
                    console.log(store)    
                    store.dispatch('d2admin/account/logout',{
                             confirm: false
                    })
                        Message({
                            message: "登陆过期,请重新登录!",
                            type: "error",
                            duration: "2500"
                        })
                        break;
                        //404：不存在接口
                    case 404:
                        Message({
                            message: "请求错误!",
                            type: "error",
                            duration: "2500"
                        })
                        break;
                        //405：未登录
                    case 405:
                        router.push({
                            path: "/login",
                            query: {
                                prepath: router.currentRoute.fullPath
                            }
                        })
                        Message({
                            message: "您暂未登录!",
                            type: "error",
                            duration: "2500"
                        })
                        break;
                    default:
                        Message({
                            message: "发生错误,请重试！",
                            type: "error",
                            duration: "2500"
                        })
                }
                return Promise.reject(response)
            }
        },
        //如果返回状态码不为2开头，进入报错
        error => {
            //其余情况操作，直接打印在控制台
            if (error.response) {
                if (error.response.status) {
                    switch (error.response.status) {
                        //400：请求错误
                        case 400:
                            Message({
                                message: "请求发生错误！工程师紧急维修中",
                                type: "error",
                                duration: "2500"
                            })
                            break;
                            //401：登陆失败：即用户名或密码错误
                        case 401:
                            router.push({
                                path: "/login",
                            })
                            Message({
                                message: "用户名或密码错误",
                                type: "error",
                                duration: "2500"
                            })
                            break;
                            //402：验证码错误：手机验证码发生错误
                        case 402:
                            Message({
                                message: "验证码错误",
                                type: "error",
                                duration: "2500"
                            })
                            break;
                            //601：拒绝访问：token过期/无token情况已经由请求拦截器截拦
                        case 601:
                            router.push({name: login})
                            Message({
                                message: "登陆过期,请重新登录!",
                                type: "error",
                                duration: "2500"
                            })
                            break;
                            //404：不存在接口
                        case 404:
                            Message({
                                message: "请求错误!",
                                type: "error",
                                duration: "2500"
                            })
                            break;
                            //405：未登录
                        case 405:
                            router.push({
                                path: "/login",
                                query: {
                                    prepath: router.currentRoute.fullPath
                                }
                            })
                            Message({
                                message: "您暂未登录!",
                                type: "error",
                                duration: "2500"
                            })
                            break;
                        case 600:
                            Message({
                                message: error,
                                type: "error",
                                duration: "2500"
                            })
                            break;
                        default:
                            Message({
                                message: "发生错误,请重试！" + error,
                                type: "error",
                                duration: "2500"
                            })
                    }
                    return Promise.reject(error.response)
                }
            } else {
                Message({
                    message: "网络错误,请刷新重试！",
                    type: "error",
                    duration: "2000"
                })
                return Promise.reject(error)
            }
        }
    )
    //get方法
    /**
     * 封装的get方法
     * @param {*} url 接口路径
     * @param {*} params 参数
     */
export function get(url, params) {
    return new Promise((resolve, reject) => {
        server.get(url, params)
            .then((data) => {
                resolve(data.data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}
//post方法
/**
 * 封装post方法
 * @param {*} url 接口路径
 * @param {*} params 参数
 */
export function post(url, params) {
    return new Promise((resolve, reject) => {
        server.post(url, qs.stringify(params))
            .then((data) => {
                resolve(data.data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

export default server;