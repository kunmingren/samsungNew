///**
// * Created by 83471 on 2016/8/2.
// */
//'use strict';
//
//angular.module('app.resource', [])
//    .service('ResourceManager', ['$rootScope', 'SERVER_URL', 'MESSAGE_URL', 'en-US-String','zh-CN-String', function ($rootScope, SERVER_URL, MESSAGE_URL, en_US_String,zh_CN_String) {
//
//        var locale         = 'zh-CN',
//            i18nResource,
//            picTextDetail,
//            cityIndex,
//            meal,
//            cart = [],
//            langString;
//
//        this.initialize = function (mainJSON, menuJSON) {
//
//            i18nResource = {};
//            i18nResource['zh-CN'] = {};
//            i18nResource['en-US'] = {};
//            i18nResource['zh-CN'].language         = 'zh-CN';
//            i18nResource['en-US'].language         = 'en-US';
//
//        };
//
//        this.setLocale = function (_locale) {
//            locale = _locale;
//            if(locale=="zh-CN"){
//                langString = zh_CN_String;
//            }else{
//                langString = en_US_String;
//            }
//            $rootScope.$broadcast('locale.change', _locale);
//            //console.log(locale);
//        };
//
//        this.getLocale = function () {
//            return langString;
//        };
//
//        this.getI18NResource = function () {
//            // keep i18n resource be a snapshot
//            var resource = i18nResource[locale];
//            return {
//                getString: function (resourceKey) {
//                    return resource[resourceKey];
//                }
//            };
//        };
//
//        this.addI18NResource = function (strs) {
//            Object.keys(strs['zh-CN']).forEach(function (key) {
//                i18nResource['zh-CN'][key] = strs['zh-CN'][key];
//            });
//            Object.keys(strs['en-US']).forEach(function (key) {
//                i18nResource['en-US'][key] = strs['en-US'][key];
//            });
//        };
//
//        this.setPicTextDetail = function (title, detail) {
//            picTextDetail = {
//                title : title,
//                detail : detail
//            };
//        }
//
//        this.getPicTextDetail = function () {
//            return picTextDetail;
//        }
//
//        this.setCity = function(city){
//            cityIndex = {
//                cityName:city
//            };
//        }
//
//        this.getCity = function(){
//            return cityIndex;
//        }
//
//        this.setMeal = function(id){
//            meal = {
//                id:id
//            };
//        }
//
//        this.getMeal = function(){
//            return meal;
//        }
//
//        this.addToCart = function(id,f,n,p){
//            cart[id] = {
//                name : f ,
//                num : n ,
//                price : p
//            }
//        }
//
//        this.getCart = function(){
//            return cart;
//        }
//
//        this.resetCart = function(){
//            cart = [];
//        }
//
//    }])
//    .constant('SERVER_URL', 'http://172.17.173.100/nativevod/now')
//    .constant('MESSAGE_URL', 'http://192.168.17.101:8000/backend/GetMessage');
'use strict';

angular.module('app.resource', [])
    .service('ResourceManager', ['$rootScope', 'SERVER_URL', 'MESSAGE_URL', 'en-US-String','zh-CN-String', function ($rootScope, SERVER_URL, MESSAGE_URL, en_US_String,zh_CN_String) {

        var locale         = 'zh-CN',
            i18nResource,
            configurations,
            picTextDetail,
            cityIndex,
            meal,
            cart = [],
            langString;

        this.initialize = function (mainJSON, menuJSON) {

            i18nResource = {};
            i18nResource['zh-CN'] = {};
            i18nResource['en-US'] = {};
            i18nResource['zh-CN'].language         = 'zh-CN';
            i18nResource['en-US'].language         = 'en-US';
            i18nResource['zh-CN'].guest_name         = mainJSON.guest_name;
            i18nResource['en-US'].guest_name         = mainJSON.guest_name_eng;
            i18nResource['zh-CN'].hotel_manager_name = mainJSON.hotel_manager_name;
            i18nResource['en-US'].hotel_manager_name = mainJSON.hotel_manager_name_eng;
            i18nResource['zh-CN'].welcome_text       = mainJSON.welcome_text;
            i18nResource['en-US'].welcome_text       = mainJSON.welcome_text_eng;

            configurations = {};
            configurations.backgroundVideoUrl = SERVER_URL + mainJSON.background_video_url;
            //configurations.mainConfigUrl      = SERVER_URL + '/main.json';
            configurations.menuConfigUrl      = SERVER_URL + mainJSON.MainView_Json_URL;
            configurations.logoUrl            = SERVER_URL + mainJSON.logo;
            var languages                     = [];
            mainJSON.Content.forEach(function (el, idx, arr) {
                var codeLocaleMapping = {ENG: 'en-US', CHZ: 'zh-CN'};
                languages.push({
                    code: codeLocaleMapping[el.Code],
                    name: el.Name,
                    icon: SERVER_URL + el.URL
                });
            });
            configurations.languages = languages;

            var viewTree = [], subViewTreeIndex = 0, viewTreeIndex = 0;
            menuJSON.Content.forEach(function (el, idx, arr) {
                //var childViews = [];
                if (el.Second) {
                    el.Second.Content.forEach(function (el2, idx2, arr2) {
                        var nameKey = 'menu_item_' + viewTreeIndex;
                        viewTree.push({
                            icon: SERVER_URL + el2.Icon_URL,
                            nameKey: nameKey,
                            type: el2.Type,
                            config: SERVER_URL + el2.Json_URL
                        });
                        i18nResource['zh-CN'][nameKey] = el2.Name;
                        i18nResource['en-US'][nameKey] = el2.NameEng;
                        viewTreeIndex++;
                    });
                    return;
                }
                var nameKey = 'menu_item_' + viewTreeIndex;
                viewTree.push({
                    //childViews: childViews,
                    nameKey: nameKey,
                    type: el.Type,
                    icon: SERVER_URL + el.Icon_URL,
                    config: SERVER_URL + el.Json_URL
                });
                viewTreeIndex++;
                i18nResource['zh-CN'][nameKey] = el.Name;
                i18nResource['en-US'][nameKey] = el.NameEng;
            });
            configurations.viewTree = viewTree;

        };

        this.setLocale = function (_locale) {
            locale = _locale;
            if(locale=="zh-CN"){
                langString = zh_CN_String;
            }else{
                langString = en_US_String;
            }
            $rootScope.$broadcast('locale.change', _locale);
            //console.log(locale);
        };

        this.getLocale = function () {
            return langString;
        };

        this.getI18NResource = function () {
            // keep i18n resource be a snapshot
            var resource = i18nResource[locale];
            return {
                getString: function (resourceKey) {
                    return resource[resourceKey];
                }
            };
        };

        this.addI18NResource = function (strs) {
            Object.keys(strs['zh-CN']).forEach(function (key) {
                i18nResource['zh-CN'][key] = strs['zh-CN'][key];
            });
            Object.keys(strs['en-US']).forEach(function (key) {
                i18nResource['en-US'][key] = strs['en-US'][key];
            });
        };

        this.setPicTextDetail = function (title, detail) {
            picTextDetail = {
                title : title,
                detail : detail
            };
        }

        this.getPicTextDetail = function () {
            return picTextDetail;
        }

        this.setCity = function(city){
            cityIndex = {
                cityName:city
            };
        }

        this.getCity = function(){
            return cityIndex;
        }

        this.setMeal = function(id){
            meal = {
                id:id
            };
        }

        this.getMeal = function(){
            return meal;
        }

        this.addToCart = function(id,f,n,p){
            cart[id] = {
                name : f ,
                num : n ,
                price : p
            }
        }

        this.getCart = function(){
            return cart;
        }

        this.resetCart = function(){
            cart = [];
        }

        this.getConfigurations = function () {
            return {
                backgroundVideoUrl: function () {
                    return configurations.backgroundVideoUrl;
                },
                mainConfigUrl: function () {
                    return SERVER_URL + '/main.json';
                },
                serverUrl: function () {
                    return SERVER_URL;
                },
                logoUrl: function () {
                    return configurations.logoUrl;
                },
                languages: function () {
                    return configurations.languages;
                },
                viewTree: function () {
                    return configurations.viewTree;
                },
                billUrl: function() {
                    return SERVER_URL + '/billing.json';
                },
                messageUrl: function() {
                    return MESSAGE_URL;
                },
            };
        };

    }])
    .constant('SERVER_URL', 'http://172.17.173.100/nativevod/now')
    .constant('MESSAGE_URL', 'http://192.168.17.101:8000/backend/GetMessage');
