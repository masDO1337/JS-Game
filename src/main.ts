import { init, clear } from "./Engine/core.js";
import GameLoop from "./Engine/gameLoop.js";
import { gamepadButtonName, gamepad, gamepadMap, initGamepad } from "./Engine/inputs/gamepad.js";
initGamepad();
function Game() : void {

    let {canvas, context} = init();
    
    let loop = GameLoop({
        update: (dt: number) => {
            [...gamepadMap, "leftStick", "rightStick"].map(value => {
                let b = gamepad(<gamepadButtonName>value);
                if (b.pressed) console.log(value, b);
            });
        },
        render: () => {
            clear();
        }
    });
    
    loop.start();
}

window.oncontextmenu = (e) => {e.preventDefault()};
window.onload = Game;