import Vector from "./vector.js";

export let canvasEl: HTMLCanvasElement;
export let context: CanvasRenderingContext2D;
export let WIDTH: number, HEIGHT: number;

export function getScale() : number {
    return Math.min(window.innerWidth / WIDTH, window.innerHeight / HEIGHT);
}

export function getOffset() : Vector {
    const x: number = window.innerWidth / 2 - (WIDTH * getScale()) / 2;
    const y: number = window.innerHeight / 2 - (HEIGHT * getScale()) / 2;
    return new Vector(x, y);
}

export function initCanvas({canvas, width, height}: {canvas?: string; width: number; height: number}) : void {
    if (typeof canvas !== 'undefined') {
        canvasEl = <HTMLCanvasElement>document.getElementById(canvas);
    } else {
        canvasEl = <HTMLCanvasElement>document.querySelector('canvas');
    }
    
    if (!canvasEl) {
        throw Error('You must provide a canvas element for the game');
    }

    WIDTH = width;
    HEIGHT = height;

    context = <CanvasRenderingContext2D> canvasEl.getContext('2d');

    canvasEl.width = window.innerWidth;
    canvasEl.height = window.innerHeight;


    context.imageSmoothingEnabled = false;

    window.addEventListener('resize', () => {
        canvasEl.width = window.innerWidth;
        canvasEl.height = window.innerHeight;
    });

    console.log("Init Canvas Done.");
}