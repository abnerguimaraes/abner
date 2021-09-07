"use strict";

class AbTextAreaUnderline extends HTMLElement {

    constructor() {
        super();

        this.textarea = document.createElement("textarea");
        this.label = document.createElement("label");
        this.span = document.createElement("span");

        this.mainClass = "ab-text-area-underline";

        this._addEvent();
    }

    _render() {
        //Cria um id
        var id = generateID();
        if (this.hasAttribute("id")) {
            id = this.getAttribute("id");
        } else {
            this.setAttribute("id", id);
        }

        //coloca classe
        this.classList.add(this.mainClass);

        if (!this.hasAttribute("max-rows")) {
            this.setAttribute("max-rows", "20");
        }

        //width
        if (this.hasAttribute("width")) {
            //description: Define a largura do componente | % ou px | não | 100% |
            this.style.width = this.getAttribute("width");
        }

        //Obrigatorio checagem abaixo do width
        if (this.hasAttribute("width-on-bigscreen")) {
            if (pmb.utils.showBigScreen(top.$("body"))) {
                this.style.width = obj.attr("width-on-bigscreen");
            }
        }

        //Coloca Textarea
        this.appendChild(this.textarea);
        this.textarea.setAttribute("id", id + "txa_input");

        //onfocus no objeto
        if (this.hasAttribute("onfocus")) {
            this.textarea.setAttribute("onfocus", this.getAttribute("onfocus"));
        }

        if (this.hasAttribute("maxlength")) {
            //description: Define a quantidade máxima de caracteres a ser digitado no campo | numeric | não | 
            this.textarea.setAttribute("maxlength", this.getAttribute("maxlength"));
        }

        if (this.hasAttribute("rows")) {
            //description: Define a quantidade de linhas da exibição do campo | numeric | não | 1 |
            this.textarea.setAttribute("rows", this.getAttribute("rows"));
        } else {
            this.textarea.setAttribute("rows", "1");
        }

        //Coloca label
        this.appendChild(this.label);
        this.label.setAttribute("id", id + "txa_label");
        this.label.setAttribute("for", id + "txa_input");

        if (this.hasAttribute("label")) {
            //description: Define o texto que será apresentado como label do campo | varchar | não | |
            this.label.innerText = this.getAttribute("label");
        };

        //Coloca mensagem de erro 
        this.appendChild(this.span);
        this.span.setAttribute("id", id + "txa_span");

        if (this.hasAttribute("error")) {
            //description: Define mensagem de erro caso o campo esteja inválido | varchar | não | |
            this.span.innerText = this.getAttribute("error");
            this.classList.add("ab-text-area-underline-error");
        }

        //desabilitar o campo quando o atributo is-disabled é true
        if (this.getAttribute("is-disabled") == "true") {
            //values: true;false
            //description: Define se o campo estará desativado | true ou false | não | false |
            this.textarea.setAttribute("disabled", true);
        }

        if (this.hasAttribute("max-width")) {
            //description: Define a largura máxima do componente | % ou px | não | 100% |
            this.style.maxWidth = this.getAttribute("max-width");
        }

        //coloca tabindex
        if (this.hasAttribute("tab-index")) {
            //description: Ordem de tabulação na página.| Numérico| não| vazio|
            this.textarea.setAttribute("tabindex", this.getAttribute("tab-index"));
        }

        //para qual index vai
        if (this.hasAttribute("goto-tab-index")) {
            this.textarea.setAttribute("goto-tab-index", this.getAttribute("goto-tab-index"));
        }

        //para qual index vai
        if (this.hasAttribute("stop-tab-index")) {
            this.textarea.setAttribute("stop-tab-index", this.getAttribute("stop-tab-index"));
        }

        /*
        DATA BINDING
        WORK IN PROGRESS
        USE AT YOUR OWN RISK
        BE AWARE OF DRAGONS
        - GABS 02/10/2019
        */

        if (this.hasAttribute("data-binding-obj")) {
            this.createDataBinding();
        }

    }

    _addEvent() {
        var textarea = $(this.textarea);
        var _this = this;

        textarea.on("keyup", function (event) {
            if (_this.getAttribute("auto-height") == "true") {
                while ($(this)[0].scrollHeight > $(this)[0].offsetHeight) {
                    var rows = this.getAttribute("rows");
                    var maxRow = _this.getAttribute("max-rows");
                    rows++;
                    if (rows >= maxRow) {
                        break
                    } else {
                        this.setAttribute("rows", rows);
                    }
                }
            }

            //Ir para o próximo item quando apertar enter
            return goToNextTabindex(event, $(this), "focus");
        });

        textarea.on("blur", function () {
            //BugIOS Retira a marcacao do foco
            _this.removeAttribute("focus-executed");

            //Triga as validações
            _this.setAttribute("cancel-onchange", "true");
            $(this).trigger("change");

            //Chama a funcao que colcou no onblur
            if (_this.hasAttribute("onblur")) {
                var fn = window[_this.getAttribute("onblur")];
                if (typeof fn === 'function') {
                    fn.call($(_this));
                }
            }
        });

        textarea.on("focus", function (e) {
            //BugIOS
            if (_this.getAttribute("focus-executed") == "true") {
                return false;
            }
            _this.setAttribute("focus-executed", "true");

            e.preventDefault();
            e.stopPropagation();

            if (_this.getAttribute("is-disabled") != "true") {
                //Coloca foco no input
                _this.classList.add("ab-text-area-underline-min");

                $(this).setCursorPosition($("textarea")[0].value.length);

                //Arruma scroll no mobile quando sobe o teclado para ANDROID
                if (window.isAndroid) {
                    setTimeout(function () {
                        _this.scrollIntoView();
                    }, 500);
                }
            }

            //Chama a funcao que colocou no onfocus
            if (_this.hasAttribute("onfocus")) {
                var fn = window[_this.getAttribute("onfocus")];
                if (typeof fn === 'function') {
                    fn.call($(_this));
                }
            }
        });

        //evento change quando alterar o valor do input
        textarea.on("change", function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (this.value == "" || this.value == null) {
                if (_this.getAttribute("focus-executed") != "true") {
                    _this.classList.remove("ab-text-area-underline-min");
                }

                if (_this.hasAttribute("rows")) {
                    this.setAttribute("rows", _this.getAttribute("rows"));
                } else {
                    this.setAttribute("rows", "1");
                }
            } else {
                _this.classList.add("ab-text-area-underline-min");
            }

            //verifica se o campo é obrigatório
            if (_this.getAttribute("is-required") == "true") {
                //values: true;false
                //description: Define se o campo será obrigatório | true ou false | não | false |
                if (this.value.length == 0) {
                    _this.setAttribute("error", "Campo obrigatório");
                } else {
                    _this.removeAttribute("error");
                }
            }

            //se tiver ajuste
            if (_this.getAttribute("auto-height") == "true") {
                while ($(this)[0].scrollHeight > $(this)[0].offsetHeight) {
                    var rows = this.getAttribute("rows");
                    var maxRow = _this.getAttribute("max-rows");
                    rows++;
                    this.setAttribute("rows", rows);
                    if (rows >= maxRow) {
                        break
                    }
                }
            }

            //Chama a funcao que colcou no onblur
            if (_this.hasAttribute("onchange") && _this.getAttribute("cancel-onchange") != "true") {
                var fn = window[_this.getAttribute("onchange")];
                if (typeof fn === 'function') {
                    fn.call($(_this));
                }
            }
            _this.removeAttribute("cancel-onchange");

            //Chama a funcao que colcou no onblur
            if (_this.hasAttribute("onvalidate")) {
                var fn = window[_this.getAttribute("onvalidate")];
                if (typeof fn === 'function') {
                    fn.call($(_this));
                }
            }
        });
    }

    connectedCallback() {
        if (!this.classList.contains(this.mainClass)) {
            /*this.shadowDom = this.attachShadow({
                mode: 'open'
            }); */
            this._render();
        }
    }

    static get observedAttributes() {
        return ["error", "is-disabled", "label", "id", "width", "maxlength", "rows"];
    }

    attributeChangedCallback(attrName, oldVal, newVal) {

        switch (attrName) {
            case "error":
                if (newVal != undefined && newVal != null) {
                    this.span.innerText = newVal;
                    this.classList.add("ab-text-area-underline-error");

                    /*if (this.hasAttribute("error-icon")) {
                        obj.children("#" + id + "txa_img").attr("src", obj.attr("error-icon"));
                    }*/
                } else {
                    this.classList.remove("ab-text-area-underline-error");
                    this.span.innerText = "";

                    /*if (obj.attr("icon")) {
                        obj.children("#" + id + "txa_img").attr("src", obj.attr("icon"));
                    }*/
                }
                break;

            case "is-disabled":
                //quando o atributo is-disabled é alterado, adiciona ou retira a classe underline-min
                if (newVal == "true") {
                    this.classList.add("ab-text-area-underline-min");
                    this.textarea.setAttribute("disabled", true);
                } else {
                    if (this.textarea.value == "") {
                        this.classList.remove("ab-text-area-underline-min");
                    }
                    this.textarea.removeAttribute("disabled");
                }
                break;

            case "label":
                this.label.innerText = newVal;
                break;

            case "id":
                this.textarea.setAttribute("id", newVal + "txa_input");
                this.label.setAttribute("for", newVal + "txa_input");
                this.label.setAttribute("id", newVal + "txa_label");
                this.span.setAttribute("id", newVal + "txa_span");
                break;

            case "width":
                this.style.width = newVal;
                break;

            case "maxlength":
                this.textarea.setAttribute("maxlength", newVal);
                break;

            case "rows":
                this.textarea.setAttribute("rows", newVal);
                break;

            case "data-binding-obj":
                this.createDataBinding(obj);
                break;
        
            default:
                break;
        }
    }

    createDataBinding() {

        new pmb.utils.DataBinding({
            object: this.getAttribute("data-binding-obj")
        })
        .addBinding(this.textarea, "value", "change");

    }

    setText(text) {
        this.textarea.value = text;
        if (text.length > 0) {
            this.classList.add("ab-text-area-underline-min");
        }
    }

    getText() {
        return this.textarea.value;
    }
}

customElements.define('ab-text-area-underline', AbTextAreaUnderline);