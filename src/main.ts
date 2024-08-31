import Notifications from "./notifications.js";
import { on } from "./Engine/events.js";
import { initCanvas } from "./Engine/core.js";
import Game from "./Game/Game.js";

const notify = new Notifications("notifications");

on("gamepadConnected", (name: string) => {
    notify.triger('<i class="fa-solid fa-gamepad"></i>', "Gamepad Connected", name)
});

on("gamepadDisconnected", (name: string) => {
    notify.triger('<i class="fa-solid fa-gamepad"></i>', "Gamepad Disconnected", name)
});

window.oncontextmenu = (e) => {e.preventDefault()};
window.addEventListener('load', function(){
    initCanvas({width: 1920, height: 1080});
    new Game();
});