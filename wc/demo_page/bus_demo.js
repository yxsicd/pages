import { LitElement, html, css, ebus } from '../import.js';

class bus_demo extends LitElement {
    static properties = {
        message: { state: true },
        prop4: { type: String },
    };

    constructor() {
        super();
        this.message = "good";
        this.prop4 = "p4";

        const that = this;
        ebus.subscribe('good_message', function (msg) {
            that.message = msg.detail;
        })

        ebus.subscribe('good_message', function (msg) {
            console.log(msg);
        })

    }

    send_message(msg) {
        ebus.publish("good_message", { time: new Date().toISOString(), msg: msg })
    }

    render() {
        var msg = JSON.stringify(this.message);
        var rows = [1, 2, 3, 4, 5];

        var h_rows = rows.map(x => {
            return html`<h3 style='color:red' @click=${function () {
                this.send_message("msg_" + x);
            }}>${msg}</h3>`
        })

        return html`
        <input type="checkbox" .value="${this.prop4}"/>
        ${h_rows}
        
        `
    }
}

customElements.define('bus-demo', bus_demo);
