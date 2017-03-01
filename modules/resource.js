/**
 * Created by 83471 on 2016/8/2.
 */
'use strict';

angular.module('app.resource', [])
    .service('ResourceManager', ['$rootScope', '$http', 'SERVER_URL', 'MESSAGE_URL', 'en-US-String', 'zh-CN-String', 'TIMEZONE', function ($rootScope, $http, SERVER_URL, MESSAGE_URL, en_US_String, zh_CN_String, TIMEZONE) {

        var locale = 'zh-CN',
            i18nResource,
            configurations,
            welcomeData,
            picTextDetail,
            pic_Url,
            meal,
            cart = [],
            langString,
            service = {},
            time;

        this.initialize = function (mainJSON, menuJSON) {
            i18nResource = {};
            i18nResource['zh-CN'] = {};
            i18nResource['en-US'] = {};
            i18nResource['zh-CN'].language = 'zh-CN';
            i18nResource['en-US'].language = 'en-US';
            i18nResource['zh-CN'].guest_name = mainJSON.guest_name;
            i18nResource['en-US'].guest_name = mainJSON.guest_name_eng;
            i18nResource['zh-CN'].welcome_text = mainJSON.welcome_text;
            i18nResource['en-US'].welcome_text = mainJSON.welcome_text_eng;

            configurations = {};
            configurations.logoUrl = SERVER_URL + mainJSON.logo;
            configurations.welcomeBgImageUrl = SERVER_URL + mainJSON.background_video_url;

            var viewTree = [], viewTreeIndex = 0, subViewTreeIndex = 0;
            menuJSON.Content.forEach(function (el, idx, arr) {
                var childViews = [];
                if (el.Second) {
                    el.Second.Content.forEach(function (el2, idx2, arr2) {
                        var nameKey = 'sub_menu_item_' + subViewTreeIndex;
                        childViews.push({
                            nameKey: nameKey,
                            nameEng: el2.NameEng,
                            type: el2.Type,
                            pic: SERVER_URL + el2.Icon_URL,
                            config: SERVER_URL + el2.Json_URL,
                            name:el2.Name,
                            icon_url: SERVER_URL + el2.Icon_focus_URL
                        });
                        i18nResource['zh-CN'][nameKey] = el2.Name;
                        i18nResource['en-US'][nameKey] = el2.NameEng;
                        subViewTreeIndex++;
                    });
                }
                var nameKey = 'menu_item_' + viewTreeIndex;
                viewTree.push({
                    childViews: childViews,
                    nameKey: nameKey,
                    nameEng: el.NameEng,
                    type: el.Type,
                    pic: SERVER_URL + el.Icon_URL,
                    config: SERVER_URL + el.Json_URL,
                    name: el.Name,
                    icon_url: SERVER_URL + el.Icon_focus_URL
                });
                viewTreeIndex++;
                i18nResource['zh-CN'][nameKey] = el.Name;
                i18nResource['en-US'][nameKey] = el.NameEng;
            });
            configurations.viewTree = viewTree;
        };

        this.setLocale = function (_locale) {
            locale = _locale;
            if (locale == "zh-CN") {
                langString = zh_CN_String;
            } else {
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
            //return resource;
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
                title: title,
                detail: detail
            };
        }

        this.getPicTextDetail = function () {
            return picTextDetail;
        }

        this.setPic = function (pic) {
            pic_Url = {
                url: pic
            };
        }

        this.getPic = function () {
            return pic_Url;
        }

        this.setMeal = function (id) {
            meal = {
                id: id
            };
        }

        this.getMeal = function () {
            return meal;
        }

        this.addToCart = function (id, f, n, p) {
            cart[id] = {
                name: f,
                num: n,
                price: p
            }
        }

        this.getCart = function () {
            return cart;
        }

        this.resetCart = function () {
            cart = [];
        };

        this.setService = function (name, icon) {
            service = {
                name: name,
                icon: icon
            }
        };
        this.getService = function () {
            return service;
        };

        this.getTime = function () {
            return $http.get(SERVER_URL + "/date.json").success(function (data) {
                time = new Date(data.date + (TIMEZONE * 3600000));
            });
        };
        this.timeReturn = function () {
            return time;
        };

        this.getConfigurations = function () {
            return {
                mainConfigUrl: function () {
                    return SERVER_URL + '/main.json';
                },
                serverUrl: function () {
                    return SERVER_URL;
                },
                logoUrl: function () {
                    return configurations.logoUrl;
                },
                welcomeBgImageUrl: function () {
                    return configurations.welcomeBgImageUrl;
                },
                languages: function () {
                    return configurations.languages;
                },
                viewTree: function () {
                    return configurations.viewTree;
                },
                billUrl: function () {
                    return SERVER_URL + '/billing.json';
                },
                messageUrl: function () {
                    return MESSAGE_URL;
                }
            };
        };
        this.setCookie = function(c_name,value,expiredays)
        {
            var exdate=new Date();
            exdate.setDate(exdate.getDate()+expiredays)
            document.cookie=c_name+ "=" +escape(value)+
                ((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
        }

        //取回cookie
        this.getCookie = function(c_name)
        {
            if (document.cookie.length>0)
            {
                var c_start=document.cookie.indexOf(c_name + "=")
                if (c_start!=-1)
                {
                    c_start=c_start + c_name.length+1
                    var c_end=document.cookie.indexOf(";",c_start)
                    if (c_end==-1) c_end=document.cookie.length
                    return unescape(document.cookie.substring(c_start,c_end))
                }
            }
            return ""
        }

    }])
    .constant('SERVER_URL', 'http://192.168.30.75/nativevod/now')
    //.constant('SERVER_URL', '/dtv/usb/sda4/nativevod/now')
    .constant('MESSAGE_URL', 'http://192.168.17.101:8000/backend/GetMessage')
    .constant('TIMEZONE', 8);

