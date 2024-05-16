import { initCanvas } from "./Engine/core.js";
import Game from "./Game/Game.js";

window.oncontextmenu = (e) => {e.preventDefault()};
window.addEventListener('load', function(){
    initCanvas({width: 1920, height: 1080, virtual: true});
    new Game();
});