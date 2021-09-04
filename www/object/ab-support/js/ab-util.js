"use strict";

//component-wrapper: non-functional

//Criando namespace utils
var PmbUtils = function () { }


PmbUtils.prototype.removeAccent = function (word) {
    var _this = this;

    var map = {
        "á": "a",
        "à": "a",
        "â": "a",
        "ã": "a",
        "ä": "a",
        "Á": "A",
        "À": "A",
        "Â": "A",
        "Ã": "A",
        "Ä": "A",
        "é": "e",
        "è": "e",
        "ê": "e",
        "ẽ": "e",
        "ë": "e",
        "É": "E",
        "È": "E",
        "Ê": "E",
        "Ẽ": "E",
        "Ë": "E",
        "í": "i",
        "ì": "i",
        "î": "i",
        "ĩ": "i",
        "ï": "i",
        "Í": "I",
        "Ì": "I",
        "Î": "I",
        "Ĩ": "I",
        "Ï": "I",
        "ó": "o",
        "ò": "o",
        "ô": "o",
        "õ": "o",
        "ö": "o",
        "Ó": "O",
        "Ò": "O",
        "Ô": "O",
        "Õ": "O",
        "Ö": "O",
        "ú": "u",
        "ù": "u",
        "û": "u",
        "ũ": "u",
        "ü": "u",
        "Ú": "U",
        "Ù": "U",
        "Û": "U",
        "Ũ": "U",
        "Ü": "U",
        "ý": "y",
        "ỳ": "y",
        "ŷ": "y",
        "ỹ": "y",
        "ÿ": "y",
        "Ý": "Y",
        "Ỳ": "Y",
        "Ŷ": "Y",
        "Ỹ": "Y",
        "Ÿ": "Y",
        "ñ": "n",
        "Ñ": "n",
        "Ç": "c",
        "ç": "c"
    };

    if (word != "") {
        return word.replace(/[àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãẽĩũñõÃẼĨŨÑÕäëïöüÿÄËÏÖÜŸÇç]/g, function (match) {
            return map[match];
        });
    } else {
        return null;
    }
}

//PEga variaveis da URL
PmbUtils.prototype.getUrlVars = function () {
    var vars = new Object(),
        hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars[hash[0]] = hash[1];
    }
    return vars;
}

//Determina se é modo adaptativo 
PmbUtils.prototype.showBigScreen = function (obj) {
    if (parseInt(obj.outerWidth()) >= 1024) {
        return true;
    } else {
        return false;
    }
}

PmbUtils.prototype.getCheckedRadio = function (name) {
    if (name) {
        return $("input[type=radio][name=" + name + "]:checked").parent();
    } else {
        return $("input[type=radio]:checked").parent();
    }
}

PmbUtils.prototype.getPhoneAsObject = function (phone) {

    var phoneObj = {
        ddi: "",
        ddd: "",
        phone: phone
    };

    phone = phone ? phone.replace(/\D+/g, '') : phone;

    if (phone && phone.length > 11) {
        phoneObj.ddi = phone.replace(/^(\d{2})(\d{2})(\d{8,9})$/g, "\$1");
        phoneObj.ddd = phone.replace(/^(\d{2})(\d{2})(\d{8,9})$/g, "\$2");
        phoneObj.phone = phone.replace(/^(\d{2})(\d{2})(\d{8,9})$/g, "\$3");
    } else if (phone && phone.length > 9) {
        phoneObj.ddd = phone.replace(/^(\d{2})(\d{8,9})$/g, "\$1");
        phoneObj.phone = phone.replace(/^(\d{2})(\d{8,9})$/g, "\$2");
    }

    return phoneObj;
}

PmbUtils.prototype.formatPhone = function (phone) {

    var phoneReturn = phone.replace(/[^0-9]/g, '');

    if (phone && phone.length > 11) {
        phoneReturn = phone.replace(/^(\d{2})(\d{2})(\d{4,5})(\d{4})$/g, "\+$1 \($2) \$3 \$4");
    } else if (phone && phone.length > 9) {
        phoneReturn = phone.replace(/^(\d{2})(\d{4,5})(\d{4})$/g, "\($1) \$2 \$3");
    };

    return phoneReturn;
}

PmbUtils.prototype.removeCpfCnpjFormat = function (valor, type) {

    if (valor) {
        //remove ponto e virgula
        valor = valor.replace(new RegExp(/[^\d]/g), "");

        if (type == "CNPJ") {
            var len = 14;
            var pad = "00000000000";
        } else if (type == "CPF") {
            var len = 11;
            var pad = "00000000000";
        } else {
            return "";
        }

        //transforma para numero
        valor = parseInt(valor);

        //se for maior que o valor defindo para len ele corta
        if (valor.length > len) {
            valor = valor.substring(0, len);
        }

        //Se ocorre algum erro, deixar vazio
        if (isNaN(valor)) {
            valor = "";

        } else {
            valor = pad.substring(0, pad.length - valor.length) + valor;
        }
    }
    return valor;
}

PmbUtils.prototype.validarCNPJ = function (cnpj) {

    cnpj = cnpj.replace(/[^\d]+/g, '');
    
    if (cnpj == "0" ||
        cnpj == "00000000000000" ||
        cnpj == "11111111111111" ||
        cnpj == "22222222222222" ||
        cnpj == "33333333333333" ||
        cnpj == "44444444444444" ||
        cnpj == "55555555555555" ||
        cnpj == "66666666666666" ||
        cnpj == "77777777777777" ||
        cnpj == "88888888888888" ||
        cnpj == "99999999999999") {
        return false;
    }

    // Valida DVs
    var tamanho = cnpj.length - 2
    var numeros = cnpj.substring(0, tamanho);
    var digitos = cnpj.substring(tamanho);
    var soma = 0;
    var pos = tamanho - 7;
    var i = tamanho;

    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0)) {
        return false;
    }

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

    if (resultado != digitos.charAt(1)) {
        return false;
    }

    return true;
}

//valida o CPF digitado
PmbUtils.prototype.validarCPF = function(cpf) {

    var exp = /\.|\-/g
    cpf = cpf.toString().replace(exp, "");
    if (cpf.length < 11) {
        var pad = "00000000000";
        cpf = pad.substring(0, pad.length - cpf.length) + cpf;
    }

    if (cpf == "0" ||
        cpf == "00000000000" ||
        cpf == "11111111111" ||
        cpf == "22222222222" ||
        cpf == "33333333333" ||
        cpf == "44444444444" ||
        cpf == "55555555555" ||
        cpf == "66666666666" ||
        cpf == "77777777777" ||
        cpf == "88888888888" ||
        cpf == "99999999999") {
        return false;
    }

    var soma;
    var resto;
    soma = 0;

    for (var i = 1; i <= 9; i++) {
        soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;

    if ((resto == 10) || (resto == 11)) {
        resto = 0;
    }
    if (resto != parseInt(cpf.substring(9, 10))) {
        return false;
    }

    soma = 0;
    for (var i = 1; i <= 10; i++) {
        soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;

    if ((resto == 10) || (resto == 11)) {
        resto = 0;
    }
    if (resto != parseInt(cpf.substring(10, 11))) {
        return false;
    }
    return true;
}

PmbUtils.prototype.validarEMAIL = function(email) {
    var emailValidation = email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+$/);

    if (email == emailValidation) {
        return emailValidation;
    }
}

//Funcoes uteis de uso do JQUERY
window.addEventListener('WebComponentsReady', function () {
    document.querySelector("html").classList.add("html-page-loaded");
});

$(document).ready(function () {
    $.fn.setCursorPosition = function (pos) {
        this.each(function (index, elem) {
            if (elem.setSelectionRange) {
                elem.setSelectionRange(pos, pos);
            } else if (elem.createTextRange) {
                var range = elem.createTextRange();
                range.collapse(true);
                range.moveEnd('character', pos);
                range.moveStart('character', pos);
                range.select();
            }
        });
        return this;
    };

    $.fn.validate = function () {
        var change = null;
        var tag = new String();
        //Tratamento
        if ($(this).length > 0) {
            tag += $(this)[0].nodeName;
            if (tag) {
                tag = tag.toUpperCase();
            }
        } else {
            return null;
        }

        if ($(this).attr("onchange")) {
            change = $(this).attr("onchange");
            $(this).removeAttr("onchange");
        }

        //tira o foco de qualquer elemento
        document.activeElement.blur();
        $(window).focus();

        if (change != null) {
            $(this).attr("onchange", change);
        }

        //se ouver um erro validacao esta incorreta
        if ($(this).attr("error") && $(this).attr("error") != "") {
            return false;
        } else {
            return true;
        }
    };

    $.fn.setFocus = function () {
        if ($(this).length > 0) {
            $(this).find("input").focus();
        } else {
            return null;
        }
    }

    $.fn.removeFocus = function () {
        if (document.activeElement) {
            document.activeElement.blur();
        }
    }

    $.fn.getText = function () {
        var text = null;
        var tag = new String();
        //Tratamento
        if ($(this).length > 0) {
            tag += $(this)[0].nodeName;
            if (tag) {
                tag = tag.toUpperCase().startsWith("AB-INPUT") ? "AB-INPUT" : tag.toUpperCase();
                var tagsAceitas = ["AB-TEXT-READ-ONLY", "AB-TEXT-AREA-UNDERLINE", "AB-SELECT-UNDERLINE", "AB-INPUT"];
                if (tagsAceitas.indexOf(tag) == -1) {
                    return null;
                }
            }
        } else {
            return null;
        }

        if ($(this).length > 1) {
            var textArray = new Array();
            for (const radio of this) {
                textArray.push(radio.getText());
            }
            text = textArray;
        } else {
            text = this[0].getText();
        };

        return text;
    };

    $.fn.setText = function (text, cancel) {
        var tag = new String();

        //Tratamento
        if ($(this).length > 0) {
            tag += $(this)[0].nodeName;
            if (tag) {
                tag = tag.toUpperCase();
            }
        } else {
            return null;
        }

        if (tag == "AB-TEXT-READ-ONLY") {
            this[0].setText(text);

        } else if (tag.startsWith("AB-INPUT-DATE")) {
            this[0].setText(text);

        } else if (tag.startsWith("AB-INPUT")) {
            this[0].setText(text);

        } else if (tag == "AB-TEXT-AREA-UNDERLINE") {
            this[0].setText(text);

        } else if (tag.startsWith("AB-SELECT")) {
            if (cancel) {
                $(this).find("select").val(text);
            } else {
                $(this).find("select").val(text).change();
            }
        }

        //salva valor
        if (!tag.startsWith("AB-INPUT-CHECKBOX")) {
            $(this).attr("loaded-value", $(this).getText());
        }
    };


    //funcao para corrigir o data
    $.fn.getNumber = function () {
        var text = null;
        var tag = new String();
        //Tratamento
        if ($(this).length > 0) {
            tag += $(this)[0].nodeName;
            if (tag) {
                tag = tag.toUpperCase();
            }
        } else {
            return null;
        }

        if (tag == "AB-TEXT-READ-ONLY") {
            text = this[0].getText();

        } else if (tag.startsWith("AB-INPUT-CHECKBOX")) {
            text = this[0].getNumber();

        } else if (tag.startsWith("AB-INPUT-RADIO")) {
            text = this[0].getNumber();
            
        } else if (tag.startsWith("AB-INPUT-SWITCH")) {
            text = this[0].getNumber();

        } else if (tag.startsWith("AB-INPUT-TIME")) {
            text = $(this).find("input").val() + "00";

        } else if (tag.startsWith("AB-INPUT-NUMBER")) {
            text = $(this).find("input").val();
            text = text.replace(new RegExp(/[^\d]/g), "");

        } else if (tag.startsWith("AB-INPUT-DATE")) {
            if (window.isIOS || window.isAndroid) {
                text = $(this).find("input").val();
                text = text.substring(8, 10) + "" + text.substring(5, 7) + "" + text.substring(0, 4);
            } else {
                text = $(this).find("input").val();
            }

        } else if (tag.startsWith("AB-INPUT")) {
            text = $(this).find("input").val();

        } else if (tag.startsWith("AB-TEXT-AREA-UNDERLINE")) {
            text = $(this).find("textarea").val();

        } else if (tag.startsWith("AB-SELECT")) {
            text = parseInt($(this).getObject().valor);

        } else if (tag.startsWith("AB-QUESTION")) {
            text = $(this).attr("answer");
        }

        if (text && tag != "AB-SELECT-UNDERLINE") {
            text = text.replace(new RegExp(/[^\d\,]/g), "");
        }

        return text;
    };

    //funcao para corrigir o data
    $.fn.setNumber = function (text, cancel) {
        var tag = new String();
        //Tratamento
        if ($(this).length > 0) {
            tag += $(this)[0].nodeName;
            if (tag) {
                tag = tag.toUpperCase();
            }
        } else {
            return null;
        }

        if (text || text == 0) {
            //Necessario ser string para regex
            text += "";
            text = text.replace(new RegExp(/[^\d-\,]/g), "");

            if (tag == "AB-TEXT-READ-ONLY") {
                this[0].setText(text);

            } else if (tag.startsWith("AB-INPUT-CHECKBOX")) {
                this[0].setNumber(text);

                $(this).attr("loaded-value", $(this).attr("is-checked"));

            } else if (tag.startsWith("AB-INPUT-RADIO")) {
                this[0].setNumber(text);

            } else if (tag.startsWith("AB-INPUT-SWITCH")) {
                this[0].setNumber(text);

            } else if (tag.startsWith("AB-INPUT-DATE")) {
                this[0].setText(text);

            } else if (tag.startsWith("AB-INPUT")) {
                this[0].setNumber(text);

            } else if (tag.startsWith("AB-SELECT")) {
                if (cancel) {
                    $(this[0].select).val(text);
                } else {
                    $(this[0].select).val(text).change();
                }
            }

            //salva valor
            if (!tag.startsWith("AB-INPUT-CHECKBOX")) {
                $(this).attr("loaded-value", $(this).getText());
            }
        }
    };

    $.fn.setOldValue = function () {
        $(this).setText($(this).attr("loaded-value"));
    };

    $.fn.isChanged = function (val) {
        var loadedValue = $(this).attr("loaded-value");
        var currentValue = $(this).getText();

        if (loadedValue || currentValue) {
            if (loadedValue !== currentValue) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    $.fn.setObject = function (val) {
        var tag = $(this)[0].nodeName;
        if (tag.startsWith("AB-SELECT")) {
            $(this).find("select").val(val).change();
        }
    }

    $.fn.getObject = function () {
        var bean = new Object();

        if ((this)[0]) {
            var tag = $(this)[0].nodeName;

            if (tag.startsWith("AB-SELECT")) {
                bean.nome = $(this).find("select option:selected").text();
                bean.valor = $(this).find("select option:selected").attr("value");
            }
        }

        return bean;
    }


    //Avisar nossos componentes quando teve uma alteracao
    var origAppend = $.fn.append;
    $.fn.append = function () {
        if ($(this).hasClass("ab-container-content") && arguments[0].hasClass("ab-block")) {
            return false;
        } else {
            return origAppend.apply(this, arguments).trigger("append");
        }
    };

    //função para retornar se o campo esrá com erro ou não
    $.fn.hasError = function () {
        if ($(this).attr("error")) {
            return true;
        } else {
            return false;
        }
    }
});


//função para arrumar bug no iOS 8
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
        position = position || 0;
        return this.indexOf(searchString, position) === position;
    };
}

String.prototype.toUpperOnlyFirstLetter = function () {
    var str = this;

    var wordMap = {
        "rg": "RG",
        "cpf": "CPF",
        "cnpj": "CNPJ",
        "rne": "RNE",
        "cep": "CEP",
        "cnh": "CNH",
        "s.a.": "S.A."
    };

    if (str && str.length == 0) {
        return "";
    } else if (str && str.length == 1) {
        return str.toUpperCase()
    } else if (str && str.length > 1) {
        str = str.substr(0, 1).toUpperCase() + str.substr(1).toLowerCase();
        return str = str.replace(/\b(rg|cpf|cnpj|rne|cep|cnh)\b|s\.a\./gi, function (word) {
            return wordMap[word.toLowerCase()];
        });
    } else {
        return "";
    }
}

String.prototype.toCamelCase = function () {
    var str = this.toLowerCase();

    var wordsArray = ["de", "sem", "o", "do", "da"];

    var words = str.split(" ");

    var fullString = new String();

    for (var i = 0; i < words.length; i++) {
        if (wordsArray.indexOf(words[i]) == -1 && words[i].length > 1) {
            words[i] = words[i].toUpperOnlyFirstLetter();
        };
    };

    fullString = words.join(" ")

    return fullString;
}

String.prototype.formatPercent = function(decimals, integers) {
    var tmp = this;
    var dec = "1";
    var formatDecimal = 0;
    var negativeCheck = false;

    if (tmp.substring(0, 1) == "-") {
        negativeCheck = true;
        tmp = tmp.substring(1, tmp.length);
    };

    if (decimals) {
        dec = dec.rpad("0", parseInt(decimals) + 1);
        formatDecimal = parseInt(decimals);
    }
    dec = parseInt(dec);

    if ((tmp && parseInt(tmp) == 0) || tmp == "" || tmp == undefined || isNaN(parseInt(tmp))) {
        tmp = 0;
    } else {
        tmp = parseFloat(tmp) / dec;
    }

    if (negativeCheck) {
        tmp = tmp * -1;
    }

    var option = {
        minimumFractionDigits: formatDecimal,
        maximumFractionDigits: formatDecimal
    };

    tmp = new Intl.NumberFormat('pt-BR', option).format(tmp);

    return tmp;
}

String.prototype.formatCurrency = function () {
    var tmp = this;
    var negativeCheck = false;

    if (tmp.substring(0, 1) == "-") {
        negativeCheck = true;
        tmp = tmp.substring(1, tmp.length);
    };

    //remove zeros a esquerda
    if (tmp) {
        // tmp = parseInt(tmp) + "";
        tmp = tmp.replace(/^0+/, '');
    }

    //Qualquer coisa diferente de um numero valido retorna 0,00
    if ((tmp && parseInt(tmp) == 0) || tmp == "" || tmp == undefined || isNaN(parseInt(tmp))) {
        return "0,00";
    }

    //Verifica se existem somente decimais, e acrescenta um zero na frente
    if (tmp && tmp.length <= 2) {
        tmp = tmp.lpad("0", 3);
    }

    //se o tamanho for
    //coloca as casas decimais
    tmp = tmp.replace(/([0-9]{2})$/g, ",$1");

    //se tiver milhar coloca ponto
    if (tmp.length > 6) {
        tmp = tmp.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    if (negativeCheck == true) {
        tmp = "-" + tmp;
    }

    return tmp;
}

String.prototype.formatDate = function (options) {
    var dia = "";
    var mes = "";
    var ano = "";
    var itens = "";
    var dataFormatada = null;
    var str = this;

    if (options) {
        //options.date != "" && options.date != 0 && options.date != null
        options.date = str;

        switch (options.srcFormat) {
            case 'ddmmyyyy':
                ano = options.date.substring(4, 8);
                mes = options.date.substring(2, 4);
                dia = options.date.substring(0, 2);
                break;

            case 'yyyymmdd':
                ano = options.date.substring(0, 4);
                mes = options.date.substring(4, 6);
                dia = options.date.substring(6, 8);
                break;

            case 'dd.mm.yyyy':
                itens = options.date.split(".");
                ano = itens[2];
                mes = itens[1];
                dia = itens[0];
                break;

            case 'dd/mm/yyyy':
                itens = options.date.split("/");
                ano = itens[2];
                mes = itens[1];
                dia = itens[0];
                break;

            case 'yyyy.mm.dd':
                itens = options.date.split(".");
                ano = itens[2];
                mes = itens[1];
                dia = itens[0];
                break;

            case 'dd-mm-yyyy':
                itens = options.date.split("-");
                ano = itens[2];
                mes = itens[1];
                dia = itens[0];
                break;

            case 'yyyy-mm-dd':
                itens = options.date.split("-");
                ano = itens[0];
                mes = itens[1];
                dia = itens[2];
                break;

            case 'yyyymm':
                ano = options.date.substring(0, 4);
                mes = options.date.substring(4, 6);
                break;

            default:
                console.log("Data inválida");
        }

        switch (options.targetFormat) {
            case 'dd/mm/yyyy':
                dataFormatada = dia + '/' + mes + '/' + ano;
                break;

            case 'yyyy/mm/dd':
                dataFormatada = ano + '/' + mes + '/' + dia;
                break;

            case 'dd.mm.yyyy':
                dataFormatada = dia + '.' + mes + '.' + ano;
                break;

            case 'yyyy.mm.dd':
                dataFormatada = ano + '.' + mes + '.' + dia;
                break;

            case 'dd-mm-yyyy':
                dataFormatada = dia + '-' + mes + '-' + ano;
                break;

            case 'yyyy-mm-dd':
                dataFormatada = ano + '-' + mes + '-' + dia;
                break;

            case 'mm/yyyy':
                dataFormatada = mes + '/' + ano;
                break;

            case 'mmyy':
                dataFormatada = mes + "" + ano.substring(2, 4);
                break;

            case 'ddmmyyyy':
                dataFormatada = dia + mes + ano;
                break;

            case 'yyyymmdd':
                dataFormatada = ano + mes + dia;
                break;

            default:
                console.log("erro");
        }
    }
    return dataFormatada;
}

String.prototype.formatTime = function (options) {
    var hora = "";
    var min = "";
    var seg = "";
    var itens = "";
    var horaFormatada = null;
    var str = this;

    if (options) {
        options.time = str;

        switch (options.srcFormat) {
            case 'hhmmss':
                hora = options.time.substring(0, 2);
                min = options.time.substring(2, 4);
                seg = options.time.substring(4, 6);
                break;

            case 'hh:mm:ss':
                itens = options.time.split(":");
                hora = itens[0];
                min = itens[1];
                seg = itens[2];
                break;

            case 'hh.mm.ss':
                itens = options.time.split(".");
                hora = itens[0];
                min = itens[1];
                seg = itens[2];
                break;

            case 'hh-mm-ss':
                itens = options.time.split("-");
                hora = itens[0];
                min = itens[1];
                seg = itens[2];
                break;

            default:
                console.log("Hora inválida");
        }

        switch (options.targetFormat) {
            case 'hh:mm:ss':
                horaFormatada = hora + ':' + min + ':' + seg;
                break;

            case 'hh.mm.ss':
                horaFormatada = hora + '.' + min + '.' + seg;
                break;

            case 'hh-mm-ss':
                horaFormatada = hora + '-' + min + '-' + seg;
                break;

            case 'hhmmss':
                horaFormatada = hora + min + seg;
                break;

            default:
                console.log("erro");
        }
    }
    return horaFormatada;
}

String.prototype.formatCpf = function () {
    var cpf = this.lpad("0", 11);
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "\$1.\$2.\$3\-\$4");
}

String.prototype.formatCnpj = function () {
    var cpf = this.lpad("0", 14);
    return cpf.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "\$1.\$2.\$3\/\$4\-$5");
}


String.prototype.dateDiff = function (srcFormat, targetData, type) {

    var dataIni = new Date(this.formatDate({
        "srcFormat": srcFormat,
        "targetFormat": "yyyy/mm/dd"
    }));
    var dataFim = new Date(targetData.formatDate({
        "srcFormat": srcFormat,
        "targetFormat": "yyyy/mm/dd"
    }));

    if (type == "dia") {
        var difDias = Math.abs(dataFim.getTime() - dataIni.getTime());
        var numDias = Math.ceil(difDias / (1000 * 3600 * 24));
        return numDias;
    } else if (type == "mes") {
        var difMeses = Math.abs(dataFim.getTime() - dataIni.getTime());
        var numMeses = Math.ceil(difMeses / (1000 * 3600 * 24 * 30) - 1);
        return numMeses;
    } else if (type == 'ano') {
        var difMeses = Math.abs(dataFim.getTime() - dataIni.getTime());
        var numMeses = Math.ceil(difMeses / (1000 * 3600 * 24 * 30) - 1);
        return Math.floor(numMeses / 12);
    }
}

String.prototype.plusDays = function (srcFormat, days) {
    var dataFormatada = this.formatDate({
        "srcFormat": srcFormat,
        "targetFormat": "yyyy/mm/dd"
    });
    var dataGerada = new Date(dataFormatada);
    var dataFinal = "";
    dataGerada.setDate(dataGerada.getDate() + days);
    var mes = new String(dataGerada.getMonth() + 1).lpad('0', 2);
    var dia = new String(dataGerada.getDate()).lpad('0', 2);
    dataFinal = dia + '/' + mes + '/' + dataGerada.getFullYear();
    return dataFinal;
}

String.prototype.minusDays = function (srcFormat, days) {
    var dataFormatada = this.formatDate({
        "srcFormat": srcFormat,
        "targetFormat": "yyyy/mm/dd"
    });
    var dataGerada = new Date(dataFormatada);
    var dataFinal = "";
    dataGerada.setDate(dataGerada.getDate() - days);
    var mes = new String(dataGerada.getMonth() + 1).lpad('0', 2);
    var dia = new String(dataGerada.getDate()).lpad('0', 2);
    dataFinal = dia + '/' + mes + '/' + dataGerada.getFullYear();
    return dataFinal;
}

String.prototype.convertToNumber = function () {
    var codeString = this.substring(1, 12);
    var letter = this.substring(0, 1).toLowerCase();
    return letter.charCodeAt(0) - 96 + codeString;
}

String.prototype.lpad = function (padString, length) {
    var str = this;
    while (str.length < length)
        str = padString + str;
    return str;
}

String.prototype.getSigla = function () {
    var sigla = "";
    var name = this;

    if (name) {
        var userName = name.replace(new RegExp(/[-]/g), "");
        userName = userName.replace(new RegExp(/[\s]+/g), " ").trim();
        userName = userName.split(" ");
        var firstName = userName[0];
        var lastName = userName[userName.length - 1];
        sigla = firstName[0] + lastName[0];
    }

    return sigla;
}

String.prototype.rpad = function (padString, length) {
    var str = this;
    while (str.length < length)
        str = str + padString;
    return str;
}

String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, "");
}

//trimming space from left side of the string
String.prototype.ltrim = function () {
    return this.replace(/^\s+/, "");
}

//trimming space from right side of the string
String.prototype.rtrim = function () {
    return this.replace(/\s+$/, "");
}