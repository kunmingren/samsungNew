'use strict';

angular.module('app.zh-CN', [])
    .service('zh-CN-String', [function () {
        return {
            lang:'zh-CN',
            welcome: {
                welcome_text:'欢迎来到希尔顿酒店！我们将为您提供温馨舒适的客房、美味可口的佳肴、现代齐全的设施设备和尽善尽美的服务。感谢您对我们的支持，期待您的光临！',
                press1:'按',
                press2:'进入',
                guestName: '尊敬的 ',
            },
            toolbar: {
                left: '按',
                selsct: '进行选择',
                select_Live: '选择频道',
                ok: '确认',
                back: '返回',
                menu: '返回菜单页',
                play: '播放',
            },
            weather:{
                title:'天气',
                city_list:'城市列表',
                day1:'今天',
                day2:'明天',
                day3:'后天',
                type_in:'国内',
                type_out:'国外'
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
                title: '电影',
                dire:'导演',
                act:'主演'
            },
            music: {
                title: '音乐'
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
            },
            live:{
                title:'电视直播'
            }
        }
    }])
