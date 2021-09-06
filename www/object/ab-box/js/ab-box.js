"use strict";

$(document).ready(function () {
    $(window).on("resize", function () {
        $("ab-page").find("ab-box").each(function () {
            if ($(this).attr("width")) {
                $(this).css("width", $(this).attr("width"));
            } else {
                $(this).css("width", "100%");
            };
        });
    });
});

class AbBox extends HTMLElement {

    constructor() {
        super();

        this.boxHeader = document.createElement("header");
        this.boxHeaderText = document.createElement("p");
        this.divFooter = document.createElement("footer");

        this.mainClass = "ab-box";
        
    }

    _render() {
        var id = generateID();
        if (this.hasAttribute("id")) {
            //description: Identificador único do objeto, com prefixo "box" | Alfanumérico | Não | Normal |
            id = this.getAttribute("id");
        } else {
            this.setAttribute("id", id);
        }

        $(this).addClass("ab-box");

       // style.innerText = " .ab-box[status='analise'] { --border-status: 8px solid var(--box-status-analise); } .ab-box[status='ativo'] { --border-status: 8px solid var(--box-status-ativo); } .ab-box[status='inativo'] { --border-status: 8px solid var(--box-status-inativo); } .ab-box[status='cancelado'] { --border-status: 8px solid var(--box-status-cancelado); } :host(.ab-box) { box-sizing: border-box; display: inline-block; overflow: hidden; float: left; margin: 8px; width: -webkit-calc(100% - 16px); width: -moz-calc(100% - 16px); width: -o-calc(100% - 16px); width: calc(100% - 16px); border-radius: 5px; border-left: var(--border-status); box-shadow: var(--shadow-lv2); } .ab-box-content { box-sizing: border-box; padding: 8px; display: var(--boxDisp); justify-content: space-between; align-items: center; background-color: var(--bg-components); height: initial; overflow: hidden; float: var(--boxFloat); width: 100%; position: relative; } :host(.ab-box-expandable) .ab-box-content { padding: 8px; } .ab-box-footer { float: left; height: 40px; width: 100%; background-size: 20px; background-repeat: no-repeat; background-position: center; bottom: 0px; left: 8px; background-color: var(--bg-components); cursor: pointer; } :host(.ab-box-closed) :host(.ab-box-opened) .ab-box-content { max-height: 9000% !important; } :host(.ab-box-opened) .ab-box-form .ab-box-content { max-height: 100px } .ab-box-content::slotted(label) { font-size: 13px; font-family: 'ablinkmedium'; line-height: 18px; color: var(--cor-pri-text); display: block; width: 100%; padding: 8px; box-sizing: border-box; float: left; } .ab-box-title { box-sizing: border-box; display: inline-block; background-color: var(--bg-components); height: 50px; float: left; width: 100%; } .ab-box-title-text { line-height: 50px; box-sizing: border-box; font-size: 16px; font-family: 'ablinksemiboldregular'; font-weight: normal; color: var(--cor-titulo); float: left; padding-left: 8px; margin: 0px; } .ab-box-div-buttons { float: left; display: table; width: 100%; table-layout: fixed; vertical-align: top; background-color: var(--bg-components); margin-top: -5px; padding: 0px 16px 16px 16px; box-sizing: border-box; z-index: 1; position: relative; } br { line-height: 20px; }";

        if (this.getAttribute("theme") == 'flex'){
            $(this).addClass("ab-box__flex");            
        } else if (this.getAttribute("theme") == 'ativo'){
            $(this).addClass("ab-box__ativo");            
        } else if (this.getAttribute("theme") == 'inativo'){
            $(this).addClass("ab-box__inativo");
        } else if (this.getAttribute("theme") == 'dark'){
            $(this).addClass("ab-box__dark");
        }



        //Classe base
        this.classList.add(this.mainClass);

        //Coloca titulo
        this.boxHeader.setAttribute("id", id + "_div_title");
        this.boxHeader.classList.add("ab-box-title");


        this.boxHeader.appendChild(this.boxHeaderText);
        this.boxHeaderText.setAttribute("id", id + "_div_text");
        this.boxHeaderText.classList.add("ab-box-title-text");

        if (this.hasAttribute("title")) {
            //description: Coloca um título | Alfanumérico | não |não|
            this.boxHeaderText.innerText = this.getAttribute("title");
        } else {
            this.boxHeader.style.display = "none";
        }


        if (this.hasAttribute("max-width")) {
            //description: Define o tamanho máximo | Tamanho em pixel | não |100%|
            this.style.maxWidth = this.getAttribute("max-width");
        }

        if (this.hasAttribute("width")) {
            //description: Ativa ou desativa o max-width | true ou false| não|false|
            this.style.width = this.getAttribute("max-width");
        }

        //div para fazer a seta que expande o box
        this.divFooter.setAttribute("id", id + "_footer");
        this.divFooter.classList.add("ab-box-footer");

        //verifica se existe a altura inicial, considerado para expandir
        if (this.hasAttribute("initial-height")) {
            //description: Define a altura inicial do componente quando precisa ser expandido| 100px, 200px, 300px| não|não|

            //adicionando classes para considerar o footer
            this.classList.add("ab-box-expandable");

            if (!this.hasAttribute("is-opened")) {
                this.classList.add("ab-box-closed");
            }
        } else {
            this.divFooter.style.display = "none";
        }

        if (this.getAttribute("visibility") == "hidden") {
            //values: hidden
            //description: Se o parâmetro estiver presente com o valor "hidden", esconde o objeto | hidden | não| não|
            this.style.display = "none";
        }

        if (this.hasAttribute("width-on-bigscreen")) {
            //description: Define uma largura para quando estiver em tela grande (tablets, pc) | Numérico | não| não|
            if ($("ab-page").attr("fullscreen") == "true"){
                this.style.width = this.getAttribute("width-on-bigscreen");
            }
        }

        if (this.hasAttribute("status")) {
            this.boxHeader.setAttribute("status", this.getAttribute("status"));
            this.divFooter.setAttribute("status", this.getAttribute("status"));
        }

        //for legacy substituir todos os h1 dos box por h3
        for (const element of this.children) {
            if (element.tagName == "H1") {
                element.outerHTML = element.outerHTML.replace(/h1/g,"h3");
            }            
        }
    }

    _addEvent() {
        var _this = this;

        $(this.divFooter).on("tap", function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (_this.getAttribute("is-opened") == "true") {
                //values: true;false
                //description: Se possuir initial-height, inicia aberto ou fechado | true ou false | não | false|
                _this.setAttribute("is-opened", "false");
            } else {
                _this.setAttribute("is-opened", "true");
            }
        });

    }


    connectedCallback() {
        if (!this.classList.contains("ab-box")) {
            this._render();
            this._addEvent();
        }
    }

    static get observedAttributes() {
        return ["is-opened", "max-width", "title", "theme", "initial-height", "id", "visibility", "width-on-bigscreen", "status"];
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        switch (attrName) {
            case "is-opened":
                if (newVal == "true") {
                    this.classList.add("ab-box-opened");
                    this.classList.remove("ab-box-closed");
                } else if (newVal == "false") {
                    this.classList.add("ab-box-closed");
                    this.classList.remove("ab-box-opened");
                }
                break;
    
            case "max-width":
                if (newVal) {
                    this.style.maxWidth = newVal;
                } else {
                    this.style.maxWidth = "";
                }
                break;
    
            case "title":
    
                if (newVal) {
                    this.boxHeader.style.display = "block";
                    this.boxHeaderText.innerText = newVal;
                } else {
                    this.boxHeader.style.display = "none";
                    this.boxHeaderText.innerText = "";
                }
                break;
    
            case "theme":
                if (newVal) {
                    this.boxHeader.classList.add("ab-box-title-" + newVal);
                    this.divFooter.classList.add("ab-box-footer-" + newVal);
                } else {
                    this.boxHeader.classList.remove("ab-box-title-" + oldVal);
                    this.divFooter.classList.remove("ab-box-footer-" + newVal);
                }
                break;
    
            case "initial-height":
                //adiciona a altura inicial na altura do objeto
                //seta Max height
                if (newVal) {
                    this.classList.add("ab-box-expandable");
                    this.divFooter.style.display = "block";
                } else {
                    this.classList.remove("ab-box-expandable");
                    this.divFooter.style.display = "none";
                }
    
                //Box aberto ou fechado
                if (this.getAttribute("is-opened") == "false" || !this.hasAttribute("is-opened")) {
                    this.classList.add("ab-box-closed");
                } else {
                    this.classList.remove("ab-box-closed");
                }
                break;
    
            case "id":
                //muda ids
                this.boxHeader.setAttribute("id", newVal + "_div_title");
                this.boxHeaderText.setAttribute("id", newVal + "_div_text");
                this.divFooter.setAttribute("id", newVal + "_footer");
                break;
    
            case "visibility":
                if (newVal == "show") {
                    this.style.display = "inline-block";
                } else if (newVal == "hidden") {
                    this.style.display = "none";
                }
                break;
    
            case "width-on-bigscreen":
                if ($("ab-page").attr("fullscreen") == "true"){
                    this.style.width = newVal;
                }
                break;

            case "status":
                this.boxHeader.setAttribute("status", newVal);
                this.divFooter.setAttribute("status", newVal);
                break;
        
            default:
                break;
        }
    }


}
customElements.define('ab-box', AbBox);