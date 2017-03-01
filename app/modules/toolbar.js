'use strict';

angular.module('app.toolbar', [])
    .directive('toolbar', [ 'ResourceManager', 'COMMON_KEYS', 'ActivityManager', function (ResourceManager, COMMON_KEYS, ActivityManager) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                items: '@items'
            },
            templateUrl: 'partials/toolbar.html',
            link: function (scope, element, attrs) {
                var i18nText  = ResourceManager.getLocale();
                var triggerBottom  = ActivityManager.getActiveActivity().triggerBottom();
                var toolbarItems = [
                    {code: 'ok', icon: false, title: i18nText.toolbar.ok},
                    {code: 'weather_ok', icon: false, title: i18nText.toolbar.weather_ok},
                    {code: 'order_ok', icon: false, title: i18nText.toolbar.order_ok},
                    {code:'weather_open',title:i18nText.toolbar.weather_open},
                    {code:'cart_l_r',title:i18nText.toolbar.cart_l_r},
                    {code: 'up-down', icon: 'assets/images/ic_up_down.png', title: i18nText.toolbar.up_down},
                    {code: 'left-right', icon: 'assets/images/ic_left_right.png', title: i18nText.toolbar.left_right},
                    {code: 'back', icon: 'assets/images/ic_back.png', title: i18nText.toolbar.back}
                ];
                var items = attrs.items.split('|');
                var leftItems = items[0].split(',');
                var rightItems = items[1].split(',');
                scope.leftItems = toolbarItems.filter(function (el, idx, arr) {
                    return leftItems.indexOf(el.code) !== -1;
                });
                scope.rightItems = toolbarItems.filter(function (el, idx, arr) {
                    return rightItems.indexOf(el.code) !== -1;
                });
                scope.menu = {menuText: i18nText.toolbar.menuText, title: i18nText.toolbar.menu};
                    scope.showToolbar = true;
                scope.$on('menu.toggle', function (ev, visible) {
                    scope.showToolbar = !visible;
                });
                scope.isActive = triggerBottom;
                scope.$on('triggerBottom.change', function (ev, visible) {
                    scope.isActive = visible;
                });
            }
        };
    }]);
