import { emit } from "./events.js";

let canvasEl: HTMLCanvasElement, context: CanvasRenderingContext2D;
let fullWindow: boolean = true;

export function getCanvas() : HTMLCanvasElement {
    return canvasEl;
}

export function getContext() : CanvasRenderingContext2D {
    return context;
}

export function clear() : void {
    context.clearRect(0, 0, canvasEl.width, canvasEl.height);
}

function resize(w: number = window.innerWidth, h: number = window.innerHeight) : void {
    canvasEl.width = w;
    canvasEl.height = h;
}

type initType = {
    canvas?: string;
    width?: number;
    height?: number;
}

export function init({canvas, width, height}: initType = {}) : {canvas: HTMLCanvasElement, context: CanvasRenderingContext2D} {

    if (typeof canvas !== 'undefined') {
        canvasEl = <HTMLCanvasElement>document.getElementById(canvas);
    } else {
        canvasEl = <HTMLCanvasElement>document.querySelector('canvas');
    }
    
    if (!canvasEl) {
        throw Error('You must provide a canvas element for the game');
    }

    if (typeof width !== 'undefined' && typeof height !== 'undefined') {
        resize(width, height);
    } else resize();

    context = <CanvasRenderingContext2D>canvasEl.getContext('2d');
    context.imageSmoothingEnabled = false;

    if (!fullWindow) {
        window.addEventListener('resize', () => { resize(); });
    }

    emit('init');

    return { canvas: canvasEl, context };
}