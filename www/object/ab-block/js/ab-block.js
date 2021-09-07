"use strict";

$(document).ready(function() {
    $.fn.block = function(options) {
        var tag = "";
        var onlyLoad = true;

        //Tratamento
        if ($(this).length > 0) {
            tag += $(this)[0].nodeName;
            if (tag) {
                tag = tag.toUpperCase();
            }
        } else {
            return null;
        }

        //se existir tela remove
        $(this).unblock();

        //Gera ID
        var id = randomNumber();
        $(this).attr("blockID", id);

        var divBlock = $("<div>");
        divBlock.on("tap", function(e) {
            e.preventDefault();
            e.stopPropagation();
        });
        divBlock.attr("id", id);

        //coloca preto ou branco
        if (options && options.transparency == false) {
            divBlock.addClass("ab-block-full-black");
        } else if (tag == "AB-PAGE" || tag == "BODY") {
            divBlock.addClass("ab-block-black");
        } else {
            divBlock.addClass("ab-block-white");
        }


        $(this).append(divBlock);
        

        var divWrapper = $("<div>");
        divWrapper.addClass("ab-block-wrapper");
        divWrapper.appendTo(divBlock);

        if ((options && options.showLoading && options.showLoading == true) || !options || options.showLoading == undefined) {
            var divLoading = $("<div>");

            if (onlyLoad) {
                divLoading.addClass("ab-block-loading-center");
            } else {
                divLoading.addClass("ab-block-loading");
            }

            divLoading.appendTo(divWrapper);
        }
    };

    //funcao para desbloquear a tela/componente
    $.fn.unblock = function() {

        //remove determinado block
        $("#" + $(this).attr("blockID")).remove();

        //Tratamento
        var tag = "";
        if ($(this).length > 0) {
            tag += $(this)[0].nodeName;
            if (tag) {
                tag = tag.toUpperCase();
            }
        } else {
            return null;
        }
    };
});