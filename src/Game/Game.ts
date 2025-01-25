import Loop from "../Engine/Loop.js";
import Input from "./Input.js";
import Player from "./Entity/Player.js";

export default class Game {

    private player: Player = new Player();

    constructor(){
        new Loop(dt=>this.update(dt), context=>this.render(context));
        new Input();
    }

    update(dt: number): void {
        this.player.update(dt);
    }

    render(context: CanvasRenderingContext2D): void {
        this.player.render(context);
    }
}