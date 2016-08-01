'use strict';

angular.module('app.en-US', [])
    .service('en-US-String', [function () {
        return{
            lang:'en-US',
            welcome: {
                cue: 'Please select language as you like'
            },
            index:{
                guestName:'Dear ',
                roomNumber:'Room Number:'
            },
            toolbar: {
                ok: 'Click OK button to select category',
                weather_ok:'Click OK button to select city',
                order_ok:'Click OK button to select meal',
                up_down: 'Click Up and Down to move option',
                left_right: 'Click Left and Right to change image',
                cart_l_r:'Click Left and Right to change number',
                weather_open:'Click OK button to open cities list',
                back: 'Click back',
                menu: 'Click to open the menu',
                menuText: 'MENU'
            },
            weather: {
                title: 'weather',
                city_list: 'list of cities',
                day1: 'today',
                day2: 'tomorrow',
                day3: 'the day after tomorrow'
            },
            bill: {
                title: 'Bill',
                billList: 'Consumer items',
                time: 'Time',
                price: 'Price',
                currentPage: 'Current page',
                total: 'Total'
            },
            tpl_categroy_list: {
                title: 'City Guide'
            },
            movie: {
                title: 'Movie'
            },
            message: {
                title: 'Message'
            },
            order: {
                title: 'Order',
                add:'Add',
                cart:'Cart',
                coin:'$'
            },
            cart:{
                title:'Shopping Cart',
                coin:'$',
                price:'/parts',
                total:'Total Price',
                submit:'Submit',
                cancel:'Cancel'
            }
        }

    }])
