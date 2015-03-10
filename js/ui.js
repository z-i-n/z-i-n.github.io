(function(win){
    var UI = {};

// Browser capabilities
    isLandscape = (window.innerWidth > window.innerHeight) ? true : false,
    isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
    hasTouch = 'ontouchstart' in window && !isTouchPad,
    RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
    START_EV = hasTouch ? 'touchstart' : 'mousedown',
    MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
    CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup',
    END_EV = hasTouch ? 'touchend' : 'mouseup';

    UI.btns = function (option) {
        this.evtTarget = option.evtTarget;
        this.cssTarget = option.cssTarget;
        this.cssName = option.cssName;
        this.callback = option.callback;
        this.bind(this.evtTarget);
    };
    UI.btns.prototype = {
        bind: function (nodeElement) {
            nodeElement.addEventListener(START_EV, this, false);
            nodeElement.addEventListener('click', this, false);
        },
        handleEvent: function(e){
            switch(e.type) {
                case 'click':
                    this.click(e);
                break;
                case MOVE_EV:
                    this.move(e);
                break;
                case START_EV:
                    this.pressed(e);
                break;
                case CANCEL_EV:
                case END_EV:
                    this.released(e);
                break;
            }
        },
        click: function (e) {
            console.log('click ' + e.type);
            if(typeof this.callback == 'function') {
                console.log('callback');
                this.callback(this.evtTarget);
            }
        },
        move: function(e){
            console.log('move ' + e.type);
            e.preventDefault();
        },
        pressed: function (e) {
            console.log('pressed ' + e.type);
            if (!$(this.cssTarget).hasClass(this.cssName)) {
                $(this.cssTarget).addClass(this.cssName);
            }
            this.evtTarget.addEventListener(MOVE_EV, this, false);
            document.documentElement.addEventListener(CANCEL_EV, this, false);
            document.documentElement.addEventListener(END_EV, this, false);
        },
        released: function (e) {
            console.log('released ' + e.type);
            this.evtTarget.removeEventListener(MOVE_EV, this, false);
            document.documentElement.removeEventListener(CANCEL_EV, this, false);
            document.documentElement.removeEventListener(END_EV, this, false);
            if($(this.cssTarget).hasClass(this.cssName)){
                $(this.cssTarget).removeClass(this.cssName);
            }
            if(e.type == CANCEL_EV) {
                console.log('prevent');
                e.preventDefault();
            }
        }
    };
    win.UI = UI;
})(window);