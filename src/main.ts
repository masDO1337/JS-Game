import { init, clear } from "./Engine/core.js";
import GameLoop from "./Engine/gameLoop.js";
import GameObject from "./Engine/gameObject.js"
import { initKeybourd, keyPressed} from "./Engine/inputs/keybourd.js";

initKeybourd();

class Player extends GameObject {
    private _speed = 35;
    constructor({...props}) {
        super({...props});
    }

    update(dt?: number | undefined): void {
        super.update(dt);
        if(keyPressed('w')){
            this.velocity.y = -this._speed
        }
        else if(keyPressed('s')){
            this.velocity.y = this._speed
        }
        else this.velocity.y = 0

        if(keyPressed('a')){
            this.velocity.x = -this._speed
        }
        else if(keyPressed('d')){
            this.velocity.x = this._speed
        }
        else this.velocity.x = 0
    }

    draw(context: CanvasRenderingContext2D): void {
        context.fillStyle = "red";
        context.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

let {canvas, context} = init();
let p = new Player({x: 20, y: 20, width: 50, height: 50});
    
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