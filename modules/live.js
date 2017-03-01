'use strict';

angular.module('app.live', [])
    .directive('repeatFinish', [function () {
        return {
            link: function (scope, element, attr) {
                if (scope.$last == true) {
                    scope.$eval(attr.repeatFinish);
                    scope.$last = false;
                }
            }
        }
    }])
    .controller('LiveController', ['$scope', 'ActivityManager', 'ResourceManager','COMMON_KEYS', 'LiveService', '$timeout', function ($scope, ActivityManager,ResourceManager, COMMON_KEYS, LiveService, $timeout) {
        var activity = ActivityManager.getActiveActivity();
        var channels = [];
        var stream,
            chaData,
            LISTTOP,
            timeout;
        activity.initialize($scope);

        if (document.readyState == "complete") {
            ActivityManager.hideLoading(500);
        }

        contentShow();
        activity.loadI18NResource(function (res) {
            var languageData = LiveService.getLanguage();
            $scope.left = languageData.toolbar.left;
            $scope.select = {
                icon: 'assets/images/icon_toolbar_select.png',
                right: languageData.toolbar.select_Live
            };
            $scope.ok = {
                //icon: 'assets/images/icon_toolbar_ok.png',
                icon: 'assets/images/icon_toolbar_menu1.png',
                right: languageData.toolbar.play
            };
            $scope.menu = {
                // icon: 'assets/images/icon_toolbar_menu.png',
                // right: languageData.toolbar.menu
            };
            $scope.logoUrl = LiveService.getLogoUrl();
            $scope.name = languageData.live.title;


        })

        if (LiveService.getChannels().length == 0) {
            LiveService.getPlayUrl().success(function (data) {
                LiveService.initialize().success(function (data) {
                    //console.log(LiveService.getChannels());
                    bindChannels();
                })
            })
        } else {
            bindChannels();
        }

        $scope.liveFinish = function () {
            $scope.selectedIndex = 0;
            LISTTOP = 310 - $scope.channels.length * 80;
            $scope.listStyleTop = LISTTOP + "px";
        }

        activity.onKeyDown(function (keyCode) {
            var tempIndex = $scope.selectedIndex;
            if (activity.isHide()) {
                switch (keyCode) {
                    case COMMON_KEYS.KEY_UP:
                        contentShow();
                        cutLoading();
                        tempIndex -= 1;
                        if (tempIndex < 0) {
                            $scope.listStyleTop = (LISTTOP - ($scope.channels.length - 1) * 80) + "px";
                            tempIndex = $scope.channels.length - 1;
                        } else {
                            $scope.listStyleTop = (LISTTOP - tempIndex * 80) + "px";
                        }
                        cutChannel(tempIndex);
                        break;
                    case COMMON_KEYS.KEY_DOWN:
                        contentShow();
                        cutLoading();
                        tempIndex += 1;
                        if (tempIndex > $scope.channels.length - 1) {
                            $scope.listStyleTop = LISTTOP + "px";
                            tempIndex = 0;
                        } else {
                            $scope.listStyleTop = (LISTTOP - tempIndex * 80) + "px";
                        }
                        cutChannel(tempIndex);
                        break;
                    case COMMON_KEYS.KEY_ENTER:
                        contentShow();
                        break;
                    case COMMON_KEYS.KEY_BACK:
                        LiveService.stopPlay();
                        $("body").css("background-image", "url(assets/images/bg_window.png)");
                        activity.finish();
                        break;
                }
                $scope.selectedIndex = tempIndex;
                return;
            }
            switch (keyCode) {
                case COMMON_KEYS.KEY_UP:
                    contentShow();
                    cutLoading();
                    tempIndex -= 1;
                    if (tempIndex < 0) {
                        $scope.listStyleTop = (LISTTOP - ($scope.channels.length - 1) * 80) + "px";
                        tempIndex = $scope.channels.length - 1;
                    } else {
                        $scope.listStyleTop = (LISTTOP - tempIndex * 80) + "px";
                    }
                    cutChannel(tempIndex);
                    break;
                case COMMON_KEYS.KEY_DOWN:
                    contentShow();
                    cutLoading();
                    tempIndex += 1;
                    if (tempIndex > $scope.channels.length - 1) {
                        $scope.listStyleTop = LISTTOP + "px";
                        tempIndex = 0;
                    } else {
                        $scope.listStyleTop = (LISTTOP - tempIndex * 80) + "px";
                    }
                    cutChannel(tempIndex);
                    break;
                case COMMON_KEYS.KEY_ENTER:
                    activity.hide();
                    break;
                case COMMON_KEYS.KEY_BACK:
                    activity.hide();
                    break;
            }
            $scope.selectedIndex = tempIndex;
        })

        function bindChannels() {
            chaData = LiveService.getChannels();
            $("body").css("background-image", "none");
            stream = chaData[0].stream;
            //stream = "udp://@229.1.1.1:8001";
            LiveService.onLoad(stream);
            for (var i = 0; i < chaData.length; i++) {
                channels.push({
                    index: i,
                    icon: chaData[i].icon,
                    name: LiveService.getChannelName(chaData[i].nameKey),
                    stream: chaData[i].stream
                });
            }
            $scope.channels = channels;
        }

        function cutChannel(tempIndex) {
            stream = chaData[tempIndex].stream;
            //stream = "udp://@229.1.1.1:8001";
            LiveService.changeVideo(stream);
        }

        function contentShow() {
            activity.show();
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                //重新渲染
                $timeout(function () {
                    $scope.channels = channels;
                    activity.hide();
                }, 0);
            }, 5000);
        }

        function cutLoading() {
            ActivityManager.showLoading();
            ActivityManager.hideLoading(0);
        }
    }])
    .service('LiveService', ['$q', '$http', 'ResourceManager', function ($q, $http, ResourceManager) {
        var widgetAPI = new Common.API.Widget();

        var configUrl,
            conUrl = ResourceManager.getConfigurations().serverUrl(),
            jsonUrl,
            channels = [];
        var pluginSef;
        var pluginObjectTVMW;
        var PL_MEDIA_SOURCE = 45;

        var SEF_EVENT_TYPE = {
            CONNECTION_FAILED: 1,
            AUTHENTICATION_FAILED: 2,
            STREAM_NOT_FOUND: 3,
            NETWORK_DISCONNECTED: 4,
            NETWORK_SLOW: 5,
            RENDER_ERROR: 6,
            RENDERING_START: 7,
            RENDERING_COMPLETE: 8,
            STREAM_INFO_READY: 9,
            DECODING_COMPLETE: 10,
            BUFFERING_START: 11,
            BUFFERING_COMPLETE: 12,
            BUFFERING_PROGRESS: 13,
            CURRENT_DISPLAY_TIME: 14,
            AD_START: 15,
            AD_END: 16,
            RESOLUTION_CHANGED: 17,
            BITRATE_CHANGED: 18,
            SUBTITLE: 19,
            CUSTOM: 20
        };

        this.initialize = function () {
            var deferred = $q.defer();

            // cached configurations
            if (jsonUrl === configUrl) {
                deferred.resolve();
                return deferred.promise;
            }
            return $http.get(jsonUrl).success(function (configJSON) {
                var zhStrs = [], enStrs = [];
                configUrl = jsonUrl;
                configJSON.Content.forEach(function (el, idx, arr) {
                    var nameKey = 'channel_name_' + el.ChannelNum;
                    channels.push({
                        nameKey: nameKey,
                        stream: el.ChannelSrc[0].Src,
                        icon: conUrl + el.ChannelPic
                    });
                    zhStrs[nameKey] = el.ChannelName;
                    enStrs[nameKey] = el.ChannelNameEng;
                });
                ResourceManager.addI18NResource({'zh-CN': zhStrs, 'en-US': enStrs});
            });
        };

        this.getLanguage = function () {
            return ResourceManager.getLocale();
        }

        this.getLogoUrl = function () {
            var treeView = ResourceManager.getConfigurations().viewTree();
            var logoUrl;
            for (var i = 0; i < treeView.length; i++) {
                if (treeView[i].type == 'Live') {
                    logoUrl = treeView[i].icon_url;
                }
            }
            return logoUrl;
        }

        this.getChannelName = function (nameKey) {
            return ResourceManager.getI18NResource().getString(nameKey);
        }

        this.getChannels = function () {
            return channels;
        };

        this.getPlayUrl = function () {
            return $http.get(conUrl + '/Main/json/MainMenu_4.json').success(function (menuJSON) {
                menuJSON.Content.forEach(function (el, idx, arr) {
                    if (el.Type == "Live") {
                        jsonUrl = conUrl + el.Json_URL;
                        return;
                    }
                })
            })
        }

        this.stopPlay = function () {
            try {
                pluginSef.Execute("Stop");
            } catch (e) {
            }
        }

        this.changeVideo = function (videoURL) {
            var type = videoURL.split(".").pop();
            if(type=="ts"||type=="mp4"){
                videoURL = conUrl + videoURL;
            }else if(type=="m3u8"){
                videoURL += "|COMPONENT=HLS"
            }
            pluginSef.Execute("Stop");
            pluginSef.Execute("InitPlayer", videoURL);
            pluginSef.Execute("Start", videoURL);
            pluginSef.Execute("StartPlayback", 0);
        }

        this.onLoad = function (videoURL) {
            var type = videoURL.split(".").pop();
            if(type=="ts"||type=="mp4"){
                videoURL = conUrl + videoURL;
            }else if(type=="m3u8"){
                videoURL += "|COMPONENT=HLS"
            }
            widgetAPI.sendReadyEvent();

            pluginSef = document.getElementById("pluginSef");
            pluginObjectTVMW = document.getElementById("pluginObjectTVMW");

            pluginSef.Open('Player', '1.000', 'Player');
            pluginSef.OnEvent = onEvent;

            if (parseInt(pluginObjectTVMW.GetSource(), 10) != PL_MEDIA_SOURCE) {
                pluginObjectTVMW.SetSource(PL_MEDIA_SOURCE);
            }
            pluginSef.Execute("InitPlayer", videoURL);
            pluginSef.Execute("Start", videoURL);
            pluginSef.Execute("StartPlayback", 0);

        }

        function onEvent(event, data1, data2) {
            //document.getElementById("test").innerHTML += "<br>onEvent==" + event + " param1 : " + data1 + " param2 : " + data2;
            switch (event) {

                case SEF_EVENT_TYPE.STREAM_INFO_READY:
                    //document.getElementById("test").innerHTML += "Stream info ready Completed <br>";
                    break;

                case SEF_EVENT_TYPE.DECODING_COMPLETE:
                    //document.getElementById("test").innerHTML += "DECODING_COMPLETE Completed <br>";
                    break;

                case SEF_EVENT_TYPE.BUFFERING_COMPLETE:
                    //document.getElementById("test").innerHTML += "Buffering Completed <br>";
                    break;

                case SEF_EVENT_TYPE.CURRENT_DISPLAY_TIME:
                    //document.getElementById("test").innerHTML += "CURRENT_DISPLAY_TIME <br>";
                    break;

                case SEF_EVENT_TYPE.RENDERING_COMPLETE:
                    //document.getElementById("test").innerHTML += "RENDERING_COMPLETE <br>";
                    break;

                case SEF_EVENT_TYPE.NETWORK_DISCONNECTED:
                    //document.getElementById("test").innerHTML += "Network disconnected<br>";
                    break;

                case SEF_EVENT_TYPE.CONNECTION_FAILED:
                    //document.getElementById("test").innerHTML += "CONNECTION_FAILED<br>";
                    break;

                case SEF_EVENT_TYPE.STREAM_NOT_FOUND:
                    //document.getElementById("test").innerHTML += "STREAM_NOT_FOUND<br>";
                    break;

                case SEF_EVENT_TYPE.NETWORK_SLOW:
                    //document.getElementById("test").innerHTML += "NETWORK_SLOW<br>";
                    break;

                case SEF_EVENT_TYPE.RENDERING_START:
                    //document.getElementById("test").innerHTML += 'RENDERING_START<br>';
                    break;
            }
        }
    }]);
;