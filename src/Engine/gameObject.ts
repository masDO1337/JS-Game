import { getContext } from "./core.js";
import { on } from "./events.js";
import { Updatable, clamp, removeFromArray, rotatePoint } from "./helpers.js";
import Vector from "./vector.js";

export default class GameObject extends Updatable {
    context: CanvasRenderingContext2D = getContext();
    anchor: Vector = new Vector();
    parent: GameObject | null = null;
    private _rf: () => void = this.draw;
    private _uf: (dt?: number) => void = this.advance;
    private _ready: boolean = false;

    init({
        render = this.draw,
        update = this.advance,
        children = [],
        ...props
    } = {}){
        super.init({...props});

        this._ready = true;
        this._updateWorldPos();

        this.addChild(children);

        this._rf = render;

        this._uf = update;

        on('init', () => {
            this.context = getContext();
        });
    }

    update(dt?: number) : void {
        this._uf(dt);
        this.children.map((child: GameObject) => {child.update(dt)});
    }

    render() : void {
        let context = this.context;
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

        this.context.globalAlpha = this.opacity;
    
        this._rf();

        if (anchorX || anchorY) {
            context.translate(-anchorX, -anchorY);
        }

        let children = this.children;
        children.map((child: GameObject) => {child.render()});
    
        context.restore();
    }

    draw() : void {}

    _pc() : void {
        if (this._ready) return;
        this._updateWorldPos();
        this.children.map((child: GameObject) => child._pc());
    }

    private _world = {x: 0, y: 0, w: 0, h: 0, o: 1, r: 0, sx: 1, sy: 1};

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

    private _w: number = 0;

    get width() {
        return this._w;
    }
    
    set width(value) {
        this._w = value;
        this._pc();
    }

    private _h: number = 0;

    get height() {
        return this._h;
    }
    
    set height(value) {
        this._h = value;
        this._pc();
    }

    private _c: [] = [];

    set children(value) {
        this.removeChild(this._c);
        this.addChild(value);
    }
    
    get children() {
        return this._c;
    }

    private _opa: number = 1;

    get opacity() {
        return this._opa;
    }
    
    set opacity(value) {
        this._opa = clamp(0, 1, value);
        this._pc();
    }

    private _rot: number = 0;

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

    private _scx: number = 1;

    get scaleX() {
        return this._scx;
    }
    
    set scaleX(value) {
        this._scx = value;
        this._pc();
    }

    private _scy: number = 1;

    get scaleY() {
        return this._scy;
    }
    
    set scaleY(value) {
        this._scy = value;
        this._pc();
    }
}