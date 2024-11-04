import { LitElement, html, css } from "../import.js";
import { } from "../rect3d.js";


class init_element extends LitElement {
    static properties = {
    };

    constructor() {
        super();
    }


    mul_div() {
        var all_div = [];
        for (var i = 0; i < 1; i++) {
            all_div.push(html`<rect-3d></rect-3d>`);
        }
        return all_div;
    }


    render() {
        return html`
             ${this.mul_div()}  
        
        `
    }

}

customElements.define("page-3d-demo", init_element);