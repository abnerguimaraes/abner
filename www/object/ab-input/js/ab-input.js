"use strict";

class AbInput extends HTMLElement {

    constructor() {
        super();

        this.abner = new AbnerUtils();

        this.input = document.createElement("input");
        this.label = document.createElement("label");
        this.span = document.createElement("span");
        this.errorParent = false;

        this.mainClass = "ab-input-underline";

        this._addEvent();
    }

    _render() {

        var id = null;
        if (this.getAttribute("id")) {
            id = this.getAttribute("id");
        } else {
            id = generateID();
            this.setAttribute("id", id);
        };

        //Coloca classe principal do objeto
        this.classList.add(this.mainClass);

        //width
        if (this.hasAttribute("width")) {
            this.style.width = this.getAttribute("width");
        }

        //Obrigatorio checagem abaixo do width
        if (this.hasAttribute("width-on-bigscreen")) {
            if (this.abner.showBigScreen(top.$("body"))) {
                this.style.width = this.getAttribute("width-on-bigscreen");
            }
        }

        //Coloca Input
        this.appendChild(this.input);
        this.input.setAttribute("id", id + "_input");
        this.input.setAttribute("type", "text");

        //onfocus no objeto
        if (this.hasAttribute("onfocus")) {
            this.input.setAttribute("onfocus", this.getAttribute("onfocus"));
        }

        //BugIOS Corrigi bug do cursor na selecao do texto
        if (this.hasAttribute("maxlength")) {
            this.input.setAttribute("maxlength", this.getAttribute("maxlength"));
        } else {
            this.input.setAttribute("maxlength", "100");
        }

        if (this.hasAttribute("placeholder")) {
            this.input.setAttribute("placeholder", this.getAttribute("placeholder"));
        }

        //Coloca Label
        this.appendChild(this.label);
        this.label.setAttribute("id", id + "_label");
        this.label.setAttribute("for", id + "_input");

        if (this.hasAttribute("label")) {
            this.label.innerText = this.getAttribute("label");
        }

        //Coloca mensagem de erro 
        this.span.setAttribute("id", id + "_span");
        if (this.hasAttribute("error")) {
            this.span.innerText = this.getAttribute("error");
            this.classList.add("ab-input-underline-error");
        } else {
            //se tiver descrição
            if (this.hasAttribute("description")) {
                this.span.innerText = this.getAttribute("description");
            }
        }
        this.appendChild(this.span);

        //desabilitar o campo quando o atributo is-disabled é true
        if (this.getAttribute("is-disabled") == "true") {
            this.input.setAttribute("disabled", true);
        }

        //coloca tabindex
        if (this.hasAttribute("tab-index")) {
            this.input.setAttribute("tabindex", this.getAttribute("tab-index"));
        }

        //para qual index vai
        if (this.hasAttribute("goto-tab-index")) {
            this.input.setAttribute("goto-tab-index", this.getAttribute("goto-tab-index"));
        }

        //para qual index vai
        if (this.hasAttribute("stop-tab-index")) {
            this.input.setAttribute("stop-tab-index", this.getAttribute("stop-tab-index"));
        }

        //verifica se tem max width
        if (this.hasAttribute("max-width")) {
            this.style.maxWidth = this.getAttribute("max-width");
        }

        //visivel
        if (this.getAttribute("visible") == "false") {
            //values: true;false
            //description: Define se o componente estará invisível ou não | Boolean | não | |
            this.style.display = "none";
        }

        /*if (this.hasAttribute("value")) {
            this.innerText = this.getAttribute("value");
        };*/
    }

    _addEvent() {
        var input = $(this.input);
        var _this = this;

        input.on("focus", function () {
            //Arruma scroll no mobile quando sobe o teclado para ANDROID
            setTimeout(function () {
                _this.scrollIntoView();
            }, 500);

            _this.classList.add("ab-input-underline-min");
            _this.classList.add("ab-input-underline-focus");

            //Chama a funcao que colocou no onfocus
            if (this.hasAttribute("onfocus")) {
                var fn = window[this.getAttribute("onfocus")];
                if (typeof fn === 'function') {
                    fn.call($(this));
                }
            }
        });

        input.on("blur", function () {
            _this.classList.remove("ab-input-underline-focus");
            //Triga as validações
            if (!_this.hasAttribute("thousand-mask")) {
                _this.setAttribute("cancel-onchange", "true");
            };
            $(this).trigger("change");

            //Chama a funcao que colcou no onblur
            if (_this.hasAttribute("onblur")) {
                var fn = window[_this.getAttribute("onblur")];
                if (typeof fn === 'function') {
                    fn.call($(_this));
                }
            }
        });

        //Ir para o próximo item quando apertar enter
        input.on("keydown", function (event) {
            var key = event.keyCode ? event.keyCode : event.which;
            //var shift = !!event.shiftKey;
            var max = 0
            var len = _this.input.value.length;
            if (this.hasAttribute("maxlength")) {
                max = this.getAttribute("maxlength");
                if (len > max) {
                    return;
                }
            } else {
                if (key == 13 || key == 9) {
                    return goToNextTabindex(event, $(this), "tap");
                }
            }
        });

        //evento change quando alterar o valor do input
        input.on("change", function (e) {
            e.preventDefault();
            e.stopPropagation();

            //Sobe ou nao o label caso tenha algum valor
            if (this.value.length == 0) {
                _this.classList.remove("ab-input-underline-min");
            } else {
                _this.classList.add("ab-input-underline-min");
            }

            //verifica se o campo é obrigatório
            if (_this.getAttribute("is-required") == "true" && !_this.errorChild) {
                //values: true;false
                if (this.value.length == 0) {
                    _this.setAttribute("error", "Campo obrigatório");
                    _this.errorParent = true;
                } else {
                    _this.removeAttribute("error");
                    _this.errorParent = false;
                    _this.span.innerText = _this.getAttribute("description");
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

        // $(this).on("change", function (e) {
        //     $(_this.input).trigger("change");
        // });
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
        return ["id", "error", "is-disabled", "label", "width", "maxlength", "width-on-bigscreen", "tab-index", "goto-tab-index", "value", "visible"];
    }

    attributeChangedCallback(attrName, oldVal, newVal) {

        switch (attrName) {
            case "error":
                if (newVal != undefined && newVal != null) {
                    this.span.innerText = newVal;
                    this.classList.add("ab-input-underline-error");
                    this.errorParent = true;
                }

                if (newVal == null || newVal == "") {
                    this.classList.remove("ab-input-underline-error");
                    this.errorParent = false;
                    this.span.innerText = "";
                    if (this.hasAttribute("description")) {
                        this.span.innerText = this.getAttribute("description");
                    }
                }
                break;

            case "is-disabled":
                //quando o atributo is-disabled é alterado, adiciona ou retira a classe underline-min
                if (newVal == "true") {
                    if (this.input.value.length > 0) {
                        this.classList.add("ab-input-underline-min");
                    }
                    this.input.setAttribute("disabled", true);
                } else {
                    if (this.input.value.length == 0) {
                        this.classList.remove("ab-input-underline-min");
                    }
                    this.input.removeAttribute("disabled");
                }
                break;

            case "label":
                this.label.innerText = newVal;
                break;

            case "id":
                this.label.setAttribute("for", newVal + "_input");
                this.label.setAttribute("id", newVal + "_label");
                this.input.setAttribute("id", newVal + "_input");
                this.span.setAttribute("id", newVal + "_span");
                break;

            case "maxlength":
                this.input.setAttribute("maxlength", newVal);
                break;

            case "width":
                this.style.width = newVal;
                break;

            case "width-on-bigscreen":
                if (this.abner.showBigScreen(top.$("body"))) {
                    this.style.width = newVal;
                }
                break;

            case "tab-index":
                this.input.setAttribute("tabindex", newVal);
                break;

            case "goto-tab-index":
                this.input.setAttribute("goto-tab-index", newVal);
                break;

            /*case "value":
                this.input.value = newVal;
                break;*/

            case "visible":
                if (newVal == "true") {
                    this.style.display = "inline-block";
                } else if (newVal == "false") {
                    this.style.display = "none";
                }
                break;

            default:
                break;
        }
    }

    setText(text) {
        if (this.classList.contains("ab-input-date-underline")) {
            this.setDate(text);
        } else {
            this.input.value = text;
        }

        $(this.input).change();
    }

    getText() {
        if (this.classList.contains("ab-input-date-underline")) {
            return this.getDate();
        } else {
            return this.input.value;
        }
    }

    setNumber(text) {
        this.input.value = text;

        $(this.input).change();
    }

    getNumber() {
        return this.input.value;
    }
}

customElements.define('ab-input', AbInput);