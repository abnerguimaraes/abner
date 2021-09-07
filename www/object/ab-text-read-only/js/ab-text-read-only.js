"use strict";

class AbTextReadOnly extends HTMLElement {

    constructor() {
        super();

        this.label = document.createElement("legend");
        this.text = document.createElement("p");

        this.mainClass = "ab-text-read-only";
    }

    _render() {
        //Cria um id
        var id = generateID();
        if (this.hasAttribute("id")) {
            //description: Identificação do componente. Atributo obrigatório para interagir com o objeto | Alfanumérico | sim | vazio |
            id = this.getAttribute("id");
        } else {
            this.setAttribute("id", id);
        };

        var contentHtml = this.innerHTML ;
        this.innerHTML = "";

        //coloca classe
        this.classList.add(this.mainClass);

        //width
        if (this.hasAttribute("width")) {
            //description: Define a largura do componente| % ou px| não| |
            this.style.width = this.getAttribute("width");
        };

        //verifica width-on-bigscreen
        if (this.hasAttribute("width-on-bigscreen")) {
            //description: Define a largura do componente em telas maiores| % ou px| não| |
            if (abner.utils.showBigScreen(top.$("body"))) {
                this.classList.add("ab-text-read-only-bigscreen")
                this.style.width = this.getAttribute("width-on-bigscreen");
            } else {
                this.classList.remove("ab-text-read-only-bigscreen")
            }
        };

        //Coloca Label
        this.label.setAttribute("id", id + "label");

        if (this.hasAttribute("label")) {
            //description: Colocar uma descrição que represente o valor que será colocado no input da página | Alfanumérico | não | vazio |
            this.label.innerText = this.getAttribute("label");
        }
        this.appendChild(this.label);

        //Coloca Input
        this.text.classList.add("ab-paragrafo-medio");
        this.text.setAttribute("id", id + "text");
        if (contentHtml.length > 0) {
            this.text.innerHTML = contentHtml;
        }
        this.appendChild(this.text);

        //visible
        if (this.getAttribute("visible") == "false") {
            //values: true;false
            //description: Define se o componente estará visível | Boolean | não| true |
            this.style.display = "none";
        };

        //limpa variaveis
        id = null;
        contentHtml = null;
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
        return ["label", "id", "width", "width-on-bigscreen", "visible"];
    }

    attributeChangedCallback(attrName, oldVal, newVal) {

        switch (attrName) {
            case "label":
                this.label.innerText = newVal;
                break;
    
            case "id":
                this.label.setAttribute("id", newVal + "label");
                this.text.setAttribute("id", newVal + "text");
                break;
    
            case "width":
                this.style.width = newVal;
                break;
    
            case "width-on-bigscreen":
                if ($("ab-page").attr("fullscreen") == "true"){
                    this.style.width = this.getAttribute("width-on-bigscreen");
                }
                break;
    
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
        this.text.innerHTML = text;
    }

    getText() {
        return this.text.innerText;
    }

    getText() {
        return this.text.innerText;
    }

    setHtml() {

    }
}
customElements.define('ab-text-read-only', AbTextReadOnly);