"use strict";

$(document).ready(function () {
    $(window).on("resize", function () {
        $("ab-page").find("ab-checkbox").each(function () {
            if ($(this).attr("width-on-bigscreen")) {
                if ($(this).attr("width")) {
                    $(this).css("width", $(this).attr("width"));
                } else {
                    $(this).css("width", "100%");
                }
            }
        });
    });
});

class AbCheckbox extends HTMLElement {

    constructor() {
        super();

        this.checkspace = document.createElement("div");
        this.spanLabel = document.createElement("span");
        this.spanSubtitle = document.createElement("span");

        this.mainClass = "ab-checkbox";

        this._addEvent();
    }

    _render() {
        //coloca classe
        this.classList.add(this.mainClass);

        //Cria um id
        let id = generateID();
        if (this.hasAttribute("id")) {
            //description: Define se a checkbox já estará selecionada| Boolean | não| false|
            id = this.getAttribute("id");
        } else {
            this.setAttribute("id", id);
        }

        //armazena o conteúdo passado no html
        let conteudo = this.innerHTML;
        this.innerHTML = "";

        //Coloca os atributos no objeto
        if (this.hasAttribute("width")) {
            //description: Largura do componente (afeta somente o espaço que terá para text, não altera o tamanho da checkbox)| % ou px| não| 100%|
            this.style.width = this.getAttribute("width");
            this.style.maxWidth = this.getAttribute("width");
        }

        //Obrigatorio checagem abaixo do width
        if (this.hasAttribute("width-on-bigscreen")) {
            //description: Define a largura do compenente em telas maiores (afeta somente o espaço que terá para text, não altera o tamanho da checkbox)| % ou px| não| |
            if (abner.utils.showBigScreen(top.$("body"))) {
                this.style.width = this.getAttribute("width-on-bigscreen");
            }
        }

        //Cria check
        this.checkspace.classList.add("ab-checkbox-checkspace");
        this.checkspace.setAttribute("id", id + "chk_checkbox");
        this.appendChild(this.checkspace);

        //insere o conteúdo no objeto
        this.spanLabel.classList.add("ab-checkbox-title");
        this.spanLabel.setAttribute("content-area", "true")
        this.spanLabel.setAttribute("id", id + "chk_label");
        if (conteudo) {
            this.spanLabel.innerHTML = conteudo;
        } else {
            if (this.hasAttribute("label")) {
                //description: Label do componente |  | não | |
                this.spanLabel.innerText = this.getAttribute("label");
            }
        }
        this.appendChild(this.spanLabel);

        this.spanSubtitle.classList.add("ab-checkbox-subtitle");
        this.spanSubtitle.setAttribute("id", id + "chk_subtitle");
        this.spanSubtitle.innerText = this.getAttribute("subtitle");
        this.appendChild(this.spanSubtitle);

        //Define se deverá ser alinhado a direita
        if (this.getAttribute("position") == "right") {
            //values: left;right
            //description: Define para onde estará posicionado o checkbox| Posição | não| left|
            this.style.float = this.getAttribute("position");
            this.style.paddingRight = "15px";
        }

        if (this.getAttribute("is-disabled") == "true") {
            //values: true;false
            //description: Define se a checkbox estará desativada| Boolean | não| false|
            this.checkspace.setAttribute("disabled", "disabled");
            this.classList.add("ab-checkbox-disabled");
        }

        //verifica se tem max width
        if (this.hasAttribute("max-width")) {
            //description: Largura máxima do componente | % ou px | não | |
            this.style.maxWidth = this.getAttribute("max-width");
        }

        if (this.hasAttribute("subtitle")) {
            //description: Subtitulo do componente |  | não | |
            this.spanSubtitle.innerText = this.getAttribute("subtitle");
        }

        //Limpa variaveis
        id = null;
        conteudo = null;
    }

    _addEvent() {
        let _this = this;
        $(this).on("tap", function (e) {
            e.preventDefault();

            if (_this.getAttribute("is-disabled") == "false" || !_this.hasAttribute("is-disabled")) {
                if (_this.getAttribute("is-checked") == "true") {
                    _this.setAttribute("is-checked", "false");
                } else {
                    _this.setAttribute("is-checked", "true");
                }
            }

            //Chama a funcao
            if (_this.hasAttribute("onvalidate")) {
                let fn = window[_this.getAttribute("onvalidate")];
                if (typeof fn === 'function') {
                    fn.call($(_this));
                } else {
                    fn = new Function(_this.getAttribute("onvalidate"));
                    fn.call($(_this));
                }
            }
        });
    }

    connectedCallback() {
        if (!this.classList.contains(this.mainClass)) {
            /*this.shadowDom = this.attachShadow({ mode: 'open' }); */
            this._render();
        }
    }

    static get observedAttributes() {
        return ["is-disabled", "is-checked", "width", "width-on-bigscreen", "id", "subtitle", "label"];
    }

    attributeChangedCallback(attrName, oldVal, newVal) {

        switch (attrName) {
            case "is-disabled":
                if (newVal == "true") {
                    this.checkspace.setAttribute("disabled", "disabled");
                    this.classList.add("ab-checkbox-disabled");
                } else {
                    this.checkspace.removeAttribute("disabled");
                    this.classList.remove("ab-checkbox-disabled");
                }
                break;

            case "is-checked":
                //Quando is-disable = true, desabilita o botão
                if (newVal == "true") {
                    this.classList.remove("ab-checkbox-checkspace-middle");
                    this.classList.add("ab-checkbox-checkspace-checked");
                } else if (newVal == "neutral") {
                    this.classList.remove("ab-checkbox-checkspace-checked");
                    this.classList.add("ab-checkbox-checkspace-middle");
                } else {
                    this.classList.remove("ab-checkbox-checkspace-middle");
                    this.classList.remove("ab-checkbox-checkspace-checked");
                }

                if (this.getAttribute("cancel-callback") != "true") {
                    if (this.hasAttribute("onchange")) {
                        let fn = window[this.getAttribute("onchange")];
                        if (typeof fn === 'function') {
                            fn.call($(this));
                        }
                    }
                }
                break;

            case "width":
                this.style.width = newVal;
                break;

            case "width-on-bigscreen":
                if (abner.utils.showBigScreen(top.$("body"))) {
                    this.style.width = newVal;
                }
                break;

            case "id":
                this.checkspace.setAttribute("id", newVal + "chk_checkbox");
                this.spanLabel.setAttribute("id", newVal + "chk_label");
                this.spanSubtitle.setAttribute("id", newVal + "chk_subtitle");
                break;

            case "subtitle":
                this.spanSubtitle.innerText = newVal;
                break;

            case "label":
                this.spanLabel.innerHTML = newVal;
                break;

            default:
                break;
        }
    }

    setText(text) {
        this.spanLabel.innerHTML = text;
    }

    getText() {
        return this.spanLabel.innerText;
    }

    setNumber(text) {
        if (text == 1 || text == true) {
            this.setAttribute("is-checked", "true");
        } else {
            this.setAttribute("is-checked", "false");
        }
    }

    getNumber() {
        if (this.getAttribute("is-checked") == "true") {
            return "1";
        } else if ($(this).attr("is-checked") == "false") {
            return "0";
        }
    }
}
customElements.define("ab-checkbox", AbCheckbox);