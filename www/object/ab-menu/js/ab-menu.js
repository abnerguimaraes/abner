"use strict";

var ChassiFloatButton = function(chassi) {
    // Escopo do chassi
    this.chassi = chassi;

    // Tamanho
    this.size = "65";
}

ChassiFloatButton.prototype.onTouchMove = function(e) {
    e.preventDefault();

    var btnDiv = $("#DivautoHide");

    if (btnDiv.attr('id') != undefined) {
        // Pega o toque
        var touch = new Object();
        if (e.originalEvent && e.originalEvent.touches) {
            touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        } else {
            touch = e;
        }

        var h = parseInt($(btnDiv).css("height"));
        var w = parseInt($(btnDiv).css("width"));

        // Move objeto
        $(btnDiv).css("top", touch.pageY - (h / 2));
        $(btnDiv).css("left", touch.pageX - (w / 2));
        $(btnDiv).attr("moved", "true");
    }
}

ChassiFloatButton.prototype.hide = function() {
    var _this = this;

    // Remove Timeout
    if (window.btnChassiFull != undefined) {
        window.clearInterval(window.btnChassiFull);
        window.btnChassiFull = undefined;
    }

    // remove evento
    $(document).unbind("touchmove mousemove", _this.onTouchMove);

    // Remove botao da tela
    $("#DivautoHide").remove();
}

ChassiFloatButton.prototype.refresh = function() {
    var btnDiv = $("#DivautoHide");

    if (btnDiv.attr('id') != undefined) {
        this.hide();
        this.show();
    }
}

ChassiFloatButton.prototype.setNewPosition = function(e, forceMove) {
    var _this = this;
    var oh = parseInt($("#DivautoHide").css("height"));
    var ow = parseInt($("#DivautoHide").css("width"));
    var ol = parseInt($("#DivautoHide").css("left"));
    var ot = parseInt($("#DivautoHide").css("top"));
    var ob = parseInt($("#DivautoHide").css("bottom"));

    var w = parseInt($(window).width());
    var h = parseInt($(window).height());

    var dontMove = false;

    if (ot < 30) {
        $("#DivautoHide").animate({
            "top": "10px"
        }, 100);
        dontMove = true;
    }

    if ((ot + oh + 30) > h) {
        $("#DivautoHide").animate({
            "top": h - (oh + 10)
        }, 100);
        dontMove = true;
    }

    if (dontMove == false || forceMove != undefined) {
        if ((ol + (ow / 2)) > (w / 2)) {
            $("#DivautoHide").animate({
                "left": w - ow - 10 + "px"
            }, 100);
        } else {
            $("#DivautoHide").animate({
                "left": "5px"
            }, 100);
        }
    }

    $(document).unbind("touchmove mousemove", _this.onTouchMove);
}

ChassiFloatButton.prototype.show = function() {
    var btnDiv = $("#DivautoHide");
    var _this = this;

    if (btnDiv.attr('id') == undefined) {

        var div = $("<div>", {
            id: "DivautoHide"
        });

        div.addClass('ab-menu-float');
        div.css('height', '0px');
        div.css('width', '0px');
        div.css('background-color', 'white');
        div.css('border', '1px solid #cacaca');
        div.css('border-radius', '54px');
        div.css('cursor', 'pointer');
        div.css('opacity', '0');
        div.css('position', 'fixed');
        div.css('text-align', 'center');
        div.css('z-index', 98);
        div.css('bottom', '10px');
        div.css('left', $(window).width());

        // Evitar Selecao
        div.attr('unselectable', 'on')
        div.css('user-select', 'none')
        div.on('selectstart', false);

        // Fecha botao ao terminar
        div.on("click", function(ev) {
            ev.preventDefault();

            if ($("#DivautoHide").attr("moved") == "false") {
                $("ab-menu").attr("visible", "true");
                _this.hide();
            }
        });

        // Adiciona no html
        $('body').append(div);

        // animacao
        div.animate({
            opacity: "1",
            height: this.size + "px",
            width: this.size + "px",
            'left': ($(window).width() - this.size - 10)
        }, 200, 'linear');

        // // Coloca funcoes
        div.on("touchstart mousedown", function(e) {
            $("#DivautoHide").attr("moved", "false");

            $(document).bind("touchmove mousemove", _this.onTouchMove);

            $("#DivautoHide").animate({
                "opacity": "1"
            }, 100);
        });

        // Quando subir encostar o botao
        div.on("touchend mouseup", function(e) {

            $(document).unbind("touchmove mousemove", _this.onTouchMove);

            _this.setNewPosition(e);
        });

        // Armazena funcao para deixar mais claro o botao
        if (window.btnChassiFull != undefined) {
            window.clearInterval(window.btnChassiFull);
            window.btnChassiFull = undefined;
        }

        // Coloca acao para ficar transparente
        window.btnChassiFull = setInterval(function() {
            var lastTopLeft = parseInt($("#DivautoHide").attr("lastTopLeft"));
            var ol = parseInt($("#DivautoHide").css("left"));
            var ot = parseInt($("#DivautoHide").css("top"));
            var tot = 0;

            if ($("#DivautoHide").css("left") != "auto" && $("#DivautoHide").css("top") != "auto") {
                tot = (ol + ot);
            } else {
                lastTopLeft = 0;
            }

            if (lastTopLeft == tot) {
                $("#DivautoHide").animate({
                    "opacity": "0.5"
                }, 100);
            }

            // Salva ultimo topleft
            $("#DivautoHide").attr("lastTopLeft", tot);

        }, 3000);
    }
}

class AbMenu extends HTMLElement {

    constructor() {
        super();

        this.mainClass = "ab-menu";

        this.state = "closed";
        this.startX = 0;
        this.currentX = 0;
        this.action = 0;
        this.maxTranslate = 0;
        this.currTranslate = 0;
        this.divOpacity = "0.8";
        this.zIndex = "102";
        this.animationTime = "200";
        this.floatButton = new ChassiFloatButton();
        this.isFooterOnBody = null;
        this.isHeaderOnBody = null;
    }

    _render() {
        var height = $(this).attr("height");
        if (height != undefined) {
            $(this).css("height", height);
        } else {
            $(this).css("height", "100%");
        }
    
        var width = $(this).attr("width");
        if (width != undefined) {
            $(this).css("width", width);
        } else {
            $(this).css("width", "200px");
        }

        var height = $(this).attr("height");
        if (height != undefined) {
            $(this).css("height", height);
        } else {
            $(this).css("height", "100%");
        }
    
        var width = $(this).attr("width");
        if (width != undefined) {
            $(this).css("width", width);
        } else {
            $(this).css("width", "200px");
        }
    
        // Verificacao do footer
        this.isFooterOnBody = false
        this.isHeaderOnBody = $("ab-header").parent().is("body");
    
        this.mode3d = this.support3d();
    
        // Configura menu
        $(this).css("zIndex", this.zIndex);
        $(this).css("position", "fixed");
        $(this).css("left", "0px");
        $(this).css("top", "0px");
        $(this).css("overflowY", "auto");
    
        // Ajusta animacoes
        this.maxTranslate = parseFloat($(this).css("width"));
    
        // Abre ou fecha menu
        var visible = $(this).attr("visible");
        if (visible != undefined) {
            this.visible(this, "0", visible);
        } else {
            this.visible(this, "0", "false");
        }
    
        if ($(this).attr("float-button") == "true") {
            $(window).on("resize",function() {
                _this.floatButton.refresh();
            });
        }
    
        if ($(this).attr("touch-move") == "true") {
            var _this = this;
            $(document).on("touchmove mousemove", function(event) {
                _this.mouseMove(event);
                // return false;
            });
    
            $(document).on("touchstart mousedown", function(event) {
                _this.mouseDown(event);
                // return false;
            });
    
            $(document).on("touchend mouseup", function(event) {
                _this.mouseUp(event);
                // return false;
            });
        }
    
        $(this).addClass(this.mainClass);
    }

    _addEvent() {
    }

    connectedCallback() {
        if (!this.classList.contains(this.mainClass)) {
            /*this.shadowDom = this.attachShadow({
                mode: 'open'
            }); */
            this._render();
            this._addEvent();
        }
    }

    static get observedAttributes() {
        return ["visible"];
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName == "visible") {
            this.isFooterOnBody = false
            this.isHeaderOnBody = $("ab-header").parent().is("body");
    
            var visible = $(this).attr("visible");
    
            this.visible(this, this.animationTime, visible);
    
            if ($(this).attr("float-button") == "true") {
                if (visible == "false") {
                    this.floatButton.show();
                } else {
                    this.floatButton.hide();
                }
            }
        }    
    }

    moveX(_this, time, show, translateX) {
        var mode3d = this.support3d();
        var trans = this.getTransform(_this);
        var y = trans[1];
    
        // transicao
        if (mode3d) {
            $(_this).css("transition", "transform " + time + "ms");
            $(_this).css("-o-transition", "-o-transform " + time + "ms");
            $(_this).css("-ms-transition", "-ms-transform " + time + "ms");
            $(_this).css("-moz-transition", "-moz-transform " + time + "ms");
            $(_this).css("-webkit-transition", "-webkit-transform " + time + "ms");
        }
    
        if (show == false) {
            if (mode3d) {
                $(_this).css({
                    "transform": "translate3d(" + (-1 * translateX) + "px," + y + "px,0)",
                    "-webkit-transform": "translate3d(" + (-1 * translateX) + "px," + y + "px,0)",
                    "-moz-transform": "translate3d(" + (-1 * translateX) + "px," + y + "px,0)",
                    "-ms-transform": "translate3d(" + (-1 * translateX) + "px," + y + "px,0)",
                    "-o-transform": "translate3d(" + (-1 * translateX) + "px," + y + "px,0)"
                });
    
            } else {
                if (time == "0") {
                    $(_this).css("left", (-1 * translateX) + "px");
                } else {
                    $(_this).animate({
                        "left": (-1 * translateX) + "px"
                    }, time, function() {});
                }
            }
        } else {
            if (mode3d) {
                $(_this).css({
                    "transform": "translate3d(0," + y + "px,0)",
                    "-webkit-transform": "translate3d(0," + y + "px,0)",
                    "-moz-transform": "translate3d(0," + y + "px,0)",
                    "-ms-transform": "translate3d(0," + y + "px,0)",
                    "-o-transform": "translate3d(0," + y + "px,0)"
                });
    
            } else {
                if (time == "0") {
                    $(_this).css("left", "0px");
                } else {
                    $(_this).animate({
                        "left": "0px"
                    }, time, function() {});
                }
            }
        }
    }
    
    visible(_this, time, visible) {
    
        if (visible != "true") {
            this.currTranslate = 0;
            this.state = "closed";
    
            this.moveX(_this, time, false, this.maxTranslate);
            // this.moveX($("ab-header"), time, false, this.maxTranslate);
    
            if ($(_this).attr("animation") == "push" || $(_this).attr("animation") == "pushAndFit") {
                this.moveX($("ab-page"), time, true, (-1 * this.maxTranslate));
    
                if (this.isHeaderOnBody) {
                    this.moveX($("ab-header"), time, true, (-1 * this.maxTranslate));
                }
    
                if (this.isFooterOnBody) {
                    this.moveX($("ab-page"), time, true, (-1 * this.maxTranslate));
                }
            }
    
            this.removeBlockDiv();
    
            if ($(_this).attr("animation") == "pushAndFit") {
                setTimeout(function() {
                    $("ab-page").css("width", "100%");
                }, time);
            }
        } else {
            this.state = "opened";
            this.currTranslate = this.maxTranslate;
            this.moveX(_this, time, true, "0");
    
            if ($(_this).attr("animation") == "push" || $(_this).attr("animation") == "pushAndFit") {
                this.moveX($("ab-page"), time, false, (-1 * this.maxTranslate));
    
                if (this.isHeaderOnBody) {
                    this.moveX($("ab-header"), time, false, (-1 * this.maxTranslate));
                }
    
                if (this.isFooterOnBody) {
                    this.moveX($("ab-page"), time, false, (-1 * this.maxTranslate));
                }
            }
    
            this.createBlockDiv();
    
            if ($(_this).attr("animation") == "pushAndFit") {
                setTimeout(function() {
                    var w = parseFloat($("ab-menu").css("width"));
                    $("ab-page").css("width", "-webkit-calc(100% - " + w + "px)");
                    $("ab-page").css("width", "-moz-calc(100% - " + w + "px)");
                    $("ab-page").css("width", "-o-calc(100% - " + w + "px)");
                    $("ab-page").css("width", "calc(100% - " + w + "px)");
                }, time);
            }
        }
    }
    
    support3d() {
        var ret = false;
        var supports3DTransforms = document.body.style['webkitPerspective'] !== undefined || document.body.style['MozPerspective'] !== undefined;
        if (supports3DTransforms) {
            ret = true;
        }
        return ret;
    }
    
    getXY(event) {
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
    
    mouseMove(event) {
        event.preventDefault();
        var _this = this;
    
        if (this.action == "move" && (this.state == "closed" || this.state == "opened")) {
    
            var pos = this.getXY(event);
    
            // fecha ou abre
            if (this.state == "closed") {
                this.currTranslate = (this.currentX + this.startX + pos.x);
            } else {
                this.currTranslate = (this.currentX + (pos.x - this.startX));
            }
    
            // deixa o translate no maximo e no minimo
            if (this.currTranslate >= this.maxTranslate) {
                this.currTranslate = this.maxTranslate;
            } else if (this.currTranslate <= 0) {
                this.currTranslate = 0;
            }
    
            var trans = this.getTransform(this);
            var x = parseInt(this.currTranslate);
            var y = trans[1];
            var delta = (x - this.maxTranslate);
    
            // Mudar Left
            if (this.mode3d) {
                $(this).css({
                    "transform": "translate3d(" + delta + "px," + y + "px,0)",
                    "-webkit-transform": "translate3d(" + delta + "px," + y + "px,0)",
                    "-moz-transform": "translate3d(" + delta + "px," + y + "px,0)",
                    "-ms-transform": "translate3d(" + delta + "px," + y + "px,0)",
                    "-o-transform": "translate3d(" + delta + "px," + y + "px,0)"
                });
    
                // move o resto
                if ($(this).attr("animation") == "push" || $(this).attr("animation") == "pushAndFit") {
                    var transPage = this.getTransform($("ab-page"));
                    var yPage = transPage[1];
                    $("ab-page").css({
                        "transform": "translate3d(" + x + "px," + yPage + "px,0)",
                        "-webkit-transform": "translate3d(" + x + "px," + yPage + "px,0)",
                        "-moz-transform": "translate3d(" + x + "px," + yPage + "px,0)",
                        "-ms-transform": "translate3d(" + x + "px," + yPage + "px,0)",
                        "-o-transform": "translate3d(" + x + "px," + yPage + "px,0)"
                    });
    
                    if (this.isHeaderOnBody) {
                        var transPage = this.getTransform($("ab-header"));
                        var yHead = transPage[1];
                        $("ab-header").css({
                            "transform": "translate3d(" + x + "px," + yHead + "px,0)",
                            "-webkit-transform": "translate3d(" + x + "px," + yHead + "px,0)",
                            "-moz-transform": "translate3d(" + x + "px," + yHead + "px,0)",
                            "-ms-transform": "translate3d(" + x + "px," + yHead + "px,0)",
                            "-o-transform": "translate3d(" + x + "px," + yHead + "px,0)"
                        });
                    }
    
                    if (this.isFooterOnBody) {
                        var transPage = this.getTransform($("ab-page"));
                        var yPage = transPage[1];
                        $("ab-page").css({
                            "transform": "translate3d(" + x + "px," + yPage + "px,0)",
                            "-webkit-transform": "translate3d(" + x + "px," + yPage + "px,0)",
                            "-moz-transform": "translate3d(" + x + "px," + yPage + "px,0)",
                            "-ms-transform": "translate3d(" + x + "px," + yPage + "px,0)",
                            "-o-transform": "translate3d(" + x + "px," + yPage + "px,0)"
                        });
                    }
                }
            } else {
    
                // Muda menu com a diferenca do tamanho dele
                var diff = parseFloat($(this).css("width"));
                diff = (x - parseFloat(diff));
                $(this).css("left", diff + "px");
    
                if ($(this).attr("animation") == "push" || $(this).attr("animation") == "pushAndFit") {
                    // muda outros com o x normal
                    $("ab-page").css("left", x + "px");
    
                    if (this.isHeaderOnBody) {
                        $("ab-header").css("left", x + "px");
                    }
    
                    if (this.isFooterOnBody) {
                        $("ab-footer").css("left", x + "px");
                    }
                }
            }
    
            // Arruma tamanho
            if ($(this).attr("animation") == "pushAndFit") {
                var diff = parseFloat($(this).css("width"));
                diff = (x - parseFloat(diff));
    
                $("ab-page").css("width", "-webkit-calc(100% - " + diff + "px)");
                $("ab-page").css("width", "-moz-calc(100% - " + diff + "px)");
                $("ab-page").css("width", "-o-calc(100% - " + diff + "px)");
                $("ab-page").css("width", "calc(100% - " + diff + "px)");
            }
        }
    }
    
    mouseDown(event) {
        var mode3d = this.support3d();
    
        // Verificacao do footer
        this.isFooterOnBody = false;
        this.isHeaderOnBody = $("ab-header").parent().is("body");
    
        if (this.state != "closing" && this.state != "opening") {
            // Pega x y
            var pos = this.getXY(event);
    
            // Pega o start x
            if ((this.state == "closed" && pos.x < 10) || (this.state == "opened" && (pos.x > (this.maxTranslate - (this.maxTranslate / 3))) && pos.x < this.maxTranslate + 40)) {
                event.preventDefault();
    
                // transicao
                if (mode3d) {
                    $(this).css("transition", "none");
                    $(this).css("-o-transition", "none");
                    $(this).css("-ms-transition", "none");
                    $(this).css("-moz-transition", "none");
                    $(this).css("-webkit-transition", "none");
    
                    if (this.isHeaderOnBody) {
                        $("ab-header").css("transition", "none");
                        $("ab-header").css("-o-transition", "none");
                        $("ab-header").css("-ms-transition", "none");
                        $("ab-header").css("-moz-transition", "none");
                        $("ab-header").css("-webkit-transition", "none");
                    }
    
                    if ($(this).attr("animation") == "push" || $(this).attr("animation") == "pushAndFit") {
                        $("ab-page").css({
                            "transition": "none",
                            "-o-transition": "none",
                            "-ms-transition": "none",
                            "-moz-transition": "none",
                            "-webkit-transition": "none"
                        });
                    }
                }
    
                if (this.state == "closed") {
                    this.removeBlockDiv();
                    this.createBlockDiv();
                }
    
                this.startX = pos.x;
                this.currentX = this.currTranslate;
                this.action = "move";
    
            }
        }
    }
    
    mouseUp(event) {
        if (this.action == "move") {
            // Se soltar no meio decide para onde ir
            if (Math.abs(this.currTranslate) < (this.maxTranslate / 2)) {
                if ($(this).attr("visible") == "false") {
                    this.visible(this, this.animationTime, "false");
                } else {
                    $(this).attr("visible", false);
                }
    
            } else {
                if ($(this).attr("visible") == "true") {
                    this.visible(this, this.animationTime, "true");
                } else {
                    $(this).attr("visible", true);
                }
            }
    
            this.action = null;
            this.startX = null;
            this.currentX = null;
        }
    }
    
    removeBlockDiv() {
        if ($("#ab-menu-block-div").length != 0) {
            $("#ab-menu-block-div").css("opacity", "0");
            $("#ab-menu-block-div").css("-webkit-opacity", "0");
            $("#ab-menu-block-div").css("-moz-opacity", "0");
            $("#ab-menu-block-div").css("-ms-opacity", "0");
            $("#ab-menu-block-div").css("-0-opacity", "0");
    
            setTimeout(function() {
                $("#ab-menu-block-div").remove();
            }, this.animationTime);
        }
    }
    
    createBlockDiv(forceOpacity) {
        if ($(this).attr("block-content") == "true") {
            if ($("#ab-menu-block-div").length == 0) {
                var div = $("<div>");
                div.appendTo($("ab-menu").parent());
                div.css("zIndex", (this.zIndex - 1));
                div.attr("id", "ab-menu-block-div");
                div.addClass("ab-menu-block-div");
    
                if ($(this).attr("close-image") != undefined && $(this).attr("close-image") != "") {
                    var imgClose = $("<img>");
                    imgClose.attr("src", $(this).attr("close-image"));
                    imgClose.addClass("ab-menu-block-close");
                    imgClose.appendTo(div);
                }
    
                // animacao de opacidade
                div.css("transition", "opacity " + this.animationTime + "ms linear");
                div.css("-webkit-transition", "-webkit-opacity " + this.animationTime + "ms linear");
    
                div.on("touchstart mousedown", function(event) {
                    // event.preventDefault();
                    // return false;
                });
    
                div.on("touchend mouseup", function(event) {
                    // event.preventDefault();
                    $("ab-menu").attr("visible", "false");
                });
    
                div.on("touchmove mousemove", function(event) {
                    event.preventDefault();
                    // return false;
                });
    
                // Se abrir forcando opacity maxima
                if (forceOpacity) {
                    $(".ab-menu-block-div").css("opacity", this.divOpacity);
                }
            }
            // altera opacidade
            if ($(".ab-menu-block-div").css("opacity") != this.divOpacity) {
                $(".ab-menu-block-div").css("opacity", this.divOpacity);
                $(".ab-menu-block-div").css("-webkit-opacity", this.divOpacity);
                $(".ab-menu-block-div").css("-moz-opacity", this.divOpacity);
                $(".ab-menu-block-div").css("-ms-opacity", this.divOpacity);
            }
        }
    }

    getTransform(el) {
        var prop = "";
    
        if ($(el).css('-webkit-transform') != undefined) {
            prop = $(el).css('-webkit-transform');
        } else if ($(el).css('transform') != undefined) {
            prop = $(el).css('transform');
        } else if ($(el).css('-moz-transform') != undefined) {
            prop = $(el).css('-moz-transform');
        } else if ($(el).css('-ms-transform') != undefined) {
            prop = $(el).css('-ms-transform');
        } else {
            return [0, 0, 0];
        }
    
        var results = prop
            .match(/matrix(?:(3d)\(-{0,1}\d+(?:, -{0,1}\d+)*(?:, (-{0,1}\d+))(?:, (-{0,1}\d+))(?:, (-{0,1}\d+)), -{0,1}\d+\)|\(-{0,1}\d+(?:, -{0,1}\d+)*(?:, (-{0,1}\d+))(?:, (-{0,1}\d+))\))/);
    
        if (!results)
            return [0, 0, 0];
        if (results[1] == '3d')
            return results.slice(2, 5);
    
        results.push(0);
        return results.slice(5, 8);
    }
}
customElements.define("ab-menu", AbMenu);

class AbMenuBtn extends HTMLElement {

    constructor() {
        super();

        this.mainClass = "ab-menu-btn";

    }

    _render() {
        $(this).attr("href", "javascript:void(0)");

        $(this).on("touchstart mousedown", function() {
            if ($("ab-menu").attr("visible") == "true") {
                $("ab-menu").attr("visible", "false");
            } else {
                $("ab-menu").attr("visible", "true");
            }
        });
    
        $(this).addClass(this.mainClass);
    }

    _addEvent() { }

    connectedCallback() {
        if (!this.classList.contains(this.mainClass)) {
            /*this.shadowDom = this.attachShadow({
                mode: 'open'
            }); */
            this._render();
            this._addEvent();
        }
    }

    static get observedAttributes() {
        return [];
    }

    attributeChangedCallback(attrName, oldVal, newVal) { }
}
customElements.define("ab-menu-btn", AbMenuBtn);