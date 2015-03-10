(function (window) {
    window.EDITOR = {
        call: function (command, param, callback) {
            if (typeof callback == 'function') {
                var nativeCallback = function () {
                    nativeEvent.removeListener(command, nativeCallback);
                    if (typeof callback == 'function') {
                        callback.apply(this, arguments);
                    }
                };
                if (command === 'edititem') {
                    nativeEvent.removeListener(command);
                }
                nativeEvent.addListener(command, nativeCallback);
            }
            nativeInterface.execute(command, param);
        }
    };

    window.DEVICE = {
        setCurrentPage: function (index) {
            try{
                deviceapis.extension.moveevent.setCurrentPage(index);
            } catch(err) {
                console.log('setCurrentPage : deviceapis API is not defined');
            }
        },
        errorGotoPage: function () {
            try{
                deviceapis.extension.moveevent.errorGotoPage();
            } catch(err) {
                console.log('errorGotoPage : deviceapis API is not defined');
            }
        }
    };
})(window);
