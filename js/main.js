import { palette } from "./color/interpolation.js";
import { scaleLinear } from "./ScaleLinear/scaleLinear.js";

let columns;
let worker;

window.onresize = () => {
    // TODO
};

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const zoomSpan = document.getElementById("zoom-level");
let zoomLevel = 0;
zoomSpan.zoomLevel = zoomLevel;

const zoomInput = document.getElementById("zoom-factor");
let zoomFactor = 0.1;
zoomInput.value = zoomFactor;

const iterationInput = document.getElementById("iterations")
let iterations = 1000;
iterationInput.value = iterations;

const zoomButton = document.getElementById("zoom-button");
zoomButton.addEventListener("click", () => {
    zoomFactor = +zoomInput.value;
})

const iterationButton = document.getElementById("iteration-button");
iterationButton.addEventListener("click", () => {
    iterations = +iterationInput.value;
    startWorker();
})

let HEIGHT = window.innerHeight;
let WIDTH = Math.floor(HEIGHT * 3 / 2);

ctx.canvas.height = HEIGHT;
ctx.canvas.width = WIDTH;

let xSection = { from: -2, to: 1 };
let ySection = { from: -1, to: 1 };

const colors = palette();
colors.unshift("#000");

startWorker()

canvas.addEventListener("click", (e) => {
    changeZoomLevel(1);

    const zoomedW = WIDTH * zoomFactor;
    const zoomedH = HEIGHT * zoomFactor;
    const coords = getCursorPosition(canvas, e);
    setNewSections(coords, zoomedW, zoomedH)
    
    startWorker();
})

canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault();

    changeZoomLevel(-1);

    const zoomedW = WIDTH * (zoomFactor + 1) * 2;
    const zoomedH = HEIGHT * (zoomFactor + 1) * 2;
    const coords = getCursorPosition(canvas, e);
    setNewSections(coords, zoomedW, zoomedH)
    
    startWorker();
})

function startWorker(){
    if(worker) worker.terminate();

    worker = new Worker("/js/worker.js");
    worker.postMessage({
        setup: true,
        WIDTH,
        HEIGHT,
        xSection,
        ySection,
        iterations
    });
    worker.onmessage = nextCol;
    columns = [...Array(WIDTH).keys()];
    worker.postMessage({ col: columns.shift() })
}

function nextCol(response) {
    if (columns.length > 0){
        worker.postMessage({ col: columns.shift() })
    }
    const { col, results } = response.data;
    for(let i = 0; i < HEIGHT; i++){
        const [iterations, isMandelbrotSet] = results[i];
        ctx.fillStyle = colors[isMandelbrotSet ? 0 : (iterations % colors.length - 1) + 1];
        ctx.fillRect(col, i, 1, 1);
    }
}

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return [x, y];
}

function setNewSections(pixelCoords, zoomedW, zoomedH){
    const [clickX, clickY] = pixelCoords;

    const pixelXExtent = [clickX - zoomedW, clickX + zoomedW];
    const pixelYExtent = [clickY + zoomedH, clickY - zoomedH]

    const xScale = scaleLinear([xSection.from, xSection.to], [0, WIDTH]);
    const yScale = scaleLinear([ySection.from, ySection.to], [0, HEIGHT]);

    xSection = {from: xScale(pixelXExtent[0]), to: xScale(pixelXExtent[1])};
    ySection = {from: yScale(pixelYExtent[0]), to: yScale(pixelYExtent[1])};
}

function changeZoomLevel(amount){
    zoomLevel += amount;
    zoomSpan.innerText = zoomLevel;
}
