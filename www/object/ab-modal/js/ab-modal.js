"use strict";

window['onchangeforcheckbox'] = null;
class AbModalUtil {

    constructor() {

        this.divBackground = document.createElement("div");

    }

    hide() {
        if ($("#ab-modal").length > 0) {

            $("#ab-modal").remove();
            $('.chat-body-div').css("overflow-y", "scroll");

        }
    }

    show(prop) {
        var id = generateID();
        var _this = this;


        //compatibilidade com versao antiga
        if (prop && prop.callBack) {
            prop.callback = prop.callBack;
        }

        this.hide();

        //Cria fundo preto
        this.divBackground.classList.add("ab-modal-background");
        this.divBackground.setAttribute("id", "ab-modal");
        setTimeout(function () {
            _this.hide();
            $("body")[0].appendChild(_this.divBackground);
            
        }, 1);

        $(this.divBackground).on("mousedown touchstart", function (e) {
            if  (e.target == this) {
                e.preventDefault();
                e.stopPropagation();
                if (_this.divBackground.getAttribute("closable") == "true" && e.target.id == _this.divBackground.getAttribute("id")) {
                    _this.hide();
                }
            }
        });

        if (prop.closable) {
            this.divBackground.setAttribute("closable", prop.closable);
        }

        switch (prop.type) {
            case "promocional":
                this.modalPromocional(prop);
                break;

            case "checkbox":
                this.modalCheckOrList(prop);
                break;

            case "tela":
                this.modalTela(prop);
                break;

            default:
                if (prop.list && prop.list.length > 0) {
                    this.modalCheckOrList(prop);
                } else {
                    this.modalNormal(prop);
                }
                break;
        }
    }

    modalNormal(prop) {
        var _this = this;

        var divWrapper = document.createElement("div");
        divWrapper.classList.add("ab-modal-wrapper");
        divWrapper.setAttribute("id", "ab-modal" + "_divWrapper");
        this.divBackground.appendChild(divWrapper);

        //Cria janela branca para colocar o texto e botoes
        var divModal = document.createElement("div");
        divModal.classList.add("ab-modal-window");
        divModal.setAttribute("id", "ab-modal" + "_divModal");
        divWrapper.appendChild(divModal);

        if (prop.type) {
            //Se tiver type sucess, error, alerta, divulgacao e orientacao, apresenta imagem no content representando o caso
            var divModalIcon = document.createElement("div");
            divModalIcon.classList.add("ab-modal-icon");
            this.divBackground.classList.add("ab-modal-" + prop.type);
            divModal.appendChild(divModalIcon);
        // } else {
        //     this.divBackground.classList.add("ab-modal-alerta");
        }

        if(prop.maxWidth){
            divModal.style.maxWidth = prop.maxWidth;
            divModal.style.margin = "auto";
        }

        //Se tiver titulo, adiciona div de titulo
        if (prop.title) {
            var divTitle = document.createElement("div");
            divTitle.classList.add("ab-modal-title");
            divTitle.setAttribute("id", "ab-modal_divTitle");
            if (typeof prop.title == 'object') {
                var serializer = new XMLSerializer();
                divTitle.innerHTML = serializer.serializeToString(prop.title[0]);
            } else {
                divTitle.innerHTML = prop.title;
            }
            divModal.appendChild(divTitle);
        };

        //Se tiver texto, apresenta texto
        if (prop.text) {
            var spanText = $("<span/>");
            //spanText.html(prop.text);
            if (typeof prop.text == 'object') {
                var serializer = new XMLSerializer();
                spanText.html(serializer.serializeToString(prop.text[0]));
            } else {
                spanText.html(prop.text);
            }
            spanText.addClass("ab-modal-span");
            spanText.appendTo(divModal);
        }

        //Cria botoes solicitados
        if (prop.buttons && prop.buttons.length > 0) {
            //Para cada item "buttons" no html, irá criar um botão.
            for (var i = 0; i < prop.buttons.length; i++) {
                let btnModalNormal = document.createElement("ab-button");
                btnModalNormal.setAttribute("label", prop.buttons[i].title);
                btnModalNormal.setAttribute("order", i);
                if (i > 0) {
                    btnModalNormal.setAttribute("theme", "secondary");
                }
                divModal.appendChild(btnModalNormal);
                $(btnModalNormal).on("tap", function (e) {
                    e.preventDefault();

                    _this.hide();

                    let order = parseInt($(this).attr("order"));
                    if (typeof prop.buttons[order].callback === 'function') {
                        prop.buttons[order].callback.call(null);
                    }
                });
            }
        }

        $(divWrapper).on("touchstart mousedown", function (e) {
            if (divModal.scrollHeight > divModal.clientHeight) {
                if (e.target.id == "ab-modal_divWrapper" || e.target.id == "ab-modal_divTitle") {
                    e.preventDefault();
                } else {
                    e.stopPropagation();
                }
            } else {
                e.preventDefault();
            }
        });

        setTimeout(function () {
            if (prop && typeof prop.onopen === 'function') {
                prop.onopen.call(null, divContent);
            }
        }, 2);
    }

    modalPromocional(prop) {
        var _this = this;

        this.divBackground.style.backgroundColor = "transparent";

        let divPromo = document.createElement("div");
        divPromo.classList.add("ab-modal-promocional-content");
        this.divBackground.appendChild(divPromo);

        let closePromo = document.createElement("span");
        closePromo.classList.add("ab-modal-promocional-close");
        closePromo.innerText = "X"
        divPromo.appendChild(closePromo);
        $(closePromo).on("tap", function (e) {
            e.preventDefault();

            _this.hide();

            if (typeof prop.buttons[0].callback === 'function') {
                prop.buttons[0].callback.call(null);
            }
        });

        let divImg = document.createElement("div");
        divImg.classList.add("ab-modal-promocional-imagem");
        divPromo.appendChild(divImg);

        let imgPromo = document.createElement("img");
        imgPromo.setAttribute("src", prop.imgPromo);
        divImg.appendChild(imgPromo);

        let titlePromo = document.createElement("h2");
        titlePromo.classList.add("ab-modal-promocional-title");
        titlePromo.innerText = prop.title;
        divPromo.appendChild(titlePromo);

        let pPromo = document.createElement("p");
        pPromo.classList.add("ab-modal-promocional-text");
        pPromo.innerHTML = prop.text;
        divPromo.appendChild(pPromo);

        if (prop.buttons[0]) {
            let btnPromo = document.createElement("ab-button");
            btnPromo.classList.add("ab-modal-promocional-button");
            if (prop.buttons[0].title) {
                btnPromo.setAttribute("label", prop.buttons[0].title.toUpperOnlyFirstLetter());
            } else {
                btnPromo.setAttribute("label", "Fechar");
            }
            divPromo.appendChild(btnPromo);
            $(btnPromo).on("tap", function (e) {
                e.preventDefault();

                _this.hide();

                if (typeof prop.buttons[0].callback === 'function') {
                    prop.buttons[0].callback.call(null);
                }
            });
        }
    }

    modalCheckOrList(prop) {
        var _this = this;

        this.divBackground.style.backgroundColor = "transparent";

        let divTela = document.createElement("div");
        divTela.classList.add("ab-modal-tela-window");
        this.divBackground.appendChild(divTela);

        let closeTela = document.createElement("span");
        closeTela.classList.add("ab-modal-tela-close");
        closeTela.innerText = "X"
        divTela.appendChild(closeTela);
        $(closeTela).on("tap", function (e) {
            e.preventDefault();

            _this.hide();
        });

        let divTitle = document.createElement("div");
        divTitle.classList.add("ab-modal-tela-title");
        divTitle.innerHTML = prop.title;
        divTela.appendChild(divTitle);

        let divContent = document.createElement("div");
        divContent.classList.add("ab-modal-tela-content");
        divContent.setAttribute("id", "ab-modal-content");
        divTela.appendChild(divContent);

        let divButton = document.createElement("div");
        divButton.classList.add("ab-modal-tela-buttons");
        divTela.appendChild(divButton);

        //Se tiver lista na chamada do modal no HTML, cria a lista
        if (prop.list && prop.list.length > 0) {
            //trata para quando for lista normal ou lista de checkbox
            if (prop.type == "checkbox") {
                //adiciona attr max-select para o modal
                if (prop["max-select"]) {
                    divContent.setAttribute("max-select", prop["max-select"]);
                }

                //cria os checkbox no modal
                for (let i = 0; i < prop.list.length; i++) {
                    let modalCheck = document.createElement("ab-checkbox");
                    modalCheck.classList.add("modal-checkbox");
                    modalCheck.setAttribute("cancel-callback", "true");
                    divContent.appendChild(modalCheck);

                    if (prop.list[i].code) {
                        modalCheck.setAttribute("code", prop.list[i].code);
                    }
                    if (prop.list[i].subtitle) {
                        modalCheck.setAttribute("subtitle", prop.list[i].subtitle);
                    }

                    modalCheck.setAttribute("is-checked", prop.list[i].checked == undefined ? "false" : prop.list[i].checked);
                    modalCheck.setAttribute("label", prop.list[i].label == undefined ? "NÃO INFORMADO" : prop.list[i].label);

                    if (prop && prop.onchange) {
                        window['onchangeforcheckbox'] = prop.onchange;

                        modalCheck.setAttribute("onchange", 'onchangeforcheckbox');
                    }

                    modalCheck.setAttribute("cancel-callback", "false");
                }

                if (prop.buttons[0]) {
                    let btnTela = document.createElement("ab-button");
                    btnTela.classList.add("ab-modal-promocional-button");
                    if (prop.buttons[0].title) {
                        btnTela.setAttribute("label", prop.buttons[0].title.toUpperOnlyFirstLetter());
                    } else {
                        btnTela.setAttribute("label", "Fechar");
                    }
                    divButton.appendChild(btnTela);
                    $(btnTela).on("tap", function (e) {
                        e.preventDefault();

                        var data = [];
                        $("#ab-modal-content").children().each(function () {

                            var item = {
                                "code": $(this).attr("code"),
                                "label": $(this).attr("label"),
                                "subtitle": $(this).attr("subtitle"),
                                "checked": $(this).attr("is-checked")
                            }

                            data.push(item);
                        });

                        _this.hide();

                        if (typeof prop.buttons[0].callback === 'function') {
                            prop.buttons[0].callback.call(null, data);
                        }
                    });
                }
            } else {

                //Para cada item na array list, irá criar 1 item na lista
                for (var i = 0; i < prop.list.length; i++) {
                    let divItem = document.createElement("div");
                    var divSpan = document.createElement("span");
                    divSpan.innerHTML = prop.list[i].text;
                    divSpan.setAttribute("code", prop.list[i].code);
                    divSpan.setAttribute("content", "text");
                    divItem.classList.add("ab-modal-list");
                    divContent.appendChild(divItem);
                    divItem.appendChild(divSpan);

                    //Se tiver subtexto, adiciona texto embaixo do texto principal
                    if (prop.list[i].subtext) {
                        var divParag = document.createElement("p");
                        divParag.innerHTML = prop.list[i].subtext;
                        divParag.setAttribute("content", "subtext");
                        divSpan.appendChild(divParag);
                    }

                    if (prop.callback) {
                        var divIcon = document.createElement("ab-icon-button");
                        divIcon.classList.add("ab-icon-button-seta");
                        divItem.appendChild(divIcon);
                        divItem.setAttribute("order", i);
                        $(divItem).on("tap", function (e) {
                            e.preventDefault();

                            var data = new Object();
                            data.text = $(this).children("[content=text]")[0].childNodes[0].nodeValue;
                            data.subtext = $(this).children("[content=text]").children("[content=subtext]").text();
                            data.code = $(this).children("[content=text]").attr("code");

                            _this.hide();

                            if (prop && typeof prop.callback === 'function') {
                                prop.callback.call(null, data);
                            }
                        });
                    }
                }
                let btnTela = document.createElement("ab-button");
                btnTela.setAttribute("label", "Fechar");
                divButton.appendChild(btnTela);
                $(btnTela).on("tap", function (e) {
                    e.preventDefault();

                    _this.hide();
                });
            }
        }

        $("body").removeFocus();

        setTimeout(function () {
            if (prop && typeof prop.onopen === 'function') {
                prop.onopen.call(null, $(divContent));
            }
        }, 2);
    }

    modalTela(prop) {
        var _this = this;

        this.divBackground.style.backgroundColor = "transparent";

        let divTela = document.createElement("div");
        divTela.classList.add("ab-modal-tela-window");
        this.divBackground.appendChild(divTela);

        let closeTela = document.createElement("span");
        closeTela.classList.add("ab-modal-tela-close");
        closeTela.innerText = "X"
        divTela.appendChild(closeTela);
        $(closeTela).on("tap", function (e) {
            e.preventDefault();

            _this.hide();
        });

        let divTitle = document.createElement("div");
        divTitle.classList.add("ab-modal-tela-title");
        divTitle.innerHTML = prop.title;
        divTela.appendChild(divTitle);

        let divContent = document.createElement("div");
        divContent.classList.add("ab-modal-tela-content");
        divContent.setAttribute("id", "ab-modal-content");
        divTela.appendChild(divContent);

        let divButton = document.createElement("div");
        divButton.classList.add("ab-modal-tela-buttons");
        divTela.appendChild(divButton);

        divContent.innerHTML = prop.text;

        //Cria botoes solicitados
        if (prop.buttons && prop.buttons.length > 0) {
            //Para cada item "buttons" no html, irá criar um botão.
            let btnHeight = 0;
            for (var i = 0; i < prop.buttons.length; i++) {
                let btnTela = document.createElement("ab-button");
                btnTela.setAttribute("label", prop.buttons[i].title);
                btnTela.setAttribute("order", i);
                if (i > 0) {
                    btnTela.setAttribute("theme", "secondary");
                }
                divButton.appendChild(btnTela);
                btnHeight = btnHeight + 64;
                $(btnTela).on("tap", function (e) {
                    e.preventDefault();

                    _this.hide();

                    let order = parseInt($(this).attr("order"));
                    if (typeof prop.buttons[order].callback === 'function') {
                        prop.buttons[order].callback.call(null);
                    }
                });
            }
            divButton.style.height = btnHeight + "px";
            if (btnHeight > 64) {
                divContent.setAttribute("style", "calc(100% - 210px) !important;");
            }
        }

        $("body").removeFocus();

        setTimeout(function () {
            if (prop && typeof prop.onopen === 'function') {
                prop.onopen.call(null, $(divContent));
            }
        }, 2);
    }
}
