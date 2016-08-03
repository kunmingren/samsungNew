'use strict';

angular.module('app.zh-CN', [])
    .service('zh-CN-String', [function () {
        return {
            lang:'zh-CN',
            welcome: {
                cue: '根据您的语言习惯选择使用的语言系统',
                welcome_text:'欢迎来到希尔顿酒店！我们将为您提供温馨舒适的客房、美味可口的佳肴、现代齐全的设施设备和尽善尽美的服务。感谢您对我们的支持，期待您的光临！',
                press1:'按',
                press2:'进入'
            },
            index: {
                guestName: '尊敬的 ',
                roomNumber: '房间号:'
            },
            toolbar: {
                ok: '按OK选择分类',
                weather_ok:'按OK选择分类',
                order_ok:'按OK选择分类',
                up_down: '按上下移动选项',
                left_right: '按左右切换图片',
                cart_l_r:'按左右修改数量',
                weather_open:'按OK打开城市列表',
                back: '点击 返回',
                menu: '点击 打开菜单',
                menuText: '菜 单'
            },
            weather:{
                title:'天气',
                city_list:'城市列表',
                day1:'今天',
                day2:'明天',
                day3:'后天'
            },
            bill: {
                title: '账单',
                billList: '消费项目',
                time: '时间',
                price: '金额',
                currentPage: '当前页',
                total: '总计'
            },
            tpl_categroy_list: {
                title: '城市介绍'
            },
            movie: {
                title: '电影'
            },
            message: {
                title: '留言'
            },
            order: {
                title: '订餐服务',
                add:'加入购物车',
                cart:'购物车',
                coin:'￥'
            },
            cart:{
                title:'购物车',
                coin:'￥',
                price:'/份',
                total:'总价',
                submit:'提交订单',
                cancel:'取消订单'
            }
        }
    }])
