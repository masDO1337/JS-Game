import Loop from "../Engine/Loop.js";
import { WIDTH, HEIGHT } from "../Engine/core.js";
import { initGamepad } from "../Engine/inputs/gamepad.js";

export default class Game extends Loop {
    constructor(){
        super();
        initGamepad();
    }

    update(dt: number): void {
        
    }

    render(context: CanvasRenderingContext2D): void {
        context.fillStyle = "#f0f";
        context.fillRect(0, 0, WIDTH, HEIGHT);
    }
}