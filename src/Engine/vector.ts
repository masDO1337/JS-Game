import { clamp } from "./helpers.js";

export default class Vector {

    private _x: number = 0;
    private _y: number = 0;
    public _c: boolean = false;
    public _xMin: number = 0;
    public _yMin: number = 0;
    public _xMax: number = 0;
    public _yMax: number = 0;
    
    constructor(x: number = 0, y: number = 0, vec?: Vector) {
        
        this.x = x;
        this.y = y;
        
        // preserve vector clamping when creating new vectors
        if (typeof vec !== 'undefined' && vec._c) {
            this.clamp(vec._xMin, vec._yMin, vec._xMax, vec._yMax);
            // reset x and y so clamping takes effect
            this.x = x;
            this.y = y;
        }
    }

    // Set the x and y coordinate of the vector.
    set(vec: Vector | {x: number, y: number}) {
        this.x = vec.x;
        this.y = vec.y;
    }

    // Calculate the addition of the current vector with the given vector.
    add(vec: Vector) : Vector {
        return new Vector(this.x + vec.x, this.y + vec.y, this);
    }

    // Calculate the subtraction of the current vector with the given vector.
    subtract(vec: Vector) : Vector {
        return new Vector(this.x - vec.x, this.y - vec.y, this);
    }

    // Calculate the multiple of the current vector by a value.
    scale(value: number) : Vector {
        return new Vector(this.x * value, this.y * value);
    }

    // Calculate the normalized value of the current vector.
    normalize(length: number = this.length() || 1) : Vector {
        return new Vector(this.x / length, this.y / length);
    }

    // Calculate the dot product of the current vector with the given vector.
    dot(vec: Vector) : number {
        return this.x * vec.x + this.y * vec.y;
    }

    // Calculate the length (magnitude) of the Vector.
    length() : number {
        return Math.hypot(this.x, this.y);
    }

    // Calculate the distance between the current vector and the given vector.
    distance(vec: Vector) : number {
        return Math.hypot(this.x - vec.x, this.y - vec.y);
    }

    // Calculate the angle (in radians) between the current vector and the given vector.
    angle(vec: Vector) : number {
        return Math.acos(this.dot(vec) / (this.length() * vec.length()));
    }

    // Calculate the angle (in radians) of the current vector.
    direction() : number {
        return Math.atan2(this.y, this.x);
    }

    // Clamp the Vector between two points, preventing `x` and `y` from going below or above the minimum and maximum values. Perfect for keeping a sprite from going outside the game boundaries.
    clamp(xMin: number = 0, yMin: number = 0, xMax: number = 1, yMax: number = 1) {
        this._c = true;
        this._xMin = xMin;
        this._yMin = yMin;
        this._xMax = xMax;
        this._yMax = yMax;
    }

    // X coordinate of the vector.
    get x() : number {
        return this._x;
    }

    // Y coordinate of the vector.
    get y() : number {
        return this._y;
    }

    set x(value) {
        this._x = this._c ? clamp(this._xMin, this._xMax, value) : value;
    }

    set y(value) {
        this._y = this._c ? clamp(this._yMin, this._yMax, value) : value;
    }
}