import { initKeybourd, keyPressed } from "../Engine/inputs/keybourd.js";
import { gamepadAxes, initGamepad } from "../Engine/inputs/gamepad.js";
import { emit, on } from "../Engine/events.js";

export default class Input {
    constructor() {
        initKeybourd();
        initGamepad();
        on('tick', this.tick);
    }

    tick() : void {
        let movement = gamepadAxes("leftStick");

        if (keyPressed("w")) movement.y = -1;
        if (keyPressed("s")) movement.y = 1;
        if (keyPressed("a")) movement.x = -1;
        if (keyPressed("d")) movement.x = 1;

        emit("movement", movement)
    }
}