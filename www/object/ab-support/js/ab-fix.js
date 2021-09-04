"use strict";

//Verfica Sistema Operacional
window.isIOS = (/iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) && !window.MSStream;
window.isAndroid = /(android)/i.test(navigator.userAgent);
window.isDesktop = !window.isIOS && !window.isAndroid;

(function(w, $, undefined) {

    w.tapHandling = false;
    w.tappy = true;

    var tap = function($els) {
        return $els.each(function() {

            var $el = $(this),
                resetTimer,
                startY,
                startX,
                cancel,
                scrollTolerance = 10;

            function trigger(e) {
                $(e.target).trigger("tap", [e, $(e.target).attr("href")]);
            }

            function getCoords(e) {
                var ev = e.originalEvent || e,
                    touches = ev.touches || ev.targetTouches;

                if (touches) {
                    return [touches[0].pageX, touches[0].pageY];
                } else {
                    return null;
                }
            }

            function start(e) {
                if (e.touches && e.touches.length > 1 || e.targetTouches && e.targetTouches.length > 1) {
                    return false;
                }

                var coords = getCoords(e);
                startX = coords[0];
                startY = coords[1];
            }

            // any touchscroll that results in > tolerance should cancel the tap
            function move(e) {
                if (!cancel) {
                    var coords = getCoords(e);
                    if (coords && (Math.abs(startY - coords[1]) > scrollTolerance || Math.abs(startX - coords[0]) > scrollTolerance)) {
                        cancel = true;
                    }
                }
            }

            function end(e) {
                clearTimeout(resetTimer);
                resetTimer = setTimeout(function() {
                    w.tapHandling = false;
                    cancel = false;
                }, 1000);

                // make sure no modifiers are present. thx http://www.jacklmoore.com/notes/click-events/
                if ((e.which && e.which > 1) || e.shiftKey || e.altKey || e.metaKey || e.ctrlKey) {
                    return;
                }

                e.preventDefault();

                // this part prevents a double callback from touch and mouse on the same tap

                // if a scroll happened between touchstart and touchend
                if (cancel || w.tapHandling && w.tapHandling !== e.type) {
                    cancel = false;
                    return;
                }

                w.tapHandling = e.type;
                trigger(e);
            }

            $el
                .bind("touchstart.tappy MSPointerDown.tappy", start)
                .bind("touchmove.tappy MSPointerMove.tappy", move)
                .bind("touchend.tappy MSPointerUp.tappy", end)
                .bind("click.tappy", end);
        });
    };

    var untap = function($els) {
        return $els.unbind(".tappy");
    };

    // use special events api
    if ($.event && $.event.special) {
        $.event.special.tap = {
            add: function(handleObj) {
                tap($(this));
            },
            remove: function(handleObj) {
                untap($(this));
            }
        };
    } else {
        // monkeybind
        var oldBind = $.fn.bind,
            oldUnbind = $.fn.unbind;
        $.fn.bind = function(evt) {
            if (/(^| )tap( |$)/.test(evt)) {
                tap(this);
            }
            return oldBind.apply(this, arguments);
        };
        $.fn.unbind = function(evt) {
            if (/(^| )tap( |$)/.test(evt)) {
                untap(this);
            }
            return oldUnbind.apply(this, arguments);
        };
    }

}(this, jQuery));


// ARRUMA ERRO NO IE9 ONDE NAO EXISTE WINDOW.CONSOLE
if (!window.console) {
    var console = {
        log: function() {},
        warn: function() {},
        error: function() {},
        time: function() {},
        timeEnd: function() {}
    }
}

/* ARRUMA INPUT NO IOS QUE NAO FUNCIONA DIREITO */
/*$(document).ready(function() {
    if (window.isIOS) {
        $(document).ready(function() {
            document.addEventListener('keydown', function(e) {
                window.focus();
                $(':focus').focus();
            });
        });
    }

});*/

var getXY = function(event) {
    var x = null;
    var y = null;

    if (event.originalEvent != null && event.originalEvent.touches != null) {
        var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
        x = parseFloat(touch.pageX);
        y = parseFloat(touch.pageY);
    } else {
        x = parseFloat(event.pageX);
        y = parseFloat(event.pageY);
    }

    var pos = new Object();
    pos.x = x;
    pos.y = y;

    return pos;
}

var support3d = function() {
    var ret = false;
    var supports3DTransforms = document.body.style['webkitPerspective'] !== undefined || document.body.style['MozPerspective'] !== undefined;
    if (supports3DTransforms) {
        ret = true;
    }
    return ret;
}

var getTransform = function(el) {
    var prop = "";

    if (el.css('-webkit-transform') != undefined) {
        prop = el.css('-webkit-transform');
    } else if (el.css('transform') != undefined) {
        prop = el.css('transform');
    } else if (el.css('-moz-transform') != undefined) {
        prop = el.css('-moz-transform');
    } else if (el.css('-ms-transform') != undefined) {
        prop = el.css('-ms-transform');
    } else {
        return [0, 0, 0];
    }

    var results = prop.match(/matrix(?:(3d)\(-{0,1}\d+(?:, -{0,1}\d+)*(?:, (-{0,1}\d+))(?:, (-{0,1}\d+))(?:, (-{0,1}\d+)), -{0,1}\d+\)|\(-{0,1}\d+(?:, -{0,1}\d+)*(?:, (-{0,1}\d+))(?:, (-{0,1}\d+))\))/);

    if (!results)
        return [0, 0, 0];
    if (results[1] == '3d')
        return results.slice(2, 5);

    results.push(0);
    return results.slice(5, 8);
}

var goToNextTabindex = function(event, obj, command) {
    var key = event.keyCode ? event.keyCode : event.which;

    if (key == 13 || key == 9) {
        var ficar = true;
        var ret = true;
        var tabindex = obj.attr('tabindex');

        if (key == 13 && obj[0].nodeName == "TEXTAREA") {
            return;
        }

        do {
            //Verifica o tabindex
            var gotoTabindex = obj.attr('goto-tab-index');
            var stopTabindex = obj.attr('stop-tab-index');

            //Vai opara
            if (tabindex && stopTabindex != "true") {
                tabindex = parseInt(tabindex);

                //avanca o tabindex
                if (gotoTabindex) {
                    tabindex = gotoTabindex;
                } else {
                    tabindex++;
                }

                //se Existir o elemento foca nele
                var nextObj = $('[tab-index=' + tabindex + ']');

                //Verifica se encontrou um objeto
                if (nextObj.length > 0 && nextObj.attr("is-disabled") != "true") {
                    ficar = false;                    

                    if (nextObj[0].nodeName == "ABNER-SELECT-UNDERLINE") {
                        nextObj.find("select").trigger("focus");
                    } else {
                        nextObj.find("[div-focus=true]").trigger(command);
                    };
                } else {
                    if (nextObj.length > 0) {
                        //verifica o proximo objeto
                        obj = nextObj;
                    } else {
                        ficar = false;
                    }
                }

                //removido para funcionar o enter
                //return false;
            } else {
                if (stopTabindex == "true") {
                    ficar = false;
                    ret = false;
                } else {
                    ficar = false;
                    ret = true;
                }

            }
        }
        while (ficar);

        //Se for tab deixar false
        if (key == 9) {
            ret = false;
        }

        //rodar saida
        return ret;
    }

}

var randomNumber = function() {
    //var random_integer = Math.random()*101|0;    
    return Math.random().toString(36).substr(2, 10);
}

var guid = function() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

var generateID = function() {
    return guid();
}

var pointerEventToXY = function(e) {
    var out = { x: 0, y: 0 };
    if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel') {
        var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        out.x = touch.pageX;
        out.y = touch.pageY;
    } else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover' || e.type == 'mouseout' || e.type == 'mouseenter' || e.type == 'mouseleave') {
        out.x = e.pageX;
        out.y = e.pageY;
    }
    return out;
};