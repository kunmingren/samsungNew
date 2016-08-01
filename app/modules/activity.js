'use strict';

angular.module('app.activity', ['app.resource'])
    .service('ActivityManager', ['ResourceManager', function (ResourceManager) {
        var activityStack = [];

        function Activity(id) {
            this.templateUrl = 'partials/' + id + '.html';
            this._hide = false;
            this._shouldDisplayMenu = true;
            this._triggerBottom = false;
        }

        Activity.prototype.finish = function () {
            activityStack.pop();
        };

        Activity.prototype.initialize = function (scope) {
            this._scope = scope;
        };
        
        Activity.prototype.hide = function () {
            this._hide = true;
        };

        Activity.prototype.show = function () {
            this._hide = false;
        };

        Activity.prototype.isHide = function () {
            return this._hide;
        };

        Activity.prototype.shouldDisplayMenu = function (bool) {
            if (typeof bool !== 'boolean') {
                return this._shouldDisplayMenu;
            } else {
                this._shouldDisplayMenu = bool;
            }
        };

        Activity.prototype.triggerBottom = function (bool) {
            if (typeof bool !== 'boolean') {
                return this._triggerBottom;
            } else {
                this._triggerBottom = bool;
            }
        };

        Activity.prototype.keyUp = function (keyCode) {
            typeof(this._keyUp_callback_) === 'function' && this._keyUp_callback_(keyCode);
        };
        
        Activity.prototype.keyDown = function (keyCode) {
            typeof(this._keyDown_callback_) === 'function' && this._keyDown_callback_(keyCode);
        };

        Activity.prototype.onKeyUp = function (callback) {
            this._keyUp_callback_ = callback;
        };

        Activity.prototype.onKeyDown = function (callback) {
            this._keyDown_callback_ = callback;
        };

        Activity.prototype.loadI18NResource = function (callback) {
            callback(ResourceManager.getI18NResource());
            this._scope.$on('locale.change', function (ev, keyCode) {
                callback(ResourceManager.getI18NResource());
            });
        };

        this.go = function (id, stackIndex) {
            var nPops = activityStack.length - stackIndex;
            for (var i = 0; i < nPops; i++) {
                activityStack.pop();
            }
            this.startActivity(id);
        };

        this.startActivity = function (id) {
            var activity = new Activity(id);
            activityStack.push(activity);
        };

        this.getActiveActivity = function () {
            return activityStack[activityStack.length - 1];
        };

        this.getActivityStack = function () {
            return activityStack;
        };
        
    }]);
