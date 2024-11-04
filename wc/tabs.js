import { LitElement, html, css } from './import.js';
import { ebus } from './import.js';

class init_element extends LitElement {
    static properties = {
        tabsId: { type: String },
        tabList: { type: Array },
        activeTab: { type: String },
    };

    constructor() {
        super();
        this.tabsId = '';
        this.tabList = [];
        this.activeTab = null;
        this.draggingTab = null;

        ebus.subscribe('tabs.init', event => this.initializeTabs(event.detail));
        ebus.subscribe('tab.insert', event => this.insertTabs(event.detail));
    }

    initializeTabs(initData) {
        if (initData.tabsId === this.tabsId) {
            this.tabList = initData.tabList;
            this.requestUpdate();
        }
    }

    insertTabs(insertData) {
        if (insertData.tabsId === this.tabsId) {
            this.tabList = [...this.tabList, ...insertData.tabList];
            this.requestUpdate();
        }
    }

    handleTabClick(tabId) {
        this.activeTab = tabId;
        const tabData = this.tabList.find(tab => tab.id === tabId);
        ebus.publish('tab.active', { tabsId: this.tabsId, tabData });
    }

    handleTabClose(tabId) {
        const tabData = this.tabList.find(tab => tab.id === tabId);
        this.tabList = this.tabList.filter(tab => tab.id !== tabId);
        if (this.activeTab === tabId) {
            this.activeTab = this.tabList.length > 0 ? this.tabList[0].id : null;
        }
        ebus.publish('tab.close', { tabsId: this.tabsId, tabData });
    }

    handleDragStart(event, tabId) {
        this.draggingTab = tabId;
    }

    handleDrop(event, targetTabId) {
        event.preventDefault();
        if (this.draggingTab && this.draggingTab !== targetTabId) {
            const draggingIndex = this.tabList.findIndex(tab => tab.id === this.draggingTab);
            const targetIndex = this.tabList.findIndex(tab => tab.id === targetTabId);
            const [draggedTab] = this.tabList.splice(draggingIndex, 1);
            this.tabList.splice(targetIndex, 0, draggedTab);
            this.draggingTab = null;
            this.requestUpdate();
        }
    }

    static styles = css`
    .tabs-container {
      display: flex;
      border-bottom: 1px solid #ccc;
    }
    .tab {
      padding: 10px;
      cursor: pointer;
      user-select: none;
      border: 1px solid transparent;
      border-radius: 4px 4px 0 0;
      margin-right: 5px;
      background: #f0f0f0;
    }
    .tab.active {
      background: white;
      border-color: #ccc;
      border-bottom: 1px solid white;
    }
    .tab:hover {
      background: #e0e0e0;
    }
    .close-btn {
      margin-left: 10px;
      cursor: pointer;
    }
  `;

    render() {
        this.addEventListener('dragover', event => event.preventDefault());
        return html`
      <div class="tabs-container">
        ${this.tabList.map(
            tab => html`
            <div
              class="tab ${this.activeTab === tab.id ? 'active' : ''}"
              draggable="true"
              @dragstart="${e => this.handleDragStart(e, tab.id)}"
              @drop="${e => this.handleDrop(e, tab.id)}"
              @click="${() => this.handleTabClick(tab.id)}"
            >
              ${tab.displayName}
              <span class="close-btn" @click="${() => this.handleTabClose(tab.id)}">&times;</span>
            </div>
          `
        )}
      </div>
    `;
    }
}

export function demo_init(tabsId) {
    const initData = {
        tabsId: tabsId,
        tabList: [
            { id: 'tab1', displayName: 'Tab 1', type: 'code', data: 'Sample data 1' },
            { id: 'tab2', displayName: 'Tab 2', type: 'code', data: 'Sample data 2' },
            { id: 'tab3', displayName: 'Tab 3', type: 'code', data: 'Sample data 3' },
            { id: 'tab4', displayName: 'Tab 4', type: 'code', data: 'Sample data 4' },
            { id: 'tab5', displayName: 'Tab 5', type: 'code', data: 'Sample data 5' },
            { id: 'tab6', displayName: 'Tab 6', type: 'code', data: 'Sample data 6' },
            { id: 'tab7', displayName: 'Tab 7', type: 'code', data: 'Sample data 7' },
            { id: 'tab8', displayName: 'Tab 8', type: 'code', data: 'Sample data 8' }
        ],
    };
    ebus.publish('tabs.init', initData);
}

export function demo_insert(tabsId) {
    const insertData = {
        tabsId: tabsId,
        tabList: [
            { id: 'tab9', displayName: 'Tab 9', type: 'code', data: 'Sample data 9' },
            { id: 'tab10', displayName: 'basic_sheet.js', type: 'code', data: 'Sample data 10' }
        ],
    };
    ebus.publish('tab.insert', insertData);
}

customElements.define('wc-tabs', init_element);
