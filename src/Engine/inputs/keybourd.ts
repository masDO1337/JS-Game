let pressedKeys:string[] = [];

function keydownEventHandler(evt: KeyboardEvent): void {
    if (pressedKeys.indexOf(evt.key) === -1) pressedKeys.push(evt.key);
}

function keyupEventHandler(evt: KeyboardEvent): void {
    pressedKeys.splice(pressedKeys.indexOf(evt.key), 1);
}

function blurEventHandler(): void {
    pressedKeys = [];
}

export function initKeybourd(): void {
    window.addEventListener('keydown', keydownEventHandler);
    window.addEventListener('keyup', keyupEventHandler);
    window.addEventListener('blur', blurEventHandler);
}

export function keyPressed(keys: string|string[]): boolean {
    if (typeof keys === 'string') {
        return pressedKeys.includes(keys);
    } else {
        return keys.every((key: string) => pressedKeys.includes(key));
    }
}