import { getVWindow } from './core.js';
import { emit } from './events.js';


type GameLoopType = { 
    fps?: number;
    update?: (dt: number) => void;
    render?: (context: CanvasRenderingContext2D) => void;
    blur?: boolean;
};

type LoopType = {
    update: (dt: number) => void;
    render: (context: CanvasRenderingContext2D) => void;
    isStopped: boolean;
    start: () => void;
    stop: () => void;
};

export default function GameLoop({
    fps = 60,
    update = () => {},
    render = () => {},
    blur = false
}: GameLoopType = {}) : LoopType {
    let WINDOW = getVWindow();

    let focused: boolean = true;

    if (!blur) {
        window.addEventListener('focus', () => {
            focused = true;
        });
        window.addEventListener('blur', () => {
            focused = false;
        });
    }

    let accumulator: number = 0;
    let delta: number = 1e3 / fps; // delta between performance.now timings (in ms)
    let step: number = 1 / fps;
    let last: number, rAF: number, now: number, dt: number;

    let loop = {
        update,
        render,
        isStopped: true,
        start() {
            last = performance.now();
            this.isStopped = false;
            requestAnimationFrame(frame);
        },

        stop() {
            this.isStopped = true;
            cancelAnimationFrame(rAF);
        },
    };

    function frame() : void {
        rAF = requestAnimationFrame(frame);
    
        // don't update the frame if tab isn't focused
        if (!focused) return;
    
        now = performance.now();
        dt = now - last;
        last = now;
    
        // prevent updating the game with a very large dt if the game
        // were to lose focus and then regain focus later
        if (dt > 1e3) return;
    
        emit('tick');
        accumulator += dt;
    
        while (accumulator >= delta) {
            loop.update(step);
    
            accumulator -= delta;
        }
        WINDOW.context.clearRect(0, 0, WINDOW.canvasEl.width, WINDOW.canvasEl.height);
        WINDOW.context.save();
        WINDOW.context.translate(WINDOW.x, WINDOW.y);
        WINDOW.context.scale(WINDOW.scale, WINDOW.scale);
        loop.render(WINDOW.context);
        WINDOW.context.restore();
    }

    return loop;
}