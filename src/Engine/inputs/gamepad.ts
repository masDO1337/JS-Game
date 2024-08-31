import { on, emit } from "../events.js";
import Vector from "../vector.js";

export type gamepadButtonName = "south" |
    "east" |
    "west" |
    "north" |
    "leftShoulder" |
    "rightShoulder" |
    "leftTrigger" |
    "rightTrigger" |
    "select" |
    "start" |
    "leftStick" |
    "rightStick" |
    "leftStickButton" |
    "rightStickButton" |
    "dpadUp" |
    "dpadDown" |
    "dpadLeft" |
    "dpadRight" |
    "logoButton";

const gamepadMap: string[] = [
    'south',
    'east',
    'west',
    'north',
    'leftShoulder',
    'rightShoulder',
    'leftTrigger',
    'rightTrigger',
    'select',
    'start',
    'leftStickButton',
    'rightStickButton',
    'dpadUp',
    'dpadDown',
    'dpadLeft',
    'dpadRight',
    'logo'
];

type gamepadButtonT = {pressed: boolean; value: number};
type buttonsType = {[key: string]: gamepadButtonT};
type axesType = {leftStick: Vector, rightStick: Vector}

type gamepadType = {buttons: buttonsType, axes: axesType}

let deadZone: number;

let gamepads: gamepadType[] = [];

function gamepadConnectedHandler(event: GamepadEvent) {
    emit("gamepadConnected", event.gamepad.id);
    
    gamepads[event.gamepad.index] = {
        buttons: {},
        axes: {
            leftStick: new Vector(), 
            rightStick: new Vector()
        }
    };
}

function gamepadDisconnectedHandler(event: GamepadEvent) {
    emit("gamepadDisconnected", event.gamepad.id);
    
    delete gamepads[event.gamepad.index];
}

function blurEventHandler() {
    gamepads.map(gamepad => {
        gamepad.buttons = {};
        gamepad.axes = {
            leftStick: new Vector(), 
            rightStick: new Vector()
        }
    });
}

function isDeadZone(n: number): boolean {
    return n < deadZone && n > -deadZone;
}

function updateGamepad() {
    let pads = navigator.getGamepads();
    
    for (let i = 0; i < pads.length; i++) {
        let gamepad = pads[i];

        // a GamepadList will have a default length of 4 but use null for
        // any index that doesn't have a gamepad connected
        if (!gamepad) continue;

        let { buttons, axes } = gamepads[gamepad.index];

        gamepad.buttons.map((button, index) => {
            let buttonName = gamepadMap[index];
            let { pressed, value } = button;

            let state = buttons[buttonName];

            if (pressed) {
                buttons[buttonName] = {pressed, value};
            } else if (state?.pressed && !pressed) {
                delete buttons[buttonName];
            }
        });

        axes.leftStick.x = gamepad.axes[0]; 
        axes.leftStick.y = gamepad.axes[1];

        axes.rightStick.x = gamepad.axes[2]; 
        axes.rightStick.y = gamepad.axes[3];
    }
}

export function gamepadButton(name: gamepadButtonName, id: number = 0) : gamepadButtonT {
    if (gamepads.length === 0) return {pressed: false, value: 0};
    let pressedButton = gamepads[id].buttons[name];
    if (pressedButton !== undefined) return pressedButton;
    return {pressed: false, value: 0};
}

export function gamepadAxes(name: "leftStick" | "rightStick", id: number = 0) : Vector {
    if (gamepads.length === 0) return new Vector();
    return gamepads[id].axes[name];
}

export function initGamepad(deadzone: number = 0.05) {
    window.addEventListener('gamepadconnected', gamepadConnectedHandler);
    window.addEventListener('gamepaddisconnected', gamepadDisconnectedHandler);
    window.addEventListener('blur', blurEventHandler);

    deadZone = deadzone;

    // update gamepad state each frame
    on('tick', updateGamepad);
}