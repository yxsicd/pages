import { LitElement, html, css, ebus } from './import.js';

class init_element extends LitElement {
    static properties = {
        filter_keyword: { type: String },
        table_id: { type: String },
    };

    constructor() {
        super();
        this.table_id = "demo";
        this.filter_keyword = '';

    }

    handleInput(event) {
        var that = this;
        var filter_keyword = event.target.value;
        this.filter_keyword = filter_keyword;
        ebus.publish("table.filter", {
            filter_keyword: filter_keyword,
            table_id: that.table_id
        })
        // 其他操作
    }

    render() {
        return html` Search: <input type="text" .value="${this.filter_keyword}" @input=${this.handleInput} />
        `;
    }
}

customElements.define('table-filter', init_element);
