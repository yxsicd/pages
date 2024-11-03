import { LitElement, html, css, ebus } from '../wc/import.js';
import { } from '../wc/basic_table.js';


function init_table(table_id, row_count, column_count) {
    var rc = row_count ? row_count : 100;
    var cc = column_count ? column_count : 5;

    var init_rows = [
    ];
    for (var i = 0; i < rc; i++) {
        var row = {};
        for (var j = 0; j < cc; j++) {
            row["f_" + j] = "v_" + i + "_" + j;
        }
        init_rows.push(row);
    }


    ebus.publish('table.init', {
        table_id: table_id, init_rows: init_rows
    })
}

class init_element extends LitElement {
    static properties = {
    };

    constructor() {
        super();
    }

    firstUpdated() {
        this.init_page();
    }

    init_page() {
        init_table("d1", 10, 4);
        init_table("d2", 400, 3);
    }

    render() {
        return html` 
    <button @click=${this.init_page}>init</button>
    <table-filter table_id="d1"></table-filter>
    <table-filter table_id="d2"></table-filter>
    <!-- Use the dynamic-table component -->
    <basic-table heightpercent="30" widthpercent="80" table_id="d1"></basic-table>
    <basic-table heightpercent="30" widthpercent="80" table_id="d2"></basic-table>
        `;
    }
}

customElements.define('table-demo', init_element);



