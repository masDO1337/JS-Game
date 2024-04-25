import { init, clear } from "./Engine/core.js";
import GameLoop from "./Engine/gameLoop.js";
import { gamepadButtonName, gamepad, gamepadMap, initGamepad } from "./Engine/inputs/gamepad.js";
import GameObject from "./Engine/gameObject.js"

initGamepad();

class Player extends GameObject {
    constructor({...props}) {
        super({...props});
    }

    draw(context: CanvasRenderingContext2D): void {
        context.fillStyle = "red";
        context.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

let {canvas, context} = init();
let p = new Player({x: 20, y: 20, width: 50, height: 50});
    
let loop = GameLoop({
    update: (dt: number) => {
        p.update(dt);
        [...gamepadMap, "leftStick", "rightStick"].map(value => {
            let b = gamepad(<gamepadButtonName>value);
            if (b.pressed) console.log(value, b);
        });
    },
    render: () => {
        p.render(context);
    }
});
    
loop.start();

window.oncontextmenu = (e) => {e.preventDefault()};