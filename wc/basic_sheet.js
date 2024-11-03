import { LitElement, html, css } from './import.js';

class init_element extends LitElement {
    static styles = css`
        #luckysheet {
            margin: 0;
            padding: 0;
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
        }
    `;

    constructor() {
        super();
        this.count = 333; // 可以通过属性传递count值
    }

    firstUpdated() {
        this.loadLuckysheetScripts().then(() => {
            this.initLuckysheet();
            this.setupMessageListener();
        });
    }

    loadLuckysheetScripts() {
        return new Promise((resolve) => {
            // 添加 CSS 文件
            const cssFiles = [
                'https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/plugins/css/pluginsCss.css',
                'https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/plugins/plugins.css',
                'https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/css/luckysheet.css',
                'https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/assets/iconfont/iconfont.css'
            ];
            cssFiles.forEach(href => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = href;
                document.head.appendChild(link);
            });

            // 添加 JS 文件
            const scriptFiles = [
                'https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/plugins/js/plugin.js',
                'https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/luckysheet.umd.js'
            ];
            const loadScripts = scriptFiles.map(src => {
                return new Promise((scriptResolve) => {
                    const script = document.createElement('script');
                    script.src = src;
                    script.onload = scriptResolve;
                    document.body.appendChild(script);
                });
            });

            Promise.all(loadScripts).then(resolve);
        });
    }

    initLuckysheet() {
        const options = {
            container: 'luckysheet', // luckysheet为容器id
            showinfobar: false, // 是否显示顶部信息栏
            row: 256,
            column: 16,
        };
        // 确保 Luckysheet 脚本已加载
        if (window.luckysheet) {
            window.luckysheet.create(options);
        }
    }

    setupMessageListener() {
        window.addEventListener('message', (event) => {
            const data = event.data;
            console.log(event);

            let i = 0;
            Object.keys(window).sort().forEach(key => {
                let value = '';
                if (typeof window[key] === 'string' || typeof window[key] === 'number' || typeof window[key] === 'boolean') {
                    value = window[key];
                }
                window.luckysheet.setCellValue(i, 0, key, { order: 0 });
                window.luckysheet.setCellValue(i, 1, typeof window[key], { order: 0 });
                window.luckysheet.setCellValue(i, 2, value, { order: 0 });
                i++;
            });
        });
    }

    render() {
        return html`
            <div id="luckysheet"></div>
        `;
    }
}

customElements.define('basic-sheet', init_element);
