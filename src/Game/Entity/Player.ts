import { on } from "../../Engine/events.js";
import GameObject from "../../Engine/gameObject.js";
import Vector from "../../Engine/vector.js";

export default class Player extends GameObject {

    private speed: number = 85
    
    constructor() {
        super({width:50, height:50});

        on("movement", (movement: Vector) => {
            this.vx = this.speed * movement.x;
            this.vy = this.speed * movement.y;
        })
    }

    draw(context: CanvasRenderingContext2D): void {
        context.fillStyle = "#f00";
        context.fillRect(0, 0, this.width, this.height);
    }
}