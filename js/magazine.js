window.magazine = null;
window.isUseMedia = false;
var ServerURL = 'http://webby.obigo.com/~sec/';
var isPaging = false;

var has3d = ('m11' in new WebKitCSSMatrix()),

// Browser capabilities
    isLandscape = (window.innerWidth > window.innerHeight) ? true : false,
    isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
    hasTouch = 'ontouchstart' in window && !isTouchPad,
    RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
    START_EV = hasTouch ? 'touchstart' : 'mousedown',
    MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
    END_EV = hasTouch ? 'touchend' : 'mouseup',
    CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup';

function insertDom(target, strHtml) {
    return new Promise(function(resolve, reject) {
        var callback = function (evt) {
            this.removeEventListener('DOMNodeInserted', callback, false);
            resolve(evt);
        };
        target.addEventListener('DOMNodeInserted',callback, false);
        target.insertAdjacentHTML('beforeend', strHtml.trim());
    });
}

function Magazine(obj, initFunc, addFunc) {
    var i, len, page;
    this.length = 0;
    this.pageIndex = 0;
    this.posY = 0;
    this.wrapper = document.getElementById('pageWrapper');
    this.addFunc = addFunc;

    if (typeof obj == 'object' && 'page' in obj) {
        this.pageData = obj.page;
        //this.length = this.pageData.length;
        if (this.pageData.length > 0) {
            page = this.createPage(this.pageIndex);
            this.setPage(this.pageIndex, this.pageData[this.pageIndex], page);
            for (i=1, len=this.pageData.length; i<len; i++) {
                //empty page create
                page = this.createPage(i);
                this.setPage(i, this.pageData[i], page);
            }
        }
        if(typeof initFunc == 'function') {
            initFunc(this.pageData);
        }
    }
}

Magazine.prototype = {
    // For landscape view.
    createPage: function (index) {
        var page = document.createElement('div');
        if (typeof index == 'undefined') index = this.length;
        page.id = "page_" + index;
        page.className = 'page loadLayout';
        this.wrapper.appendChild( page );
        this.length++;
        return page;
    },

    setLayout: function (data) {
        var html;
        if(typeof this.addFunc == 'function') {
            data = this.addFunc(data);
        }
        html = Template.layout(data);
        //*//html += Template.page(pageIndex);
        return html;
    },

    setItem: function (layoutElement, itemData, isEdit) {
        var callback, html;
        layoutElement.innerHTML = '';
        html = Template.bind(itemData, itemData.type);
        //native capture call
        console.log(itemData.type);
        if (isEdit) {
            callback = function (evt) {
                this.removeEventListener('DOMNodeInserted', callback, false);
                var elem, selector, loaded, eventType;
                if (itemData.type !== 'text') {
                    selector = itemData.type;
                    if (selector == 'audio') {
                        eventType = 'loadedmetadata';
                    } else {
                        selector = 'img';
                        eventType = 'load';
                    }
                    elem = this.querySelector(selector);
                    loaded = function () {
                        this.removeEventListener(eventType, loaded, false);
                        setTimeout(function () {EDITOR.call("loadfinish"); }, 100);
                    };
                    elem.addEventListener(eventType,loaded, false);
                } else {
                   setTimeout(function () {EDITOR.call("loadfinish"); }, 100);
                }

            };
            layoutElement.addEventListener('DOMNodeInserted',callback, false);
        }
        layoutElement.insertAdjacentHTML('beforeend', html.trim());
    },

    insertPage: function (pageIndex) {

    },

    setPage: function (pageIndex, data, page) {
        var html;
        //page 가 미리 만들어진 경우
        if (typeof page == 'undefined') {
            if (document.getElementById("page_" + pageIndex) === 'undefined') {
                page = this.createPage(pageIndex);
            } else {
                page = document.getElementById("page_" + pageIndex);
            }
        }
        html = this.setLayout(data);

        var callback = function (evt) {
            this.removeEventListener('DOMNodeInserted', callback, false);
            setTimeout(function () {EDITOR.call("loadfinish"); }, 100);
        };
        page.addEventListener('DOMNodeInserted',callback, false);
        page.insertAdjacentHTML('beforeend', html.trim());

        for (var i=0, len=data.layout.length; i<len; i++){
            if ("type" in data.layout[i].item) {
                elem = page.querySelector('.'+data.layout[i].cls);
                this.setItem(elem, data.layout[i].item);
            }
        }
        page.dataset.isSetData = true;
        return page;
    },

    checkPage: function (pageIndex) {
        if ( $(document.getElementById( 'page_' + pageIndex)).data('isSetData') != 'true' && 'pageData' in this && this.pageData[pageIndex]) {
            this.setPage(pageIndex, this.pageData[pageIndex]);
        }
    },

    delPage: function (index) {
        index = parseInt(index);
        if (this.length == 0 || index < 0 || index > this.length) {
            return false;
        }
        if (index == this.pageIndex &&  this.length > 1) {
            if (index == 0) {
                this.move(this.pageIndex, 1, 'firstPage');
            } else {
                this.move(this.pageIndex, this.pageIndex-1);
                this.pageIndex--;
            }
        }
        $("#page_" + index).remove();
        this.length--;

        var pages = $('.page');
        for (var i=index, len=pages.length; i<len; i++){
            pages[i].id =  'page_' + i;
        }
        setTimeout(function () {EDITOR.call("loadfinish"); }, 100);
    },

    gotoPage: function (index) {
        //try{
            index = parseInt(index - 1);
            if(isPaging) return;
            //var position = -(pageHeight * index);
            if (index == this.pageIndex || index < 0 || index > this.length) {
                return false;
            }
            pauseAllAudio(this.pageIndex);
            //this.posY = position;
            this.move(this.pageIndex, index);
            this.pageIndex = index;
        /*} catch (err) {
            DEVICE.errorGotoPage(this.pageIndex);
        }*/
    },

    move: function (preIndex, newIndex, firstPage) {
        document.getElementById( 'page_' + newIndex).style.zIndex = 10;
        document.getElementById( 'page_' + newIndex).style.display = "block";
        document.getElementById( 'page_' + preIndex).style.display = "none";
        document.getElementById( 'page_' + preIndex).style.zIndex = 2;;

        document.getElementById( 'page_' + newIndex).style["opacity"] = 1;
        document.getElementById( 'page_' + newIndex).style["-webkit-transform"] = "scale(1, 1)";

        EDITOR.call('currentpage', (firstPage === 'firstPage' ? 1 : (newIndex + 1)));
    },

    swapPage: function (srcInx, tarInx) {
        //try{
            if (srcInx < 0 || srcInx > this.length) {
                return false;
            }
            if (tarInx < 0 || tarInx > this.length) {
                return false;
            }

            // this.setPage(this.pageIndex, this.pageData[this.pageIndex]);

            var page1 = $("#page_" + srcInx);
            var page2 = $("#page_" + tarInx);
            var temp1 = page1.html();
            var temp2 = page2.html();

            page1.html(temp2);
            page2.html(temp1);
            var temp1, temp2;
            temp1 = this.pageData[srcInx];
            temp2 = this.pageData[tarInx];
            this.pageData[srcInx] = temp2
            this.pageData[tarInx] = temp1;

            /*if (srcInx == this.pageIndex || tarInx == this.pageIndex) {
               //this.setPage(this.pageIndex, this.pageData[this.pageIndex],  $("#page_" + this.pageIndex));
                EDITOR.call('currentpage', (this.pageIndex + 1));
            }*/

        /*} catch (err) {
            DEVICE.errorGotoPage(this.pageIndex);
        }*/
    },

    replacePage : function () {
        if(this.length>0 && 'pageData' in this){
            isPaging = true;
            var _pageIndex = this.pageIndex;
            /*$('.spinner').css('display', 'inline-block');
            var loaded = function(){
                $('.spinner').css('display', 'none');
                isPaging = false;
                DEVICE.setCurrentPage(this.pageIndex);
                console.log('replacePage DOMNodeInserted'); //DOMNodeInserted
            };
            this.wrapper.removeEventListener('DOMNodeInserted', loaded, false);
            this.wrapper.addEventListener('DOMNodeInserted', loaded, false);*/
            //$('.spinner').css('display', 'inline-block');
            setTimeout(function(){
                //$('.spinner').css('display', 'none');
                isPaging = false;
               // DEVICE.setCurrentPage(_pageIndex+1);
            }, 800);

            this.setPage(this.pageIndex, this.pageData[this.pageIndex], this.createPage(this.pageIndex));
        }
    },

    sendMail: function (e){
        var subject, mail = $(this).data('email'),
            page = $(this).parents('.page'),
            quiz = page.find('.quizQuestion').text().trim(),
            checkCnt = page.find('.answerBox li').length,
            answerItems = page.find('.answerBox li>div.on').next('span.text'),
            answers = '';
        for (var i=0, len=answerItems.length; i<len; i++) {
            answers += $(answerItems[i]).text().trim();
            if ( i != (len-1) ) {
                answers += ", ";
            }
        }
        if (quiz.length > 60) {
            subject = quiz.substring(0, 60);
        } else {
            subject = quiz;
        }
        if (checkCnt == 0) {
            answers = page.find('.answerBox textarea').val().trim();
        }
        if (answers == '') {
            alert('Please check answer');
            return;
        }
        location.href = 'mailto:' + mail + '?subject='+subject+'&body=Quiz['+ encodeURIComponent(quiz) + '] '+ encodeURIComponent('\r\n\r\n') + ' Answer[' + encodeURIComponent(answers) + ']';
    }
};

$.views.helpers({
    position: function( top, left, width, height ) {
        var pos = "";

        if ( isLandscape ) pos = "top: "+top+"px;left:"+left+"px;width:"+width+"px;height:"+height+"px;";

        return pos;
    },
    fontstyle: function( font, size, bold, italic, underline ) {
        var style = '';
        if (font) {
            style += 'font-family:'+font+';';
        }
        if (size) {
            style += 'font-size:'+size+'px;';
        }
        if (bold == 'true' || bold === true) {
            style += 'font-weight:bold;';
        }
        if (italic == 'true' || italic === true) {
            style += 'font-style:italic;';
        }
        if (underline == 'true' || underline === true) {
            style += 'text-decoration:underline;';
        }
        return style != '' ? 'style="'+style+'"' : '';
    },
    id : function( uid ) {
        return uid ? 'id="'+uid+'"' : "";
    },
    setURL: function( url ) {
        if (url != 'about:blank' && url.indexOf('http://') < 0) {
            return 'http://' + url;
        } else {
            return url;
        }
    },
    mediaType : function( type ) {
        return type == 'video' ? './images/video_icon.png' : "./images/audio_icon.png";
    },
    newLine : function (txt) {
        return txt.replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/\r\n/gm, "<br />");
    },
    checkEdit : function () {
        return window.isEditMode;
    },
    resizeTextArea : function (width) {
        return parseInt(width - 20, 10);
    },
    cutMessage : function (msg) {
        var rMsg;
        if(window.innerWidth > 720){
            rMsg = msg.substring(0, 40);
        } else if (window.innerWidth > 480) {
            rMsg = msg.substring(0, 20);
        } else {
            rMsg = msg.substring(0, 10);
        }
        return rMsg;
    }
});
/**
 *  Generate DOM Element from item attribute in json.
 */
var Template = {
    page: function (index) {
        return $( "#pageTemplate" ).render( {'page' : parseInt(index) + 1} );
    },
    layout: function (pageData) {
        var strHTML = '';
        for(var i=0, len=pageData.layout.length; i<len; i++) {
            strHTML += $( "#layoutTemplate" ).render( {'cls' : pageData.layout[i].cls , 'uid': pageData.layout[i].item.uid, 'type': pageData.layout[i].item.type} );
        }
        return strHTML;
    },
    bind: function (item) {
        var strHTML,
            templateName;
        if (window.isEditMode && item.type === 'video') {
           templateName = "videoEditTemplate";
        } else {
           templateName = item.type + "Template";
        }
        /*if ( (item.type == 'video' || item.type == 'audio') && window.isEditMode ) {
            templateName = 'noMediaTemplate';
        }*/
        strHTML = $("#" + templateName ).render( item );
        return strHTML;
    }
};

var css = {
    cssNumber : {
    "fillOpacity": true,
    "fontWeight": true,
    "lineHeight": true,
    "opacity": true,
    "orphans": true,
    "widows": true,
    "zIndex": true,
    "zoom": true
    },
    get: function(elem, name){
        var computedStyle, parsed, ret;
        var rupper = /([A-Z]|^ms)/g,
            rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i;
            // Matches dashed string for camelizing
            rdashAlpha = /-([a-z])/ig,
            // Used by jQuery.camelCase as callback to replace()
            fcamelCase = function( all, letter ) {
                return letter.toUpperCase();
        };
        if ( !elem || elem.nodeType === 3 || elem.nodeType === 8) {
            return;
        }

        name = name.replace( rupper, "-$1" ).toLowerCase();

        if ( elem[name] && elem[name] != null && (!elem.style || elem.style[ name ] == null) ) {
            if(elem.namespaceURI == 'http://www.w3.org/2000/svg'){
                return elem[ name ].animVal.value;
            }else{
                return elem[ name ];
            }
        }else{
            computedStyle = elem.ownerDocument.defaultView.getComputedStyle( elem, null );
            ret = computedStyle.getPropertyValue( name );
            return isNaN( parsed = parseFloat( ret ) ) ? (!ret || ret === "auto" ? 0 : ret) : parsed;
        }
    },
    set: function(elem, name, value){
        if ( !elem || elem.nodeType === 3 || elem.nodeType === 8) {
            return;
        }
        if ( elem[name ] && elem[name ] != null && (!elem.style || elem.style[ name ] == null) ) {
            elem.setAttribute(name, value);
        }else{
            elem.style[ name ] = value;
        }
    }
};

window.isAudioPlay = false;

function pauseAllAudio(pageIndex){
    var context = (typeof pageIndex != 'undefined') ? $("#page_" + pageIndex) : $("#pageWrapper");
    context.find('audio').each(function(i, elem){
        elem.pause();
        console.log('=======['+elem+'] pause=======');
    });
    context.find('video').each(function(i, elem){
        elem.pause();
        console.log('=======['+elem+'] pause=======');
    });
}

function onPlayAudio(obj) {
    window.isAudioPlay = true;
    console.log('=======audioPlay=======');
}

function widthVideo(obj){
    var innerBox = $(obj).parents('.edititembox').get(0);
    var maxWidth = css.get(innerBox, 'width');
    var maxHeight = css.get(innerBox, 'height');
    var width = maxWidth;
    var height = (parseInt(width, 10) * 9)/16;
    if(height > maxHeight) {
        width = (parseInt(maxHeight, 10) * 16)/9;
        height = maxHeight;
    }
    obj.width = parseInt(width, 10);
    obj.height = parseInt(height, 10);
    obj.style.display = '';
    console.log('media size: ' + obj.width +"x"+obj.height);
}

function widthAudio(obj){
    var innerBox = $(obj).parents('.edititem').get(0);
    var maxWidth = css.get(innerBox, 'width');
    var width = maxWidth;
    obj.style.width = parseInt(width, 10) + 'px';
}

function onPlayAudio(obj) {
    //DEVICE.setPlayNoti();
    console.log('=======videoPlay=======');
}
function onPlayVideo(obj) {
    //DEVICE.setPlayNoti();
    console.log('=======videoPlay=======');
}
function onPauseVideo(obj) {
    //DEVICE.setPauseNoti();
    console.log('=======videoPause=======');
}

function openMedia( url ){
    if (!window.isEditMode && url != ''){
        if (url.indexOf('http') > -1) {
            DEVICE.openFile(url.replace(ServerURL, 'open://webbyhost/'));
        } else {
            DEVICE.openFile(url.replace('./resource', 'open://localhost/resource'));
        }
    } else {
        return false;
    }
}

function playVideo (obj) {
     if (!window.isEditMode) {
        if (obj.paused) {
          obj.play();
        } else {
          obj.pause();
        }
    } else {
        return false;
    }
}

function resizeImg(obj, url){
    var image = new Image();
    image.onload = function(){
        var innerBox = obj.parentElement;
        var maxWidth = innerBox.clientWidth;
        var maxHeight = innerBox.clientHeight;
        var width = image.width,
            height = image.height,
            scalex = maxWidth / width,
            scaley = maxHeight / height,
            scale = (scalex > scaley) ? scalex : scaley;
        if (scale > 1) {
            scale = 1;
        }
        var w = parseInt(scale * width, 10),
            h =  parseInt(scale * height, 10);
        var positionValue = (scalex > scaley) ? (h - maxHeight) : (w - maxWidth);
        positionValue = '-' + parseInt(positionValue / 2) + 'px'
        if (scalex > scaley) {
            innerBox.style["background-position-y"] = positionValue;
        } else {
            innerBox.style["background-position-x"] = positionValue;
        }
        delete image;
        obj.parentElement.removeChild(obj);
    };
    image.src = url;
}

function getAngle( x1, y1,  x2, y2){
    var dx = x2 - x1;
    var dy = y2 - y1;

    var rad= Math.atan2(dx, dy);
    var degree = (rad*180)/Math.PI;

    return degree;
}

function checkAngle( degree){
    var isValid = false;
    degree = degree < 0 ? 360 + degree : degree;
    if ( (degree >= 0 && degree <= 30) ||
         (degree >= 150 && degree <= 210) ||
         (degree >= 330 && degree <= 360) ) {
        isValid = true;
    }
    return isValid;
}

function log(msg) {
    //document.getElementById("debug").innerHTML = document.getElementById("debug").innerHTML + "<br>" + msg;
}

/**
 *  Detect vertical swipe for page navigation.
 */

var slideController = {
    mTime: 1000,
    isPaging: false,
    init: function () {
        this.eventTarget = document.getElementById('Wrap');
        this.eventTarget.addEventListener(START_EV, this, false);
    },
    handleEvent: function (e) {
        //var evt = hasTouch ? e.changedTouches[0] : e;
        //console.log('WEBCONSOLE === type : ' + e.type + " x:" + evt.pageX + " y:" + evt.pageY + '====');
        switch (e.type) {
            case START_EV:
                this.touchStart(e);
                break;
            case MOVE_EV:
                this.touchMove(e);
                break;
            case END_EV:
            case CANCEL_EV:
                this.touchEnd(e);
                break;
            case "webkitTransitionEnd":
                this.transEnd(e);
            default:
                break;
        }
    },

    touchStart: function (event) {
        var evt = hasTouch ? event.changedTouches[0] : event;
        //console.log(pageWidth + ' ' + evt.pageX);

        if (this.isPaging || evt.pageX < 50 || evt.pageX > (pageWidth - 50) || evt.pageY < 50 || evt.pageY > (pageHeight - 50)) {
            return false;
        }
        this.startX = evt.pageX;
        this.startY = evt.pageY;
        this.moveX = null;
        this.moveY = null;
        this.direction = null;
        this.eventTarget.addEventListener(MOVE_EV, this, false);
        this.eventTarget.addEventListener(END_EV, this, false);
        this.eventTarget.addEventListener(CANCEL_EV, this, false);
    },

    touchMove: function (event) {
        event.preventDefault();
        var evt = hasTouch ? event.changedTouches[0] : event,
            direction = evt.pageY-this.startY > 0 ? -1 : 1,
            moveX = evt.pageX-this.startX,
            moveY = evt.pageY-this.startY;
        var preIndex = magazine.pageIndex;
        var newIndex = preIndex + direction;
        var degree = getAngle(this.startX, this.startY, evt.pageX, evt.pageY);
        var isV = checkAngle(degree);

        if (this.moveY === null && !isV) {
            console.log('return move XXX');
            this.eventTarget.removeEventListener(MOVE_EV, this, false);
            this.eventTarget.removeEventListener(END_EV, this, false);
            this.eventTarget.removeEventListener(CANCEL_EV, this, false);
            return;
        }
        if (newIndex < 0 || newIndex >= magazine.length) {
            this.eventTarget.removeEventListener(MOVE_EV, this, false);
            this.eventTarget.removeEventListener(END_EV, this, false);
            this.eventTarget.removeEventListener(CANCEL_EV, this, false);
            return;
        }
        // if (newIndex < 0) {
        //     newIndex = magazine.length -1;
        // } else if (newIndex >= magazine.length) {
        //     newIndex = 0;
            /*this.eventTarget.removeEventListener(MOVE_EV, this, false);
            this.eventTarget.removeEventListener(END_EV, this, false);
            this.eventTarget.removeEventListener(CANCEL_EV, this, false);
            this.isPaging = false;
            return false;*/
        //}

        //다른 방향으로
        if (this.direction !== null && this.direction != direction) {
            if (this.newIndex) { document.getElementById( 'page_' + this.newIndex).style.display = "none"; }
            document.getElementById( 'page_' + newIndex).style.display = "block";
        }

        //최초 한번만
        if (this.moveY === null) {
            pauseAllAudio(magazine.pageIndex);
            document.getElementById( 'page_' + newIndex).style.display = "block";
            document.getElementById( 'page_' + newIndex).style.zIndex = 2;
            document.getElementById( 'page_' + preIndex).style.zIndex = 10;
            document.querySelector('.block_wrap').style.display = "block";
        }
        this.slide(preIndex, newIndex, moveY, 0);
        this.moveX = evt.pageX;
        this.moveY = evt.pageY;
        this.direction = direction;
        this.newIndex = newIndex;
    },

    touchEnd: function (event) {
        var that = this;
        var evt = hasTouch ? event.changedTouches[0] : event,
            direction = evt.pageY-this.startY > 0 ? -1 : 1,
            moveX = evt.pageX-this.startX,
            moveY = evt.pageY-this.startY;
        var preIndex = magazine.pageIndex;
        var newIndex = preIndex + direction;
        var time = this.mTime - (this.mTime * Math.abs(moveY) / pageHeight);
        var degree = getAngle(this.startX, this.startY, evt.pageX, evt.pageY);
        var isV = checkAngle(degree);

        if (newIndex < 0) {
            newIndex = magazine.length -1;
        } else if (newIndex >= magazine.length) {
            newIndex = 0;
            /*this.eventTarget.removeEventListener(MOVE_EV, this, false);
            this.eventTarget.removeEventListener(END_EV, this, false);
            this.eventTarget.removeEventListener(CANCEL_EV, this, false);
            this.isPaging = false;
            return false;*/
        }

        this.eventTarget.removeEventListener(MOVE_EV, this, false);
        this.eventTarget.removeEventListener(END_EV, this, false);
        this.eventTarget.removeEventListener(CANCEL_EV, this, false);
        //console.log('WEBCONSOLE === this.moveY : ' + this.moveY + '====');
        if (this.moveY) {
            this.transEnd = function () {
                document.getElementById( 'page_' + newIndex).style.zIndex = 10;
                document.getElementById( 'page_' + preIndex).style.display = "none";
                document.getElementById( 'page_' + preIndex).style.zIndex = 2;
                document.getElementById( 'page_' + preIndex).style["-webkit-transition"] = "all 0ms";
                document.getElementById( 'page_' + preIndex).style["-webkit-transform"] = "translate(0px, 0px)";
                document.querySelector('.block_wrap').style.display = "none";
                that.isPaging = false;
                magazine.pageIndex = newIndex;
                document.getElementById( 'page_' + preIndex).removeEventListener('webkitTransitionEnd', this, false);
                EDITOR.call('currentpage', (newIndex + 1));
                EDITOR.call( (preIndex < newIndex ? 'pagedown' : 'pageup') );
            };

            document.getElementById( 'page_' + preIndex).addEventListener('webkitTransitionEnd', this, false);

            this.slide(preIndex, newIndex, (-1 * direction * pageHeight), time);
        } else {
            document.querySelector('.block_wrap').style.display = "none";
            that.isPaging = false;
        }
    },

    slide: function (preIndex, newIndex, y, time) {
        this.isPaging = true;

        var opacity = 0.2 + ((0.8 * Math.abs(y)) / pageHeight);
        var scale = 0.8 + ((0.2 * Math.abs(y)) / pageHeight);
        document.getElementById( 'page_' + preIndex).style["-webkit-transition"] = "all "+time+"ms";
        document.getElementById( 'page_' + newIndex).style["-webkit-transition"] = "all "+ time +"ms";

        document.getElementById( 'page_' + preIndex).style["-webkit-transform"] = "translate(0px, "+y+"px)";

        document.getElementById( 'page_' + newIndex).style["opacity"] = opacity;
        document.getElementById( 'page_' + newIndex).style["-webkit-transform"] = "scale("+scale+", "+scale+")";
    }
};
