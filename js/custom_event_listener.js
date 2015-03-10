/*
 * Copyright (c) 2007 	Josh Davis ( http://joshdavis.wordpress.com )
 *
 * Licensed under the MIT License ( http://www.opensource.org/licenses/mit-license.php ) as follows:
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
*/
/**
 * Binds a function to the given object's scope
 *
 * @param {Object} object The object to bind the function to.
 * @return {Function}	Returns the function bound to the object's scope.
 */
Function.prototype.bind = function (object) {
    var method = this;
    return function ()
    {
        return method.apply(object, arguments);
    };
};

/**
 * Create a new instance of Event.
 *
 * @classDescription	This class creates a new Event.
 * @return {Object}	Returns a new Event object.
 * @constructor
 */
function CustomEvent() {
    this.events = [];
    this.builtinEvts = [];
}

/**
 * Gets the index of the given action for the element
 *
 * @memberOf Event
 * @param {Object} obj The element attached to the action.
 * @param {String} evt The name of the event.
 * @param {Function} action The action to execute upon the event firing.
 * @param {Object} binding The object to scope the action to.
 * @return {Number} Returns an integer.
 */
CustomEvent.prototype.getActionIdx = function (evt, action, binding) {
    if (evt)
    {
        var curel = this.events[evt];
        if (curel)
        {
            var len = curel.length;
            for (var i = len-1;i >= 0;i--)
            {
                if (curel[i].action == action && curel[i].binding == binding)
                {
                    return i;
                }
            }
        }
        else
        {
            return -1;
        }
    }
    return -1;
};

/**
 * Adds a listener
 *
 * @memberOf Event
 * @param {Object} obj The element attached to the action.
 * @param {String} evt The name of the event.
 * @param {Function} action The action to execute upon the event firing.
 * @param {Object} binding The object to scope the action to.
 * @return {null} Returns null.
 */
CustomEvent.prototype.addListener = function (evt, action, binding) {
        if (this.events[evt]) {
            if (this.getActionIdx(evt, action, binding) == -1) {
                var curevt = this.events[evt];
                curevt[curevt.length] = {action:action, binding:binding};
            }
        } else {
            this.events[evt] = [];
            this.events[evt][0] = {action:action, binding:binding};
        }

};

/**
 * Removes a listener
 *
 * @memberOf Event
 * @param {Object} obj The element attached to the action.
 * @param {String} evt The name of the event.
 * @param {Function} action The action to execute upon the event firing.
 * @param {Object} binding The object to scope the action to.
 * @return {null} Returns null.
 */
CustomEvent.prototype.removeListener = function (evt, action, binding) {
    if (this.events[evt]) {
        if (action){
            var idx = this.getActionIdx(evt,action,binding);
            if (idx >= 0) {
                this.events[evt].splice(idx,1);
            }
        } else {
            this.events[evt] = [];
        }
    }
};

/**
 * Fires an event
 *
 * @memberOf Event
 * @param e [(event)] A builtin event passthrough
 * @param {Object} obj The element attached to the action.
 * @param {String} evt The name of the event.
 * @param {Object} args The argument attached to the event.
 * @return {null} Returns null.
 */
CustomEvent.prototype.fireEvent = function () {
    //console.dir(this.events);
    //console.log(' fire ' + this.events);
    var evt = arguments[0], args = Array.prototype.slice.call(arguments, 1);//args = arguments;//
    //console.log(' fire ' + evt);
    if (this.events) {
        var curel = this.events[evt];
        if (curel) {
            var i = 0;
            for (var act in curel) {
                i++;
                var action = curel[act].action;
                if (curel[act].binding) {
                    action = action.bind(curel[act].binding);
                }
                //console.log("&&&&&&&&&&&&&&&&& i = " + i);
                //console.log("----------------------------------------");
                //console.log("fireEvent() action = " + action);
                //console.log("----------------------------------------");
                action.apply(this, args);
            }
        }
    }
};