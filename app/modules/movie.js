'use strict';

angular.module('app.movie', [])
    .controller('MovieController', ['$scope', 'ActivityManager', 'COMMON_KEYS', 'MovieService', function ($scope, ActivityManager, COMMON_KEYS, MovieService) {
        var activity = ActivityManager.getActiveActivity();
        var movData,
            movieUrl,
            numOfmovies,
            movies = [],
            movieTypes = [];
        var moviesPerColumn = 4, column;
        activity.initialize($scope);

        activity.loadI18NResource(function (res) {
            $scope.title = MovieService.getTitle().title;
            if (MovieService.getMovies().length == 0) {
                MovieService.getPlayUrl().success(function (data) {
                    MovieService.initialize().success(function (data) {
                        console.log(MovieService.getMovies());
                        bindType();
                    })
                })
            } else {
                bindType();
            }
        })

        activity.onKeyUp(function (keyCode) {
            if (activity.isHide()) {
                switch (keyCode) {
                    case COMMON_KEYS.KEY_LEFT:
                        MovieService.blkjumpLeft();
                        break;
                    case COMMON_KEYS.KEY_RIGHT:
                        MovieService.blkjumpRight();
                        break;
                }
            }
        })

        activity.onKeyDown(function (keyCode) {
            var tempIndex = $scope.selectedIndex;
            var oldIndex = tempIndex + 1;
            var typeIndex = $scope.selectedTypeIndex;

            if (activity.isHide()) {
                switch (keyCode) {
                    case COMMON_KEYS.KEY_UP:
                        break;
                    case COMMON_KEYS.KEY_DOWN:
                        break;
                    case COMMON_KEYS.KEY_LEFT:
                        MovieService.jumpLeft();
                        break;
                    case COMMON_KEYS.KEY_RIGHT:
                        MovieService.jumpRight();
                        break;
                    case COMMON_KEYS.KEY_ENTER:
                        MovieService.pausePlay();
                        break;
                    case COMMON_KEYS.KEY_BACK:
                        MovieService.stopPlay();
                        activity.show();
                        document.getElementById("all").style.display = "none";
                        document.getElementsByTagName("body")[0].setAttribute("style", "background-image:(url:../assets/images/bg_window.jpg)");
                        break;
                }
                $scope.selectedIndex = tempIndex;
                return;
            }

            switch (keyCode) {
                case COMMON_KEYS.KEY_LEFT:
                    tempIndex -= 1;
                    break;
                case COMMON_KEYS.KEY_RIGHT:
                    tempIndex += 1;
                    break;
                case COMMON_KEYS.KEY_UP:
                    //tempIndex -= 4;
                    if (typeIndex > 0) {
                        typeIndex -= 1;
                        bindMovie(movData[typeIndex].nameKey);
                        tempIndex = 0;
                    }
                    break;
                case COMMON_KEYS.KEY_DOWN:
                    //tempIndex += 4;
                    if (typeIndex < $scope.movieTypes.length - 1) {
                        typeIndex += 1;
                        bindMovie(movData[typeIndex].nameKey);
                        tempIndex = 0;
                    }
                    break;
                case COMMON_KEYS.KEY_ENTER:
                    activity.hide();
                    document.getElementsByTagName("body")[0].setAttribute("style", "background-image:none");
                    movieUrl = movData[tempIndex].movieUrl;
                    MovieService.playVideo(movieUrl);
                    break;
                case COMMON_KEYS.KEY_BACK:
                    activity.finish();
                    break;
            }
            if (tempIndex >= numOfmovies) {
                if (oldIndex != movData.length) {
                    tempIndex = numOfmovies - 1;
                } else {
                    tempIndex = 0;
                }
            }
            if (tempIndex < 0) {
                if (oldIndex == 1) {
                    tempIndex = movData.length - 1;
                } else {
                    tempIndex = 0;
                }
            }
            var currentPage = Math.floor(tempIndex / (3 * moviesPerColumn));
            if (currentPage != $scope.currentPage) {
                $scope.currentPage = currentPage;
                $scope.movies = movies.slice(currentPage * 3, currentPage * 3 + 3);
            }
            $scope.selectedTypeIndex = typeIndex;
            $scope.selectedIndex = tempIndex;
        });

        function bindType() {
            movData = MovieService.getMovies();

            for (var a = 0; a< movData.length; a++) {
                movieTypes.push({
                    index: a,
                    name: MovieService.getName(movData[a].nameKey),
                    nameKey: movData[a].nameKey
                })
            }
            $scope.movieTypes = movieTypes;
            $scope.selectedTypeIndex = 0;
            bindMovie(movData[0].nameKey);
        }

        function bindMovie(nameKey) {
            column = [];
            movies = [];
            $scope.movies = [];
            for (var b = 0; b < movData.length; b++) {
                if (movData[b].nameKey == nameKey){
                    var movieData = movData[b].movies;
                    for (var c = 0; c < movieData.length; c++) {
                        column.push({
                            index: c,
                            pic: movieData[c].picUrl,
                            name: MovieService.getName(movieData[c].nameKey),
                            movieUrl: movieData[c].movieUrl
                        });
                    }
                }
            }
            if (column) {
                movies.push(column);
            }
            $scope.currentPage = 0;
            $scope.selectedIndex = 0;
            $scope.totalPage = Math.ceil(movData.length / (3 * moviesPerColumn));
            $scope.movies = movies.slice(0, 3);
            numOfmovies = movData.length;
        }
    }])
    .service('MovieService', ['$q', '$http', 'ResourceManager', function ($q, $http, ResourceManager) {
        var widgetAPI = new Common.API.Widget();
        var pluginObj = new Common.API.Plugin();
        var tvKey = new Common.API.TVKeyValue();

        var pluginSef;
        var pluginObjectTVMW;
        var PL_MEDIA_SOURCE = 43;

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

        var conUrl = ResourceManager.getConfigurations().serverUrl(),
            configUrl,
            jsonUrl,
            videoURL,
            playStatus;
        var moviesType = [];

        this.getPlayUrl = function () {
            return $http.get(conUrl + '/Main/json/MainMenu_4.json').success(function (menuJSON) {
                menuJSON.Content.forEach(function (el, idx, arr) {
                    if (el.Type == 'Movie_Category') {
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
                var zhStrs = [], enStrs = [];
                var subViewTreeIndex = 0, viewTreeIndex = 0;
                configUrl = jsonUrl;
                configJSON.Content.forEach(function (el, idx, arr) {
                    var movies = [];
                    if (el.Second) {
                        el.Second.forEach(function (el2, idx2, arr2) {
                            var nameKey = 'movie_name_' + subViewTreeIndex;
                            var introduceKey = 'first_level_introduce_' + subViewTreeIndex;
                            movies.push({
                                nameKey: nameKey,
                                type: el2.Type,
                                duration: el2.Duration,
                                picUrl: conUrl + el2.Picurl,
                                movieUrl: conUrl + el2.Address
                            });
                            zhStrs[nameKey] = el2.Name;
                            enStrs[nameKey] = el2.NameEng;
                            zhStrs[introduceKey] = el2.Introduce;
                            enStrs[introduceKey] = el2.IntroduceEng;
                            subViewTreeIndex++;
                        });
                    }
                    var nameKey = 'movie_tyep_name_' + viewTreeIndex;
                    moviesType.push({
                        nameKey: nameKey,
                        movies: movies,
                    });
                    zhStrs[nameKey] = el.MovieCategoryName;
                    enStrs[nameKey] = el.MovieCategoryNameEng;
                    viewTreeIndex++;
                });
                ResourceManager.addI18NResource({'zh-CN': zhStrs, 'en-US': enStrs});
            });
        };

        this.getMovies = function () {
            return moviesType;
        };

        this.getName = function (nameKey) {
            return ResourceManager.getI18NResource().getString(nameKey);
        }

        this.getTitle = function () {
            return ResourceManager.getLocale().movie;
        }

        var blktime = null;
        var noneFlag = false;
        var blk_t;
        var stopFlag = false;

        /*
         *停止播放
         */
        this.stopPlay = function () {
            try {
                pluginSef.Execute("Stop");
                playStatus = "Stop";
            } catch (e) {
            }
        }

        /*
         *暂停/恢复播放
         */
        this.pausePlay = function () {
            document.getElementById("all").style.display = "block";
            if (playStatus == "Resume") {
                pluginSef.Execute("Pause");         //暂停播放
                playStatus = "Pause";
            } else if (playStatus == "Pause") {
                pluginSef.Execute("Resume");        //恢复播放
                playStatus = "Resume";
            }
        }

        /*
         *向右拖动
         */
        this.jumpRight = function () {
            if (stopFlag)return;
            stopFlag = true;
            noneFlag = false;
            FastFlog = true;
            //debugConsole.log('jumpRight');
            //debugConsole.log({current_Time: current_Time, blktime: blktime, totalTime: totalTime});
            if (blktime == null) {
                blktime = current_Time / totalTime;
            }

            document.getElementById("all").style.display = "block";

            blktime += 0.01;
            if (blktime > 0.99)blktime = 0.99;

            document.getElementById("startTime").innerHTML = toTime(parseInt(blktime * totalTime));
            var _width = blktime * 100 + "%";
            document.getElementById("playtime").style.width = _width;

            clearTimeout(blk_t);
            blk_t = setTimeout(function () {
                noneFlag = true;
            }, 7000);
            setTimeout(function () {
                stopFlag = false
            }, 50);
        }

        /*
         *向左拖动
         */
        this.jumpLeft = function () {
            if (stopFlag)return;
            stopFlag = true;
            noneFlag = false;

            FastFlog = true;

            if (blktime == null) {
                blktime = current_Time / totalTime;
            }
            document.getElementById("all").style.display = "block";

            blktime -= 0.01;
            if (blktime < 0)blktime = 0;
            document.getElementById("startTime").innerHTML = toTime(parseInt(blktime * totalTime));

            var _width = blktime * 100 + "%";
            document.getElementById("playtime").style.width = _width;

            clearTimeout(blk_t);
            blk_t = setTimeout(function () {
                noneFlag = true;
            }, 7000);
            setTimeout(function () {
                stopFlag = false
            }, 50);
        }

        this.blkjumpRight = function () {
            //debugConsole.log('blkjumpRight');
            var timeLength = Math.abs(parseInt(blktime * totalTime - current_Time)) / 1000;
            pluginSef.Execute("JumpForward", timeLength);
            pluginSef.Execute("play", videoURL);
            pluginSef.Execute("StartPlayback", 1);
            //blktime = null;
            setTimeout(function () {
                FastFlog = false;
            }, 3500);
        }

        this.blkjumpLeft = function () {
            var timeLength = Math.abs(parseInt(blktime * totalTime - current_Time)) / 1000;
            pluginSef.Execute("JumpBackward", timeLength);
            pluginSef.Execute("play", videoURL);
            pluginSef.Execute("StartPlayback", 1);
            //blktime = null;
            setTimeout(function () {
                FastFlog = false;
            }, 3500);
        }

        setInterval(function(){
            if(noneFlag){
                document.getElementById("all").style.display = "none";
                blktime = null;
            }
        },1000);

        /*
         *开始播放
         */
        this.playVideo = function (URL) {
            videoURL = URL;
            //document.getElementById("all").style.display = "block";
            document.getElementById("playtime").style.width = 0;
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
            playStatus = "Resume";

            setTimeout(function () {
                player();
            }, 3000);
        }

        function toTime(x) {
            var n = Number(x / 1000);
            var h = Math.floor(n / 3600);
            var m = Math.floor((n - h * 3600) / 60);
            var s = parseInt(n - h * 3600 - m * 60);
            if (h < 10) {
                h = '0' + h;
            }
            if (m < 10) {
                m = '0' + m;
            }
            if (s < 10) {
                s = '0' + s;
            }
            return h + ':' + m + ':' + s;
        }


        var FastFlog = false;
        var StartTime;
        var EndTime;
        var totalTime = 0;
        var current_Time = 0;

        function player() {
            setInterval(function () {
                if (!FastFlog) {
                    StartTime = toTime(current_Time);
                    EndTime = toTime(totalTime);
                    //document.getElementById('debug').innerHTML='current_Time:' + current_Time +'totalTime:' + totalTime;
                    document.getElementById("startTime").innerHTML = StartTime;
                    document.getElementById("endTime").innerHTML = EndTime;
                    var _width = (current_Time / totalTime) * 100 + "%";
                    document.getElementById("playtime").style.width = _width;
                }
            }, 500);
        }

        function onEvent(event, data1, data2) {
            //document.getElementById("test").innerHTML += "<br>onEvent=="+event+" param1 : "+data1+" param2 : "+data2;
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
            }
        }

    }]);
