export let callbacks: any = {};

export function on(event: string, callback: any) : void {
    callbacks[event] = callbacks[event] || [];
    callbacks[event].push(callback);
}

export function off(event: string, callback: any) : void {
    callbacks[event] = (callbacks[event] || []).filter(
        (fn: any) => fn != callback
    );
}

export function emit(event: string, ...args: any) : void {
    (callbacks[event] || []).map((fn: any) => fn(...args));
}