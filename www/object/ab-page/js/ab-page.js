"use strict";

$.fn.incrementRequest = function () {
    var curr = 0;
    if (this.attr("current-request")) {
        curr = parseInt(this.attr("current-request"));
    }

    curr++;
    this.attr("current-request", curr);
}

$.fn.resetRequest = function () {
    this.removeAttr("current-request");
}

class AbPage extends HTMLElement {

    constructor() {
        super();

        this.htmlObj = $("html,body")[0];

        //pageLoader
        this.pageLoad = document.createElement("div");
        this.wrapper = document.createElement("div");
        this.loadBar = document.createElement("div");
        this.barRange = document.createElement("div");
        this.loadText = document.createElement("p");

        this.mainClass = "ab-page";
    }

    _render() {
        this.classList.add(this.mainClass);

        //Cria um id
        if (!this.hasAttribute("id")) {
            //description: Atributo para identificar o objeto| Alfanumérico| não| vazio|
            this.setAttribute("id", generateID());
        }

        // parametros
        if (this.getAttribute("fullscreen") != "false") {
            //values: true;false
            //description: Usa o tamanho total da tela | true ou false | não | true |
            this.htmlObj.style.margin = "0px";
            this.htmlObj.style.padding = "0px";
            this.htmlObj.style.width = "100%";
            this.htmlObj.style.height = "100%";

            this.style.top = "0px";
            this.style.left = "0px";
            this.style.bottom = "0px";
            this.style.right = "0px";
            this.style.height = "100%";
            this.style.width = "100%";
            this.style.position = "fixed";
        }

        // Valor padrao
        this.style.zIndex = "0";

        //se existir um max-request, construir o sistema de load
        if (this.hasAttribute("max-request")) {
            //description: Máximo de requests que terá na página para o loader | Numérico | não | 0 |
            this._createLoader();
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
        return ["loader-visibility", "current-request"];
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName == "loader-visibility") {
            if (newVal != "true") {
                $(this.logo).fadeOut(100, function () {
                    this.remove();
                });

                $(this.pageLoad).fadeOut(100, function () {
                    this.remove();
                });
            } else if (this.pageLoad.length == 0) {
                this._createLoader();
            } else {
                $(this.pageLoad).fadeIn(100);
            }

        } else if (attrName == "current-request") {
            var reqAtual = parseInt(newVal);
            var reqMax = parseInt(this.getAttribute("max-request"));
            var total = ((100 / reqMax) * reqAtual);

            this.barRange.style.width = total + "%";

            if (total >= 100) {
                this.setAttribute("loader-visibility", "false");
                document.querySelector("html").classList.add("html-page-loaded");
            }

            reqAtual = null;
            reqMax = null;
            total = null;
        }
    }

    _createLoader() {

        this.pageLoad.classList.add("ab-page-loader");
        this.pageLoad.setAttribute("id", "ab-page-loader");
        this.pageLoad.style.display = "block";
        this.appendChild(this.pageLoad);

        this.wrapper.classList.add("ab-page-loader-wrapper");
        this.pageLoad.appendChild(this.wrapper);

        this.loadBar.classList.add("ab-page-loader-path");
        this.wrapper.appendChild(this.loadBar);

        this.barRange.classList.add("ab-page-loader-range");
        this.barRange.setAttribute("id", "ab-page-loader-range");
        this.loadBar.appendChild(this.barRange);

        this.loadText.classList.add("ab-page-loader-text");
        this.loadText.innerText = "Aguarde";
        this.wrapper.appendChild(this.loadText);
    }
}
customElements.define('ab-page', AbPage);