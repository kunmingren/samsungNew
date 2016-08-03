/**
 * Created by 83471 on 2016/8/2.
 */
'use strict';

angular.module('app.activity', [])
    .service('ActivityManager',function () {
        var activityStack = [];

        function Activity(id) {
            this.templateUrl = 'partials/' + id + '.html';
            this._hide = false;
        }

        Activity.prototype.finish = function () {
            activityStack.pop();
        };

        //Activity.prototype.initialize = function (scope) {
        //    this._scope = scope;
        //};

        Activity.prototype.hide = function () {
            this._hide = true;
        };

        Activity.prototype.show = function () {
            this._hide = false;
        };

        Activity.prototype.isHide = function () {
            return this._hide;
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

    });
