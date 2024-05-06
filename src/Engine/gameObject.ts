import { Updatable, clamp, removeFromArray, rotatePoint } from "./helpers.js";
import Vector from "./vector.js";

export default class GameObject extends Updatable {
    anchor: Vector = new Vector();
    parent: GameObject | null = null;
    private _ready: boolean = false;
    private _world = {x: 0, y: 0, w: 0, h: 0, o: 1, r: 0, sx: 1, sy: 1};
    private _w: number = 0;
    private _h: number = 0;
    private _opa: number = 1;
    private _rot: number = 0;
    private _scx: number = 1;
    private _scy: number = 1;
    private _c: [] = [];

    constructor({width = 0, height = 0, opacity = 1, rotation = 0, scaleX = 1, scaleY = 1, children = [], ...props} = {}) {
        super(props);
        this.width = width;
        this.height = height;
        this.opacity = opacity;
        this.rotation = rotation;
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        this._ready = true;
        this._updateWorldPos();

        this.addChild(children);
    }

    update(dt?: number) : void {
        super.update(dt);
        this.children.map((child: GameObject) => child.update(dt));
    }

    render(context: CanvasRenderingContext2D) : void {
        context.save();
    
        if (this.x || this.y) {
            context.translate(this.x, this.y);
        }
    
        if (this.rotation) {
            context.rotate(this.rotation);
        }

        if (this.scaleX != 1 || this.scaleY != 1) {
            context.scale(this.scaleX, this.scaleY);
        }

        let anchorX = -this.width * this.anchor.x;
        let anchorY = -this.height * this.anchor.y;
    
        if (anchorX || anchorY) {
            context.translate(anchorX, anchorY);
        }

        context.globalAlpha = this.opacity;
    
        this.draw(context);

        if (anchorX || anchorY) {
            context.translate(-anchorX, -anchorY);
        }

        let children = this.children;
        children.map((child: GameObject) => {child.render(context)});
    
        context.restore();
    }

    draw(context: CanvasRenderingContext2D) : void {}

    _pc() : void {
        
        if (!this._ready) return;
        this._updateWorldPos();
        this.children.map((child: GameObject) => child._pc());
    }

    _updateWorldPos() : void {
        let {
            x = 0,
            y = 0,
            o = 1,
            r = 0,
            sx = 1,
            sy = 1
        } = this.parent?._world || {};
        this._world.x = this.x;
        this._world.y = this.y;
        this._world.w = this.width;
        this._world.h = this.height;
        this._world.o = o * this.opacity;
        this._world.sx = sx * this.scaleX;
        this._world.sy = sy * this.scaleY;
    
        this._world.x = this._world.x * sx;
        this._world.y = this._world.y * sy;
        this._world.w = this.width * this._world.sx;
        this._world.h = this.height * this._world.sy;
        this._world.r = r + this.rotation;
    
        let rP = rotatePoint(new Vector(this._world.x, this._world.y), r);
        this._world.x = rP.x;
        this._world.y = rP.y;
        this._world.x += x;
        this._world.y += y;
    }

    addChild(...objects: any) : void {
        objects.flat().map((child: GameObject) => {
            this.children.push(<never>child);
            child.parent = this;
            child._pc();
        });
    }

    removeChild(...objects: any) : void {
        objects.flat().map((child: GameObject) => {
            if (removeFromArray(this.children, <never>child)) {
                child.parent = null;
                child._pc();
            }
        });
    }

    get world() {
        return {
            x: this._world.x,
            y: this._world.y,
            width: this._world.w,
            height: this._world.h,
            opacity: this._world.o,
            rotation: this._world.r,
            scaleX: this._world.sx,
            scaleY: this._world.sy
        };
    }

    get x() : number {
        return this.position.x;
    }
    
    get y() : number {
        return this.position.y;
    }

    set x(value) {
        this.position.x = value;
        this._pc();
    }
    
    set y(value) {
        this.position.y = value;
        this._pc();
    }

    get width() {
        return this._w;
    }
    
    set width(value) {
        this._w = value;
        this._pc();
    }

    get height() {
        return this._h;
    }
    
    set height(value) {
        this._h = value;
        this._pc();
    }

    set children(value) {
        this.removeChild(this._c);
        this.addChild(value);
    }
    
    get children() {
        return this._c;
    }

    get opacity() {
        return this._opa;
    }
    
    set opacity(value) {
        this._opa = clamp(0, 1, value);
        this._pc();
    }

    get rotation() {
        return this._rot;
    }
    
    set rotation(value) {
        this._rot = value;
        this._pc();
    }

    setScale(x: number, y = x) : void {
        this.scaleX = x;
        this.scaleY = y;
    }

    get scaleX() {
        return this._scx;
    }
    
    set scaleX(value) {
        this._scx = value;
        this._pc();
    }

    get scaleY() {
        return this._scy;
    }
    
    set scaleY(value) {
        this._scy = value;
        this._pc();
    }
}