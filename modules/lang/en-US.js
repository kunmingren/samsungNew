'use strict';

angular.module('app.en-US', [])
    .service('en-US-String', [function () {
        return{
            lang:'en-US',
            welcome: {
                welcome_text:'Welcome to Hilton！You will enjoy comfortable guest room, tasty food, full equipments and perfect service here. Thanks for your strong support.  We are sincerely looking forward to your visit！',
                press1:'',
                press2:'Enter',
                guestName:'Dear ',
            },
            toolbar: {
                left: '',
                selsct: 'Select',
                select_Live: 'Select Channal',
                ok: 'OK',
                back: 'Back',
                menu: 'Menu',
                play: 'Play',
            },
            weather: {
                title: 'weather',
                city_list: 'list of cities',
                day1: 'today',
                day2: 'tomorrow',
                day3: 'the day after tomorrow',
                type_in:'domestic',
                type_out:'foreign'
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
                title: 'Movie',
                dire:'Director',
                act:'Actors'
            },
            music: {
                title: 'Music'
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
            },
            live:{
                title:'Live'
            }
        }

    }])
