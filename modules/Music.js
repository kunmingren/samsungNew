'use strict';

angular.module('app.music', [])
    .controller('MusicController', ['$scope', 'ActivityManager', 'COMMON_KEYS', 'MusicService', '$timeout', function ($scope, ActivityManager, COMMON_KEYS, MusicService, $timeout) {
        var activity = ActivityManager.getActiveActivity();
        activity.initialize($scope);

        var music = [];
        var stream,
            musicData,
            listHide = false;

        //$scope.$watch('$viewContentLoaded', function() {
        //    ActivityManager.hideLoading();
        //});
        if (document.readyState == "complete") {
            ActivityManager.hideLoading(500);
        }


        activity.loadI18NResource(function (res) {
            var languageData = MusicService.getLanguage();
            $scope.left = languageData.toolbar.left;
            $scope.select = {
                icon: 'assets/images/icon_toolbar_select.png',
                right: languageData.toolbar.select_Live
            };
            $scope.ok = {
                icon: 'assets/images/icon_toolbar_menu1.png',
                right: languageData.toolbar.play
            };
            $scope.menu = {
                // icon: 'assets/images/icon_toolbar_menu.png',
                // right: languageData.toolbar.menu
            };
            $scope.logoUrl = MusicService.getLogoUrl();
            $scope.name = languageData.music.title;
        })

        if (MusicService.getMusic().length == 0) {
            MusicService.getPlayUrl().success(function (data) {
                MusicService.initialize().success(function (data) {
                    //console.log(MusicService.getMusic());
                    bindMusic();
                })
            })
        } else {
            bindMusic();
        }

        activity.onKeyDown(function (keyCode) {
            var tempIndex = $scope.selectedItemIndex;
            if (listHide) {
                switch (keyCode) {
                    case COMMON_KEYS.KEY_LEFT:
                        if (tempIndex > 0) {
                            tempIndex -= 1;
                        } else {
                            tempIndex = $scope.musicItems.length - 1;
                        }
                        cutMusic(tempIndex);
                        break;
                    case COMMON_KEYS.KEY_RIGHT:
                        if (tempIndex < $scope.musicItems.length - 1) {
                            tempIndex += 1;
                        } else {
                            tempIndex = 0;
                        }
                        cutMusic(tempIndex);
                        break;
                    case COMMON_KEYS.KEY_ENTER:
                        break;
                    case COMMON_KEYS.KEY_BACK:
                        backList();
                        break;
                }
                $scope.selectedItemIndex = tempIndex;
                return;
            }
            switch (keyCode) {
                case COMMON_KEYS.KEY_UP:
                    if (tempIndex > 0) {
                        tempIndex -= 1;
                    } else {
                        tempIndex = $scope.musicItems.length - 1;
                    }
                    break;
                case COMMON_KEYS.KEY_DOWN:
                    if (tempIndex < $scope.musicItems.length - 1) {
                        tempIndex += 1;
                    } else {
                        tempIndex = 0;
                    }
                    break;
                case COMMON_KEYS.KEY_ENTER:
                    ActivityManager.showLoading();
                    ActivityManager.hideLoading(300);
                    initPlayer();
                    $scope.playIndex = tempIndex;
                    stream = music[tempIndex].stream;
                    MusicService.stopPlay();
                    MusicService.playMusic(stream);
                    player();
                    break;
                case COMMON_KEYS.KEY_BACK:
                    MusicService.stopPlay();
                    activity.finish();
                    break;
            }
            if (tempIndex > 8) {
                $scope.listStyleTop = (8 - tempIndex) * 55;
            } else {
                $scope.listStyleTop = 0
            }
            $scope.selectedItemIndex = tempIndex;
        })

        function bindMusic() {
            musicData = MusicService.getMusic();
            for (var i = 0; i < musicData.length; i++) {
                music.push({
                    name: musicData[i].name,
                    pic: musicData[i].pic,
                    stream: musicData[i].stream
                });
            }
            $scope.musicItems = music;
            $scope.selectedItemIndex = 0;
            $(".music-item-container .music-player").hide();
        }

        function initPlayer() {
            $(".music-item-container .music-list-container").hide();
            $(".music-item-container .music-player").show();
            listHide = true;
        }

        function backList() {
            $(".music-item-container .music-list-container").show();
            $(".music-item-container .music-player").hide();
            listHide = false;
        }

        //切歌
        function cutMusic(tempIndex) {
            //重新渲染
            $timeout(function () {
                $scope.musicItems = music;
            }, 0);
            $scope.playIndex = tempIndex;
            stream = musicData[tempIndex].stream;
            MusicService.changeMusic(stream);
        }

        //自动切歌
        function player() {
            setInterval(function () {
                if (MusicService.playEnd()) {
                    if ($scope.selectedItemIndex < $scope.musicItems.length - 1) {
                        $scope.selectedItemIndex += 1;
                    } else {
                        $scope.selectedItemIndex = 0;
                    }
                    cutMusic($scope.selectedItemIndex);
                }
            }, 500);
        }
    }])
    .service('MusicService', ['$q', '$http', 'ResourceManager', function ($q, $http, ResourceManager) {
        var widgetAPI = new Common.API.Widget();
        var configUrl,
            conUrl = ResourceManager.getConfigurations().serverUrl(),
            jsonUrl,
            music = [];
        var pluginSef;
        var totalTime = 0;
        var current_Time = 0;

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

        this.getLogoUrl = function () {
            var treeView = ResourceManager.getConfigurations().viewTree();
            var logoUrl;
            for (var i = 0; i < treeView.length; i++) {
                if (treeView[i].type == 'Music') {
                    logoUrl = treeView[i].icon_url;
                }
            }
            return logoUrl;
        }

        this.getPlayUrl = function () {
            return $http.get(conUrl + '/Main/json/MainMenu_4.json').success(function (menuJSON) {
                menuJSON.Content.forEach(function (el, idx, arr) {
                    if (el.Type == 'Music') {
                        jsonUrl = conUrl + el.Json_URL;
                        return;
                    }
                })
            })
        }

        this.initialize = function () {
            var deferred = $q.defer();

            // cached configurations
            if (jsonUrl === configUrl) {
                deferred.resolve();
                return deferred.promise;
            }
            return $http.get(jsonUrl).success(function (configJSON) {
                configUrl = jsonUrl;
                configJSON.Content.forEach(function (el, idx, arr) {
                    music.push({
                        name: el.Name,
                        pic: conUrl + el.Picurl,
                        stream: conUrl + el.PlayURL
                    });
                });
            });
        };

        this.getMusic = function () {
            return music;
        };

        this.stopPlay = function () {
            try {
                pluginSef.Execute("Stop");
            } catch (e) {
            }
        }

        this.playMusic = function (musicURL) {
            widgetAPI.sendReadyEvent();

            pluginSef = document.getElementById("pluginSef");
            pluginSef.Open('Player', '1.000', 'Player');
            pluginSef.OnEvent = onEvent;

            pluginSef.Execute("InitPlayer", musicURL);
            pluginSef.Execute("Start", musicURL);
            pluginSef.Execute("StartPlayback", 0);

        }

        this.changeMusic = function (musicURL) {
            pluginSef.Execute("Stop");
            pluginSef.Execute("InitPlayer", musicURL);
            pluginSef.Execute("Start", musicURL);
            pluginSef.Execute("StartPlayback", 0);
        }

        this.playEnd = function () {
            if (totalTime != 0 && current_Time == totalTime) {
                totalTime = 0;
                return true;
            } else {
                return false;
            }
        }

        function onEvent(event, data1, data2) {
            //document.getElementById("test").innerHTML += "<br>onEvent==" + event + " param1 : " + data1 + " param2 : " + data2;
            switch (event) {

                case SEF_EVENT_TYPE.STREAM_INFO_READY:
                    totalTime = Number(pluginSef.Execute("GetDuration"));
                    //document.getElementById("test").innerHTML += "Stream info ready Completed <br>";
                    break;

                case SEF_EVENT_TYPE.DECODING_COMPLETE:
                    //document.getElementById("test").innerHTML += "DECODING_COMPLETE Completed <br>";
                    break;

                case SEF_EVENT_TYPE.BUFFERING_COMPLETE:
                    //document.getElementById("test").innerHTML += "Buffering Completed <br>";
                    break;

                case SEF_EVENT_TYPE.CURRENT_DISPLAY_TIME:
                    current_Time = Number(data1);
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