"use strict";

$(document).ready(function () {
    //funcao para corrigir o data
    $.fn.fillSelect = function (selectArr, callback) {
        this[0].fillSelect(selectArr, callback);

        var fn = window[callback];
        if (typeof fn === 'function') {
            fn.call(null);
        } else if (typeof callback === 'function') {
            callback.call(null);
        }
    };


});

class AbSelect extends HTMLElement {

    constructor() {
        super();

        this.label = document.createElement("label");
        this.select = document.createElement("select");
        this.option = document.createElement('option');
        this.img = document.createElement("img");
        this.legend = document.createElement("legend");

        this.mainClass = "ab-select";

    }

    _render() {
        //Cria um id
        var id = generateID();
        if (this.hasAttribute("id")) {
            //description: Identificador único do objeto, com prefixo "sel"| Alfanumérico |não| randômico|
            id = this.getAttribute("id");
        } else {
            this.setAttribute("id", id);
        }

        //Bradesco Container
        this.classList.add(this.mainClass);

        //no caso do combo ja fica mimificado
        this.classList.add("ab-select-min");

        //Coloca Label
        this.label.classList.add("ab-select-label");
        this.label.setAttribute("id", id + "sl_label");
        this.label.setAttribute("for", id + "sl_input");
        this.appendChild(this.label);

        if (this.hasAttribute("label")) {
            //description: Colocar uma descrição que represente o valor que será colocado no input da página| Alfanumérico| não| vazio|
            this.label.innerText = this.getAttribute("label");
        };

        //Cria o combo
        this.select.classList.add("ab-select-select");
        this.select.setAttribute("id", id + "sl_input")
        this.appendChild(this.select);

        //onfocus no objeto
        if (this.hasAttribute("onfocus")) {
            this.select.setAttribute("onfocus", this.getAttribute("onfocus"));
        }

        //preenche combo
        this.option.setAttribute("selected", true);
        this.option.setAttribute("value", "");
        this.option.innerText = "Selecione";
        this.appendChild(this.select);

        //coloca cor no label
        if (this.hasAttribute("width")) {
            //description: Largura do select. | Alfanumérico | não | 100% |
            this.style.width = this.getAttribute("width");
        }

        //verifica width-on-bigscreen
        if (this.hasAttribute("width-on-bigscreen")) {
            //description: Largura do componente em telas maiores| % ou px| não| |
            if (pmb.utils.showBigScreen(top.$("body"))) {
                this.style.width = this.getAttribute("width-on-bigscreen");
            }
        }

        //desabilitar o campo quando o atributo is-disabled é true
        if (this.getAttribute("is-disabled") == "true") {
            //values: true;false
            //description: Desabilita o campo para alteração. | Booleano | não | vazio |
            this.select.setAttribute("disabled", true);
        }

        //coloca tabindex
        if (this.hasAttribute("tab-index")) {
            //description: Ordem de tabulação na página. | Numérico | não | vazio |
            this.select.setAttribute("tabindex", this.getAttribute("tab-index"));
        }

        //para qual index vai
        if (this.hasAttribute("goto-tab-index")) {
            this.select.setAttribute("goto-tab-index", this.getAttribute("goto-tab-index"));
        }

        //para qual index vai
        if (this.hasAttribute("stop-tab-index")) {
            this.select.setAttribute("stop-tab-index", this.getAttribute("stop-tab-index"));
        }

        //Mesmo comportamento porém com outro nome de atributo, necessário ajustar todos projetos que usam o de cima
        if (this.getAttribute("visible") == "false") {
            //values: true;false
            this.style.display = "none";
        }

        //Coloca mensagem de erro 
        this.legend.classList.add("ab-select-span");
        this.legend.setAttribute("id", id + "sl_span");
        if (this.hasAttribute("error")) {
            this.legend.innerText = this.getAttribute("error");
            this.classList.add("ab-select-error");
        } else {
            //se tiver descrição
            if (this.hasAttribute("description")) {
                this.legend.innerText = this.getAttribute("description");
            };
        }
        this.appendChild(this.legend);

        this.img.classList.add("ab-select-seta");
        this.img.setAttribute("src", "object/ab-select/img/seta-baixo.svg");
        this.appendChild(this.img);

        //Limpar variaveis
        id = null;
    }

    _addEvent() {

        var selectEl = $(this.select);

        //Ao sair ele volta o label ou deixa o valor
        selectEl.on("blur", function () {
            var _this = this.parentElement;
            //tira classe que mostra focus
            _this.classList.remove("ab-select-focus");

            //Na checar conteudo
            _this.setAttribute("cancel-onchange", "true");
            $(this).trigger("change");

            //Chama a funcao que colcou no onblur
            if (_this.hasAttribute("onblur")) {
                var fn = window[_this.getAttribute("onblur")];
                if (typeof fn === 'function') {
                    fn.call($(_this));
                }
            }
            _this = null;
        });

        //na mudanca
        selectEl.on("change", function () {
            var _this = this.parentElement;
            //verifica se o campo é obrigatório
            if (_this.getAttribute("is-required") == "true") {
                //values: true;false
                if (_this.getSelected(this)) {
                    _this.removeAttribute("error");
                } else {
                    _this.setAttribute("error", "Campo obrigatório");
                }
            }

            //Chama a funcao que colcou no onchange
            if (_this.hasAttribute("onchange") && _this.getAttribute("cancel-onchange") != "true") {
                var functionsArray = _this.getAttribute("onchange").split(";");

                for (var i = 0; i < functionsArray.length; i++) {
                    var fn = window[functionsArray[i].trim()];
                    if (typeof fn === 'function') {
                        fn.call($(_this));
                    } else {
                        functionsArray[i];
                    }
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
            _this = null;
        });

        selectEl.on("focus", function (e) {
            var _this = this.parentElement;
            //e.preventDefault();
            //e.stopPropagation();

            //mostra que esta com focu
            _this.classList.add("ab-select-focus");
            _this = null;
        });

        //Ir para o próximo item quando apertar enter
        selectEl.on("keydown", function (event) {
            var _this = this.parentElement;
            return goToNextTabindex(event, $(_this), "tap");
            _this = null;
        });
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
        return ["error", "is-disabled", "label", "width", "id", "width-on-bigscreen", "tab-index", "goto-tab-index", "description", "icon", "visible"];
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        switch (attrName) {
            case "error":
                if (newVal != undefined && newVal != null) {
                    this.legend.innerText = newVal;
                    this.classList.add("ab-select-error");
                } else {
                    this.legend.innerText = "";
                    if (this.hasAttribute("description")) {
                        this.legend.innerText = this.getAttribute("description");
                    }
                    this.classList.remove("ab-select-error");
                }
                break;

            case "is-disabled":
                if (newVal == "true") {
                    this.select.setAttribute("disabled", true);
                    this.removeAttribute("error");
                } else {
                    this.select.removeAttribute("disabled");
                }
                break;

            case "label":
                this.label.innerText = newVal;
                break;

            case "width":
                this.style.width = newVal;
                break;

            case "id":
                if (oldVal != null) {
                    this.img.setAttribute("id", newVal + "sl_img");
                    this.label.setAttribute("for", newVal + "sl_input");
                    this.label.setAttribute("id", newVal + "sl_label");
                    this.select.setAttribute("id", newVal + "sl_input");
                    this.legend.setAttribute("id", newVal + "sl_span");
                }
                break;

            case "width-on-bigscreen":
                if (pmb.utils.showBigScreen(top.$("body"))) {
                    this.style.width = newVal;
                }
                break;

            case "tab-index":
                this.select.setAttribute("tabindex", newVal);
                break;

            case "goto-tab-index":
                this.select.setAttribute("goto-tab-index", newVal);
                break;

            case "description":
                if (newVal) {
                    this.legend.innerText = newVal;
                }
                break;

            case "icon":
                obj.children("#" + id + "sl_img").remove();

                var img = $("<img />");
                img.attr("id", id + "sl_img");

                //Coloca icone
                if (obj.attr("error")) {
                    if (obj.attr("error-icon")) {
                        img.attr("src", obj.attr("error-icon"));
                    } else {
                        img.attr("src", obj.attr("icon"));
                    }
                } else {
                    img.attr("src", obj.attr("icon"));
                }

                img.appendTo(obj);
                img = null;

                //Muda estilo com imagem
                this.classList.add("ab-select-img");
                break;

            case "visible":
                if (newVal == "true") {
                    this.style.display = "block";
                } else if (newVal == "false") {
                    this.style.display = "none";
                }
                break;
        
            default:
                break;
        }
    }

    setText(text) {

    }

    getText() {
        let index = this.select.options.selectedIndex;
        if (index == -1) {
            return "";
        } 

        return this.select.options[index].value;
    }

    setNumber(text) {

    }

    getNumber() {
        let index = this.select.options.selectedIndex;
        if (index == -1) {
            return "";
        } 

        return parseInt(this.select.options[index].value);
    }

    getSelected(select) {
        var selectedIndex = select.options.selectedIndex;

        if (selectedIndex == -1) {
            return false;
        }

        if (select.options[selectedIndex].value == "") {
            return false;
        } else {
            return true;
        }
    }

    fillSelect(selectArr) {
        if (!selectArr) {
            return;
        }

        //bloqueia combo
        $(this.select).block();

        //limpa combo
        this.select.innerHTML = "";

        //preenche combo
        var optionsArray = [];
        optionsArray.push(option);
        for (var i = 0; i < selectArr.length; i++) {
            optionsArray.push("<option value='" + selectArr[i].valor + "'>" + selectArr[i].nome + "</option>");
        }
        this.select.innerHTML = optionsArray.join("");

        var option = document.createElement("OPTION");
        option.setAttribute("selected", true);
        option.setAttribute("value", "");
        option.innerHTML = "Selecione";
        this.select.prepend(option);

        $(this.select).unblock();
    };

}

customElements.define('ab-select', AbSelect);