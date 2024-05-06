import { init, clear } from "./Engine/core.js";
import GameLoop from "./Engine/gameLoop.js";
import GameObject from "./Engine/gameObject.js"
import { initKeybourd, keyPressed} from "./Engine/inputs/keybourd.js";

initKeybourd();

class Player extends GameObject {
    private _speed = 55;
    private _color = "red"
    private _Controler = true;
    constructor({color = "red",controler = true, ...props}) {
        super({...props});
        this.anchor.set({x:0.5, y:0.5})

        this._color = color;
        this._Controler = controler;
    }

    update(dt: number): void {
        super.update(dt);
        if (!this._Controler) return
        if(keyPressed('w') && !keyPressed('s')){
            this.velocity.y = -this._speed
        }
        else if(keyPressed('s') && !keyPressed('w')){
            this.velocity.y = this._speed
        }
        else this.velocity.y = 0

        if(keyPressed('a') && !keyPressed('d')){
            this.velocity.x = -this._speed
        }
        else if(keyPressed('d') && !keyPressed('a')){
            this.velocity.x = this._speed
        }
        else this.velocity.x = 0

        if(keyPressed('q')){
            this.rotation -= 1 * dt
        }
        if(keyPressed('e')){
            this.rotation += 1 * dt
        }
    }

    draw(context: CanvasRenderingContext2D): void {
        context.fillStyle = this._color;
        context.fillRect(0, 0, this.width, this.height);
    }
}

let {canvas, context} = init();
let p = new Player({children: [new Player({color: "green", controler: false, x: 60, y: -35, width: 25, height: 25})],x: 20, y: 20, width: 50, height: 50});
p.addChild(new Player({color:"blue", controler: false, x: 60, y: 60, width: 25, height: 25}))

let loop = GameLoop({});
loop.update = (dt: number) => {
    p.update(dt);
},
loop.render = () => {
    clear()
    p.render(context);
}
loop.start();

window.oncontextmenu = (e) => {e.preventDefault()};