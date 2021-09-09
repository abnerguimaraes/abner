"use strict";

//component-wrapper: bradesco-input-password-underline
class AbPassword extends AbInput {

    constructor() {
        super();

        this.childClass = "ab-password";
        // this.img = document.createElement("img");
        this.errorChild = false;

        this._addEventChild();
    }

    _renderChild() {
        //Coloca classe principal do objeto
        this.classList.add(this.childClass);

        this.input.setAttribute("type", "password");

        if (this.getAttribute("keyboard") == "number") {
            this.input.setAttribute("pattern", "[0-9]*");
        }

        if (!this.hasAttribute("maxlength")) {
            this.input.setAttribute("maxlength", "10");
        }

    }

    _addEventChild() {
        var _this = this;

        //Ir para o próximo item quando apertar enter
        $(this.input).on("keydown", function (e) {
            return goToNextTabindex(e, $(this), "tap");
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
        return ["id", "error", "is-disabled", "label", "width", "maxlength", "width-on-bigscreen", "tab-index", "goto-tab-index", "value", "visible", "description"];
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        super.attributeChangedCallback(attrName, oldVal, newVal);

        if (attrName == "description") {
            this.span.innerText = newVal;
        }
    }

}
customElements.define('ab-password', AbPassword);