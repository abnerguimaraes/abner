"use strict";

class AbHeader extends HTMLElement {

    constructor() {
        super();

        this.img = document.createElement("img");

        this.mainClass = "ab-header";
    }

    _render() {
        // ADICIONA CLASSE PADRAO
        this.classList.add(this.mainClass);

        //Gera novo id
        var id = generateID();
        if (this.hasAttribute("id")) {
            //description: Identificação do objeto, com prefixo "head" | Alfanumérico | sim | randômico |
            id = this.getAttribute("id");
        } else {
            this.setAttribute("id", id);
        }

        //coloca o menu
        this.img.classList.add("ab-header-menu");
        this.img.setAttribute("src", "object/ab-menu/img/open-menu.svg");
        this.appendChild(this.img);

        // parametros
        if (this.hasAttribute("height")) {
            //description: Seta altura| Número com px ou %| não| 50px|
            this.style.height = this.getAttribute("height");
        } else {
            this.style.height = "55px";
        }

        if (this.hasAttribute("width")) {
            //description: Seta largura| Número com px ou %| não| 100%|
            this.style.width = this.getAttribute("width");
        } else {
            this.style.width = "100%";
        }

        // MOSTRA OU NAO MOSTRA
        if (this.hasAttribute("visible")) {
            //values: true;false
            //description: Mostra ou esconde objeto | Boolean | não| true|
            this.setAttribute("visible", this.getAttribute("visible"));
        } else {
            this.setAttribute("visible", "true");
        }
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
        return ["visible", "position-fixed", "width", "height"];
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName == "visible") {
            if (newVal && (newVal == true || newVal == "true")) {
                this.style.display = "block";
            } else {
                this.style.display = "none";
            }

            this.fixContent();

        } else if (attrName == "position-fixed") {
            // Posicao
            this.fixContent();

        } else if (attrName == "width") {
            this.style.width = newVal;

        } else if (attrName == "height") {
            this.style.height = newVal;
        }
    }

    fixContent() {
        var page = $("body").children("ab-page");
        var content = page.children("ab-page");
        var objHeader = page.children("ab-header");
        var objFooter = page.children("ab-footer");

        var totalH = 0;
        var over = false; //verifica se muda o overflow

        //calcula a diferenca do header 
        if (objHeader.length == 1 && objHeader.attr("position-fixed") == "true" && objHeader.attr("visible") == "true") {
            totalH += parseFloat(objHeader.height());
            over = true;

        } else if (objHeader.attr("visible") == "true") {
            totalH += parseFloat(objHeader.height());
        }

        if (objFooter.length == 1 && objFooter.attr("position-fixed") == "true" && objFooter.attr("visible") == "true") {
            totalH += parseFloat(objFooter.css("height"));
            over = true;

        } else if (objFooter.attr("visible") == "true") {
            totalH += parseFloat(objFooterobjFooter.height());
        }

        if (over) {
            content.css("overflow-y", "auto");
        } else {
            content.css("overflow-y", "initial");
        }

        //arruma content
        content.css("height", "-webkit-calc(100% - " + totalH + "px)");
        content.css("height", "-moz-calc(100% - " + totalH + "px)");
        content.css("height", "-o-calc(100% - " + totalH + "px)");
        content.css("height", "calc(100% - " + totalH + "px)");

        //apaga variaveis
        page = null;
        content = null;
        objHeader = null;
        objFooter = null;
    }
}
customElements.define('ab-header', AbHeader);