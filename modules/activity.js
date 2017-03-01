/**
 * Created by 83471 on 2016/8/2.
 */
'use strict';

angular.module('app.activity', ['app.resource'])
    .service('ActivityManager', ['ResourceManager', function (ResourceManager) {
        var activityStack = [];

        function Activity(id, type, child) {
            this.templateUrl = 'partials/' + type + '.html';
            this._hide = false;
            this._isMenu = false;
            this.activityID = id;
            this._child = child;
        }

        Activity.prototype.getID = function () {
            return this.activityID;
        };

        Activity.prototype.getChild = function () {
            return this._child;
        };

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

        Activity.prototype.isMenu = function (bool) {
            if (typeof bool !== 'boolean') {
                return this._isMenu;
            } else {
                this._isMenu = bool;
            }
        };

        Activity.prototype.loadI18NResource = function (callback) {
            callback(ResourceManager.getI18NResource());
            this._scope.$on('locale.change', function (ev, keyCode) {
                callback(ResourceManager.getI18NResource());
            });
        };

        Activity.prototype.animate = function (num, sel, className) {
            var target = document.getElementById(sel).children[num].children[0];
            if (this.hasClass(target, className)) {
                this.remove(num);
            }
            this.addClass(target, className);
        }

        Activity.prototype.movieAnimate = function (num, sel, className) {
            var targetAll = document.getElementById(sel).children.length;
            for (var i = 0; i < targetAll; i++) {
                var target1 = document.getElementById(sel).children[i].children[0];
                //target1.style='';
                this.removeClass(target1, 'opacityAdd');
            }
            var target = document.getElementById(sel).children[num].children[0];
            this.addClass(target, className);
        }

        Activity.prototype.removeAnimate = function (num, sel, className) {
            var target = document.getElementById(sel).children[num].children[0];
            this.removeClass(target, className);
        }

        Activity.prototype.rotateUp = function (num) {
            if (num == 0) {
                var number = num;
                var target = document.getElementById('type' + number).children;
                for (var i = 0; i < target.length; i++) {
                    this.transform(target[i].children[0], "rotateX(0deg)");
                    this.removeClass(target[i].children[0], 'opacityReduce');
                    this.addClass(target[i].children[0], 'opacityAdd');
                    target[i].children[0].style.top = '33.3px';
                }
            } else {
                var number = num;
                var target = document.getElementById('type' + number).children;
                for (var i = 0; i < target.length; i++) {
                    this.transform(target[i].children[0], "rotateX(0deg)");
                    this.removeClass(target[i].children[0], 'opacityReduce');
                    this.removeClass(target[i].children[0], 'choseMovie');
                    this.addClass(target[i].children[0], 'opacityAdd');
                    target[i].children[0].style.top = '33.3px';
                }
                var number1 = num - 1;
                var target1 = document.getElementById('type' + number1).children;
                for (var i = 0; i < target1.length; i++) {
                    this.transform(target1[i].children[0], "rotateX(90deg)");
                    this.removeClass(target1[i].children[0], 'opacityAdd');
                    this.removeClass(target1[i].children[0], 'choseMovie');
                    this.addClass(target1[i].children[0], 'opacityReduce');
                    this[i].children[0].style.top = '-145px';
                }
            }
        }


        Activity.prototype.rotateDown = function (num) {
            if (num == -1) {
                var target = document.getElementsByClassName('rotate_img');
                for (var i = 0; i < target.length; i++) {
                    this.transform(target[i], "rotateX(-90deg)");
                    this.addClass(target[i], 'opacityReduce');
                    target[i].style.top = '145px';
                }
            } else {
                var number1 = num + 1;
                var target1 = document.getElementById('type' + number1).children;
                for (var i = 0; i < target1.length; i++) {
                    this.transform(target1[i].children[0], "rotateX(-90deg)");
                    this.removeClass(target1[i].children[0], 'opacityAdd');
                    this.removeClass(target1[i].children[0], 'choseMovie');
                    this.addClass(target1[i].children[0], 'opacityReduce');
                    target1[i].children[0].style.top = '145px';
                }
                var number = num;
                var target = document.getElementById('type' + number).children;
                for (var i = 0; i < target.length; i++) {
                    this.transform(target[i].children[0], "rotateX(0deg)");
                    this.removeClass(target[i].children[0], 'opacityReduce');
                    this.removeClass(target[i].children[0], 'choseMovie');
                    this.addClass(target[i].children[0], 'opacityAdd');
                    target[i].children[0].style.top = '33.3px';
                }
            }
        }

        Activity.prototype.remove = function (num, sel, className) {
            var target = document.getElementById(sel).children[num].children[0];
            this.removeClass(target, className);
        }

        Activity.prototype.hasClass = function (obj, cls) {
            return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
        }

        Activity.prototype.addClass = function (obj, cls) {
            if (!this.hasClass(obj, cls)) {
                obj.className += " " + cls;
            }
        }

        Activity.prototype.removeClass = function (obj, cls) {
            if (this.hasClass(obj, cls)) {
                var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
                obj.className = obj.className.replace(reg, ' ');
            }
        }

        Activity.prototype.transform = function (element, value, key) {
            key = key || "Transform";
            ["Moz", "O", "Ms", "Webkit", ""].forEach(function (prefix) {
                element.style[prefix + key] = value;
            });
            return element;
        }

        Activity.prototype.showTip = function (text) {
            var target = $("#tipModal");
            target.css("display","block");
            $(".toast-content").html(text);
            setTimeout(function () {
                target.css("display","none");
            },3000)
        }

        this.go = function (id, stackIndex, type, child) {
            var nPops = activityStack.length - stackIndex;
            for (var i = 0; i < nPops; i++) {
                activityStack.pop();
            }
            this.startActivity(id, type, child);
        };

        this.startActivity = function (id, type, child) {
            var activity = new Activity(id, type, child);
            activityStack.push(activity);
        };

        this.getActiveActivity = function () {
            return activityStack[activityStack.length - 1];
        };

        this.getActivityStack = function () {
            return activityStack;
        };

        this.hideLoading = function (time) {
            if(time){
                setTimeout(function () {
                    var load = document.getElementsByClassName('loading');
                    load[0].style.display = 'none';
                }, time);
            }else{
                var load = document.getElementsByClassName('loading');
                load[0].style.display = 'none';
            }
        };

        this.showLoading = function () {
            var load = document.getElementsByClassName('loading');
            load[0].style.display = 'block';
        }

    }]);
