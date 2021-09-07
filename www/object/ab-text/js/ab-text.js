"use strict";

class AbText extends AbInput {

    constructor() {
        super();

        this.childClass = "ab-text";
        this.errorChild = false;

        this.abner = new AbnerUtils();

        this._addEventChild();
    }

    _renderChild() {
        //adiciona class
        this.classList.add(this.childClass);
    }

    _addEventChild() {
        var input = $(this.input);
        var _this = this;
        var abner = new AbnerUtils();

        //evento change quando alterar o valor do input
        input.on("change", function (e) {
            e.preventDefault();

            if (_this.getAttribute("letters-only") == "true" && this.value.length > 0) {
                var text = abner.removeAccent(this.value);
                this.value = text;
                var textmatch = this.value.match(/^[A-Za-z ]+$/);
                if (textmatch == null) {
                    _this.setAttribute("error", "É permitido apenas letras");
                    this.errorChild = true;
                } else {
                    if (!this.errorParent) {
                        _this.removeAttribute("error");
                    }
                    this.errorChild = false;
                }
            };
        });
    }

    connectedCallback() {
        if (!this.classList.contains(this.childClass)) {
            /*this.shadowDom = this.attachShadow({
                mode: 'open'
            }); */
            super.connectedCallback();
            this._renderChild();
        }
    }

    static get observedAttributes() {
        return ['id', 'error', 'is-disabled', 'label', 'width', 'maxlength', 'width-on-bigscreen', 'tab-index', 'goto-tab-index', 'value'];
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        super.attributeChangedCallback(attrName, oldVal, newVal);
    }

}

customElements.define('ab-text', AbText);