'use strict';

angular.module('app.live', [])
    .controller('LiveController', ['$scope', '$element', 'ActivityManager', 'LiveService', 'COMMON_KEYS', function ($scope, $element, ActivityManager, LiveService, COMMON_KEYS) {
        var activity = ActivityManager.getActiveActivity();
        var chaData,
            numOfChannels,
            stream;
        var channelsPerColumn = 8, column;
        var channels = [];

        document.getElementsByTagName("body")[0].setAttribute("style", "background-image:none");
        activity.initialize($scope);
        activity.shouldDisplayMenu(false);
        activity.hide();

        $element[0].parentNode.classList.add('live-content-container');
        if (LiveService.getChannels().length == 0) {
            LiveService.getPlayUrl().success(function (data) {
                LiveService.initialize().success(function (data) {
                    //console.log(LiveService.getChannels());
                    bind();
                })
            })
        } else {
            bind();
        }

        activity.onKeyDown(function (keyCode) {
            var tempIndex = $scope.selectedIndex;
            var oldIndex = tempIndex + 1;

            if (activity.isHide()) {
                switch (keyCode) {
                    case COMMON_KEYS.KEY_UP:
                        tempIndex += 1;
                        cutVideo();
                        break;
                    case COMMON_KEYS.KEY_DOWN:
                        tempIndex -= 1;
                        cutVideo();
                        break;
                    case COMMON_KEYS.KEY_ENTER:
                        activity.show();
                        break;
                    case COMMON_KEYS.KEY_BACK:
                        LiveService.stopPlay();
                        document.getElementsByTagName("body")[0].setAttribute("style", "background-image:(url:../assets/images/bg_window.jpg)");
                        activity.finish();
                        break;
                }
                $scope.selectedIndex = tempIndex;
                return;
            }

            switch (keyCode) {
                case COMMON_KEYS.KEY_LEFT:
                    tempIndex -= 8;
                    cutVideo();
                    break;
                case COMMON_KEYS.KEY_RIGHT:
                    tempIndex += 8;
                    cutVideo();
                    break;
                case COMMON_KEYS.KEY_UP:
                    tempIndex -= 1;
                    cutVideo();
                    break;
                case COMMON_KEYS.KEY_DOWN:
                    tempIndex += 1;
                    cutVideo();
                    break;
                case COMMON_KEYS.KEY_ENTER:
                    //activity.hide();
                    break;
                case COMMON_KEYS.KEY_BACK:
                    activity.hide();
                    break;
            }
            if (tempIndex >= numOfChannels) {
                if (oldIndex != chaData.length) {
                    tempIndex = numOfChannels - 1;
                } else {
                    tempIndex = 0;
                }
            }
            if (tempIndex < 0) {
                if (oldIndex == 1) {
                    tempIndex = chaData.length - 1;
                } else {
                    tempIndex = 0;
                }
            }
            var currentPage = Math.floor(tempIndex / (3 * channelsPerColumn));
            if (currentPage != $scope.currentPage) {
                $scope.currentPage = currentPage;
                $scope.channels = channels.slice(currentPage * 3, currentPage * 3 + 3);
            }
            $scope.selectedIndex = tempIndex;

            function cutVideo() {
                //stream = chaData[tempIndex].stream;
                stream = "rtp://239.45.3.177:5140";
                LiveService.changeVideo(stream);
            }
        });

        function bind() {
            chaData = LiveService.getChannels();
            stream = chaData[0].stream;
            //stream = "rtp://239.45.3.228:5140";
            //LiveService.onLoad(stream);

            for (var i = 0; i < chaData.length; i++) {
                if (i % channelsPerColumn === 0) {
                    if (column) {
                        channels.push(column);
                    }
                    column = [];
                }
                column.push({
                    index: i,
                    icon: chaData[i].icon,
                    name: LiveService.getChannelName(chaData[i].nameKey),
                    stream: chaData[i].stream
                });
            }
            if (column) {
                channels.push(column);
            }
            $scope.currentPage = 0;
            $scope.selectedIndex = 0;
            $scope.title = '电视频道';
            $scope.totalPage = Math.ceil(chaData.length / (3 * channelsPerColumn));
            $scope.channels = channels.slice(0, 3);
            numOfChannels = chaData.length;
        }
    }])
    .service('LiveService', ['$q', '$http', 'ResourceManager', function ($q, $http, ResourceManager) {
        var widgetAPI = new Common.API.Widget();
        var pluginObj = new Common.API.Plugin();
        var tvKey = new Common.API.TVKeyValue();

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

        this.getChannelName = function (nameKey) {
            return ResourceManager.getI18NResource().getString(nameKey);
        }

        this.getChannels = function () {
            return channels;
        };

        this.getPlayUrl = function () {
            return $http.get(conUrl + '/Main/json/MainMenu_4.json').success(function (menuJSON) {
                menuJSON.Content.forEach(function (el, idx, arr) {
                    if (el.Name == '直播' || el.NameEng == "Live") {
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
            pluginSef.Execute("Stop");
            pluginSef.Execute("InitPlayer", videoURL);
            pluginSef.Execute("Start", videoURL);
            pluginSef.Execute("StartPlayback", 0);
        }

        this.onLoad = function (videoURL) {
            widgetAPI.sendReadyEvent();

            pluginObj.unregistKey(tvKey.KEY_VOL_UP);
            pluginObj.unregistKey(tvKey.KEY_VOL_DOWN);
            pluginObj.unregistKey(tvKey.KEY_MUTE);

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
