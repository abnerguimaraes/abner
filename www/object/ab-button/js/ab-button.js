"use strict";

$(document).ready(function () {
    $(window).on("resize", function () {
        $("ab-page").find("ab-button").each(function () {
            $(this).css("max-width", "100%");
            if ($(this).attr("width")) {
                $(this).css("width", $(this).attr("width"));
            }
        });
    });
});

class AbButton extends HTMLElement {

    constructor() {
        super();

        this.button = document.createElement("button");
        this.span = document.createElement("span");
        this.img = document.createElement("div");
        this.blocker = document.createElement("div");

        this.mainClass = "ab-button";

    }

    _render() {
        //coloca classe
        this.classList.add(this.mainClass);

        var id = generateID();
        if (this.hasAttribute("id")) {
            //description: Identificador único do objeto, com prefixo "btn"| Alfanumérico |não| randômico|
            id = this.getAttribute("id");
        } else {
            this.setAttribute("id", id);
        }

        //Coloca os atributos no objeto
        if (this.hasAttribute("width")) {
            //description: Largura do botão| Alfanumérico| não| auto |
            this.style.width = this.getAttribute("width");
        }

        // if (this.hasAttribute("height")) {
        //     //description: Altura do botão| Alfanumérico| não| auto |
        //     this.style.height = this.getAttribute("height");
        // }

        if (this.getAttribute("last-button") == "true") {
            //description: Ultimo botão da página | Boolean | não | false |
            this.classList.add("ab-button-last-button");
        }

        //verifica width-on-bigscreen
        if ($("ab-page").attr("fullscreen") == "true") {
            if (this.hasAttribute("width-on-bigscreen")) {
                //description: Largura do componente em telas maiores| % ou px| não| |
                this.style.width = this.getAttribute("width-on-bigscreen");
            } else {
                this.style.maxWidth = "340px";
            }
        }

        //Cria botao
        this.button.setAttribute("id", id + "btn_button");
        this.appendChild(this.button);

        // adiciona o texto inserido no objeto para o span criado
        this.span.setAttribute("id", id + "btn_span");

        if (this.hasAttribute("label")) {
            //description: Colocar um texto no botão| Alfanumérico| sim| vazio|
            this.span.innerText = this.getAttribute("label").toUpperOnlyFirstLetter();
        }
        this.button.appendChild(this.span);

        // adiciona a imagem inserida no objeto no background de uma div
        this.img.setAttribute("div-image", "true");
        this.img.setAttribute("id", id + "btn_img");
        this.button.insertAdjacentElement("afterbegin", this.img);
        if (this.hasAttribute("icon") || this.hasAttribute("icon-class")) {
            this.img.style.backgroundImage = "url(" + this.getAttribute("icon") + ")";
            if (this.hasAttribute("icon-class")) {
                this.img.classList.add(this.getAttribute("icon-class"));
            }
        } else {
            this.img.style.display = "none";
        }

        // verifica se o botão é somente para mostrar o ícone e adiciona a classe
        if (this.getAttribute("icon-button") == "true") {
            //values: true;false
            //description: Trava o botão para ter somente o ícone| true ou false| não| false|
            this.classList.add("ab-button-img");
        }

        // verifica se tem o tamanho do icone e adiciona no tamanho do background
        if (this.hasAttribute("icon-size")) {
            //description: Altera o tamanho do icone| Número em px| não| |
            this.img.style.backgroundSize = this.getAttribute("icon-size");
        }

        // verifica se tem o tamanho do espaço do ícone e define a largura da div
        if (this.hasAttribute("icon-space-width")) {
            //description: Espaçamento do ícone com o texto| Número em px| não| |
            this.img.style.width = this.getAttribute("icon-space-width");
        }

        //Coloca cor no botao
        if (this.hasAttribute("theme")) {
            //values: normal;light;keyboard;keyboard-ok;dark-rounded;red-rounded;dark;vk
            //description: Altera a cor do componente| [[#Temas | Ver temas]]| não | vazio|
            this.classList.add("ab-button-" + this.getAttribute("theme"));
        } else if (this.getAttribute("theme") == "ab-button-keyboard") {
            this.classList.add("ab-button-keyboard");
        } else {
            this.classList.add("ab-button-normal");
        }

        if (this.getAttribute("position") == "center") {
            //values: center;right;left
            //description: Posição do botão| Center, right ou left| não| center|
            if (abner.utils.showBigScreen(top.$("body")) == true) {
                this.classList.add("ab-button-center-big");
            } else {
                this.classList.add("ab-button-center");
            }
        } else if (this.getAttribute("position") == "left") {
            //não faz nada
        } else if (this.getAttribute("position") == "right") {
            this.style.float = this.getAttribute("position");
        }

        //verifica se tem max width
        if (this.hasAttribute("max-width")) {
            //description: Largura máxima do botão| Número em px| não| |
            this.style.maxWidth = this.getAttribute("max-width");
        }

        this.blocker.classList.add("ab-button-block");
        this.blocker.setAttribute("id", id + "btn_iblocker");
        this.appendChild(this.blocker);

        if (this.getAttribute("is-disabled") == "true") {
            //values: true;false
            this.button.setAttribute("disabled", "disabled");
            this.blocker.style.display = "block";
        }

        if (this.getAttribute("is-blocked") == "true") {
            //values: true;false
            this.blocker.style.display = "block";
        }

        if (this.getAttribute("visibility") == "hidden") {
            //values: hidden;show
            this.style.display = "none";
        }

        //Mesmo comportamento porém com outro nome de atributo, necessário ajustar todos projetos que usam o de cima
        if (this.getAttribute("visible") == "false") {
            //values: true;false
            this.style.display = "none";
        }

        //Limpa variaveis
        id = null;
    }

    _addEvent() {
        var button = $(this.button);
        var _this = this;

        // altera o ícone do botão quando o botão é apertado e se é passado o atributo icon-active
        button.on("touchstart mousedown", function (e) {

            //Proibe o clique em dois botões ao mesmo tempo
            if (e && e.originalEvent && e.originalEvent.touches && e.originalEvent.touches.length > 1) {
                return;
            };

            //tira o foco de qualquer elemento
            document.activeElement.blur();
            $(window).focus();

            if (_this.getAttribute("is-disabled") == "false" || !_this.hasAttribute("is-disabled")) {
                //se tiver especificado icon-active adiciona no lugar do normal quando o evento inicia
                if (_this.hasAttribute("icon-active")) {
                    //description: Caminho do ícone que aparecerá quando o botão for ativado. | Alfanumérico| não| vazio|
                    if (_this.hasAttribute("icon-active")) {
                        _this.img.style.backgroundImage = "url(" + _this.getAttribute("icon-active") + ")";
                    }
                }
                // se tiver tema adiciona o tema no objeto
                if (_this.hasAttribute("theme")) {
                    _this.classList.add("ab-button-" + _this.getAttribute("theme") + "-active");
                } else {
                    _this.classList.add("ab-button-normal-active");
                };
            };
        });

        // altera o ícone do botão quando o botão é solto e se é passado o atributo icon-active
        button.on("mouseup touchend", function (e) {
            e.preventDefault();

            //tira o foco de qualquer elemento
            document.activeElement.blur();
            $(window).focus();

            if (_this.getAttribute("is-disabled") == "false" || !_this.hasAttribute("is-disabled")) {
                //retorna o icone para o normal quando o evento termina
                if (_this.hasAttribute("icon-active")) {
                    if (_this.hasAttribute("icon")) {
                        _this.img.style.backgroundImage = "url(" + _this.getAttribute("icon") + ")";
                    }
                }
                //retira o tema adicionado
                if (_this.hasAttribute("theme")) {
                    _this.classList.remove("ab-button-" + _this.getAttribute("theme") + "-active");
                } else {
                    _this.classList.remove("ab-button-normal-active");
                }
            }
        });

        //ação quando o mouse ou o touch deixar a área do objeto botão
        button.on("mouseleave touchleave", function (e) {
            e.preventDefault();

            if (_this.getAttribute("is-disabled") == "false" || !_this.hasAttribute("is-disabled")) {
                //retorna o icone para o normal quando o evento termina
                if (_this.hasAttribute("icon-active")) {
                    if (_this.hasAttribute("icon")) {
                        _this.img.style.backgroundImage = "url(" + iconActive + ")";
                    }
                }
                //retira o tema adicionado
                if (_this.hasAttribute("theme")) {
                    _this.classList.remove("ab-button-" + _this.getAttribute("theme") + "-active");
                } else {
                    _this.classList.remove("ab-button-normal-active");
                }
            }
        });

        $(this.blocker).on("tap", function (e) {
            e.preventDefault();
            e.stopPropagation();

            return false;
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
        return ["is-disabled", "label", "theme", "icon", "icon-class", "width", "icon-button", "icon-size", "icon-space-width", "visibility", "visible", "position", "width-on-bigscreen", "id", "max-width", "is-blocked"];
    }

    attributeChangedCallback(attrName, oldVal, newVal) {

        switch (attrName) {
            case "is-disabled":
                //Quando is-disable = true, desabilita o botão
                if (newVal == "true") {
                    this.button.setAttribute("disabled", "disabled");
                    this.blocker.style.display = "block";
                } else {
                    //Se o novo valor não habilitar o disable, ele retira as classes de active e remove o disable do botão
                    if (this.hasAttribute("theme")) {
                        this.classList.remove("ab-button-" + this.getAttribute("theme") + "-active");
                    } else {
                        this.classList.remove("ab-button-normal-active");
                    }

                    this.button.removeAttribute("disabled");
                    this.blocker.style.display = "none";
                }

                break;

            case "label":
                this.span.innerText = newVal.toUpperOnlyFirstLetter();
                break;

            case "theme":
                this.classList.remove("ab-button-" + oldVal);
                this.classList.remove("ab-button-normal");
                this.classList.add("ab-button-" + newVal);
                break;

            case "icon":
                this.img.style.display = "inline-block";
                this.img.style.backgroundImage = "url(" + newVal + ")";
                break;

            case "icon-class":
                this.img.style.display = "inline-block";
                this.img.classList.add(newVal);
                break;

            case "width":
                this.style.width = newVal;
                break;

            case "icon-button":
                if (newVal == "true") {
                    this.classList.add("ab-button-img");
                } else {
                    this.classList.remove("ab-button-img");
                }
                break;

            case "icon-size":
                this.img.style.backgroundSize = newVal;
                break;

            case "icon-space-width":
                this.img.style.width = newVal;
                break;

            case "visibility":
                if (newVal == "show") {
                    this.style.display = "table";
                } else if (newVal == "hidden") {
                    this.style.display = "none";
                }
                break;

            case "visible":
                if (newVal == "true") {
                    this.style.display = "table";
                } else if (newVal == "false") {
                    this.style.display = "none";
                }
                break;

            case "position":
                if (newVal == "center") {
                    if (abner.utils.showBigScreen(top.$("body")) == true) {
                        this.classList.add("ab-button-center-big");
                    } else {
                        this.classList.add("ab-button-center");
                    }
                } else if (newVal == "right") {
                    this.style.float = newVal;
                }
                break;

            case "width-on-bigscreen":
                if (abner.utils.showBigScreen(top.$("body"))) {
                    this.style.width = newVal;
                }
                break;

            case "id":
                this.img.setAttribute("id", newVal + "btn_img");
                this.button.setAttribute("id", newVal + "btn_button");
                this.span.setAttribute("id", newVal + "btn_span");
                this.blocker.setAttribute("id", newVal + "btn_iblocker");
                break;

            case "max-width":
                this.style.maxWidth = newVal;
                break;

            case "is-blocked":
                //Trata a alteração do atributo is-disable
                //Quando is-disable = true, desabilita o botão
                if (newVal == "true") {
                    this.blocker.style.display = "block";
                } else {
                    //Se o novo valor não habilitar o disable, ele retira as classes de active e remove o disable do botão
                    if (this.hasAttribute("theme")) {
                        this.classList.remove("ab-button-" + this.getAttribute("theme") + "-active");
                    } else {
                        this.classList.remove("ab-button-normal-active");
                    }
                    this.blocker.style.display = "none";
                }
                break;

            default:
                break;
        }
    }
}
customElements.define("ab-button", AbButton);