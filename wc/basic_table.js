import { LitElement, html, css, ebus } from './import.js';

import { } from './table_filter.js'


class init_element extends LitElement {
  static properties = {
    heightPercent: { type: Number, attribute: 'heightpercent' },
    widthPercent: { type: Number, attribute: 'widthpercent' },
    init_rows: { type: Array },
    filter_rows: { type: Array },
    filter_keyword: { type: String },
    table_id: { type: String },
  };

  constructor() {
    super();
    this.table_id = "demo";
    this.heightPercent = 50;
    this.widthPercent = 80;
    this.jsonPath = 'a';
    this.init_rows = [];
    this.filter_rows = [];
    this.filter_keyword = '';

    var that = this;
    ebus.subscribe('table.init', function (msg) {
      if (!msg.detail) {
        return;
      }
      var init_data = msg.detail;
      if (init_data.table_id != that.table_id) {
        return;
      }
      that.init_rows = init_data.init_rows;
      that.filter_rows = that.init_rows;
    });


    ebus.subscribe('table.filter', function (msg) {
      if (!msg.detail) {
        return;
      }
      var filter_data = msg.detail;

      if (filter_data.table_id != that.table_id) {
        return;
      }
      that.filter_keyword = filter_data.filter_keyword;
      that.filter_rows = that.init_rows.filter(x => { if (JSON.stringify(x).match(that.filter_keyword)) { return true }; return false; })
    });

  }

  static styles = css`
        :host {
          display: block;
          box-sizing: border-box;
        }
        .table-container {
          width: var(--table-width, 80%);
          height: var(--table-height, 50%);
          overflow: auto;
          border: 1px solid #ccc;
          box-shadow: 2px 2px 12px rgba(0,0,0,0.1);
          margin: 0 auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 600px;
        }
        th, td {
          padding: 12px 15px;
          border: 1px solid #ddd;
          text-align: left;
        }
        th {
          background-color: #f4f4f4;
          position: sticky;
          top: 0;
          z-index: 1;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        tr:hover {
          background-color: #f1f1f1;
        }
      `;

  render() {
    this.style.setProperty('--table-height', `${this.heightPercent}vh`);
    this.style.setProperty('--table-width', `${this.widthPercent}vw`);

    var cols = [];
    if (!this.filter_rows || this.filter_rows.length === 0) { cols = []; } {
      var cols1 = new Set();
      this.filter_rows.forEach(item => {
        Object.keys(item).forEach(key => cols1.add(key));
      });
      cols = Array.from(cols1);
    }

    return html`
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  ${cols.map(col => html`<th>${col}</th>`)}
                </tr>
              </thead>
              <tbody>
                ${this.filter_rows.map(row => html`
                  <tr>
                    ${cols.map(col => html`<td>${row[col] !== undefined ? row[col] : ''}</td>`)}
                  </tr>
                `)}
              </tbody>
            </table>
          </div>
        `;
  }
}

customElements.define('basic-table', init_element);
