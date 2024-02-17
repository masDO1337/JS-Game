import Vector from "./vector.js";

// Convert degrees to radians.
export function degToRad(deg: number) : number {
    return (deg * Math.PI) / 180;
}

// Convert radians to degrees.
export function radToDeg(rad: number) : number {
    return (rad * 180) / Math.PI;
}

// Return the angle in radians from one point to another point.
export function angleToTarget(source: Vector, target: Vector) : number {
    return Math.atan2(target.y - source.y, target.x - source.x);
}


// Rotate a point by an angle.
export function rotatePoint(point: Vector, angle: number) : Vector {
    let sin = Math.sin(angle);
    let cos = Math.cos(angle);
    return new Vector(
        point.x * cos - point.y * sin,
        point.x * sin + point.y * cos
    );
}

//Move a point by an angle and distance.
export function movePoint(point: Vector, angle: number, distance: number) : Vector {
    return new Vector(
        point.x + Math.cos(angle) * distance,
        point.y + Math.sin(angle) * distance
    );
}

// Return a random integer between a minimum (inclusive) and maximum (inclusive) integer.
export function randInt(min: number, max: number) : number {
    return ((Math.random() * (max - min + 1)) | 0) + min;
}

// Linearly interpolate between two values. The function calculates the number between two values based on a percent. Great for smooth transitions.
export function lerp(start: number, end: number, percent: number) : number {
    return start * (1 - percent) + end * percent;
}

// Return the linear interpolation percent between two values. The function calculates the percent between two values of a given value.
export function inverseLerp(start: number, end: number, value: number) : number {
    return (value - start) / (end - start);
}

// Clamp a number between two values, preventing it from going below or above the minimum and maximum values.
export function clamp(min: number, max: number, value: number) : number {
    return Math.min(Math.max(min, value), max);
}

// Save an item to localStorage. A value of `undefined` will remove the item from localStorage.
export function setStoreItem(key: string, value: any) : void {
    if (value == undefined) {
        localStorage.removeItem(key);
    } else {
        localStorage.setItem(key, JSON.stringify(value));
    }
}

// Retrieve an item from localStorage and convert it back to its original type.
export function getStoreItem(key: string) : any {
    let value: any = localStorage.getItem(key);
    try {
        value = JSON.parse(value);
    } catch (e) {
        // do nothing
    }
    return value;
}

// Remove an item from an array.
export function removeFromArray(array: [], item: never) : boolean {
    let index = array.indexOf(item);
    if (index != -1) {
        array.splice(index, 1);
        return true;
    }
    return false;
}

// This is a private class that is used just to help make the GameObject class more manageable and smaller.
export class Updatable {

    position: Vector;
    velocity: Vector;
    acceleration: Vector;
    ttl: number;

    constructor(properties = {}) {
        this.position = new Vector();
        this.velocity = new Vector();
        this.acceleration = new Vector();
        this.ttl = Infinity;

        this.init(properties);
    }

    init(properties = {}) : void {
        Object.assign(this, properties);
    }

    update(dt?: number) : void {
        this.advance(dt);
    }

    advance(dt?: number) : void {
        let acceleration = this.acceleration;
    
        if (dt) {
            acceleration = acceleration.scale(dt);
        }
    
        this.velocity = this.velocity.add(acceleration);
        let velocity = this.velocity;
    
        if (dt) {
            velocity = velocity.scale(dt);
        }
    
        this.position = this.position.add(velocity);
        this._pc();
        this.ttl--;
    }

    // --------------------------------------------------
    // velocity
    // --------------------------------------------------

    get vx() : number {
        return this.velocity.x;
    }
    
    get vy() : number {
        return this.velocity.y;
    }
    
    set vx(value: number) {
        this.velocity.x = value;
    }
    
    set vy(value: number) {
        this.velocity.y = value;
    }

    // --------------------------------------------------
    // acceleration
    // --------------------------------------------------

    get acx() : number {
        return this.acceleration.x;
    }
    
    get acy() : number {
        return this.acceleration.y;
    }
    
    set acx(value: number) {
        this.acceleration.x = value;
    }
    
    set acy(value: number) {
        this.acceleration.y = value;
    }

    isAlive() : boolean {
        return this.ttl > 0;
    }

    _pc() : void {}
}