import { canvasEl, context, getScale, getOffset } from './core.js';
import { emit } from './events.js';

export default class Loop {

    constructor(fps = 60, blur = false) {

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
        let last: number, dt: number;

        let update = this.update;
        let render = this.render;

        function frame(now: number) : void {
            requestAnimationFrame(frame);
    
            dt = now - last;
            last = now;

            if (!focused) return;
    
            emit('tick');
            accumulator += dt;
    
            while (accumulator >= delta) {
                update(step);
    
                accumulator -= delta;
            }
            context.clearRect(0, 0, canvasEl.width, canvasEl.height);
            context.save();
            const offset = getOffset();
            context.translate(offset.x, offset.y);
            context.scale(getScale(), getScale());
            render(context);
            context.restore();
        }

        requestAnimationFrame(frame);
    }

    update(dt: number): void {}
    render(context: CanvasRenderingContext2D): void {}
}