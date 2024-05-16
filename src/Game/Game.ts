import { getVWindow } from "../Engine/core.js";
import GameLoop from "../Engine/gameLoop.js";

export default class Game {

    private WINDOW = getVWindow();

    private loop = GameLoop();

    constructor() {
        this.loop.update = (dt) => this.update(dt);
        this.loop.render = (context) => this.render(context);

        this.loop.start();
    }

    update(dt: number) : void {

    }

    render(context: CanvasRenderingContext2D) : void {

        context.fillStyle = "#ff00ff";
        context.fillRect(0, 0, this.WINDOW.width, this.WINDOW.height);
    }
}