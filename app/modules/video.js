'use strict';

angular.module('app.video', [])
    .controller('VideoController', ['$scope', '$element', 'ResourceManager', function ($scope, $element, ResourceManager) {
        var unbindFunc = $scope.$on('config.ready', function (ev) {
            var video = document.createElement('video');
            video.setAttribute('src', ResourceManager.getConfigurations().backgroundVideoUrl());
            video.setAttribute('type', 'video/mp4');
            video.setAttribute('loop', '');
            $element[0].appendChild(video);
            video.load();
            video.play();
            unbindFunc();
        });
    }])
    .service('VideoService', [function () {

        var pluginSef = document.getElementById('pluginSef');
        if (!pluginSef) {
            pluginSef.Open = function (pluginName, version, credential) {
                console.log('pluginSef.Open(', pluginName, ',', version, ',', credential, ')');
            };
            pluginSef.Close = function () {
                console.log('pluginSef.Close()');
            };
            pluginSef.Execute = function (command) {
                var msg = 'pluginSef.Execute( ' + command;
                arguments.forEach(function (arg, idx, arr) {
                    if (idx !== 0) {
                        msg += ' , ' + arg;
                    }
                });
                msg += ' )';
                console.log(msg);
            };
        }

        var PLAYER_STATE = {
            PAUSED: 0,
            STOPPED: 1,
            PLAYING: 2,
            UNINITIALIZED: 3
        };

        var PLAYER_EVENT = {
            CONNECTION_FAILED : 1,
            AUTHENTICATION_FAILED : 2,
            STREAM_NOT_FOUND : 3,
            NETWORK_DISCONNECTED : 4,
            NETWORK_SLOW : 5,
            RENDER_ERROR : 6,
            RENDERING_START : 7,
            RENDERING_COMPLETE : 8,
            STREAM_INFO_READY : 9,
            DECODING_COMPLETE : 10,
            BUFFERING_START : 11,
            BUFFERING_COMPLETE : 12,
            BUFFERING_PROGRESS : 13,
            CURRENT_DISPLAY_TIME : 14,
            AD_START : 15,
            AD_END : 16,
            RESOLUTION_CHANGED : 17,
            BITRATE_CHANGED : 18,
            SUBTITLE : 19,
            CUSTOM : 20
        };

        function handlePlayerEvent(player, ev, data1, data2) {
            switch (ev) {
                case PLAYER_EVENT.CONNECTION_FAILED:
                    player.stop();
                    player._error_callback_ && player._error_callback_(new Error('OnConnectionFailed'));
                    break;
                case PLAYER_EVENT.AUTHENTICATION_FAILED:
                    player.stop();
                    player._error_callback_ && player._error_callback_(new Error('OnAuthenticationFailed'));
                    break;
                case PLAYER_EVENT.STREAM_NOT_FOUND:
                    player.stop();
                    player._error_callback_ && player._error_callback_(new Error('OnStreamNotFound'));
                    break;
                case PLAYER_EVENT.NETWORK_DISCONNECTED:
                    player.stop();
                    player._error_callback_ && player._error_callback_(new Error('OnNetworkDisconnected'));
                    break;
                case PLAYER_EVENT.RENDER_ERROR:
                    player.stop();
                    player._error_callback_ && player._error_callback_(new Error('OnRenderError'));
                    break;
                case PLAYER_EVENT.RENDERING_COMPLETE:
                    player.stop();
                    player._complete_callback_ && player._complete_callback_();
                    break;
                case PLAYER_EVENT.STREAM_INFO_READY:
                    player._streamInfo = {};
                    player._streamInfo.druation = player._pluginSef.Execute('GetDuration');
                    player._stream_info_ready_callback_ && player._stream_info_ready_callback_();
                    break;
                case PLAYER_EVENT.BUFFERING_START:
                    break;
                case PLAYER_EVENT.BUFFERING_PROGRESS:
                    player._buffer_progress_ = data1;
                    player._progress_callback_ && player._progress_callback_(player._display_progress_, player._buffer_progress_);
                    break;
                case PLAYER_EVENT.BUFFERING_COMPLETE:
                    break;
                case PLAYER_EVENT.CURRENT_DISPLAY_TIME:
                    player._display_progress_ = data1;
                    player._progress_callback_ && player._progress_callback_(player._display_progress_, player._buffer_progress_);
                    break;
            }
        }

        function VideoPlayer(pluginSef) {
            this._state = PLAYER_STATE.STOPPED;
            this._pluginSef = pluginSef;
            this._pluginSef.Open('Player', '1.000', 'Player');
            this._pluginSef.onEvent = function (ev, data1, data2) {
                try {
                    handlePlayerEvent(this, ev, data1, data2);
                } catch (err) {
                    if (this._error_callback_) {
                        this._error_callback_(err);
                    }
                }
            };
        }

        VideoPlayer.prototype.init = function (videoUrl) {
            if (this._state !== PLAYER_STATE.UNINITIALIZED || PLAYER_STATE.STOPPED) {
                throw new Error('Player State Error');
            }
            if (this._pluginSef.Execute('InitPlayer', videoUrl) === 1) {
                this._state = PLAYER_STATE.STOPPED;
            } else {
                throw new Error('Player init failed');
            }
        };

        VideoPlayer.prototype.start = function (sec) {
            if (this._state !== PLAYER_STATE.STOPPED) {
                throw new Error('Player State Error');
            }
            if (this._pluginSef.Execute('StartPlayback', sec)) {
                this._state = PLAYER_STATE.PLAYING;
            } else {
                throw new Error('Player start failed');
            }
        };

        VideoPlayer.prototype.pause = function () {
            if (this._state !== PLAYER_STATE.PLAYING) {
                throw new Error('Player State Error');
            }
            if (this._pluginSef.Execute('Pause')) {
                this._state = PLAYER_STATE.PAUSED;
            } else {
                throw new Error('Player pause failed');
            }
        };

        VideoPlayer.prototype.resume = function () {
            if (this._state !== PLAYER_STATE.PAUSED) {
                throw new Error('Player State Error');
            }
            if (this._pluginSef.Execute('Resume')) {
                this._state = PLAYER_STATE.PLAYING;
            } else {
                throw new Error('Player resume failed');
            }
        };

        VideoPlayer.prototype.stop = function () {
            // if (this._state !== PLAYER_STATE.PLAYING) {
            //     throw new Error('Player State Error');
            // }
            if (this._pluginSef.Execute('Stop')) {
                this._state = PLAYER_STATE.STOPPED;
            } else {
                throw new Error('Player stop failed');
            }
        };

        VideoPlayer.property.forward = function (offsetSec) {
            if (this._state === PLAYER_STATE.UNINITIALIZED) {
                throw new Error('Player State Error');
            }
            if (!this._pluginSef.Execute('JumpForward', offsetSec)) {
                throw new Error('Player forward failed');
            }
        };

        VideoPlayer.prototype.backward = function (offsetSec) {
            if (this._state === PLAYER_STATE.UNINITIALIZED) {
                throw new Error('Player State Error');
            }
            if (!this._pluginSef.Execute('JumpBackward', offsetSec)) {
                throw new Error('Player backward failed');
            }
        };

        VideoPlayer.prototype.onError = function (callback) {
            this._error_callback_ = callback;
        };

        VideoPlayer.prototype.onProgress = function (callback) {
            this._progress_callback_ = callback;
        };

        VideoPlayer.prototype.onComplete = function (callback) {
            this._complete_callback_ = callback;
        };

        VideoPlayer.prototype.onStreamInfoReady = function (callback) {
            this._stream_info_ready_callback_ = callback;
        };

        VideoPlayer.prototype.destroy = function () {
            this._pluginSef.Close();
        };
        
        this.createPlayer = function () {
            return new VideoPlayer(pluginSef);
        };

    }]);
