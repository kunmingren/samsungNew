'use strict';

angular.module('app.wifi', [])
    .controller('WifiController', ['$scope', 'ActivityManager', 'COMMON_KEYS', 'WifiService', '$timeout', function ($scope, ActivityManager, COMMON_KEYS, WifiService, $timeout) {
        var activity = ActivityManager.getActiveActivity();
        var timeout;
        activity.initialize($scope);

        if (document.readyState == "complete") {
            ActivityManager.hideLoading(500);
        }

        contentShow();
        bindChannels();

        activity.onKeyDown(function (keyCode) {
            if (activity.isHide()) {
                switch (keyCode) {
                    case COMMON_KEYS.KEY_UP:
                        break;
                    case COMMON_KEYS.KEY_DOWN:
                        break;
                    case COMMON_KEYS.KEY_ENTER:
                        break;
                    case COMMON_KEYS.KEY_BACK:
                        WifiService.stopPlay();
                        $("body").css("background-image", "url(assets/images/bg_window.png)");
                        activity.finish();
                        break;
                }
                return;
            }
            switch (keyCode) {
                case COMMON_KEYS.KEY_UP:
                    break;
                case COMMON_KEYS.KEY_DOWN:
                    break;
                case COMMON_KEYS.KEY_ENTER:
                    activity.hide();
                    break;
                case COMMON_KEYS.KEY_BACK:
                    WifiService.stopPlay();
                    $("body").css("background-image", "url(assets/images/bg_window.png)");
                    activity.finish();
                    break;
            }
        })

        function bindChannels() {
            $("body").css("background-image", "none");
            var stream = "http://192.168.17.54/nativevod/now/Video/resource/GDTVHD-2173.ts";
            WifiService.onLoad(stream);
        }


        function contentShow() {
            activity.show();
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                //重新渲染
                $timeout(function () {
                    activity.hide();
                }, 0);
            }, 5000);
        }

    }])
    .service('WifiService', ['$q', '$http', 'ResourceManager', function ($q, $http, ResourceManager) {
        var widgetAPI = new Common.API.Widget();

        var pluginSef;
        var pluginObjectTVMW;
        var PL_MEDIA_SOURCE = 31;

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

        this.getLanguage = function () {
            return ResourceManager.getLocale();
        }

        this.stopPlay = function () {
            try {
                pluginSef.Execute("Stop");
            } catch (e) {
            }
        }

        this.onLoad = function (videoURL) {
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