import { canvasEl, context, getScale, getOffset } from './core.js';
import { emit } from './events.js';

export default class Loop {

    private focused: boolean = true;

    private accumulator: number = 0;
    private delta: number;
    private step: number;
    private last: number = 0;
    private dt: number = 0;

    private frame

    constructor(update: (dt:number) => void, render: (context: CanvasRenderingContext2D) => void, fps = 60, blur = false) {

        if (!blur) {
            window.addEventListener('focus', () => {
                this.focused = true;
            });
            window.addEventListener('blur', () => {
                this.focused = false;
            });
        }

        this.delta = 1e3 / fps; // delta between performance.now timings (in ms)
        this.step = 1 / fps;
        
        this.frame = (now: number) => {
            requestAnimationFrame(this.frame);
    
            this.dt = now - this.last;
            this.last = now;
    
            if (!this.focused) return;
    
            emit('tick');
            this.accumulator += this.dt;
    
            while (this.accumulator >= this.delta) {
                update(this.step);
    
                this.accumulator -= this.delta;
            }
            context.clearRect(0, 0, canvasEl.width, canvasEl.height);
            context.save();
            const offset = getOffset();
            context.translate(offset.x, offset.y);
            context.scale(getScale(), getScale());
            render(context);
            context.restore();
        }
        requestAnimationFrame(this.frame);
    }
}