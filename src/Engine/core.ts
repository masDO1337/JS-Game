export type WINDOWType = {
    canvasEl: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    virtualEnable: boolean, 
    width: number,
    height: number,
    scale: number,
    x: number,
    y: number
}

let WINDOW: WINDOWType;

export function getVWindow() : WINDOWType {
    return WINDOW;
}

export function getContext() : CanvasRenderingContext2D {
    return WINDOW.context;
}

function getWindowScale() : number {
    return Math.min(WINDOW.canvasEl.width / WINDOW.width, WINDOW.canvasEl.height / WINDOW.height);
}

function getWindowX() : number{
    return WINDOW.canvasEl.width / 2 - (WINDOW.width * getWindowScale()) / 2;

}

function getWindowY() : number{
    return WINDOW.canvasEl.height / 2 - (WINDOW.height * getWindowScale()) / 2;
}

export function clear() : void {
    WINDOW.context.clearRect(0, 0, WINDOW.canvasEl.width, WINDOW.canvasEl.height);
}

export function resize(width: number, height: number) : void {
    WINDOW.width = width;
    WINDOW.height = height;
}

export function windowResize() : void {
    WINDOW.context.translate(getWindowX(), getWindowY());
    WINDOW.context.scale(getWindowScale(), getWindowScale());
}

export function initCanvas({canvas, width, height, virtual = false}: {canvas?: string; width: number; height: number; virtual?: boolean}) : WINDOWType {

    let canvasEl: HTMLCanvasElement;

    if (typeof canvas !== 'undefined') {
        canvasEl = <HTMLCanvasElement>document.getElementById(canvas);
    } else {
        canvasEl = <HTMLCanvasElement>document.querySelector('canvas');
    }
    
    if (!canvasEl) {
        throw Error('You must provide a canvas element for the game');
    }

    WINDOW = {
        canvasEl,
        context: <CanvasRenderingContext2D> canvasEl.getContext('2d'),
        virtualEnable: virtual,
        width,
        height,
        scale: 1,
        x: 0,
        y: 0
    }

    WINDOW.context.imageSmoothingEnabled = false;

    window.addEventListener('resize', () => {
        if (!virtual) return;
        WINDOW.canvasEl.width = window.innerWidth;
        WINDOW.canvasEl.height = window.innerHeight;
        WINDOW.scale = getWindowScale();
        WINDOW.x = getWindowX();
        WINDOW.y = getWindowY();
    });

    if (virtual) {
        WINDOW.canvasEl.width = window.innerWidth;
        WINDOW.canvasEl.height = window.innerHeight;
        WINDOW.scale = getWindowScale();
        WINDOW.x = getWindowX();
        WINDOW.y = getWindowY();
    } else {
        WINDOW.canvasEl.width = width;
        WINDOW.canvasEl.height = height;
    }

    return WINDOW;
}