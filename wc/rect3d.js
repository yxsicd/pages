// src/Histogram3D.js
import { LitElement, html, css } from './import.js';


export class init_element extends LitElement {
    static properties = {
        data: { type: Array }
    }

    constructor() {
        super();
        this.data = [1, 6, 3, 11, 5, 6];
    }

    static styles = css`
    :host {
        width: 50vw;
        height: 50vh;
    }
    canvas {
        width: 50vw;
        height: 50vh;
    }
`;

    firstUpdated() {
        this.initBabylon();
    }

    initBabylon() {
        const canvas = this.renderRoot.querySelector('canvas');
        const engine = new BABYLON.Engine(canvas, true);

        const createScene = () => {
            const scene = new BABYLON.Scene(engine);
            scene.clearColor = new BABYLON.Color4(1, 1, 1, 1);

            // 相机
            const camera = new BABYLON.ArcRotateCamera(
                'camera',
                Math.PI / 2,
                Math.PI / 4,
                20,
                new BABYLON.Vector3(0, 0, 0),
                scene
            );
            camera.attachControl(canvas, true);

            // 光源
            const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);
            light.intensity = 0.7;

            // 光源
            const light2 = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, -1, 0), scene);
            light2.intensity = 0.2;

            // 光源
            const light3 = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(-1, 1, 0), scene);
            light3.intensity = 0.2;

            // 创建地面
            const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 10, height: 10 }, scene);

            // 创建直方图
            this.createHistogram(scene, this.data);

            return scene;
        };

        const scene = createScene();

        engine.runRenderLoop(() => {
            scene.render();
        });

        window.addEventListener('resize', () => {
            engine.resize();
        });
    }

    createHistogram(scene, data) {
        const barWidth = 0.8;
        const spacing = 1.0;

        const max = Math.max(...data);
        const scaleFactor = 5 / max; // 调整高度

        data.forEach((value, index) => {
            const height = value * scaleFactor;

            const box = BABYLON.MeshBuilder.CreateBox(`bar-${index}`, { width: barWidth, depth: barWidth, height }, scene);
            box.position.x = index * spacing - (data.length * spacing) / 2;
            box.position.y = height / 2;

            // 材质
            const material = new BABYLON.StandardMaterial(`material-${index}`, scene);
            material.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
            box.material = material;
        });
    }

    render() {
        return html`<canvas></canvas>`;
    }
}

customElements.define('rect-3d', init_element);
