'use strict';

angular.module('app.bill', [])
    .controller('BillController', ['$scope', 'ActivityManager', 'COMMON_KEYS', 'BillService', function ($scope, ActivityManager, COMMON_KEYS, BillService) {
        var activity = ActivityManager.getActiveActivity();
        activity.initialize($scope);

        var title,
            date,
            amount,
            totalAmount = 0;
        var billItems = [];
        var currentPage = 0,
            maxItemsPerPage = 6;

        if (BillService.getBill().length == 0) {
            BillService.initialize().success(function (data) {
                bindBill();
            })
        } else {
            bindBill();
        }

        activity.loadI18NResource(function (res) {
            $scope.bill = BillService.getLang();
        });

        activity.onKeyDown(function (keyCode) {
            switch (keyCode) {
                case COMMON_KEYS.KEY_LEFT:
                    if (activity.triggerBottom() == false) {
                        currentPage--;
                        if (-1 === currentPage) {
                            currentPage = Math.ceil(billItems.length / maxItemsPerPage) - 1;
                        }
                        updatePage();
                    }
                    break;
                case COMMON_KEYS.KEY_RIGHT:
                    if (activity.triggerBottom() == false) {
                        currentPage++;
                        if (Math.ceil(billItems.length / maxItemsPerPage) === currentPage) {
                            currentPage = 0;
                        }
                        updatePage();
                    }
                    break;
                case COMMON_KEYS.KEY_UP:
                    activity.triggerBottom(false);
                    $scope.$broadcast('triggerBottom.change', false);
                    break;
                case COMMON_KEYS.KEY_DOWN:
                    activity.triggerBottom(true);
                    $scope.$broadcast('triggerBottom.change', true);
                    break;
                case COMMON_KEYS.KEY_BACK:
                    activity.finish();
                    break;
            }
        });

        function bindBill() {
            var billData = BillService.getBill();
            for (var b= 0; b < billData.length; b++) {
                title = billData[b].name;
                date = formatDatetime(billData[b].time);
                amount = Number(billData[b].price);
                totalAmount += amount;
                billItems.push({title: title, date: date, amount: amount});
            }
            updatePage();
        }

        function updatePage() {
            $scope.billItems = billItems.slice(currentPage * maxItemsPerPage,
                (currentPage + 1) * maxItemsPerPage >= billItems.length ? billItems.length : (currentPage + 1) * maxItemsPerPage)
            $scope.pagerText = (currentPage + 1) + '/' + Math.ceil(billItems.length / maxItemsPerPage);
            $scope.amountText = '￥' + totalAmount.toFixed(2);
        }

        function formatDatetime(date) {
            var year = date.substring(0, 4);
            var mouth = date.substring(4, 6);
            var day = date.substring(6, 8);
            var hour = date.substring(8, 10);
            var minute = date.substring(10, 12);
            var second = date.substring(12, 14);
            var dataTime = new Date(year, (mouth - parseInt(1)), day, hour, minute, second);
            return dataTime;
        }

    }])
    .service('BillService', ['$q', '$http', 'ResourceManager', function ($q, $http, ResourceManager) {
        var billUrl = ResourceManager.getConfigurations().billUrl();
        var configUrl,
            bills = [];
        this.initialize = function () {
            var deferred = $q.defer();

            // cached configurations
            if (billUrl === configUrl) {
                deferred.resolve();
                return deferred.promise;
            }
            return $http.get(billUrl).success(function (configJSON) {
                configUrl = billUrl;
                configJSON.Content.forEach(function (el, idx, arr) {
                    if (el.Second) {
                        el.Second.Content.forEach(function (el2, idx2, arr2) {
                            bills.push({
                                name    : el.Name + ' · ' + el2.Name,
                                count   : el2.Count,
                                time    : el2.Time,
                                price   : el2.Price
                            });
                        });
                        return;
                    }
                });
            });
        }

        this.getLang = function () {
            return ResourceManager.getLocale().bill;
        }

        this.getBill = function () {
            return bills;
        }
    }]);
