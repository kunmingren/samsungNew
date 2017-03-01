'use strict';

angular.module('app.movie', [])
    .directive('repeatFinish', ['ActivityManager', function (ActivityManager) {
        return {
            link: function (scope, element, attr) {
                if (scope.$last == true) {
                    scope.$eval(attr.repeatFinish);
                    scope.$last = false;
                }
            }
        }
    }])
    .controller('MovieController', ['$scope', '$http', 'ResourceManager', 'ActivityManager', 'COMMON_KEYS', 'MovieService', 'MenuService', function ($scope, $http, ResourceManager, ActivityManager, COMMON_KEYS, MovieService, MenuService) {
        var activity = ActivityManager.getActiveActivity();
        activity.initialize($scope);
        activity.isMenu(true);
        var i18nText = ResourceManager.getLocale();
        var lang = i18nText.lang;
        var conUrl = ResourceManager.getConfigurations().serverUrl();
        activity.loadI18NResource(function () {
            $scope.dire = i18nText.movie.dire;
            $scope.act = i18nText.movie.act;
            var toolvarData = MenuService.getLanguage().toolbar;
            $scope.select = {
                left: toolvarData.left,
                icon: 'assets/images/icon_toolbar_select.png',
                right: toolvarData.selsct
            };
            $scope.ok = {
                left: toolvarData.left,
                icon: 'assets/images/icon_toolbar_menu1.png',
                right: toolvarData.ok
            };
            $scope.menu = {
                // left: toolvarData.left,
                // icon: 'assets/images/icon_toolbar_menu1.png',
                // right: toolvarData.menu
            };
            $scope.logoUrl = MovieService.getLogoUrl();
            var data = ResourceManager.getService();
            $scope.name = data.name;
        });

        //$scope.$watch('$viewContentLoaded', function() {
        //    ActivityManager.hideLoading();
        //});
        if(document.readyState=="complete"){
            ActivityManager.hideLoading(3000);
        }

        $scope.movieFinish = function () {
            ActivityManager.getActiveActivity().rotateDown(-1);
            ActivityManager.getActiveActivity().rotateUp(0);
            if ($scope.movie[0].list.length != 0) {
                ActivityManager.getActiveActivity().movieAnimate(0, 'type0', 'choseMovie')
            }
        };
        var movieUrl;
        var contentHide = false;
        $scope.typeIndex = 0;
        $scope.movieIndex = 0;
        $scope.movie = [];

        //var childDataStr = activity.getChild();
        //var childData = JSON.parse(childDataStr);
        getData();
        function getData() {
            MovieService.getPlayUrl().success(function (data) {
                data.Content.forEach(function (el, idx, arr) {
                    if (el.Type == 'Movie_Category_Secret') {
                        var jsonUrl = conUrl + el.Json_URL;
                        $http.get(jsonUrl).success(function (mdata) {
                            $scope.movieData = mdata;
                            if ($scope.movieData) {
                                loadData();
                            }
                        })
                    }
                })
            })
        }

        function loadData() {
            $scope.movieData.Content.forEach(function (val, idx, arr) {
                if (val.Second.length == 0) {

                } else {
                    var type = {};
                    if (lang == "en-US") {
                        type = {
                            type: val.MovieCategoryNameEng,
                            list: []
                        };
                        var movie = {};
                        val.Second.forEach(function (value, index, array) {
                            movie = {
                                name: value.NameEng,
                                director: value.DirectorEng,
                                actor: value.ActorEng,
                                intro: value.IntroduceEng,
                                img: conUrl + value.Picurl,
                                bgimg: conUrl + value.Picurl_bk,
                                url: conUrl + value.Address
                            };
                            type.list.push(movie);
                        })
                    } else {
                        type = {
                            type: val.MovieCategoryName,
                            list: []
                        };
                        var movie = {};
                        val.Second.forEach(function (value, index, array) {
                            movie = {
                                name: value.Name,
                                director: value.Director,
                                actor: value.Actor,
                                intro: value.Introduce,
                                img: conUrl + value.Picurl,
                                bgimg: conUrl + value.Picurl_bk,
                                url: conUrl + value.Address
                            };
                            type.list.push(movie);
                        });
                    }
                    $scope.movie.push(type);
                }
            });
            $scope.typeNum = $scope.movie.length;
            preloader();
        };
        //var img1,img2,img3;
        var img = new Array();

        function preloader() {
            //console.log($scope.movie);
            if (document.images) {
                for (var i = 0; i < $scope.movie.length; i++) {
                    img[i] = [];
                    for (var j = 0; j < $scope.movie[i].list.length; j++) {
                        img[i][j] = new Image();
                        img[i][j].src = $scope.movie[i].list[j].bgimg;
                    }
                }
                choseMovie(typeID, movieID);
            }
        }

        //window.onload = preloader();
        var typeID = 0;
        var movieID = 0;
        //function changeMovieType(typeID) {
        //    $scope.movieList = $scope.movie[typeID].list;
        //
        //}

        function choseMovie(typeID, movieID) {

            $scope.typeName = $scope.movie[typeID].type;

            var movieDetail = document.getElementById('movie-detail-container');
            activity.removeClass(movieDetail, 'bgAdd');
            //movieDetail.style.backgroundImage = "";
            //var imageURL = $scope.movie[$scope.typeIndex].list[$scope.movieIndex].bgimg;
            var imageURL = img[typeID][movieID].src;
            $scope.movieName = $scope.movie[typeID].list[movieID].name;
            $scope.movieDirector = $scope.movie[typeID].list[movieID].director;
            $scope.movieActor = $scope.movie[typeID].list[movieID].actor;
            $scope.movieIntro = $scope.movie[typeID].list[movieID].intro;
            //console.log(imageURL);
            var URLStr = 'url(' + imageURL + ')';
            movieDetail.style.backgroundImage = URLStr;
            activity.addClass(movieDetail, 'bgAdd');
            setTimeout(function () {
                activity.removeClass(movieDetail, 'bgAdd');
            }, 500);
        }

        function rotateUp(num) {
            if (num == 0) {
                var number = num;
                var target = document.getElementById('type' + number).children;
                for (var i = 0; i < target.length; i++) {
                    activity.transform(target[i].children[0], "rotateX(0deg)");
                    activity.removeClass(target[i].children[0], 'opacityReduce');
                    activity.addClass(target[i].children[0], 'opacityAdd');
                    target[i].children[0].style.top = '33.3px';
                }
            } else {
                var number = num;
                var target = document.getElementById('type' + number).children;
                for (var i = 0; i < target.length; i++) {
                    activity.transform(target[i].children[0], "rotateX(0deg)");
                    activity.removeClass(target[i].children[0], 'opacityReduce');
                    activity.removeClass(target[i].children[0], 'choseMovie');
                    activity.addClass(target[i].children[0], 'opacityAdd');
                    target[i].children[0].style.top = '33.3px';
                }
                var number1 = num - 1;
                var target1 = document.getElementById('type' + number1).children;
                for (var i = 0; i < target1.length; i++) {
                    activity.transform(target1[i].children[0], "rotateX(90deg)");
                    activity.removeClass(target1[i].children[0], 'opacityAdd');
                    activity.removeClass(target1[i].children[0], 'choseMovie');
                    activity.addClass(target1[i].children[0], 'opacityReduce');
                    target1[i].children[0].style.top = '-85px';
                }
            }
        }


        function rotateDown(num) {
            if (num == -1) {
                var target = document.getElementsByClassName('rotate_img');
                for (var i = 0; i < target.length; i++) {
                    activity.transform(target[i], "rotateX(-90deg)");
                    activity.addClass(target[i], 'opacityReduce');
                    target[i].style.top = '145px';
                }
            } else {
                var number1 = num + 1;
                var target1 = document.getElementById('type' + number1).children;
                for (var i = 0; i < target1.length; i++) {
                    activity.transform(target1[i].children[0], "rotateX(-90deg)");
                    activity.removeClass(target1[i].children[0], 'opacityAdd');
                    activity.removeClass(target1[i].children[0], 'choseMovie');
                    activity.addClass(target1[i].children[0], 'opacityReduce');
                    target1[i].children[0].style.top = '145px';
                }
                var number = num;
                var target = document.getElementById('type' + number).children;
                for (var i = 0; i < target.length; i++) {
                    activity.transform(target[i].children[0], "rotateX(0deg)");
                    activity.removeClass(target[i].children[0], 'opacityReduce');
                    activity.removeClass(target[i].children[0], 'choseMovie');
                    activity.addClass(target[i].children[0], 'opacityAdd');
                    target[i].children[0].style.top = '33.3px';
                }
            }
        }

        function contentShow() {
            if (contentHide) {
                $(".movie-content").show();
                contentHide = false;
            } else {
                $(".movie-content").hide();
                contentHide = true;
            }
        }

        activity.onKeyDown(function (keyCode) {
            if (contentHide) {
                switch (keyCode) {
                    case COMMON_KEYS.KEY_UP:
                        break;
                    case COMMON_KEYS.KEY_DOWN:
                        break;
                    case COMMON_KEYS.KEY_LEFT:
                        MovieService.jumpLeft();
                        MovieService.blkjumpLeft();
                        break;
                    case COMMON_KEYS.KEY_RIGHT:
                        MovieService.jumpRight();
                        MovieService.blkjumpRight();
                        break;
                    case COMMON_KEYS.KEY_ENTER:
                        MovieService.pausePlay();
                        break;
                    case COMMON_KEYS.KEY_BACK:
                        MovieService.stopPlay();
                        document.getElementById("all").style.display = "none";
                        $("body").css("background-image", "url(assets/images/bg_window.png)");
                        contentShow();
                        //activity.finish();
                        break;
                }
                $scope.selectedIndex = tempIndex;
                return;
            } else {
                switch (keyCode) {
                    case COMMON_KEYS.KEY_LEFT:
                        if ($scope.movieIndex > 0) {
                            $scope.movieIndex -= 1;
                            choseMovie($scope.typeIndex, $scope.movieIndex);
                            activity.movieAnimate($scope.movieIndex, 'type' + $scope.typeIndex, 'choseMovie');
                            activity.removeAnimate($scope.movieIndex + 1, 'type' + $scope.typeIndex, 'choseMovie')
                        }
                        break;
                    case COMMON_KEYS.KEY_RIGHT:
                        if ($scope.movieIndex < $scope.movie[$scope.typeIndex].list.length - 1) {
                            $scope.movieIndex += 1;
                            choseMovie($scope.typeIndex, $scope.movieIndex);
                            activity.movieAnimate($scope.movieIndex, 'type' + $scope.typeIndex, 'choseMovie');
                            activity.removeAnimate($scope.movieIndex - 1, 'type' + $scope.typeIndex, 'choseMovie')
                        }
                        break;
                    case COMMON_KEYS.KEY_MENU:
                        ActivityManager.startActivity('menu');
                        break;
                    case COMMON_KEYS.KEY_ENTER:
                        contentShow();
                        document.getElementsByTagName("body")[0].setAttribute("style", "background-image:none");
                        movieUrl = $scope.movie[$scope.typeIndex].list[$scope.movieIndex].url;
                        MovieService.playVideo(movieUrl);
                        break;
                    case COMMON_KEYS.KEY_UP:
                        if ($scope.typeIndex > 0) {
                            $scope.typeIndex--;
                            rotateDown($scope.typeIndex);
                            $scope.movieIndex = 0;
                            //setTimeout(choseMovie($scope.movieIndex),1);
                            choseMovie($scope.typeIndex, $scope.movieIndex);
                            activity.movieAnimate($scope.movieIndex, 'type' + $scope.typeIndex, 'choseMovie');
                        }
                        break;
                    case COMMON_KEYS.KEY_DOWN:
                        if ($scope.typeIndex < $scope.movie.length - 1) {
                            $scope.typeIndex++;
                            rotateUp($scope.typeIndex);
                            $scope.movieIndex = 0;
                            //setTimeout(choseMovie($scope.movieIndex),1);
                            choseMovie($scope.typeIndex, $scope.movieIndex);
                            activity.movieAnimate($scope.movieIndex, 'type' + $scope.typeIndex, 'choseMovie');
                        }
                        break;
                    case COMMON_KEYS.KEY_BACK:
                        activity.finish();
                        break;
                }
                if ($scope.movieIndex > 7) {
                    $scope.listTopStyle = (7 - $scope.movieIndex) * 136;
                } else if ($scope.listTopStyle !== 0) {
                    $scope.listTopStyle = 0;
                }
            }
        });
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
        var mData;
        var moviesType = [];

        this.getMovieData = function () {
            return $http.get(jsonUrl).success(function (data) {
                mData = data;
            });
        };

        this.getPlayUrl = function () {
            return $http.get(conUrl + '/Main/json/MainMenu_4.json').success(function (menuJSON) {
                menuJSON.Content.forEach(function (el, idx, arr) {
                    if (el.Type == 'Movie_Category') {
                        jsonUrl = conUrl + el.Json_URL;
                        return;
                    }
                })
            })
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
                        movies: movies
                    });
                    zhStrs[nameKey] = el.MovieCategoryName;
                    enStrs[nameKey] = el.MovieCategoryNameEng;
                    viewTreeIndex++;
                });
                ResourceManager.addI18NResource({'zh-CN': zhStrs, 'en-US': enStrs});
            });
        };

        this.getLogoUrl = function () {
            var treeView = ResourceManager.getConfigurations().viewTree();
            var logoUrl;
            for (var i = 0; i < treeView.length; i++) {
                if (treeView[i].type == 'Movie_Category_Secret') {
                    logoUrl = treeView[i].icon_url;
                }
            }
            return logoUrl;
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
        };

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
        };

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
        };

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

        setInterval(function () {
            if (noneFlag) {
                document.getElementById("all").style.display = "none";
                blktime = null;
            }
        }, 1000);

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

