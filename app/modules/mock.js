
if (!window.Common) {

    window.Common = {};
    window.Common.API = {};

    window.Common.API.Widget = function () {
    };

    window.Common.API.Widget.prototype.blockNavigation = function (event) {
        console.log('Common.API.Widget.blockNavigation(', event, ')');
    };

    window.Common.API.Widget.prototype.sendReadyEvent = function () {
        console.log('Common.API.Widget.sendReadyEvent()');
    };


    window.Common.API.TVKeyValue = function () {
                
    };

    window.Common.API.Plugin = function () {
    };
    
    window.Common.API.Plugin.prototype.unregistKey = function (keyCode) {
        console.log('Common.API.Widget.unregistKey(', keyCode, ')');
    };

}

