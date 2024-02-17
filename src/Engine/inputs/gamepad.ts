import { on } from "../events.js";

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

type gamepadButtonT = { pressed: boolean; value: number, x?: number, y?: number};
type buttonsType = {[key: string]: gamepadButtonT};
type axesType = {leftStick: gamepadButtonT, rightStick: gamepadButtonT}

type gamepadType = {pressedButtons: buttonsType, axes: axesType}

let deadZone: number;

let gamepads: gamepadType[] = [];

export const gamepadMap: string[] = [
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

function gamepadConnectedHandler(event: GamepadEvent) {
    gamepads[event.gamepad.index] = {
        pressedButtons: {},
        axes: {
            leftStick: {pressed: false, value: NaN, x: 0, y: 0}, 
            rightStick: {pressed: false, value: NaN, x: 0, y: 0}
        }
    };
}

function gamepadDisconnectedHandler(event: GamepadEvent) {
    delete gamepads[event.gamepad.index];
}

function blurEventHandler() {
    gamepads.map(gamepad => {
        gamepad.pressedButtons = {};
        gamepad.axes = {
            leftStick: {pressed: false, value: NaN, x: 0, y: 0}, 
            rightStick: {pressed: false, value: NaN, x: 0, y: 0}
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

        let { pressedButtons, axes } = gamepads[gamepad.index];

        gamepad.buttons.map((button, index) => {
            let buttonName = gamepadMap[index] as gamepadButtonName;
            let { pressed, value } = button;

            let state = pressedButtons[buttonName];

            if (pressed) {
                pressedButtons[buttonName] = {pressed, value};
            } else if (state?.pressed && !pressed) {
                delete pressedButtons[buttonName];
            }
        });

        if (!isDeadZone(gamepad.axes[0]) || !isDeadZone(gamepad.axes[1])) axes.leftStick.pressed = true;
        else axes.leftStick.pressed = false;
        axes.leftStick.x = gamepad.axes[0]; 
        axes.leftStick.y = gamepad.axes[1];

        if (!isDeadZone(gamepad.axes[2]) || !isDeadZone(gamepad.axes[3])) axes.rightStick.pressed = true;
        else axes.rightStick.pressed = false;
        axes.rightStick.x = gamepad.axes[2]; 
        axes.rightStick.y = gamepad.axes[3];
    }
}

function isAxes(name: gamepadButtonName) : boolean {
    return ["leftStick","rightStick"].includes(name);
}

export function gamepad(name: gamepadButtonName | keyof axesType, id: number = 0) : gamepadButtonT {
    if (gamepads.length === 0) return {pressed: false, value: 0, x: 0, y: 0};
    let pressedButton = gamepads[id].pressedButtons[name];
    if (pressedButton !== undefined) return pressedButton;
    if (isAxes(name)) {
        return gamepads[id].axes[<keyof axesType>name];
    }
    return {pressed: false, value: 0, x: 0, y: 0};
}

export function initGamepad(deadzone: number = 0.05) {
    window.addEventListener('gamepadconnected', gamepadConnectedHandler);
    window.addEventListener('gamepaddisconnected', gamepadDisconnectedHandler);
    window.addEventListener('blur', blurEventHandler);

    deadZone = deadzone;

    // update gamepad state each frame
    on('tick', updateGamepad);
}