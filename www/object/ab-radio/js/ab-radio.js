"use strict";

class AbRadio extends HTMLElement {

    constructor() {
        super();

        this.radioinput = document.createElement("input");
        this.radio = document.createElement("div");
        this.spanLabel = document.createElement("span");
        this.spanSubtitle = document.createElement("span");

        this.mainClass = "ab-radio";

    }

    _render() {
        //coloca classe
        this.classList.add(this.mainClass);

        //Cria um id
        let id = generateID();
        if (this.hasAttribute("id")) {
            //description: Identificação do campo. Atributo obrigatório para interagir com o input| Alfanumérico| sim| randomico |
            id = this.getAttribute("id");
        } else {
            this.setAttribute("id", id);
        }

        //armazena o conteúdo passado no html
        let conteudo = this.innerHTML;
        this.innerHTML = "";

        //Coloca os atributos no objeto
        if (this.hasAttribute("width")) {
            //description: Largura do input.| Alfanumérico| não| 100%|
            this.style.width = this.getAttribute("width");
            this.style.maxWidth = this.getAttribute("width");
        }

        //Obrigatorio checagem abaixo do width
        if (this.hasAttribute("width-on-bigscreen")) {
            //description: Largura do componente em telas maiores| % ou px| não| |
            if (abner.utils.showBigScreen(top.$("body"))) {
                this.style.width = this.getAttribute("width-on-bigscreen");
            }
        }

        //Cria check
        this.radioinput.classList.add("ab-radio-input");
        this.radioinput.setAttribute("type", "radio");
        this.radioinput.setAttribute("name", this.getAttribute("name"));
        this.radioinput.setAttribute("id", id + "rd_radioinput");
        this.appendChild(this.radioinput);

        //Cria objeto
        this.radio.classList.add("ab-radio-radiospace");
        this.radio.setAttribute("id", id + "rd_radio");
        this.appendChild(this.radio);

        //insere o conteúdo no objeto
        this.spanLabel.classList.add("ab-radio-title");
        this.spanLabel.setAttribute("content-area", "true")
        this.spanLabel.setAttribute("id", id + "rd_label");
        if (conteudo) {
            this.spanLabel.innerHTML = conteudo;
        } else {
            if (this.hasAttribute("label")) {
                //description: Label do componente |  | não | |
                this.spanLabel.innerText = this.getAttribute("label");
            }
        }
        this.appendChild(this.spanLabel);

        this.spanSubtitle.classList.add("ab-radio-subtitle");
        this.spanSubtitle.setAttribute("id", id + "rd_subtitle");
        this.spanSubtitle.innerText = this.getAttribute("subtitle");
        this.appendChild(this.spanSubtitle);

        //Define se deverá ser alinhado a direita
        if (this.hasAttribute("position") == "right") {
            //values: left;right
            //description: Posição do input| Position| não| left|
            this.style.float = this.getAttribute("position");
            this.style.paddingRight = "15px";
            this.radio.style.textAlign = "right";
        }

        if (this.getAttribute("is-disabled") == "true") {
            //values: true;false
            //description: Desabilita o campo para alteração.| String| não| vazio|
            this.radio.setAttribute("disabled", "disabled");
            this.classList.add("ab-radio-disabled");
        }

        //verifica se tem max width
        if (this.hasAttribute("max-width")) {
            //description: Largura máxima| px | não| vazio|
            this.style.maxWidth = this.getAttribute("max-width");
        }

        if (this.hasAttribute("subtitle")) {
            //description: Subtitulo do componente| Boolean| não| false|
            this.spanSubtitle.innerText = this.getAttribute("subtitle");
        }

        if (this.getAttribute("is-checked") == "true") {
            //values: true;false
            //description: Define se o input estará selecionado ou não| Boolean| não| false|
            this.radioinput.setAttribute("checked", true);
        }

        //Limpa variaveis
        id = null;
        conteudo = null;
    }

    _addEvent() {
        var _this = this;
        $(this).on("tap", function (e) {
            e.preventDefault();

            if (_this.getAttribute("is-disabled") != "true") {
                _this.radioinput.checked = true;

                if (_this.hasAttribute("onchange")) {
                    var fn = window[_this.getAttribute("onchange")];
                    if (typeof fn === 'function') {
                        fn.call($(_this));
                    }
                }
            };
        });
    }

    connectedCallback() {
        if (!this.classList.contains(this.mainClass)) {
            /*this.shadowDom = this.attachShadow({ mode: 'open' }); */
            this._render();
            this._addEvent();
        }
    }

    static get observedAttributes() {
        return ["is-disabled", "width", "width-on-bigscreen", "id", "subtitle", "label", "name", "is-checked"];
    }

    attributeChangedCallback(attrName, oldVal, newVal) {

        switch (attrName) {
            case "is-disabled":
                if (newVal == "true") {
                    this.radio.setAttribute("disabled", "disabled");
                    this.classList.add("ab-radio-disabled");
                } else {
                    this.radio.removeAttribute("disabled");
                    this.classList.remove("ab-radio-disabled");
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
                this.radioinput.setAttribute("id", newVal + "rd_radioinput");
                this.radio.setAttribute("id", newVal + "rd_radio");
                this.spanLabel.setAttribute("id", newVal + "rd_label");
                this.spanSubtitle.setAttribute("id", newVal + "rd_subtitle");
                break;
        
            case "subtitle":
                this.spanSubtitle.innerText = newVal;
                break;
        
            case "label":
                this.spanLabel.innerText = newVal;
                break;
        
            case "name":
                this.radioinput.setAttribute("name", newVal);
                break;
        
            case "is-checked":
                if (newVal == "true") {
                    this.radioinput.checked = true;
                }
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
            this.radioinput.checked = true;
        } else {
            this.radioinput.checked = false;
        }

    }

    getNumber() {

        if (this.radioinput.checked == true) {
            return "1";
        } else {
            return "0";
        }
    }
}
customElements.define("ab-radio", AbRadio);