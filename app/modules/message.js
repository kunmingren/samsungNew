'use strict';

angular.module('app.message', [])
    .controller('MessageController', ['$scope', 'ActivityManager', 'MessageService', 'COMMON_KEYS', function ($scope, ActivityManager, MessageService, COMMON_KEYS) {
        var activity = ActivityManager.getActiveActivity();
        activity.initialize($scope);

        activity.loadI18NResource(function (res) {
            $scope.title = MessageService.getTitle().title;
            if (MessageService.getMessage() == undefined) {
                MessageService.initialize().success(function (data) {
                    bindMessage();
                })
            } else {
                bindMessage();
            }
        });

        activity.onKeyDown(function (keyCode) {
            switch (keyCode) {
                case COMMON_KEYS.KEY_BACK:
                    activity.finish();
                    break;
            }
        });

        function bindMessage() {
            var meassage = MessageService.getMessage();
            $scope.texts = []
            for (var i = 0; i < meassage.length; i++) {
                $scope.texts.push({title: i + meassage, content: i + '、To run the directive after the DOM has finished rendering you should postpone the execution, for example using the setTimeout function. AngularJS has a method wrapper for the window.setTimeout function, that is $timeout.'});
            }
        }

    }])
    .service('MessageService', ['$q', '$http', 'ResourceManager', function ($q, $http, ResourceManager) {
        var messages,
            messageUrl = ResourceManager.getConfigurations().messageUrl(),
            configUrl,
            data = JSON.stringify({
                roomid: window.localStorage.room
            });

        this.initialize = function() {
            var deferred = $q.defer();

            // cached configurations
            if (messageUrl === configUrl) {
                deferred.resolve();
                return deferred.promise;
            }
            return $http.post(messageUrl, data).success(function (configJSON) {
                configUrl = messageUrl;
                var maxVer = configJSON.messages[0];
                configJSON.messages.forEach(function(el, idx, arr) {
                    if (maxVer.versionid < el.versionid) {
                        maxVer = el;
                    }
                })
                messages = maxVer;
            })

        }

        this.getMessage = function() {
            return messages;
        }

        this.getTitle = function() {
            return ResourceManager.getLocale().message;
        }

    }]);